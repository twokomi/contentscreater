export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasYouTube = !!process.env.YOUTUBE_API_KEY;
  return res.status(200).json({
    ok: true,
    proMode: hasOpenAI || hasYouTube,
    features: { aiGeneration: hasOpenAI, youtubeTrends: hasYouTube }
  });
}
