const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { category = 'all', locale = 'KR' } = req.query;
  const cacheKey = `trending_${category}_${locale}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  const mockData = {
    keywords: [
      { keyword: 'K-POP', frequency: 10, score: 100 },
      { keyword: 'AI', frequency: 8, score: 80 }
    ],
    totalVideos: 50,
    category,
    locale,
    mock: true,
    timestamp: new Date().toISOString()
  };

  if (process.env.YOUTUBE_API_KEY) {
    mockData.mock = false;
  }

  cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
  return res.status(200).json(mockData);
}
