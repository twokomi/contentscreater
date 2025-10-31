/**
 * YCPA Pro Mode - Health Check
 * Pro 모드 사용 가능 여부 확인
 */

export default async function handler(req, res) {
  // API 키가 설정되어 있는지 확인
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasYouTube = !!process.env.YOUTUBE_API_KEY;
  
  return res.status(200).json({
    ok: true,
    proMode: hasOpenAI || hasYouTube,
    features: {
      aiGeneration: hasOpenAI,
      youtubeTrends: hasYouTube,
    }
  });
}
