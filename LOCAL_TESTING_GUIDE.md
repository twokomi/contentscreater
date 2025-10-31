# 🧪 로컬 테스트 가이드

YouTube API 키를 로컬 환경에서 테스트하는 방법입니다.

## ✅ 준비 완료된 것

- ✅ `.env.local` 파일 생성됨
- ✅ YouTube API 키 설정됨: `AIzaSyBZp5Xye9qvVzaoVtqYL9ntKC31Kt1atmI`
- ✅ `.gitignore`에 환경변수 파일 제외 설정됨

## 📋 로컬 테스트 단계

### 1. Node.js 설치 확인

터미널에서 실행:

```bash
node --version
npm --version
```

**결과**: v18 이상이어야 합니다.

없다면 다운로드: https://nodejs.org/

---

### 2. 프로젝트 의존성 설치

프로젝트 폴더에서 실행:

```bash
npm install
```

**설치되는 것**:
- `openai@^4.20.0` (OpenAI API 클라이언트, 나중에 사용 가능)
- Vercel CLI가 없다면: `npm install -g vercel`

---

### 3. Vercel 로컬 개발 서버 실행

```bash
vercel dev
```

**첫 실행 시 질문들**:
- "Set up and develop...?" → **Yes (Y)**
- "Which scope...?" → **본인 계정 선택**
- "Link to existing project?" → **No (N)** (새 프로젝트)
- "What's your project's name?" → **youtube-content-producer** (또는 원하는 이름)
- "In which directory...?" → **./** (엔터)
- "Want to override the settings?" → **No (N)**

**실행 결과**:
```
> Ready! Available at http://localhost:3000
```

---

### 4. 브라우저에서 테스트

http://localhost:3000 접속

#### ✅ 확인 사항:

1. **PRO 모드 활성화 확인**
   - 로고 옆에 **✨ PRO** 배지가 보이나요?
   - 없으면 → 콘솔(F12) 확인

2. **실시간 인기 키워드 테스트**
   - "트렌드 분석" 탭 클릭
   - "실시간 인기 키워드" 섹션 확인
   - 카테고리: "전체" 선택
   - 기간: "일간" 선택
   - "새로고침" 버튼 클릭

3. **성공 시 표시되는 것들**
   - 토스트 메시지: **"✅ 실시간 인기 키워드 50개 영상 분석 완료!"**
   - 실제 YouTube 인기 동영상의 키워드들이 표시됨
   - 각 키워드에 점수와 빈도 표시

4. **키워드 검색 테스트**
   - 키워드 검색 입력란에 "K-POP" 입력
   - "분석하기" 버튼 클릭
   - 실제 YouTube 검색 결과와 통계 확인

---

## 🐛 문제 해결

### 문제 1: PRO 배지가 안 보여요

**원인**: API 키가 제대로 로드되지 않음

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# vercel dev 재시작
# Ctrl+C로 중단 후
vercel dev
```

---

### 문제 2: "API 키가 필요합니다" 오류

**원인**: 환경변수 이름이 틀림

**해결**:
`.env.local` 파일 확인:
```bash
# 정확한 이름: YOUTUBE_API_KEY
# 틀린 예: YOUTUBE_KEY, YT_API_KEY
```

---

### 문제 3: "Quota exceeded" 오류

**원인**: YouTube API 일일 할당량 초과 (10,000 units)

**해결**:
- 30분 후 재시도 (캐시 만료)
- 또는 다음날 재시도
- 앱은 자동으로 가상 데이터로 전환됨

---

### 문제 4: CORS 오류

**원인**: `vercel dev` 없이 직접 파일 열기

**해결**:
반드시 `vercel dev`를 통해 접속:
- ✅ http://localhost:3000
- ❌ file:///C:/Users/.../index.html

---

## 📊 API 사용량 확인

Google Cloud Console에서 확인:
1. https://console.cloud.google.com/apis/dashboard
2. "YouTube Data API v3" 클릭
3. "할당량" 탭 → 일일 사용량 확인

**앱의 API 사용량**:
- 키워드 검색 1회: ~7 units
- 트렌딩 새로고침 1회: ~1-3 units
- 30분 캐시로 중복 호출 방지

---

## ✅ 로컬 테스트 성공!

다음 단계: **Vercel 프로덕션 배포**

→ `VERCEL_DEPLOYMENT_GUIDE.md` 참고

---

## 💡 팁

### 개발 서버 종료
```bash
# Ctrl+C 또는 Cmd+C
```

### 로그 확인
```bash
# vercel dev 실행 중인 터미널에서 API 로그 확인 가능
# 각 API 요청이 콘솔에 표시됨
```

### 환경변수 변경 시
```bash
# .env.local 수정 후 vercel dev 재시작 필요
```

---

## 📞 도움이 필요하면

- 브라우저 콘솔(F12) → Console 탭 확인
- 터미널 로그 확인
- 구체적인 오류 메시지 캡처
