#!/bin/bash

# YouTube Content Producer App - 파일 생성 스크립트
# 로컬 터미널에서 실행하세요: bash create-files.sh

echo "🚀 YouTube Content Producer App 파일 생성 중..."
echo ""

# 현재 위치 확인
if [ ! -f "package.json" ]; then
    echo "❌ 오류: youtube-content-producer-app 폴더에서 실행해주세요!"
    echo "   cd ~/youtube-content-producer-app"
    exit 1
fi

# 폴더 생성
echo "📁 폴더 구조 생성 중..."
mkdir -p css js api/ai api/trends

echo "✅ 폴더 생성 완료"
echo ""
echo "📥 파일 다운로드가 필요합니다."
echo ""
echo "다음 방법 중 하나를 선택하세요:"
echo ""
echo "방법 1: Genipark AI 환경에서 다운로드 (추천)"
echo "  1. Genipark 탭으로 이동"
echo "  2. 왼쪽 파일 탐색기에서 프로젝트 폴더 전체 선택"
echo "  3. 우클릭 → Download 또는 Export"
echo "  4. 압축 해제 후 이 폴더에 복사"
echo ""
echo "방법 2: GitHub에서 클론"
echo "  1. AI 환경에서 먼저 GitHub에 전체 파일 푸시"
echo "  2. git clone https://github.com/twokomi/contentscreater.git temp"
echo "  3. cp -r temp/* ."
echo "  4. rm -rf temp"
echo ""
echo "방법 3: 수동 파일 생성"
echo "  제공된 각 파일 생성 스크립트를 하나씩 실행"
echo ""

read -p "계속하시겠습니까? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 0
fi

echo ""
echo "✅ 준비 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. 파일들을 이 폴더에 추가하세요"
echo "2. git add ."
echo "3. git commit -m \"Add all project files\""
echo "4. git push origin main"
echo "5. Vercel에서 GitHub 저장소 Import"
echo ""
