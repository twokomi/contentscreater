# YCPA 아키텍처 설명

## 🤔 왜 OpenAI API 키가 필요 없나요?

### MVP 모드: 템플릿 기반 시스템

YCPA는 **두 가지 모드**로 작동하도록 설계되었습니다:

#### 1️⃣ MVP 모드 (현재 구현) - API 키 불필요 ✅

**템플릿 기반 생성 시스템**을 사용하여 OpenAI 없이도 완전히 작동합니다.

```javascript
// js/templates.js 에서 작동 방식

// 1. 스크립트 생성
const generateScript = (topic, tone, length, audience) => {
    // 미리 정의된 훅 템플릿 선택
    const hook = hookTemplates[tone][randomIndex];
    
    // 길이에 따른 본문 구조 자동 생성
    const body = generateBodySteps(length); // 3, 5, 7단계
    
    // 규칙 기반 엔딩 생성
    const ending = generateEnding(tone);
    
    return { opening, body, ending };
};

// 2. 트렌드 분석
const generateMockTrendData = (keyword) => {
    // 실제 API 대신 알고리즘으로 현실적인 데이터 생성
    const volumeIndex = generateTrendPattern(30); // 30일 패턴
    const volatility = calculateStandardDeviation(volumeIndex);
    const recommendation = determineRecommendation(volatility);
    
    return { volumeIndex, volatility, recommendation };
};
```

**장점:**
- ✅ **즉시 사용 가능** - 설정 없이 바로 시작
- ✅ **비용 없음** - API 호출 비용 0원
- ✅ **속도** - 서버 요청 없이 즉시 생성
- ✅ **오프라인** - 인터넷 없이도 작동
- ✅ **제한 없음** - 무제한 생성 가능

**제공 기능:**
- 📝 스크립트 자동 생성 (오프닝, 본문, 엔딩)
- 🎯 3가지 페르소나 앵글 (초보자/중급/전문가)
- 🔗 SEO 메타데이터 (제목, 설명, 해시태그)
- 📱 쇼츠 3종 자동 생성
- 📊 트렌드 시각화 (모의 데이터)
- 🎨 B-roll 키워드 제안

#### 2️⃣ Pro 모드 (향후 확장) - API 키 필요 🚀

**AI 기반 고급 생성**을 위해 OpenAI API를 추가할 수 있습니다.

```javascript
// 향후 구현 예시

const generateScriptWithAI = async (topic, tone, length, audience) => {
    // OpenAI API 호출 (서버에서만)
    const response = await fetch('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, tone, length, audience })
    });
    
    // AI가 생성한 고품질 스크립트
    return await response.json();
};
```

**Pro 모드 추가 기능:**
- 🤖 GPT-4 기반 창의적 스크립트
- 📊 실제 YouTube Data API 트렌드
- 🔍 Google Trends 실시간 데이터
- 🎨 AI 썸네일 생성
- 🎯 경쟁사 분석
- 📈 SEO 점수 최적화

---

## 🏗️ 시스템 아키텍처

### 데이터 흐름

```
┌─────────────────┐
│   사용자 입력    │
│ (주제, 톤, 길이) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Templates.js    │ ◄─── MVP 모드 (현재)
│ 규칙 기반 생성   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  생성된 콘텐츠   │
│ (스크립트, 앵글) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Table API      │
│  데이터 저장     │
└─────────────────┘
```

### 파일 구조 및 역할

```
js/
├── templates.js    ★ MVP 핵심: 템플릿 생성 엔진
├── storage.js      ★ Table API 연동
├── projects.js     ★ 프로젝트 관리
├── trends.js       ★ 트렌드 분석 (모의 데이터)
├── utils.js        ★ 유틸리티 함수
└── main.js         ★ 앱 초기화
```

---

## 📊 템플릿 시스템 상세

### 1. 훅 생성 로직

```javascript
hookTemplates = {
    casual: [
        "야! 빠른 질문...",
        "이거 진짜 대박이야...",
        "너 이거 알아?"
    ],
    professional: [
        "오늘은 여러분께 보여드릴 것이...",
        "이 영상에서는 탐구할 내용이...",
        "핵심 내용을 알려드리겠습니다..."
    ],
    // ... 더 많은 톤별 훅
};
```

### 2. 본문 구조 자동화

```javascript
// 길이에 따른 단계 수 결정
const stepCount = {
    short: 3,   // 1-3분 → 3단계
    medium: 5,  // 3-8분 → 5단계
    long: 7     // 8-15분 → 7단계
};

// 타임스탬프 자동 계산
const timePerStep = {
    short: 20,   // 20초/단계
    medium: 40,  // 40초/단계
    long: 60     // 60초/단계
};
```

### 3. 트렌드 패턴 알고리즘

```javascript
// 현실적인 트렌드 곡선 생성
const generateTrendPattern = (days) => {
    const baseValue = 50 + Math.random() * 30;
    const trend = (Math.random() - 0.5) * 2; // 상승/하락
    
    return Array.from({ length: days }, (_, i) => {
        const noise = (Math.random() - 0.5) * 20;
        const value = baseValue + (trend * i) + noise;
        return { date: ..., value };
    });
};

// 추천 로직
if (volatility > 30) return "계절성";
if (recentVolume < avgVolume * 0.7) return "대기";
if (recentVolume > avgVolume * 1.3) return "진행";
```

---

## 🔄 Pro 모드 업그레이드 방법

### 1단계: 백엔드 API 추가

```javascript
// server/api/ai/generate.js (예시)
import OpenAI from 'openai';

export default async (req, res) => {
    const { topic, tone, length, audience } = req.body;
    
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "당신은 유튜브 스크립트 작가입니다..." },
            { role: "user", content: `주제: ${topic}, 톤: ${tone}...` }
        ]
    });
    
    res.json({ script: completion.choices[0].message.content });
};
```

### 2단계: 프론트엔드 연동

```javascript
// js/projects.js 수정
async createProject() {
    // Pro 모드 활성화 체크
    if (window.proModeEnabled) {
        // API 호출
        const script = await fetch('/api/ai/generate', {
            method: 'POST',
            body: JSON.stringify({ topic, tone, length, audience })
        }).then(r => r.json());
    } else {
        // MVP 모드 (템플릿)
        const script = Templates.generateScript({ topic, tone, length, audience });
    }
}
```

### 3단계: 환경 변수 설정

```bash
# .env
OPENAI_API_KEY=sk-...
YOUTUBE_API_KEY=AIza...
GOOGLE_API_KEY=AIza...
```

---

## 💡 핵심 설계 원칙

### 1. Progressive Enhancement
- **기본**: 템플릿으로 완전 작동
- **향상**: API 추가 시 자동 업그레이드

### 2. Zero Configuration
- 설치 없이 바로 사용 가능
- API 키 없이도 전체 기능 사용

### 3. Performance First
- 서버 요청 없이 즉시 생성
- 모든 처리를 클라이언트에서

### 4. Privacy by Design
- 외부 서버에 데이터 전송 없음
- 모든 데이터 로컬 저장

---

## 🎯 결론

**YCPA는 API 키 없이도 완전히 작동합니다!**

- ✅ 템플릿 기반 MVP 모드로 모든 핵심 기능 제공
- ✅ 추후 Pro 모드로 쉽게 확장 가능
- ✅ 사용자는 선택 가능: 무료 MVP vs 유료 Pro

**지금 바로 사용해보세요!** 🚀
