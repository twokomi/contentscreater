# YCPA - 유튜브 콘텐츠 제작 도우미

> AI 기반 유튜브 콘텐츠 제작 어시스턴트: 스크립트 작성, 트렌드 분석, 쇼츠 생성

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-MVP-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 개요

YCPA(YouTube Content Producer App)는 콘텐츠 크리에이터가 전문적인 유튜브 영상을 효율적으로 제작할 수 있도록 돕는 종합 웹 애플리케이션입니다. AI 기반 스크립트 생성, 트렌드 분석, SEO 최적화, 쇼츠 제작 도구를 제공합니다.

## 🤔 API 키가 왜 필요 없나요?

**YCPA는 템플릿 기반 시스템으로 작동합니다!**

현재 **MVP 모드**는 OpenAI API 없이도 완전히 작동합니다:

- ✅ **규칙 기반 생성**: 미리 정의된 패턴과 알고리즘으로 콘텐츠 생성
- ✅ **모의 트렌드 데이터**: 실제와 유사한 트렌드 패턴을 알고리즘으로 생성
- ✅ **즉시 사용 가능**: 설정 없이 바로 시작
- ✅ **무제한 생성**: 비용이나 제한 없이 무한 사용

자세한 내용은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

### 주요 기능

✅ **현재 구현된 기능 (MVP 모드)**

- ✨ **템플릿 기반 스크립트 생성** - API 키 없이 전문 스크립트 작성
- 📊 **트렌드 분석** - 키워드 트렌드를 시각화
- 🎬 **프로젝트 관리** - 여러 영상 프로젝트를 상태별로 관리
- 📝 **스크립트 에디터** - 오프닝, 본문, 엔딩 섹션 편집
- 🎯 **페르소나 기반 앵글** - 다양한 시청자를 위한 콘텐츠 앵글 생성
- 🔗 **SEO 최적화** - 제목, 설명, 해시태그, 챕터 자동 생성
- 📱 **쇼츠 생성기** - 롱폼 콘텐츠를 3가지 쇼츠로 변환 (15-60초)
- 💼 **제품 통합** - 자동 UTM 트래킹과 제품 링크 관리
- 🎨 **B-roll 힌트** - B-roll 영상을 위한 키워드 제안
- 📥 **내보내기 기능** - TXT, SRT(자막), JSON 형식으로 다운로드
- 🌓 **다크 모드** - 라이트/다크 테마 완벽 지원
- ⌨️ **키보드 단축키** - 파워 유저 기능 (Ctrl+S, Ctrl+K, J/K 탐색)
- 💾 **자동 저장** - 2초 디바운스 자동 저장 및 상태 표시

## 🚀 빠른 시작

### MVP 모드 (API 키 없음)

설치가 필요 없습니다! CDN 리소스를 사용하는 정적 웹 애플리케이션입니다.

1. 저장소를 클론하거나 파일 다운로드
2. `index.html`을 최신 웹 브라우저에서 열기
3. 콘텐츠 제작 시작!

### Pro 모드 (YouTube API 키 사용) ✨

**YouTube API 키를 발급받으셨나요?** 10-15분이면 배포 완료!

📖 **빠른 시작 가이드**: [`QUICK_START.md`](./QUICK_START.md) ← **여기서 시작!**

```bash
# 1. 로컬 테스트 (5분)
npm install
vercel dev
# http://localhost:3000에서 PRO 모드 확인

# 2. 프로덕션 배포 (5분)
vercel login
vercel
vercel env add YOUTUBE_API_KEY production
# API 키 입력: AIzaSyBZp5Xye9qvVzaoVtqYL9ntKC31Kt1atmI
vercel --prod

# 완료! ✨ PRO 배지가 표시됩니다
```

**상세 가이드**:
- 🧪 **로컬 테스트**: [`LOCAL_TESTING_GUIDE.md`](./LOCAL_TESTING_GUIDE.md)
- 🚀 **Vercel 배포**: [`VERCEL_DEPLOYMENT_GUIDE.md`](./VERCEL_DEPLOYMENT_GUIDE.md)
- 💰 **무료 옵션**: [`FREE_OPTIONS.md`](./FREE_OPTIONS.md)

### 사용 방법

#### 1. 새 프로젝트 만들기

1. **프로젝트** 탭으로 이동
2. 프로젝트 상세 정보 입력:
   - **주제**: 영상 주제/제목
   - **길이**: 짧음(1-3분), 중간(3-8분), 김(8-15분)
   - **톤**: 캐주얼, 전문적, 활기찬, 교육적
   - **타겟 오디언스**: 콘텐츠 대상
3. **생성하기** 클릭

#### 2. 스크립트 편집

1. 프로젝트를 더블클릭하여 확장
2. 탭 탐색: 스크립트, 앵글, SEO, 쇼츠, 제품
3. 스크립트 섹션 편집 (오프닝, 본문 단계, 엔딩)
4. 2초 후 자동 저장 활성화
5. **스크립트 저장** 클릭하여 수동 저장

#### 3. 쇼츠 생성

