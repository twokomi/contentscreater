/**
 * YCPA Pro Mode - OpenAI Script Generation
 * Vercel Serverless Function
 */

import OpenAI from 'openai';

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
    const { topic, audience, tone, length } = req.body;

    // 입력 검증
    if (!topic || !tone || !length) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다' });
    }

    // OpenAI 클라이언트 초기화
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // GPT-4 프롬프트 구성
    const systemPrompt = `당신은 전문 유튜브 스크립트 작가입니다. 
시청자의 관심을 사로잡는 매력적인 영상 스크립트를 작성하세요.

스크립트 형식:
1. Opening: 3초 안에 시청자를 사로잡는 훅
2. Body: 타임스탬프가 있는 명확한 단계별 내용
3. Ending: 강력한 CTA (Call-to-Action)와 제품 연결

추가로 다음을 포함하세요:
- B-roll 키워드 (촬영 힌트)
- 자막 타이밍 큐
- 강조해야 할 핵심 포인트`;

    const userPrompt = `다음 조건으로 유튜브 영상 스크립트를 작성해주세요:

주제: ${topic}
타겟 시청자: ${audience || '일반 시청자'}
톤: ${tone} (캐주얼/전문적/활기찬/교육적 중 하나)
길이: ${length} (짧음: 1-3분, 중간: 3-8분, 김: 8-15분)

JSON 형식으로 응답해주세요:
{
  "opening": "훅이 포함된 오프닝 멘트",
  "body": [
    {"t": 0, "line": "첫 번째 단계 내용"},
    {"t": 30, "line": "두 번째 단계 내용"}
  ],
  "ending": "CTA가 포함된 엔딩 멘트",
  "broll_keywords": ["키워드1", "키워드2"],
  "subtitle_cues": [
    {"t": 0, "type": "caption", "emphasis": "high"}
  ]
}`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 또는 'gpt-4o'
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2000,
    });

    // 응답 파싱
    const scriptData = JSON.parse(completion.choices[0].message.content);

    // 성공 응답
    return res.status(200).json({
      ok: true,
      data: {
        script: scriptData,
        usage: completion.usage,
        model: completion.model,
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);

    // 에러 응답
    return res.status(500).json({
      ok: false,
      error: 'AI 스크립트 생성 중 오류가 발생했습니다',
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
