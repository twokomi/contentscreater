export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category = 'all', locale = 'kr' } = req.query;

  const mockData = {
    keywords: [
      { keyword: '뉴스키워드1', frequency: 15, score: 150 },
      { keyword: '뉴스키워드2', frequency: 12, score: 120 },
      { keyword: '뉴스키워드3', frequency: 10, score: 100 }
    ],
    category,
    locale,
    source: 'news',
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(mockData);
}
