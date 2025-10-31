const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { keyword, locale = 'KR', maxResults = 10 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const cacheKey = `search_${keyword}_${locale}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  if (!process.env.YOUTUBE_API_KEY) {
    const mockData = generateMockSearchData(keyword);
    return res.status(200).json(mockData);
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', keyword);
    url.searchParams.set('type', 'video');
    url.searchParams.set('regionCode', locale);
    url.searchParams.set('maxResults', maxResults);
    url.searchParams.set('order', 'relevance');
    url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API error');
    }

    const videoIds = data.items.map(item => item.id.videoId).join(',');
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    statsUrl.searchParams.set('part', 'statistics');
    statsUrl.searchParams.set('id', videoIds);
    statsUrl.searchParams.set('key', process.env.YOUTUBE_API_KEY);

    const statsResponse = await fetch(statsUrl.toString());
    const statsData = await statsResponse.json();

    const results = data.items.map((item, index) => ({
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(statsData.items[index]?.statistics.viewCount || 0),
      likeCount: parseInt(statsData.items[index]?.statistics.likeCount || 0),
      commentCount: parseInt(statsData.items[index]?.statistics.commentCount || 0)
    }));

    const totalViews = results.reduce((sum, r) => sum + r.viewCount, 0);
    const avgViews = totalViews / results.length;

    const result = {
      keyword,
      results,
      totalResults: results.length,
      avgViews,
      totalViews,
      recommendation: avgViews > 100000 ? 'Go' : avgViews > 50000 ? 'Wait' : 'Seasonal',
      cached: false,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return res.status(200).json(result);

  } catch (error) {
    console.error('YouTube API error:', error);
    const mockData = generateMockSearchData(keyword);
    return res.status(200).json({ ...mockData, fallback: true });
  }
}

function generateMockSearchData(keyword) {
  const results = Array.from({ length: 10 }, (_, i) => ({
    title: `${keyword} 관련 영상 ${i + 1}`,
    channelTitle: `채널 ${i + 1}`,
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    viewCount: Math.floor(Math.random() * 100000) + 10000,
    likeCount: Math.floor(Math.random() * 5000) + 100,
    commentCount: Math.floor(Math.random() * 500) + 10
  }));

  const totalViews = results.reduce((sum, r) => sum + r.viewCount, 0);
  const avgViews = totalViews / results.length;

  return {
    keyword,
    results,
    totalResults: 10,
    avgViews,
    totalViews,
    recommendation: 'Go',
    mock: true,
    timestamp: new Date().toISOString()
  };
}
