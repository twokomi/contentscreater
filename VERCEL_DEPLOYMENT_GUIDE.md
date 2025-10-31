# 🚀 Vercel 프로덕션 배포 가이드

YouTube API 키를 포함한 프로덕션 배포 방법입니다.

## ✅ 사전 준비

- ✅ 로컬 테스트 완료 (http://localhost:3000에서 PRO 모드 확인)
- ✅ YouTube API 키 준비됨: `AIzaSyBZp5Xye9qvVzaoVtqYL9ntKC31Kt1atmI`
- ✅ Vercel 계정 (없으면 https://vercel.com 가입)

---

## 📋 배포 단계

### 방법 1: Vercel CLI로 배포 (추천)

#### 1-1. Vercel CLI 설치 (한번만)

```bash
npm install -g vercel
```

#### 1-2. Vercel 로그인

```bash
vercel login
```

이메일 주소 입력 → 이메일 확인 → 로그인 완료

#### 1-3. 프로젝트 배포

프로젝트 폴더에서 실행:

```bash
vercel
```

**첫 배포 시 질문들**:
- "Set up and deploy...?" → **Yes (Y)**
- "Which scope...?" → **본인 계정 선택**
- "Link to existing project?" → **No (N)**
- "What's your project's name?" → **youtube-content-producer-app**
- "In which directory...?" → **./** (엔터)
- "Want to override the settings?" → **No (N)**

**결과**:
```
✅ Production: https://youtube-content-producer-app.vercel.app
```

#### 1-4. 환경변수 추가

```bash
vercel env add YOUTUBE_API_KEY production
```

**프롬프트**:
```
? What's the value of YOUTUBE_API_KEY?
```

**입력**: `AIzaSyBZp5Xye9qvVzaoVtqYL9ntKC31Kt1atmI`

**확인**:
```
✅ Added Environment Variable YOUTUBE_API_KEY to Project youtube-content-producer-app
```

#### 1-5. 환경변수 적용을 위한 재배포

```bash
vercel --prod
```

**결과**:
```
✅ Production: https://youtube-content-producer-app.vercel.app [deployed]
```

---

### 방법 2: Vercel 웹 대시보드로 배포

#### 2-1. GitHub에 코드 푸시 (선택사항)

```bash
git init
git add .
git commit -m "Initial commit with YouTube API integration"
git branch -M main
git remote add origin https://github.com/your-username/youtube-content-producer-app.git
git push -u origin main
```

#### 2-2. Vercel 대시보드에서 프로젝트 임포트

1. https://vercel.com/dashboard 접속
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 선택 또는 "Import Third-Party Git Repository"
4. 프로젝트 이름: `youtube-content-producer-app`
5. Framework Preset: **Other** (자동 감지됨)
6. Root Directory: `./`
7. "Deploy" 클릭 (환경변수는 나중에 추가)

#### 2-3. 환경변수 추가

1. 배포 완료 후 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Environment Variables" 클릭
3. 새 환경변수 추가:
   - **Key**: `YOUTUBE_API_KEY`
   - **Value**: `AIzaSyBZp5Xye9qvVzaoVtqYL9ntKC31Kt1atmI`
   - **Environments**: Production ✅
4. "Save" 클릭

#### 2-4. 재배포

1. "Deployments" 탭 클릭
2. 최신 배포의 "..." 메뉴 클릭
3. "Redeploy" 선택
4. "Redeploy" 버튼 클릭

---

## ✅ 배포 확인

### 1. 사이트 접속

배포된 URL로 접속:
```
https://youtube-content-producer-app.vercel.app
```

### 2. PRO 모드 확인

- 로고 옆에 **✨ PRO** 배지 확인
- 없으면 → F12 콘솔 확인

### 3. 실시간 인기 키워드 테스트

1. "트렌드 분석" 탭 클릭
2. "실시간 인기 키워드" 섹션
3. "새로고침" 버튼 클릭
4. 토스트 메시지 확인: **"✅ 실시간 인기 키워드 50개 영상 분석 완료!"**

### 4. 키워드 검색 테스트

1. 검색창에 "K-POP" 입력
2. "분석하기" 버튼 클릭
3. 실제 YouTube 데이터 표시 확인

---

## 🐛 문제 해결

### 문제 1: PRO 배지가 안 보여요

**원인**: 환경변수가 제대로 설정되지 않음

**해결**:

1. Vercel 대시보드 → Settings → Environment Variables
2. `YOUTUBE_API_KEY` 확인
3. Production에 체크되어 있는지 확인
4. 재배포:
   ```bash
   vercel --prod
   ```

---

### 문제 2: "Failed to fetch" 오류

**원인**: Serverless Function 실행 오류

**해결**:

1. Vercel 대시보드 → Deployments → 최신 배포 클릭
2. "Functions" 탭 클릭
3. `/api/ai/health` 로그 확인
4. 오류 메시지 확인

**일반적인 원인**:
- 환경변수 오타
- API 키 형식 오류
- Node.js 버전 불일치

---

### 문제 3: 배포는 성공했는데 API가 안 돼요

**원인**: 환경변수 추가 후 재배포 안 함

**해결**:
```bash
# 반드시 재배포 필요
vercel --prod
```

---

### 문제 4: "API 키 제한" 오류

**원인**: YouTube API 키에 HTTP Referrer 제한 설정됨

**해결**:

1. Google Cloud Console 접속
2. "API 및 서비스" → "사용자 인증 정보"
3. API 키 클릭
4. "애플리케이션 제한사항": **없음** 선택
5. 또는 "HTTP 리퍼러" 선택 후 추가:
   ```
   https://youtube-content-producer-app.vercel.app/*
   https://*.vercel.app/*
   ```
6. "저장" 클릭

---

## 🔄 업데이트 배포

코드 수정 후 재배포:

```bash
# 변경사항 확인
git status

# 커밋
git add .
git commit -m "Update feature X"

# Vercel 재배포
vercel --prod
```

**자동 배포** (GitHub 연동 시):
- main 브랜치에 push만 하면 자동 배포됨
- Pull Request 생성 시 미리보기 배포 자동 생성

---

## 📊 모니터링

### API 사용량 확인

**Vercel**:
1. 대시보드 → 프로젝트 선택
2. "Analytics" 탭 → API 호출 통계

**Google Cloud**:
1. https://console.cloud.google.com/apis/dashboard
2. "YouTube Data API v3" → "할당량" 탭

### 로그 확인

```bash
# 실시간 로그 스트리밍
vercel logs --follow

# 특정 배포 로그
vercel logs [deployment-url]
```

---

## 🎯 배포 완료 체크리스트

- [ ] `vercel --prod` 실행 완료
- [ ] 환경변수 `YOUTUBE_API_KEY` 추가 완료
- [ ] 프로덕션 URL 접속 가능
- [ ] 로고에 ✨ PRO 배지 표시됨
- [ ] 실시간 인기 키워드 작동 (50개 영상 분석 완료 메시지)
- [ ] 키워드 검색 작동 (실제 YouTube 데이터 표시)
- [ ] 카테고리 필터 작동 (정치, 경제, 사회 등)
- [ ] 일간/주간 기간 필터 작동

---

## 🎉 성공!

이제 전 세계 어디서나 접속 가능한 YouTube 콘텐츠 프로듀서 앱이 완성되었습니다!

**프로덕션 URL**: https://youtube-content-producer-app.vercel.app

**공유하기**:
- URL을 친구들에게 공유
- 소셜 미디어에 게시
- 포트폴리오에 추가

---

## 💡 다음 단계 (선택사항)

### OpenAI API 추가 (AI 스크립트 생성)

1. OpenAI API 키 발급: https://platform.openai.com/api-keys
2. 환경변수 추가:
   ```bash
   vercel env add OPENAI_API_KEY production
   ```
3. API 키 입력 후 재배포:
   ```bash
   vercel --prod
   ```

### 커스텀 도메인 연결

1. Vercel 대시보드 → Settings → Domains
2. "Add" 클릭
3. 도메인 입력 (예: mycontent.com)
4. DNS 설정 안내 따라하기

---

## 📞 도움이 필요하면

- Vercel 문서: https://vercel.com/docs
- Vercel 지원: https://vercel.com/support
- 프로젝트 로그 확인: `vercel logs`
