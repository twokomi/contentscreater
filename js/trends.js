// Trends module
const Trends = {
    currentTrendData: null,

    async init() {
        this.setupEventListeners();
        await this.loadTrendingVideos(); // 초기 로드
    },

    setupEventListeners() {
        const searchBtn = document.getElementById('trend-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.analyzeTrends());
        }

        const refreshBtn = document.getElementById('trending-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadTrendingVideos());
        }

        const categorySelect = document.getElementById('trending-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.loadTrendingVideos());
        }
    },

    async loadTrendingVideos() {
        const categorySelect = document.getElementById('trending-category');
        const category = categorySelect ? categorySelect.value : 'all';
        
        const refreshBtn = document.getElementById('trending-refresh-btn');
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>로딩 중...';
        }

        try {
            const response = await APIClient.getTrendingKeywords(category, 'KR');
            
            if (response.ok && response.data) {
                this.renderTrendingVideos(response.data);
                
                const message = response.data.mock 
                    ? '⚠️ 데모 데이터를 표시합니다'
                    : `✅ 인기 영상 ${response.data.totalVideos}개 로드 완료!`;
                
                showToast(message, response.data.mock ? 'warning' : 'success');
            }
        } catch (error) {
            console.error('Load trending error:', error);
            showToast('인기 영상 로드 실패', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>새로고침';
            }
        }
    },

    renderTrendingVideos(data) {
        const container = document.getElementById('trending-keywords');
        if (!container) return;

        if (!data.videos || data.videos.length === 0) {
            container.innerHTML = '<p class="text-gray-500">데이터가 없습니다</p>';
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${data.videos.map(video => `
                    <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                         onclick="Trends.selectVideo('${video.title}')">
                        <div class="flex items-start gap-3 mb-3">
                            <span class="text-2xl font-bold text-red-500">#${video.rank}</span>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-white text-sm mb-1 line-clamp-2">
                                    ${video.title}
                                </h4>
                                <p class="text-xs text-gray-400 mb-2">
                                    <i class="fas fa-user-circle mr-1"></i>${video.channelTitle}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 text-xs text-gray-400">
                            <span title="조회수">
                                <i class="fas fa-eye mr-1"></i>${formatNumber(video.viewCount)}
                            </span>
                            <span title="좋아요">
                                <i class="fas fa-thumbs-up mr-1"></i>${formatNumber(video.likeCount)}
                            </span>
                        </div>
                        ${video.trend ? `<span class="inline-block mt-2 text-xs px-2 py-1 bg-green-500 text-white rounded">
                            <i class="fas fa-arrow-up mr-1"></i>급상승
                        </span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    selectVideo(title) {
        const keywordInput = document.getElementById('trend-keyword');
        if (keywordInput) {
            // 제목에서 핵심 키워드 추출 (첫 2-3단어)
            const keywords = title.split(' ').slice(0, 3).join(' ');
            keywordInput.value = keywords;
            showToast(`"${keywords}" 검색어가 입력되었습니다`, 'info');
        }
    },

    async analyzeTrends() {
        const keywordInput = document.getElementById('trend-keyword');
        const keyword = keywordInput ? keywordInput.value.trim() : '';
        
        if (!keyword) {
            showToast('키워드를 입력하세요', 'warning');
            return;
        }

        const searchBtn = document.getElementById('trend-search-btn');
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>분석 중...';
        }

        try {
            const data = await APIClient.searchYouTubeTrends(keyword, 'KR');
            this.renderTrendResults(data);
            showToast('✅ 트렌드 분석 완료!', 'success');
        } catch (error) {
            console.error('Analyze error:', error);
            showToast('트렌드 분석 실패', 'error');
        } finally {
            if (searchBtn) {
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i>분석하기';
            }
        }
    },

    renderTrendResults(data) {
        const container = document.getElementById('trend-results');
        if (!container) return;

        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4">"${data.keyword}" 분석 결과</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-500">${data.totalResults}</div>
                        <div class="text-sm text-gray-500">검색 결과</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-500">${formatNumber(data.avgViews)}</div>
                        <div class="text-sm text-gray-500">평균 조회수</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-500">${formatNumber(data.totalViews)}</div>
                        <div class="text-sm text-gray-500">총 조회수</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold ${
                            data.recommendation === 'Go' ? 'text-green-500' : 
                            data.recommendation === 'Wait' ? 'text-yellow-500' : 'text-gray-500'
                        }">${data.recommendation}</div>
                        <div class="text-sm text-gray-500">추천</div>
                    </div>
                </div>
                ${data.results && data.results.length > 0 ? `
                    <h4 class="font-semibold mb-3">관련 영상</h4>
                    <div class="space-y-2">
                        ${data.results.slice(0, 5).map(video => `
                            <div class="border dark:border-gray-700 rounded p-3">
                                <div class="font-medium mb-1">${video.title}</div>
                                <div class="text-sm text-gray-500">
                                    ${video.channelTitle} · 조회수 ${formatNumber(video.viewCount)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
};
