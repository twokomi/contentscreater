# YCPA Pro 모드 배포 가이드

## 📋 단계별 배포 프로세스

### 1단계: 로컬 개발 환경 설정

#### 1.1 Node.js 설치 확인
```bash
# Node.js 버전 확인 (v18 이상 권장)
node --version
npm --version
```

#### 1.2 프로젝트 의존성 설치
```bash
# 프로젝트 폴더로 이동
cd ycpa-web

# 의존성 설치
npm install
```

#### 1.3 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.local.example .env.local

# 파일 편집하여 API 키 입력
# macOS/Linux
nano .env.local

# Windows
notepad .env.local
```

`.env.local` 파일 내용:
```env
OPENAI_API_KEY=sk-proj-여기에_실제_키_입력
YOUTUBE_API_KEY=AIza여기에_실제_키_입력
NODE_ENV=development
```

#### 1.4 로컬 서버 실행
```bash
# Vercel CLI로 로컬 개발 서버 실행
npm run dev

# 브라우저에서 열기
# http://localhost:3000
```

---

### 2단계: Vercel 배포

#### 2.1 Vercel 계정 생성
```
1. https://vercel.com 방문
2. GitHub 계정으로 가입
3. 무료 플랜 선택 (Hobby)
```

#### 2.2 Vercel CLI 설치 및 로그인
```bash
# Vercel CLI 전역 설치
npm install -g vercel

# Vercel 로그인
vercel login
```

#### 2.3 프로젝트 연결
```bash
# Vercel 프로젝트 초기화
vercel

# 질문에 답변:
# ? Set up and deploy "~/ycpa-web"? [Y/n] Y
# ? Which scope do you want to deploy to? (your-username)
# ? Link to existing project? [y/N] N
# ? What's your project's name? ycpa-web
# ? In which directory is your code located? ./
```

#### 2.4 환경 변수 설정 (Vercel Dashboard)
```
1. https://vercel.com/dashboard 접속
2. ycpa-web 프로젝트 선택
3. Settings → Environment Variables
4. 다음 변수 추가:
   - OPENAI_API_KEY = sk-proj-...
   - YOUTUBE_API_KEY = AIza...
   - NODE_ENV = production
```

또는 CLI로 설정:
```bash
# OpenAI API 키 추가
vercel env add OPENAI_API_KEY production

# YouTube API 키 추가
vercel env add YOUTUBE_API_KEY production

# NODE_ENV 추가
vercel env add NODE_ENV production
```

#### 2.5 프로덕션 배포
```bash
# 프로덕션 배포
npm run deploy

# 또는
vercel --prod
```

배포 완료 후 URL 확인:
```
✅ Production: https://ycpa-web-your-username.vercel.app
```

---

### 3단계: 배포 후 확인

#### 3.1 Pro 모드 작동 확인
```bash
# Health check API 호출
curl https://your-domain.vercel.app/api/ai/health

# 예상 응답:
# {
#   "ok": true,
#   "proMode": true,
#   "features": {
#     "aiGeneration": true,
#     "youtubeTrends": true
#   }
# }
```

#### 3.2 브라우저 테스트
```
1. https://your-domain.vercel.app 접속
2. 로고 옆에 "✨ PRO" 배지 확인
3. 새 프로젝트 생성 테스트
4. "AI로 스크립트를 생성하고 있습니다..." 메시지 확인
5. 생성 완료 후 품질 확인
```

#### 3.3 트렌드 분석 테스트
```
1. 트렌드 탭으로 이동
2. 키워드 입력 (예: "생산성")
3. "YouTube에서 실제 트렌드 데이터를 가져오는 중..." 메시지 확인
4. 실제 YouTube 영상 데이터 표시 확인
```

---

## 🔍 문제 해결

### 문제 1: "Pro 모드를 사용할 수 없습니다"

**원인:** API 키가 설정되지 않았거나 잘못됨

**해결:**
```bash
# 환경 변수 확인
vercel env ls

# 키 다시 추가
vercel env add OPENAI_API_KEY production

