export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'Not configured', fallback: true });
  }
  return res.status(200).json({ message: 'AI generation endpoint' });
}
