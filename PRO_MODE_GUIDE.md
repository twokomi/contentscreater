# 🚀 YCPA Pro 모드 완벽 가이드

## 📖 목차
1. [Pro 모드란?](#pro-모드란)
2. [MVP vs Pro 비교](#mvp-vs-pro-비교)
3. [단계별 설정 가이드](#단계별-설정-가이드)
4. [API 키 발급](#api-키-발급)
5. [배포 방법](#배포-방법)
6. [테스트 및 검증](#테스트-및-검증)
7. [FAQ](#faq)

---

## Pro 모드란?

YCPA Pro 모드는 실제 AI API를 연동하여 더 높은 품질의 콘텐츠를 생성하는 업그레이드 버전입니다.

### 🎯 주요 차이점

| 항목 | MVP 모드 | Pro 모드 |
|------|----------|----------|
| **스크립트 품질** | 좋음 (템플릿) | 매우 우수함 (AI) |
| **창의성** | 제한적 | 무제한 |
| **맞춤화** | 기본 | 고급 |
| **트렌드 데이터** | 시뮬레이션 | 실제 YouTube |
| **비용** | 무료 | API 사용료 |
| **설정 난이도** | 없음 | 중간 |

---

## MVP vs Pro 비교

### 스크립트 생성 예시

**MVP 모드:**
```
주제: "생산성 향상 팁"
→ 미리 정의된 템플릿으로 생성
→ 5-10초 소요
→ 일관된 품질

결과:
"오늘은 여러분께 생산성 향상 팁을 보여드릴 것입니다.
첫 번째 단계는..."
```

**Pro 모드:**
```
주제: "생산성 향상 팁"
→ GPT-4가 맥락을 이해하고 생성
→ 10-20초 소요
→ 고품질, 창의적

결과:
"하루에 3시간씩 낭비하고 계신가요? 
이 영상 하나로 당신의 하루를 완전히 바꿔드릴게요.
실리콘밸리 최고의 생산성 전문가들이 쓰는..."
```

### 트렌드 분석 예시

**MVP 모드:**
- 알고리즘으로 생성된 시뮬레이션 데이터
- 즉시 표시
- 참고용으로 유용

**Pro 모드:**
- 실제 YouTube 검색 데이터
- 최근 50개 인기 영상 분석
- 실제 조회수, 좋아요 기반
- 정확한 트렌드 파악

---

## 단계별 설정 가이드

### 📋 준비물

1. **OpenAI 계정** (스크립트 AI 생성용)
   - 비용: 스크립트 1개당 약 $0.01-0.03
   - 필수도: ⭐⭐⭐⭐⭐

2. **Google Cloud 계정** (YouTube 트렌드용)
   - 비용: 무료 (일일 할당량 내)
   - 필수도: ⭐⭐⭐⭐

3. **Vercel 계정** (배포용)
   - 비용: 무료
   - 필수도: ⭐⭐⭐⭐⭐

### 🎯 전체 프로세스 (30분)

```
1. API 키 발급 (15분)
   ↓
2. 로컬 테스트 (5분)
   ↓
3. Vercel 배포 (5분)
   ↓
4. 프로덕션 테스트 (5분)
   ↓
✅ 완료!
```

---

## API 키 발급

### 1. OpenAI API 키 (10분)

**1단계: 계정 생성**
```
https://platform.openai.com
→ Sign Up
→ 이메일 인증
```

**2단계: 결제 방법 등록**
```
Settings → Billing
→ Add payment method
→ 카드 등록
→ $5-10 충전 (권장)
```

**3단계: API 키 생성**
```
API Keys 메뉴
→ Create new secret key
→ 이름: "YCPA-Production"
→ 복사: sk-proj-xxxxx...
→ 안전한 곳에 저장!
```

**4단계: 사용량 제한 설정**
```
Settings → Limits
→ Monthly budget: $20
→ Email alert: $15
→ Save
```

**✅ 완료 확인:**
- API 키가 `sk-proj-`로 시작
- 결제 방법 등록 완료
- 월별 예산 제한 설정 완료

---

### 2. YouTube Data API 키 (5분)

**1단계: Google Cloud Console**
```
https://console.cloud.google.com
→ 프로젝트 생성: "YCPA"
```

**2단계: API 활성화**
```
API 및 서비스 → 라이브러리
→ "YouTube Data API v3" 검색
→ 사용 설정
```

**3단계: 인증 정보 생성**
```
사용자 인증 정보
→ + 사용자 인증 정보 만들기
→ API 키
→ 복사: AIzaxxxxx...
```

**4단계: 키 제한 (권장)**
```
생성된 키 클릭
→ 애플리케이션 제한: HTTP 리퍼러
→ 웹사이트 제한: your-domain.vercel.app/*
→ API 제한: YouTube Data API v3만
→ 저장
```

**✅ 완료 확인:**
- API 키가 `AIza`로 시작
- YouTube Data API v3 활성화됨
- 할당량: 하루 10,000 units 확인

---

## 배포 방법

### 옵션 A: Vercel (추천)

**왜 Vercel인가?**
- ✅ 무료 플랜 충분함
- ✅ 배포 5분 완료
- ✅ 자동 HTTPS
- ✅ 환경 변수 관리 쉬움
- ✅ 로그 모니터링 제공

**배포 단계:**

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 배포
cd ycpa-web
vercel

# 4. 환경 변수 추가
vercel env add OPENAI_API_KEY production
# → API 키 붙여넣기

vercel env add YOUTUBE_API_KEY production
# → API 키 붙여넣기

# 5. 프로덕션 배포
vercel --prod

# ✅ 완료! URL 확인
# https://ycpa-web-xxxxx.vercel.app
```

---

### 옵션 B: Netlify

```bash
# 1. Netlify CLI 설치
npm install -g netlify-cli

# 2. 로그인
netlify login

# 3. 배포
netlify deploy --prod

# 4. 환경 변수 설정
netlify env:set OPENAI_API_KEY "sk-proj-..."
netlify env:set YOUTUBE_API_KEY "AIza..."
```

---

### 옵션 C: 직접 호스팅 (Node.js 서버)

더 복잡하지만 완전한 제어 가능:
- AWS EC2
- DigitalOcean
- Heroku

자세한 내용은 별도 문서 참조.

---

## 테스트 및 검증

### 1. Health Check

```bash
# Pro 모드 활성화 확인
curl https://your-domain.vercel.app/api/ai/health

# 예상 응답:
{
  "ok": true,
  "proMode": true,
  "features": {
    "aiGeneration": true,
    "youtubeTrends": true
  }
}
```

### 2. AI 스크립트 생성 테스트

```javascript
// 브라우저 콘솔에서 테스트
fetch('https://your-domain.vercel.app/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: '생산성 향상 팁',
    tone: 'professional',
    length: 'medium',
    audience: '직장인'
  })
})
.then(r => r.json())
.then(console.log);

// 성공 시:
// { ok: true, data: { script: {...}, usage: {...} } }
```

### 3. YouTube 트렌드 테스트

```javascript
fetch('https://your-domain.vercel.app/api/trends/youtube', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keyword: '생산성',
    locale: 'KR',
    range: '30d'
  })
})
.then(r => r.json())
.then(console.log);

// 성공 시:
// { ok: true, data: { totalVideos: 50, ... } }
```

### 4. UI 테스트

**체크리스트:**
- [ ] 로고 옆에 "✨ PRO" 배지 표시
- [ ] 프로젝트 생성 시 "AI로 생성 중..." 메시지
- [ ] 생성된 스크립트 품질 확인
- [ ] 토큰 사용량 토스트 표시
- [ ] 트렌드 분석 시 "YouTube에서..." 메시지
- [ ] 실제 영상 데이터 표시
- [ ] 에러 발생 시 템플릿으로 폴백

---

## FAQ

### Q1: Pro 모드 비용이 얼마나 드나요?

**OpenAI:**
- 스크립트 1개: $0.01-0.03
- 월 100개 생성: $1-3
- 월 1000개: $10-30

**YouTube API:**
- 기본 무료 (하루 10,000 units)
- 할당량 내 사용: $0
- 초과 시: 추가 할당량 구매 가능

**Vercel:**
- Hobby 플랜: 무료
- 개인 프로젝트에 충분함

**예상 총 비용:** 월 $5-20 (사용량에 따라)

---

### Q2: API 키를 잃어버리면?

**OpenAI:**
1. platform.openai.com → API Keys
2. 기존 키 삭제
3. 새 키 생성
4. Vercel에 업데이트

**YouTube:**
1. Google Cloud Console
2. 기존 키 제한 또는 삭제
3. 새 키 생성
4. Vercel에 업데이트

⚠️ 키는 저장 후 다시 볼 수 없으니 안전하게 보관!

---

### Q3: MVP 모드로 돌아갈 수 있나요?

네, 언제든지 가능합니다!

**방법 1: 환경 변수 제거**
```bash
vercel env rm OPENAI_API_KEY production
vercel --prod
```

**방법 2: API 키 비활성화**
- OpenAI/Google Cloud에서 키 삭제
- 자동으로 MVP 모드로 폴백

---

### Q4: 에러가 발생하면?

YCPA는 자동 폴백을 지원합니다:

```
AI 생성 실패
→ "AI 생성 실패 - 템플릿으로 생성합니다" 메시지
→ MVP 모드로 자동 전환
→ 사용자는 계속 작업 가능
```

**일반적인 에러:**
- `Insufficient quota`: OpenAI 잔액 충전 필요
- `quotaExceeded`: YouTube 일일 할당량 초과 (24시간 대기)
- `Invalid API key`: 키 확인 및 재설정

---

### Q5: 로컬에서만 Pro 모드를 쓸 수 있나요?

네! 배포 없이도 가능합니다:

```bash
# .env.local 파일 생성
OPENAI_API_KEY=sk-proj-...
YOUTUBE_API_KEY=AIza...

# 로컬 서버 실행
npm run dev

# localhost:3000에서 Pro 모드 사용
```

---

### Q6: 다른 AI 모델을 사용할 수 있나요?

네, `api/ai/generate.js` 파일에서 모델 변경:

```javascript
model: 'gpt-4o-mini'  // 기본 (빠르고 저렴)
// model: 'gpt-4o'    // 더 높은 품질 (비쌈)
// model: 'gpt-4-turbo' // 균형잡힌 선택
```

**비용 비교:**
- gpt-4o-mini: $0.15 / 1M tokens (가장 저렴)
- gpt-4o: $2.50 / 1M tokens
- gpt-4-turbo: $10 / 1M tokens

---

### Q7: 사용량을 모니터링하려면?

**OpenAI:**
```
platform.openai.com/usage
→ 일일/월간 사용량 확인
→ 비용 추이 그래프
```

**YouTube:**
```
console.cloud.google.com
→ API 및 서비스 → 할당량
→ YouTube Data API v3 사용량
```

**Vercel:**
```
vercel.com/dashboard
→ Analytics 탭
→ 함수 호출 수, 실행 시간
```

---

## 🎯 다음 단계

1. ✅ API 키 발급
2. ✅ 로컬 테스트
3. ✅ Vercel 배포
4. ✅ 프로덕션 확인

**완료했다면:**
- 📊 사용량 모니터링 설정
- 💰 월별 예산 알림 설정
- 🔔 에러 알림 활성화
- 📝 사용 가이드 작성

---

## 📞 추가 지원

- 📖 [상세 배포 가이드](./DEPLOYMENT.md)
- 🏗️ [아키텍처 설명](./ARCHITECTURE.md)
- 📚 [메인 README](./README.ko.md)

**문제 발생 시:**
1. 로그 확인: `vercel logs --follow`
2. Health check 테스트
3. GitHub Issues에 문의

---

**축하합니다! 🎉**

이제 YCPA Pro 모드의 모든 기능을 사용할 수 있습니다!

AI 기반 전문 스크립트와 실제 트렌드 데이터로 더 나은 콘텐츠를 만들어보세요. ✨