1. 프로젝트 상세 패널 열기
2. **쇼츠** 탭으로 이동
3. **쇼츠 생성 (3가지 버전)** 클릭
4. 3가지 쇼츠 영상 스크립트 확인 (15초, 30초, 45초)

#### 4. 트렌드 분석

1. **트렌드** 탭으로 이동
2. 분석할 키워드 입력
3. 지역과 기간 선택
4. **분석하기** 클릭하여 다음 확인:
   - 시간별 관심도 차트
   - 인기 연관 검색어
   - 급상승 검색어
   - 콘텐츠 추천 (진행/대기/계절성)
   - 페르소나 기반 앵글
5. **이 트렌드로 프로젝트 만들기** 클릭하여 새 프로젝트 시작

#### 5. 콘텐츠 내보내기

- **TXT**: 전체 스크립트를 텍스트 파일로
- **SRT**: 타임스탬프가 포함된 자막 파일
- **JSON**: 프로젝트 전체 데이터

## 📁 프로젝트 구조

```
ycpa-web/
├── index.html              # 메인 애플리케이션 진입점
├── css/
│   └── main.css           # 커스텀 스타일 및 테마
├── js/
│   ├── main.js            # 애플리케이션 초기화 & 라우팅
│   ├── utils.js           # 유틸리티 함수 (UUID, 날짜, 토스트 등)
│   ├── storage.js         # Table API 연동
│   ├── templates.js       # 템플릿 기반 콘텐츠 생성
│   ├── projects.js        # 프로젝트 모듈 (CRUD, 편집)
│   └── trends.js          # 트렌드 분석 모듈
├── .env.example           # 환경 변수 템플릿
├── .gitignore             # Git 무시 규칙
├── package.json           # 프로젝트 메타데이터
├── README.md             # 영문 문서
├── README.ko.md          # 한글 문서 (이 파일)
└── ARCHITECTURE.md       # 아키텍처 설명
```

## 🗄️ 데이터 모델

애플리케이션은 다음 데이터 모델을 사용합니다 (Table API):

### 프로젝트
- `id`, `topic`, `audience`, `tone`, `length`, `status`, `createdAt`, `updatedAt`

### 스크립트
- `id`, `projectId`, `opening`, `bodyJson`, `ending`, `fullMarkdown`, `wordCount`, `version`

### 앵글
- `id`, `projectId`, `persona`, `angleTitle`, `hook`, `thumbnailCopy`

### CTA (행동 유도)
- `id`, `projectId`, `timing`, `text`, `onScreenText`, `destination`

### SEO
- `id`, `projectId`, `titleA`, `titleB`, `description`, `hashtagsJson`, `chaptersJson`

### 제품
- `id`, `projectId`, `name`, `description`, `url`, `buttonText`, `utm`

### 쇼츠
- `id`, `projectId`, `durationSec`, `hook`, `captionsJson`, `overlayTextsJson`

### 에셋 힌트
- `id`, `projectId`, `brollKeywordsJson`, `subtitleCuesJson`

### 트렌드 쿼리
- `id`, `keyword`, `locale`, `range`, `resultJson`, `createdAt`

## ⌨️ 키보드 단축키

- **Ctrl/Cmd + S**: 현재 스크립트 저장
- **Ctrl/Cmd + K**: 명령 팔레트 열기
- **J**: 다음 항목으로 이동 (목록 보기)
- **K**: 이전 항목으로 이동 (목록 보기)
- **Escape**: 모달/패널 닫기

## 🎨 기능 상세

### 템플릿 기반 생성 (MVP 모드)

애플리케이션은 **API 키 없이** 지능형 규칙 기반 템플릿으로 작동합니다:

- **훅 템플릿**: 톤별 다양한 훅 (캐주얼, 전문적, 활기찬, 교육적)
- **본문 구조**: 영상 길이에 따라 자동으로 단계 생성
- **CTA 변형**: 여러 행동 유도 타이밍 (오프닝, 중반, 엔딩)
- **SEO 패턴**: 제목, 설명, 해시태그 자동 생성
- **쇼츠 로직**: 핵심 순간을 추출하여 3가지 버전 생성

### 트렌드 분석

- **모의 데이터 생성**: API 호출 없이 현실적인 트렌드 시각화
- **변동성 계산**: 검색 관심도 안정성 분석
- **추천 엔진**: 진행/대기/계절성 제안
- **연관 검색어**: 인기 및 급상승 검색어
- **페르소나 앵글**: 초보자/중급자/고급 콘텐츠 앵글

### 제품 수익화

- **자동 UTM 트래킹**: `utm_source=ycpa&utm_medium=short&utm_campaign={projectId}` 자동 추가
- **여러 배치**: 엔드스크린, 설명, 고정 댓글 제안
- **링크 검증**: 올바른 URL 형식 확인

## 🔄 상태 & 로드맵

### 현재 상태: MVP + Pro 모드 ✅

**MVP 모드 (기본)**
- 모든 핵심 기능이 API 키 없이 완전히 작동합니다
- 템플릿 기반 고품질 콘텐츠 생성

