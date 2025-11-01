const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30분

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category = 'all', locale = 'KR' } = req.query;
  const cacheKey = `trending_${category}_${locale}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json({ ok: true, data: cached.data, cached: true });
  }

  if (!process.env.YOUTUBE_API_KEY) {
    const mockData = generateMockTrendingVideos(category, locale);
    return res.status(200).json({ ok: true, data: mockData });
  }

  try {
    const categoryId = getCategoryId(category);
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,statistics');
    url.searchParams.set('chart', 'mostPopular');
    url.searchParams.set('regionCode', locale);
    url.searchParams.set('maxResults', '20'); // 상위 20개만
    if (categoryId) url.searchParams.set('videoCategoryId', categoryId);
    url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API error');
    }

    // 영상 목록 생성
    const trendingVideos = data.items.map((video, index) => ({
      rank: index + 1,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      viewCount: parseInt(video.statistics.viewCount || 0),
      likeCount: parseInt(video.statistics.likeCount || 0),
      commentCount: parseInt(video.statistics.commentCount || 0),
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.medium.url,
      videoId: video.id
    }));

    const result = {
      category,
      locale,
      period: 'daily',
      updatedAt: new Date().toISOString(),
      totalVideos: trendingVideos.length,
      videos: trendingVideos
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return res.status(200).json({ ok: true, data: result, cached: false });

  } catch (error) {
    console.error('YouTube API error:', error);
    const mockData = generateMockTrendingVideos(category, locale);
    return res.status(200).json({ ok: true, data: mockData, fallback: true });
  }
}

function getCategoryId(category) {
  const map = {
    'politics': '25',
    'economy': '25',
    'society': '25',
    'culture': '24',
    'tech': '28',
    'sports': '17'
  };
  return map[category] || null;
}

function generateMockTrendingVideos(category, locale) {
  const mockVideos = [
    {
      rank: 1,
      title: 'T1 vs AL 롤드컵 8강 하이라이트',
      channelTitle: 'LCK',
      viewCount: 5662734,
      likeCount: 125000,
      commentCount: 8500,
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      thumbnail: 'https://via.placeholder.com/320x180',
      videoId: 'mock1'
    },
    {
      rank: 2,
      title: 'K-POP 신곡 뮤직비디오',
      channelTitle: 'KPOP Channel',
      viewCount: 3245678,
      likeCount: 98000,
      commentCount: 5400,
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      thumbnail: 'https://via.placeholder.com/320x180',
      videoId: 'mock2'
    }
  ];

  return {
    category,
    locale,
    period: 'daily',
    updatedAt: new Date().toISOString(),
    totalVideos: mockVideos.length,
    videos: mockVideos,
    mock: true
  };
}
