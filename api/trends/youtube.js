/**
 * YCPA Pro Mode - YouTube Trend Analysis
 * Vercel Serverless Function
 */

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 간단한 캐시 (메모리)
const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keyword, locale = 'KR', range = '30d' } = req.body;

    // 입력 검증
    if (!keyword) {
      return res.status(400).json({ error: '키워드가 필요합니다' });
    }

    // 캐시 확인
    const cacheKey = `${keyword}-${locale}-${range}`;
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
      return res.status(500).json({ 
        error: 'YouTube API 키가 설정되지 않았습니다' 
      });
    }

    // 날짜 범위 계산
    const daysMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '12m': 365
    };
    const days = daysMap[range] || 30;
    const publishedAfter = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // YouTube Data API - Search
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', keyword);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('order', 'viewCount');
    searchUrl.searchParams.set('publishedAfter', publishedAfter);
    searchUrl.searchParams.set('maxResults', '50');
    searchUrl.searchParams.set('regionCode', locale);
    searchUrl.searchParams.set('relevanceLanguage', locale === 'KR' ? 'ko' : 'en');
    searchUrl.searchParams.set('key', process.env.YOUTUBE_API_KEY);

    console.log('Calling YouTube API:', searchUrl.toString());

    const searchResponse = await fetch(searchUrl.toString());
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(`YouTube API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const searchData = await searchResponse.json();

    // 비디오 ID 추출
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // YouTube Data API - Videos (상세 통계)
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'statistics,snippet');
    videosUrl.searchParams.set('id', videoIds);
    videosUrl.searchParams.set('key', process.env.YOUTUBE_API_KEY);

    const videosResponse = await fetch(videosUrl.toString());
    const videosData = await videosResponse.json();

    // 데이터 분석
    const videos = videosData.items || [];
    
    // 총 조회수 계산
    const totalViews = videos.reduce((sum, v) => sum + parseInt(v.statistics.viewCount || 0), 0);
    const avgViews = videos.length > 0 ? totalViews / videos.length : 0;

    // 최근 영상 vs 전체 평균 비교
    const recentVideos = videos.slice(0, 10);
    const recentAvgViews = recentVideos.reduce((sum, v) => sum + parseInt(v.statistics.viewCount || 0), 0) / recentVideos.length;

    // 변동성 계산
    const viewCounts = videos.map(v => parseInt(v.statistics.viewCount || 0));
    const variance = viewCounts.reduce((sum, v) => sum + Math.pow(v - avgViews, 2), 0) / viewCounts.length;
    const stdDev = Math.sqrt(variance);
    const volatility = avgViews > 0 ? (stdDev / avgViews) * 100 : 0;

    // 인기 태그 추출
    const allTags = videos.flatMap(v => v.snippet.tags || []);
    const tagCounts = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ query: tag, value: count }));

    // 추천 결정
    let recommendation = '진행';
    let recommendationReason = '강력하고 안정적인 관심도';

    if (volatility > 80) {
      recommendation = '계절성';
      recommendationReason = '높은 변동성 - 타이밍을 고려하세요';
    } else if (recentAvgViews < avgViews * 0.7) {
      recommendation = '대기';
      recommendationReason = '최근 관심도가 하락하고 있습니다';
    } else if (recentAvgViews > avgViews * 1.3) {
      recommendation = '진행';
      recommendationReason = '관심도가 상승중 - 지금 시작하세요!';
    }

    // 응답 데이터 구성
    const result = {
      keyword,
      totalVideos: videos.length,
      totalViews: Math.round(totalViews),
      avgViews: Math.round(avgViews),
      recentAvgViews: Math.round(recentAvgViews),
      volatility: Math.round(volatility),
      seasonality: volatility > 80 ? '높음' : volatility > 50 ? '중간' : '낮음',
      recommendation,
      recommendationReason,
      topVideos: videos.slice(0, 5).map(v => ({
        title: v.snippet.title,
        channelTitle: v.snippet.channelTitle,
        viewCount: parseInt(v.statistics.viewCount || 0),
        likeCount: parseInt(v.statistics.likeCount || 0),
        publishedAt: v.snippet.publishedAt,
      })),
      relatedQueriesTop: topTags,
      relatedQueriesRising: [], // YouTube API로는 직접 제공되지 않음
    };

    // 캐시 저장
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    // 성공 응답
    return res.status(200).json({
      ok: true,
      data: result,
      cached: false
    });

  } catch (error) {
    console.error('YouTube Trends Error:', error);

    return res.status(500).json({
      ok: false,
      error: '트렌드 분석 중 오류가 발생했습니다',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// 설정
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
