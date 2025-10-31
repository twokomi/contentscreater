# ⚡ 빠른 시작 가이드

YouTube API 키를 받았으니 바로 시작해봅시다!

## 🎯 목표

로컬에서 테스트 → Vercel에 배포 → 전 세계에 공개

소요 시간: **10-15분**

---

## 📋 단계별 체크리스트

### ✅ 1단계: 로컬 개발 환경 설정 (5분)

```bash
# 1. 의존성 설치
npm install

# 2. Vercel CLI 설치 (없는 경우)
npm install -g vercel

# 3. 로컬 개발 서버 시작
vercel dev
```

**첫 실행 시 질문에 답변**:
- "Set up and develop...?" → **Y**
- "Which scope...?" → **본인 계정**
- "Link to existing project?" → **N**
- "What's your project's name?" → **youtube-content-producer**
- "In which directory...?" → **./** (엔터)
- "Want to override the settings?" → **N**

**실행 결과**:
```
✓ Ready! Available at http://localhost:3000
```

---

### ✅ 2단계: 로컬에서 테스트 (3분)

1. **브라우저 열기**: http://localhost:3000

2. **PRO 모드 확인**:
   - 로고 옆에 **✨ PRO** 배지가 보이나요?
   - 보인다면 → 성공! 3단계로
   - 안 보인다면 → F12 콘솔 확인

3. **실시간 인기 키워드 테스트**:
   - "트렌드 분석" 탭 클릭
   - "실시간 인기 키워드" 섹션에서 "새로고침" 클릭
   - 토스트 메시지: **"실시간 인기 키워드 50개 영상 분석 완료!"**
   - 실제 YouTube 키워드들이 보이면 성공!

4. **키워드 검색 테스트**:
   - 검색창에 "K-POP" 입력
   - "분석하기" 버튼 클릭
   - YouTube 데이터와 통계 확인

✅ **로컬 테스트 성공!** 이제 배포합시다.

---

### ✅ 3단계: Vercel 프로덕션 배포 (5분)

#### 3-1. Vercel 로그인

```bash
vercel login
```

이메일 입력 → 이메일 확인 → 로그인 완료

#### 3-2. 프로젝트 배포

```bash
vercel
```

**질문에 답변** (2단계와 동일):
- 프로젝트 이름: **youtube-content-producer-app**
- 나머지는 엔터

**결과**:
```
✅ Production: https://youtube-content-producer-app-xxxx.vercel.app
```

#### 3-3. 환경변수 추가

```bash
vercel env add YOUTUBE_API_KEY production
```

**프롬프트에 API 키 입력**:
```
AIzaSyBZp5Xye9qvVzaoVtqYL9ntKC31Kt1atmI
```

#### 3-4. 환경변수 적용 재배포

```bash
vercel --prod
```

**최종 결과**:
```
✅ Production: https://youtube-content-producer-app.vercel.app [deployed]
```

---

### ✅ 4단계: 프로덕션에서 확인 (2분)

1. **배포된 URL 접속**:
   ```
   https://youtube-content-producer-app.vercel.app
   ```

2. **PRO 모드 확인**:
   - 로고 옆 **✨ PRO** 배지 확인

3. **기능 테스트**:
   - 실시간 인기 키워드 → 새로고침 → 실제 데이터 확인
   - 키워드 검색 → YouTube 데이터 확인
   - 카테고리 필터 (정치, 경제, 사회 등) 확인

---

## 🎉 완료!

당신의 YouTube 콘텐츠 프로듀서 앱이 온라인에 공개되었습니다!

**프로덕션 URL**: https://youtube-content-producer-app.vercel.app

---

## 🚨 문제가 발생했나요?

### PRO 배지가 안 보여요

**해결**:
```bash
# 환경변수 확인
vercel env ls

# 없다면 다시 추가
vercel env add YOUTUBE_API_KEY production
# API 키 입력 후

# 재배포
vercel --prod
```

### "Failed to fetch" 오류

**해결**:
1. Vercel 대시보드 → Deployments → Functions 탭
2. 로그 확인
3. 환경변수 오타 확인

### API 키 제한 오류

**해결**:
1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보
2. API 키 클릭 → "애플리케이션 제한사항": **없음** 선택
3. 저장

---

## 📚 상세 가이드

- **로컬 테스트 자세히**: `LOCAL_TESTING_GUIDE.md`
- **배포 자세히**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **전체 문서**: `README.ko.md`

---

## 💡 다음 단계

### OpenAI API 추가 (AI 스크립트 생성)

현재: 템플릿 기반 스크립트  
→ **AI 기반 맞춤형 스크립트**

1. OpenAI API 키 발급: https://platform.openai.com/api-keys
2. 환경변수 추가:
   ```bash
   vercel env add OPENAI_API_KEY production
   # 키 입력
   vercel --prod
   ```

### 커스텀 도메인

`youtube-content-producer-app.vercel.app`  
→ **mycontent.com**

Vercel 대시보드 → Settings → Domains

---

## 🎯 요약

```bash
# 1. 설치 및 시작
npm install
vercel dev

# 2. 테스트
# http://localhost:3000에서 확인

# 3. 배포
vercel login
vercel
vercel env add YOUTUBE_API_KEY production
vercel --prod

# 4. 완료!
# https://youtube-content-producer-app.vercel.app
```

**소요 시간**: 10-15분  
**결과**: 전 세계 어디서나 접속 가능한 앱 🚀

---

## 📞 도움이 필요하면

자세한 문제 해결은 상세 가이드 참조:
- `LOCAL_TESTING_GUIDE.md`
- `VERCEL_DEPLOYMENT_GUIDE.md`
