// Trends module
const Trends = {
    async init() {
        this.setupEventListeners();
    },
    setupEventListeners() {
        const searchBtn = document.getElementById('trend-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchTrend());
        }
    },
    async searchTrend() {
        const keyword = document.getElementById('trend-keyword').value;
        if (!keyword) {
            showToast('키워드를 입력하세요', 'warning');
            return;
        }
        try {
            const data = await APIClient.searchYouTubeTrends(keyword);
            this.renderTrendResults(data);
            showToast('분석 완료!', 'success');
        } catch (error) {
            showToast('분석 실패', 'error');
        }
    },
    renderTrendResults(data) {
        const container = document.getElementById('trend-results');
        if (!container) return;
        container.innerHTML = `
            <div class="bg-white p-6 rounded">
                <h3 class="font-bold mb-4">${data.keyword} 트렌드</h3>
                <p>총 ${data.totalResults}개 결과</p>
                <p>평균 조회수: ${formatNumber(data.avgViews)}</p>
            </div>
        `;
    },
    async loadTrendingKeywords() {
        try {
            const data = await APIClient.getTrendingKeywords();
            showToast(`${data.totalVideos}개 영상 분석 완료!`, 'success');
        } catch (error) {
            showToast('로드 실패', 'error');
        }
    }
};