**Pro 모드 (선택사항)** ✨
- ✅ **OpenAI 연동**: GPT-4 기반 스크립트 생성
- ✅ **YouTube Data API**: 실제 트렌드 데이터 및 검색량
- ✅ **자동 폴백**: API 실패 시 MVP 모드로 전환
- ✅ **배포 가능**: Vercel/Netlify 원클릭 배포

### Pro 모드 시작하기 🚀

```bash
# 1. API 키 발급 (15분)
# - OpenAI: https://platform.openai.com
# - YouTube: https://console.cloud.google.com

# 2. 배포 (5분)
npm install -g vercel
vercel
vercel env add OPENAI_API_KEY production
vercel env add YOUTUBE_API_KEY production
vercel --prod

# 완료! ✨ PRO 배지가 표시됩니다
```

📖 **상세 가이드**: [PRO_MODE_GUIDE.md](./PRO_MODE_GUIDE.md)

### 향후 예정 기능 🚧

- 🎥 **영상 분석**: 인기 영상 분석 기능
- 📈 **분석 대시보드**: 프로젝트 성과 추적
- 🔐 **사용자 인증**: 다중 사용자 지원
- ☁️ **클라우드 동기화**: 기기 간 프로젝트 동기화
- 🎨 **썸네일 생성기**: AI 기반 썸네일 디자인
- 🗣️ **보이스오버 스크립트**: 오디오 타이밍 최적화

### 개선 요청

- [ ] 다국어 지원
- [ ] 팀 협업 기능
- [ ] 롤백 기능이 있는 버전 히스토리
- [ ] 콘텐츠 캘린더 연동
- [ ] 고급 SEO 점수
- [ ] 경쟁사 분석
- [ ] 배치 작업
- [ ] 커스텀 템플릿 생성

## 🔧 설정

### 환경 변수

`.env.example`을 `.env`로 복사하여 설정:

```env
# 선택사항: Pro 모드 기능을 위한 설정
OPENAI_API_KEY=         # AI 생성을 위한 OpenAI API 키
YOUTUBE_API_KEY=        # YouTube Data API 키
GOOGLE_API_KEY=         # Google Trends API 키
APP_URL=                # 애플리케이션 URL
```

**참고**: MVP 모드는 API 키 없이 완벽하게 작동합니다!

## 🌐 API 연동

### Table API 엔드포인트

애플리케이션은 내장 Table API의 상대 URL을 사용합니다:

- `GET tables/{table}` - 레코드 목록 조회
- `GET tables/{table}/{id}` - 단일 레코드 조회
- `POST tables/{table}` - 레코드 생성
- `PATCH tables/{table}/{id}` - 레코드 수정
- `DELETE tables/{table}/{id}` - 레코드 삭제

모든 데이터는 플랫폼의 Table API를 통해 자동으로 저장됩니다.

## 🎯 사용 사례

### 콘텐츠 크리에이터
- 영상 콘텐츠 전략 계획
- 스크립트 개요 빠르게 생성
- SEO 최적화
- 콘텐츠를 쇼츠로 재활용

### 마케팅 팀
- 제품 영상 스크립트 작성
- 트렌딩 주제 분석
- A/B 테스트 영상 제목
- 캠페인 링크 추적

### 교육자
- 교육 콘텐츠 구조화
- 강의 영상 스크립트 작성
- 학습 자료 생성
- 영상 시리즈 계획

### 에이전시
- 여러 클라이언트 프로젝트 관리
- 콘텐츠 워크플로우 표준화
- 산출물 효율적 내보내기
- 프로젝트 상태 추적

## 🎨 디자인 & UX

- **반응형 디자인**: 데스크톱, 태블릿, 모바일에서 작동
- **다크 모드**: 시스템 설정 자동 감지와 함께 완벽한 다크 테마
- **직관적 탐색**: 키보드 단축키가 있는 탭 기반 인터페이스
- **실시간 피드백**: 토스트 알림 및 자동 저장 표시
- **접근성**: 시맨틱 HTML 및 ARIA 레이블

## 🔒 보안 & 개인정보

- ✅ 외부 서버로 데이터 전송 없음 (MVP 모드)
- ✅ 모든 데이터는 Table API를 사용하여 로컬 저장
- ✅ 쿠키나 추적 없음
- ✅ 개인 정보 수집 없음
- ✅ API 키 (사용 시) 백엔드에만 저장
- ✅ 클라이언트 측 작업만

## 📝 라이선스

MIT 라이선스 - 개인 또는 상업적 목적으로 자유롭게 사용하세요.

## 🤝 기여

기여를 환영합니다! Pull Request를 제출해주세요.

## 📞 지원

문제, 질문 또는 기능 요청은 저장소에 이슈를 열어주세요.

## 🙏 감사의 말

- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Font Awesome**: 아이콘 라이브러리
- **Pretendard**: 한글 웹 폰트
- **Table API**: 내장 데이터 지속성

---

**콘텐츠 크리에이터를 위해 ❤️ 로 만들었습니다**

오늘 놀라운 유튜브 콘텐츠를 만들기 시작하세요! 🎬✨
