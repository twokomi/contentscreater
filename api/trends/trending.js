/**
 * YCPA Pro Mode - Trending Keywords Dashboard
 * YouTube 인기 영상에서 핵심 키워드 추출
 */

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 캐시 (30분)
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000;

// YouTube 카테고리 ID 매핑
const YOUTUBE_CATEGORIES = {
  'politics': '25', // 뉴스 & 정치
  'economy': '25',  // 뉴스 (경제 포함)
  'society': '25',  // 뉴스 (사회 포함)
  'culture': '24',  // 엔터테인먼트
  'tech': '28',     // 과학 & 기술
  'sports': '17',   // 스포츠
  'gaming': '20',   // 게임
  'education': '27' // 교육
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const { category = 'all', locale = 'KR', period = 'daily' } = req.query;

    // 캐시 확인
    const cacheKey = `trending-${category}-${locale}-${period}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Cache hit:', cacheKey);
      return res.status(200).json({
        ok: true,
        data: cached.data,
        cached: true
      });
    }

    // YouTube API 키 확인
    if (!process.env.YOUTUBE_API_KEY) {
      // Pro 모드 비활성화 시 모의 데이터 반환
      const mockData = generateMockTrendingData(category, locale);
      return res.status(200).json({
        ok: true,
        data: mockData,
        mock: true
      });
    }

    // YouTube Trending API 호출
    const categoryId = category !== 'all' ? YOUTUBE_CATEGORIES[category] : null;
    
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,statistics');
    url.searchParams.set('chart', 'mostPopular');
    url.searchParams.set('regionCode', locale);
    url.searchParams.set('maxResults', '50');
    if (categoryId) {
      url.searchParams.set('videoCategoryId', categoryId);
    }
    url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

    console.log('Calling YouTube Trending API:', url.toString());

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(`YouTube API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const videos = data.items || [];

    // 키워드 추출
    const keywords = extractKeywordsFromVideos(videos, category);
    
    // 순위화
    const rankedKeywords = rankKeywords(keywords, period);

    // 응답 데이터 구성
    const result = {
      category,
      locale,
      period,
      updatedAt: new Date().toISOString(),
      totalVideos: videos.length,
      keywords: rankedKeywords,
      topVideos: videos.slice(0, 5).map(v => ({
        title: v.snippet.title,
        channelTitle: v.snippet.channelTitle,
        viewCount: parseInt(v.statistics.viewCount || 0),
        publishedAt: v.snippet.publishedAt,
        thumbnails: v.snippet.thumbnails.medium.url
      }))
    };

    // 캐시 저장
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return res.status(200).json({
      ok: true,
      data: result,
      cached: false
    });

  } catch (error) {
    console.error('Trending API Error:', error);

    // 에러 시 모의 데이터 반환
    const mockData = generateMockTrendingData(
      req.query.category || 'all',
      req.query.locale || 'KR'
    );

    return res.status(200).json({
      ok: true,
      data: mockData,
      mock: true,
      error: 'Failed to fetch real data'
    });
  }
}

// 영상 제목에서 키워드 추출
function extractKeywordsFromVideos(videos, category) {
  const keywords = {};
  
  // 불용어 (필터링할 단어)
  const stopWords = new Set([
    '영상', '동영상', '이번', '오늘', '어제', '내일',
    '처음', '마지막', '그리고', '하지만', '그래서',
    '있는', '없는', '하는', '되는', '좋은', '나쁜',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at'
  ]);

  videos.forEach(video => {
    const title = video.snippet.title;
    const views = parseInt(video.statistics.viewCount || 0);
    const likes = parseInt(video.statistics.likeCount || 0);
    
    // 제목을 단어로 분리
    const words = title
      .replace(/[^\w\s가-힣]/g, ' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.has(word));

    // 키워드 빈도 및 가중치 계산
    words.forEach(word => {
      if (!keywords[word]) {
        keywords[word] = {
          keyword: word,
          count: 0,
          totalViews: 0,
          totalLikes: 0,
          videos: []
        };
      }
      
      keywords[word].count++;
      keywords[word].totalViews += views;
      keywords[word].totalLikes += likes;
      keywords[word].videos.push({
        title,
        views,
        channelTitle: video.snippet.channelTitle
      });
    });

    // 2단어 구문(bigram) 추출
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (!keywords[phrase]) {
        keywords[phrase] = {
          keyword: phrase,
          count: 0,
          totalViews: 0,
          totalLikes: 0,
          videos: []
        };
      }
      keywords[phrase].count++;
      keywords[phrase].totalViews += views;
      keywords[phrase].videos.push({
        title,
        views,
        channelTitle: video.snippet.channelTitle
      });
    }
  });

  return keywords;
}

// 키워드 순위화
function rankKeywords(keywords, period) {
  // 키워드를 배열로 변환하고 점수 계산
  const keywordArray = Object.values(keywords).map(kw => {
    // 점수 = (빈도 * 2) + (총 조회수 / 1000000) + (총 좋아요 / 10000)
    const score = (kw.count * 2) + 
                  (kw.totalViews / 1000000) + 
                  (kw.totalLikes / 10000);
    
    return {
      keyword: kw.keyword,
      rank: 0, // 나중에 설정
      count: kw.count,
      avgViews: Math.round(kw.totalViews / kw.count),
      totalViews: kw.totalViews,
      score: Math.round(score * 100) / 100,
      relatedVideos: kw.videos.slice(0, 3), // 상위 3개만
      trend: 'up' // 실제로는 이전 데이터와 비교 필요
    };
  });

  // 점수 기준 정렬
  keywordArray.sort((a, b) => b.score - a.score);

  // 상위 20개만 선택하고 순위 부여
  return keywordArray.slice(0, 20).map((kw, index) => {
    kw.rank = index + 1;
    return kw;
  });
}

// 모의 트렌드 데이터 생성 (MVP 모드)
function generateMockTrendingData(category, locale) {
  const categories = {
    politics: ['대선', '정책', '국회', '정당', '선거', '법안', '정부', '외교'],
    economy: ['주식', '부동산', '금리', '환율', '경제', '채권', '투자', '경기'],
    society: ['사건', '사고', '교육', '복지', '인권', '환경', '노동', '인구'],
    culture: ['드라마', '영화', '음악', 'K-POP', '예능', '웹툰', '공연', '축제'],
    tech: ['AI', '스마트폰', '반도체', '전기차', '메타버스', '블록체인', '앱', '게임'],
    all: ['트렌드', '인기', '화제', '이슈', '핫', 'TOP', '최신', '실시간']
  };

  const baseKeywords = categories[category] || categories.all;
  
  return {
    category,
    locale,
    period: 'daily',
    updatedAt: new Date().toISOString(),
    totalVideos: 50,
    mock: true,
    keywords: baseKeywords.map((keyword, index) => ({
      keyword,
      rank: index + 1,
      count: Math.round(Math.random() * 20) + 5,
      avgViews: Math.round((Math.random() * 500000) + 100000),
      totalViews: Math.round((Math.random() * 5000000) + 1000000),
      score: Math.round((Math.random() * 100) + 50),
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      relatedVideos: [
        {
          title: `${keyword} 관련 인기 영상 #1`,
          views: Math.round(Math.random() * 1000000),
          channelTitle: '인기 채널'
        }
      ]
    })),
    topVideos: []
  };
}

// 설정
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
