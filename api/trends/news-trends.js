/**
 * YCPA - 뉴스 기반 트렌드 키워드 (완전 무료)
 * 공개 RSS 피드에서 키워드 추출
 */

// 주요 뉴스 RSS 피드 (무료 공개)
const NEWS_FEEDS = {
  politics: [
    'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFZ4ZERBU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko', // 정치
  ],
  economy: [
    'https://news.google.com/rss/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNR2RtY0hNekVnSnJieWdBUAE?hl=ko&gl=KR&ceid=KR:ko', // 경제
  ],
  society: [
    'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRGs0ZDNJU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko', // 사회
  ],
  tech: [
    'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFZxYUdjU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko', // 기술
  ]
};

export default async function handler(req, res) {
  const { category = 'all', locale = 'KR' } = req.query;

  try {
    // RSS 피드에서 뉴스 헤드라인 가져오기
    const feedUrl = NEWS_FEEDS[category]?.[0];
    
    if (!feedUrl) {
      // 피드가 없으면 향상된 모의 데이터
      return res.status(200).json({
        ok: true,
        data: generateEnhancedMockData(category, locale),
        source: 'enhanced-mock'
      });
    }

    // RSS 파싱
    const response = await fetch(feedUrl);
    const xml = await response.text();
    
    // 간단한 XML 파싱 (제목 추출)
    const titles = extractTitlesFromRSS(xml);
    
    // 키워드 추출
    const keywords = extractKeywordsFromTitles(titles);
    
    return res.status(200).json({
      ok: true,
      data: {
        category,
        locale,
        updatedAt: new Date().toISOString(),
        source: 'google-news-rss',
        keywords: keywords.slice(0, 20)
      }
    });

  } catch (error) {
    console.error('News Trends Error:', error);
    
    // 에러 시 향상된 모의 데이터
    return res.status(200).json({
      ok: true,
      data: generateEnhancedMockData(category, locale),
      source: 'enhanced-mock'
    });
  }
}

// RSS에서 제목 추출
function extractTitlesFromRSS(xml) {
  const titles = [];
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/g;
  let match;
  
  while ((match = titleRegex.exec(xml)) !== null) {
    titles.push(match[1]);
  }
  
  return titles;
}

// 제목에서 키워드 추출
function extractKeywordsFromTitles(titles) {
  const keywords = {};
  
  // 불용어
  const stopWords = new Set([
    '기자', '뉴스', '속보', '발표', '관련', '대한', '통해',
    '가능', '위해', '의원', '장관', '대통령', '시장'
  ]);
  
  titles.forEach(title => {
    const words = title
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopWords.has(w));
    
    words.forEach(word => {
      keywords[word] = (keywords[word] || 0) + 1;
    });
  });
  
  // 빈도순 정렬
  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .map(([keyword, count], index) => ({
      keyword,
      rank: index + 1,
      count,
      score: count * 10,
      trend: 'up'
    }));
}

// 향상된 모의 데이터 (현실적인 키워드)
function generateEnhancedMockData(category, locale) {
  // 실제 최근 트렌드를 반영한 키워드
  const realWorldKeywords = {
    politics: [
      '총선', '국회의원', '여야', '정당', '공약',
      '지지율', '정책', '법안', '국정감사', '선거'
    ],
    economy: [
      '금리인상', '주가', '환율', '부동산', '인플레이션',
      '코스피', '반도체', '수출', '실업률', '경기'
    ],
    society: [
      '교육개혁', '보육', '복지', '최저임금', '주거',
      '고용', '인구감소', '범죄', '교통', '환경'
    ],
    culture: [
      'K-POP', '드라마', '영화', '웹툰', '공연',
      '아이돌', '예능', '뮤지컬', '전시', '콘서트'
    ],
    tech: [
      'ChatGPT', '인공지능', '메타버스', '반도체', '전기차',
      '자율주행', '블록체인', '클라우드', '5G', '양자컴퓨터'
    ]
  };
  
  const keywords = realWorldKeywords[category] || realWorldKeywords.politics;
  
  return {
    category,
    locale,
    updatedAt: new Date().toISOString(),
    source: 'enhanced-mock',
    keywords: keywords.map((keyword, index) => ({
      keyword,
      rank: index + 1,
      count: Math.round(Math.random() * 15) + 5,
      avgViews: Math.round((Math.random() * 500000) + 100000),
      score: Math.round((100 - index * 4) + Math.random() * 10),
      trend: index < 3 ? 'up' : index > 7 ? 'stable' : 'down'
    }))
  };
}