# 재배포
vercel --prod
```

### 문제 2: "YouTube API Error: quotaExceeded"

**원인:** YouTube API 일일 할당량 초과 (10,000 units)

**해결:**
1. Google Cloud Console에서 할당량 확인
2. 24시간 대기 또는 할당량 증가 신청
3. 임시로 MVP 모드로 폴백됨 (자동)

### 문제 3: "OpenAI API Error: Insufficient quota"

**원인:** OpenAI 계정 잔액 부족

**해결:**
1. https://platform.openai.com/account/billing 방문
2. 결제 방법 추가 및 크레딧 충전
3. 사용량 제한 설정 권장

### 문제 4: CORS 에러

**원인:** 허용되지 않은 도메인에서 API 호출

**해결:**
vercel.json에 도메인 추가 (이미 구성됨)

---

## 💰 비용 관리

### OpenAI 비용 모니터링
```
1. https://platform.openai.com/usage 방문
2. 일일/월간 사용량 확인
3. 예산 제한 설정 (예: $20/월)
```

**예상 비용:**
- 스크립트 1개: $0.01-0.03
- 월 100개: $1-3
- 월 1,000개: $10-30

### YouTube API 할당량 관리
```
무료 할당량: 하루 10,000 units
- search.list: 100 units/요청
- videos.list: 1 unit/요청
- 하루 약 100회 검색 가능
```

**할당량 절약 팁:**
- 1시간 캐싱 활성화 (이미 구현됨)
- 중복 검색 방지
- maxResults를 필요한 만큼만 설정

### Vercel 비용
```
무료 플랜 (Hobby):
- Bandwidth: 100GB/월
- Serverless Functions: 100GB-시간/월
- 개인 프로젝트에 충분함

Pro 플랜: $20/월
- 더 많은 리소스 필요시
```

---

## 📊 모니터링 & 로깅

### Vercel Dashboard
```
1. https://vercel.com/dashboard
2. ycpa-web 프로젝트 선택
3. Analytics 탭:
   - 트래픽 확인
   - 함수 실행 시간
   - 에러 추적
```

### 실시간 로그 확인
```bash
# 실시간 로그 스트리밍
vercel logs --follow

# 특정 배포 로그
vercel logs [deployment-url]
```

### 에러 알림 설정
```
1. Vercel Dashboard → Settings → Notifications
2. 이메일 알림 활성화
3. Slack/Discord 웹훅 연동 (선택)
```

---

## 🔄 업데이트 배포

### 코드 변경 후 배포
```bash
# 변경사항 커밋
git add .
git commit -m "Update: feature description"

# Vercel에 푸시 (자동 배포)
git push origin main

# 또는 수동 배포
vercel --prod
```

### 환경 변수 업데이트
```bash
# 기존 변수 제거
vercel env rm OPENAI_API_KEY production

# 새 변수 추가
vercel env add OPENAI_API_KEY production

# 재배포
vercel --prod
```

---

## 🎯 베스트 프랙티스

### 1. 보안
```
✅ API 키는 절대 GitHub에 커밋하지 않기
✅ .env.local은 .gitignore에 포함됨
✅ 환경 변수는 Vercel Dashboard에서만 관리
✅ API 키 정기적으로 로테이션 (3-6개월)
```

### 2. 성능
```
✅ 캐싱 활용 (1시간 TTL)
✅ 불필요한 API 호출 최소화
✅ 에러 발생 시 템플릿으로 폴백
✅ 사용자에게 로딩 상태 명확히 표시
```

### 3. 비용 최적화
```
✅ OpenAI: gpt-4o-mini 사용 (gpt-4보다 15배 저렴)
✅ YouTube: 캐싱으로 중복 호출 방지
✅ 월별 예산 제한 설정
✅ 사용량 모니터링 대시보드 정기 확인
```

### 4. 사용자 경험
```
✅ Pro 모드 실패 시 자동 폴백
✅ 명확한 로딩/에러 메시지
✅ MVP 모드도 항상 작동 보장
✅ 사용자에게 Pro 모드 상태 표시
```

---

## ✅ 체크리스트

### 배포 전
- [ ] API 키 발급 완료 (OpenAI, YouTube)
- [ ] 로컬 테스트 완료
- [ ] .env.local에 키 설정 및 테스트
- [ ] Git에 .env.local 커밋되지 않았는지 확인
- [ ] vercel.json 설정 확인

### 배포 중
- [ ] Vercel 계정 생성
- [ ] Vercel CLI 로그인
- [ ] 프로젝트 연결
- [ ] 환경 변수 Vercel에 추가
- [ ] 프로덕션 배포 실행

### 배포 후
- [ ] Health check API 테스트
- [ ] Pro 모드 배지 표시 확인
- [ ] AI 스크립트 생성 테스트
- [ ] YouTube 트렌드 분석 테스트
- [ ] 에러 로그 확인
- [ ] 비용 모니터링 설정

---

## 🆘 지원

문제가 발생하면:
1. Vercel 로그 확인: `vercel logs --follow`
2. Health check API 테스트
3. 환경 변수 재확인
4. GitHub Issues에 문의

---

**축하합니다! 🎉**
YCPA Pro 모드가 성공적으로 배포되었습니다!

이제 AI 기반 전문 스크립트 생성과 실제 YouTube 트렌드 분석을 사용할 수 있습니다.
