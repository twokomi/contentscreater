#!/bin/bash

# YouTube Content Producer App - GitHub 배포 스크립트

echo "🚀 GitHub 배포 시작..."
echo ""

# Git 저장소 확인
if [ ! -d ".git" ]; then
    echo "📦 Git 저장소 초기화 중..."
    git init
    git branch -M main
else
    echo "✅ Git 저장소가 이미 초기화되어 있습니다."
fi

# 파일 추가
echo "📁 파일 추가 중..."
git add .

# 커밋
echo "💾 커밋 생성 중..."
git commit -m "Initial commit: YouTube Content Producer App with YouTube API integration

Features:
- Template-based script generation
- Real-time trending keywords dashboard with YouTube API
- Keyword trend analysis
- SEO optimization
- Shorts generator
- Product integration with UTM tracking
- Export functionality (TXT, SRT, JSON)
- Pro mode with YouTube Data API v3
- Complete Korean localization
- Comprehensive documentation

Tech stack:
- Frontend: HTML, CSS, JavaScript (Tailwind CSS)
- Backend: Vercel Serverless Functions
- APIs: YouTube Data API v3, OpenAI (optional)
- Database: Table API"

# GitHub 원격 저장소 확인 및 추가
echo "🔗 GitHub 저장소 연결 확인..."
if ! git remote | grep -q "origin"; then
    echo "⚠️  GitHub 원격 저장소를 수동으로 추가해주세요:"
    echo ""
    echo "   git remote add origin https://github.com/twokomi/contentscreater.git"
    echo ""
    echo "또는 새 저장소 URL을 입력하세요."
else
    echo "✅ 원격 저장소가 이미 연결되어 있습니다."
fi

# 푸시
echo ""
echo "📤 GitHub에 푸시 중..."
echo ""
echo "다음 명령어를 실행하세요:"
echo ""
echo "   git push -u origin main"
echo ""
echo "또는 강제 푸시가 필요한 경우:"
echo ""
echo "   git push -u origin main --force"
echo ""

echo "✨ 준비 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. GitHub 저장소 확인: https://github.com/twokomi/contentscreater"
echo "2. Vercel에서 GitHub 저장소 Import"
echo "3. 환경변수 추가: YOUTUBE_API_KEY"
echo "4. Deploy!"
