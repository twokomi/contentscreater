/**
 * YCPA Trends Module
 * Handles keyword trend analysis and recommendations
 */

const TrendsModule = {
    currentQuery: null,
    trendingData: null,
    
    // Initialize trends view
    init() {
        this.bindEvents();
        // 자동으로 트렌딩 키워드 로드
        this.loadTrendingKeywords();
    },
    
    // Analyze keyword trends
    async analyzeTrends() {
        const keyword = document.getElementById('trend-keyword').value.trim();
        const locale = document.getElementById('trend-locale').value;
        const range = document.getElementById('trend-range').value;
        
        if (!keyword) {
            showToast('키워드를 입력해주세요', 'warning');
            return;
        }
        
        // Show loading
        const btn = document.getElementById('btn-analyze');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>분석중...';
        
        try {
            // Check cache first
            let query = await StorageAPI.getTrendQuery(keyword, locale, range);
            
            if (!query) {
                let result;
                
                // Pro Mode: 실제 YouTube 데이터
                if (APIClient.isProModeAvailable) {
                    try {
                        showToast('YouTube에서 실제 트렌드 데이터를 가져오는 중...', 'info', 2000);
                        
                        const youtubeData = await APIClient.analyzeYouTubeTrends({
                            keyword,
                            locale,
                            range
                        });
                        
                        // YouTube 데이터를 우리 형식으로 변환
                        result = {
                            keyword: youtubeData.keyword,
                            volumeIndex: this.convertYouTubeToVolumeIndex(youtubeData),
                            relatedQueriesTop: youtubeData.relatedQueriesTop || [],
                            relatedQueriesRising: youtubeData.relatedQueriesRising || [],
                            volatility: youtubeData.volatility,
                            avgVolume: youtubeData.avgViews,
                            recentVolume: youtubeData.recentAvgViews,
                            seasonality: youtubeData.seasonality,
                            recommendation: youtubeData.recommendation,
                            recommendationReason: youtubeData.recommendationReason,
                            topVideos: youtubeData.topVideos
                        };
                        
                        console.log('✅ YouTube 트렌드 분석 완료');
                        showToast(\`실제 YouTube 데이터로 분석되었습니다! (\${youtubeData.totalVideos}개 영상 분석)\`, 'success', 3000);
                    } catch (apiError) {
                        console.warn('YouTube API 실패, 모의 데이터 사용:', apiError);
                        showToast('실제 데이터 로드 실패 - 모의 데이터로 표시합니다', 'warning', 2000);
                        result = this.generateMockTrendData(keyword);
                    }
                } else {
                    result = this.generateMockTrendData(keyword);
                }
                
                query = await StorageAPI.createTrendQuery({
                    keyword,
                    locale,
                    range,
                    result
                });
            }
            
            this.currentQuery = query;
            this.renderTrendResults(query);
            
        } catch (error) {
            console.error('Error analyzing trends:', error);
            showToast('트렌드 분석에 실패했습니다', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-search mr-2"></i>분석하기';
        }
    },
    
    generateMockTrendData(keyword) {
        const days = 30;
        const volumeIndex = [];
        const baseValue = 50 + Math.random() * 30;
        const trend = (Math.random() - 0.5) * 2;
        
        for (let i = 0; i < days; i++) {
            const noise = (Math.random() - 0.5) * 20;
            const value = Math.max(0, Math.min(100, baseValue + (trend * i) + noise));
            volumeIndex.push({
                date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                value: Math.round(value)
            });
        }
        
        const avgVolume = volumeIndex.reduce((sum, v) => sum + v.value, 0) / volumeIndex.length;
        const recentVolume = volumeIndex.slice(-7).reduce((sum, v) => sum + v.value, 0) / 7;
        const volatility = this.calculateVolatility(volumeIndex);
        const relatedQueriesTop = this.generateRelatedQueries(keyword, 'top');
        const relatedQueriesRising = this.generateRelatedQueries(keyword, 'rising');
        
        let recommendation = '진행';
        let recommendationReason = '강력하고 안정적인 관심도';
        
        if (volatility > 30) {
            recommendation = '계절성';
            recommendationReason = '높은 변동성 - 타이밍을 고려하세요';
        } else if (recentVolume < avgVolume * 0.7) {
            recommendation = '대기';
            recommendationReason = '최근 관심도가 하락하고 있습니다';
        } else if (recentVolume > avgVolume * 1.3) {
            recommendation = '진행';
            recommendationReason = '관심도가 상승중 - 지금 시작하세요!';
        }
        
        return {
            keyword,
            volumeIndex,
            relatedQueriesTop,
            relatedQueriesRising,
            volatility: Math.round(volatility),
            avgVolume: Math.round(avgVolume),
            recentVolume: Math.round(recentVolume),
            seasonality: volatility > 25 ? '높음' : volatility > 15 ? '중간' : '낮음',
            recommendation,
            recommendationReason
        };
    },
    
    calculateVolatility(volumeIndex) {
        const values = volumeIndex.map(v => v.value);
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
        return Math.sqrt(variance);
    },
    
    generateRelatedQueries(keyword, type) {
        const prefixes = ['방법', '최고의', '인기', '배우기', '가이드', '팁', '튜토리얼'];
        const suffixes = ['2024', '초보자', '튜토리얼', '가이드', '팁', '비법', '핵'];
        const related = ['도구', '소프트웨어', '앱', '강의', '무료', '온라인'];
        const queries = [];
        
        if (type === 'top') {
            queries.push(
                { query: \`\${keyword} 튜토리얼\`, value: Math.round(70 + Math.random() * 30) },
                { query: \`최고의 \${keyword}\`, value: Math.round(60 + Math.random() * 30) },
                { query: \`\${keyword} 가이드\`, value: Math.round(50 + Math.random() * 30) },
                { query: \`\${keyword} 사용법\`, value: Math.round(40 + Math.random() * 30) },
                { query: \`\${keyword} 팁\`, value: Math.round(30 + Math.random() * 30) }
            );
        } else {
            queries.push(
                { query: \`\${keyword} \${suffixes[Math.floor(Math.random() * suffixes.length)]}\`, growth: '+' + Math.round(100 + Math.random() * 400) + '%' },
                { query: \`\${prefixes[Math.floor(Math.random() * prefixes.length)]} \${keyword}\`, growth: '+' + Math.round(100 + Math.random() * 300) + '%' },
                { query: \`\${keyword} \${related[Math.floor(Math.random() * related.length)]}\`, growth: '+' + Math.round(80 + Math.random() * 200) + '%' },
                { query: \`\${keyword} vs\`, growth: '+' + Math.round(60 + Math.random() * 150) + '%' },
                { query: \`무료 \${keyword}\`, growth: '+' + Math.round(50 + Math.random() * 100) + '%' }
            );
        }
        return queries;
    },
    
    renderTrendResults(query) {
        const result = JSON.parse(query.resultJson);
        const container = document.getElementById('trend-results');
        container.classList.remove('hidden');
        
        container.innerHTML = \`
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">
                        <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>추천
                    </h3>
                    <div class="recommendation-badge \${result.recommendation.toLowerCase()}">
                        \${this.getRecommendationIcon(result.recommendation)} \${result.recommendation}
                    </div>
                </div>
                <p class="text-gray-600 dark:text-gray-400 mb-4">\${result.recommendationReason}</p>
                <button onclick="TrendsModule.createProjectFromTrend()" class="btn-primary px-6 py-2 rounded-lg">
                    <i class="fas fa-arrow-right mr-2"></i>이 트렌드로 프로젝트 만들기
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">평균 검색량</div>
                    <div class="text-2xl font-bold">\${result.avgVolume}</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">최근 검색량</div>
                    <div class="text-2xl font-bold">\${result.recentVolume}</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">변동성</div>
                    <div class="text-2xl font-bold">\${result.volatility}%</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">계절성</div>
                    <div class="text-2xl font-bold">\${result.seasonality}</div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold mb-4">
                    <i class="fas fa-chart-line text-primary-600 dark:text-primary-400 mr-2"></i>시간별 관심도
                </h3>
                <div class="trend-chart relative">
                    <canvas id="trend-chart-canvas" width="800" height="300"></canvas>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4">
                        <i class="fas fa-fire text-orange-500 mr-2"></i>인기 연관 검색어
                    </h3>
                    <div class="space-y-3">
                        \${result.relatedQueriesTop.map(q => \`
                            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div class="flex-1"><div class="font-medium">\${q.query}</div></div>
                                <div class="text-sm font-semibold text-primary-600 dark:text-primary-400">\${q.value}</div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4">
                        <i class="fas fa-arrow-trend-up text-green-500 mr-2"></i>급상승 검색어
                    </h3>
                    <div class="space-y-3">
                        \${result.relatedQueriesRising.map(q => \`
                            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div class="flex-1"><div class="font-medium">\${q.query}</div></div>
                                <div class="text-sm font-semibold text-green-600 dark:text-green-400">\${q.growth}</div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold mb-4">
                    <i class="fas fa-users text-purple-500 mr-2"></i>추천 앵글 & 훅
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    \${this.generateAngleSuggestions(result.keyword).map(angle => \`
                        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div class="font-semibold text-primary-600 dark:text-primary-400 mb-2">\${angle.persona}</div>
                            <div class="text-sm mb-2">\${angle.hook}</div>
                            <div class="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded inline-block">\${angle.thumbnailCopy}</div>
                        </div>
                    \`).join('')}
                </div>
            </div>
        \`;
        
        this.drawTrendChart(result.volumeIndex);
        container.scrollIntoView({ behavior: 'smooth' });
    },
    
    getRecommendationIcon(recommendation) {
        const icons = {
            '진행': '<i class="fas fa-check-circle"></i>',
            'Go': '<i class="fas fa-check-circle"></i>',
            '대기': '<i class="fas fa-hourglass-half"></i>',
            'Wait': '<i class="fas fa-hourglass-half"></i>',
            '계절성': '<i class="fas fa-calendar-alt"></i>',
            'Seasonal': '<i class="fas fa-calendar-alt"></i>'
        };
        return icons[recommendation] || '';
    },
    
    generateAngleSuggestions(keyword) {
        return [
            {
                persona: '초보자',
                hook: \`\${keyword} 처음이신가요? 여기서 시작하세요!\`,
                thumbnailCopy: '입문 가이드'
            },
            {
                persona: '중급자',
                hook: \`\${keyword} 실력을 한 단계 올리세요\`,
                thumbnailCopy: '레벨업'
            },
            {
                persona: '고급',
                hook: \`\${keyword}를 프로처럼 마스터하기\`,
                thumbnailCopy: '프로 팁'
            }
        ];
    },
    
    drawTrendChart(volumeIndex) {
        const canvas = document.getElementById('trend-chart-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const values = volumeIndex.map(v => v.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;
        
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - padding * 2) * (i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        volumeIndex.forEach((point, i) => {
            const x = padding + (width - padding * 2) * (i / (volumeIndex.length - 1));
            const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        volumeIndex.forEach((point, i) => {
            const x = padding + (width - padding * 2) * (i / (volumeIndex.length - 1));
            const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        const labels = [0, Math.floor(volumeIndex.length / 2), volumeIndex.length - 1];
        labels.forEach(i => {
            const x = padding + (width - padding * 2) * (i / (volumeIndex.length - 1));
            const date = new Date(volumeIndex[i].date);
            const label = \`\${date.getMonth() + 1}/\${date.getDate()}\`;
            ctx.fillText(label, x, height - padding + 20);
        });
    },
    
    createProjectFromTrend() {
        if (!this.currentQuery) return;
        
        const result = JSON.parse(this.currentQuery.resultJson);
        document.getElementById('input-topic').value = result.keyword;
        document.getElementById('input-audience').value = '일반 시청자';
        document.getElementById('input-tone').value = 'professional';
        document.getElementById('input-length').value = 'medium';
        document.getElementById('nav-projects').click();
        document.getElementById('input-topic').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('input-topic').focus();
        showToast('주제가 입력되었습니다! 프로젝트를 생성하세요', 'success');
    },
    
    convertYouTubeToVolumeIndex(youtubeData) {
        const days = 30;
        const baseValue = youtubeData.avgViews / 10000;
        const volumeIndex = [];
        
        for (let i = 0; i < days; i++) {
            const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
            const noise = (Math.random() - 0.5) * baseValue * 0.2;
            const value = Math.max(0, Math.min(100, baseValue + noise));
            
            volumeIndex.push({
                date: date.toISOString().split('T')[0],
                value: Math.round(value)
            });
        }
        
        return volumeIndex;
    },
    
    async loadTrendingKeywords() {
        const category = document.getElementById('trending-category').value;
        const period = document.getElementById('trending-period').value;
        const locale = document.getElementById('trend-locale')?.value || 'KR';
        
        const btn = document.getElementById('btn-refresh-trending');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>로딩중...';
        }
        
        try {
            let data;
            
            if (APIClient.isProModeAvailable) {
                const response = await fetch(\`\${APIClient.baseURL}/api/trends/trending?category=\${category}&locale=\${locale}&period=\${period}\`);
                const result = await response.json();
                
                if (result.ok) {
                    data = result.data;
                    if (!result.data.mock) {
                        showToast(\`실시간 인기 영상 \${data.totalVideos}개 로드 완료!\`, 'success', 2000);
                    }
                } else {
                    throw new Error('Failed to load trending videos');
                }
            } else {
                data = this.generateMockTrendingVideos(category, locale);
            }
            
            this.trendingData = data;
            this.renderTrendingKeywords(data);
            
        } catch (error) {
            console.error('Error loading trending videos:', error);
            showToast('인기 영상을 불러올 수 없습니다', 'error');
            const mockData = this.generateMockTrendingVideos(category, locale);
            this.renderTrendingKeywords(mockData);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i>새로고침';
            }
        }
    },
    
    renderTrendingKeywords(data) {
        const container = document.getElementById('trending-keywords');
        
        if (!data.videos || data.videos.length === 0) {
            container.innerHTML = \`
                <div class="col-span-full text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                    <p>인기 영상이 없습니다</p>
                </div>
            \`;
            return;
        }
        
        container.innerHTML = data.videos.map(video => \`
            <div class="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                <div class="relative">
                    <img src="\${video.thumbnail}" alt="\${video.title}" class="w-full h-40 object-cover">
                    <div class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">
                        #\${video.rank}
                    </div>
                </div>
                <div class="p-4">
                    <h4 class="font-semibold text-white text-sm mb-2 line-clamp-2" title="\${video.title}">
                        \${video.title}
                    </h4>
                    <p class="text-xs text-gray-400 mb-2">\${video.channelTitle}</p>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>
                            <i class="fas fa-eye mr-1"></i>\${this.formatNumber(video.viewCount)}
                        </span>
                        <span>
                            <i class="fas fa-thumbs-up mr-1"></i>\${this.formatNumber(video.likeCount)}
                        </span>
                    </div>
                </div>
            </div>
        \`).join('');
    },
    
    getTrendIcon(trend) {
        const icons = {
            'up': '<i class="fas fa-arrow-up text-green-500"></i>',
            'down': '<i class="fas fa-arrow-down text-red-500"></i>',
            'stable': '<i class="fas fa-minus text-gray-500"></i>'
        };
        return icons[trend] || icons.stable;
    },
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    selectTrendingKeyword(keyword) {
        document.getElementById('trend-keyword').value = keyword;
        document.getElementById('trend-keyword').scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast(\`"\${keyword}" 키워드가 선택되었습니다. 분석하기를 클릭하세요!\`, 'info', 3000);
    },
    
    generateMockTrendingVideos(category, locale) {
        const mockTitles = {
            politics: ['대선 후보 토론회 하이라이트', '새로운 정책 발표 현장', '국회 본회의 주요 안건', '지방선거 개표 현황'],
            economy: ['주식 시장 전망 분석', '부동산 정책 변화 정리', '금리 인상 영향 해설', '경제 지표 요약'],
            culture: ['최신 드라마 명장면 모음', 'K-POP 신곡 무대 직캠', '영화 예고편 공개', '예능 프로그램 베스트 컷'],
            tech: ['최신 스마트폰 리뷰', 'AI 기술 트렌드 2024', '게임 신작 플레이 영상', '반도체 산업 분석'],
            all: ['오늘의 핫이슈 TOP 10', '실시간 검색어 1위', '화제의 영상 모음', '최신 트렌드 정리']
        };
        
        const baseTitles = mockTitles[category] || mockTitles.all;
        const videos = [];
        
        for (let i = 0; i < 20; i++) {
            videos.push({
                rank: i + 1,
                title: baseTitles[i % baseTitles.length] + \` #\${i + 1}\`,
                channelTitle: \`인기 채널 \${String.fromCharCode(65 + (i % 10))}\`,
                viewCount: Math.round((Math.random() * 1000000) + 100000),
                likeCount: Math.round((Math.random() * 50000) + 5000),
                commentCount: Math.round((Math.random() * 10000) + 1000),
                publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                thumbnail: \`https://placehold.co/320x180/1f2937/ef4444?text=Video+\${i+1}\`,
                videoId: \`mock_video_\${i + 1}\`
            });
        }
        
        return {
            category,
            locale,
            period: 'daily',
            updatedAt: new Date().toISOString(),
            totalVideos: 50,
            mock: true,
            videos
        };
    },
    
    bindEvents() {
        document.getElementById('btn-analyze').addEventListener('click', () => {
            this.analyzeTrends();
        });
        
        document.getElementById('btn-refresh-trending').addEventListener('click', () => {
            this.loadTrendingKeywords();
        });
        
        document.getElementById('trending-category').addEventListener('change', () => {
            this.loadTrendingKeywords();
        });
        
        document.getElementById('trending-period').addEventListener('change', () => {
            this.loadTrendingKeywords();
        });
        
        document.getElementById('trend-keyword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeTrends();
            }
        });
    }
};
