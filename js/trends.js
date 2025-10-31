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
                            topVideos: youtubeData.topVideos // 추가 정보
                        };
                        
                        console.log('✅ YouTube 트렌드 분석 완료');
                        showToast(`실제 YouTube 데이터로 분석되었습니다! (${youtubeData.totalVideos}개 영상 분석)`, 'success', 3000);
                    } catch (apiError) {
                        console.warn('YouTube API 실패, 모의 데이터 사용:', apiError);
                        showToast('실제 데이터 로드 실패 - 모의 데이터로 표시합니다', 'warning', 2000);
                        
                        // Fallback to mock data
                        result = this.generateMockTrendData(keyword);
                    }
                } else {
                    // MVP Mode: 모의 데이터
                    result = this.generateMockTrendData(keyword);
                }
                
                // Save query
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
    
    // Generate mock trend data (template-based)
    generateMockTrendData(keyword) {
        // Generate realistic-looking trend data
        const days = 30;
        const volumeIndex = [];
        
        // Create a trend pattern (slight upward trend with noise)
        const baseValue = 50 + Math.random() * 30;
        const trend = (Math.random() - 0.5) * 2; // -1 to 1
        
        for (let i = 0; i < days; i++) {
            const noise = (Math.random() - 0.5) * 20;
            const value = Math.max(0, Math.min(100, baseValue + (trend * i) + noise));
            volumeIndex.push({
                date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                value: Math.round(value)
            });
        }
        
        // Calculate metrics
        const avgVolume = volumeIndex.reduce((sum, v) => sum + v.value, 0) / volumeIndex.length;
        const recentVolume = volumeIndex.slice(-7).reduce((sum, v) => sum + v.value, 0) / 7;
        const volatility = this.calculateVolatility(volumeIndex);
        
        // Generate related queries
        const relatedQueriesTop = this.generateRelatedQueries(keyword, 'top');
        const relatedQueriesRising = this.generateRelatedQueries(keyword, 'rising');
        
        // Determine recommendation
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
    
    // Calculate volatility (standard deviation)
    calculateVolatility(volumeIndex) {
        const values = volumeIndex.map(v => v.value);
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
        return Math.sqrt(variance);
    },
    
    // Generate related queries
    generateRelatedQueries(keyword, type) {
        const prefixes = ['방법', '최고의', '인기', '배우기', '가이드', '팁', '튜토리얼'];
        const suffixes = ['2024', '초보자', '튜토리얼', '가이드', '팁', '비법', '핵'];
        const related = ['도구', '소프트웨어', '앱', '강의', '무료', '온라인'];
        
        const queries = [];
        
        if (type === 'top') {
            queries.push(
                { query: `${keyword} 튜토리얼`, value: Math.round(70 + Math.random() * 30) },
                { query: `최고의 ${keyword}`, value: Math.round(60 + Math.random() * 30) },
                { query: `${keyword} 가이드`, value: Math.round(50 + Math.random() * 30) },
                { query: `${keyword} 사용법`, value: Math.round(40 + Math.random() * 30) },
                { query: `${keyword} 팁`, value: Math.round(30 + Math.random() * 30) }
            );
        } else {
            queries.push(
                { query: `${keyword} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`, growth: '+' + Math.round(100 + Math.random() * 400) + '%' },
                { query: `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${keyword}`, growth: '+' + Math.round(100 + Math.random() * 300) + '%' },
                { query: `${keyword} ${related[Math.floor(Math.random() * related.length)]}`, growth: '+' + Math.round(80 + Math.random() * 200) + '%' },
                { query: `${keyword} vs`, growth: '+' + Math.round(60 + Math.random() * 150) + '%' },
                { query: `무료 ${keyword}`, growth: '+' + Math.round(50 + Math.random() * 100) + '%' }
            );
        }
        
        return queries;
    },
    
    // Render trend results
    renderTrendResults(query) {
        const result = JSON.parse(query.resultJson);
        const container = document.getElementById('trend-results');
        container.classList.remove('hidden');
        
        container.innerHTML = `
            <!-- Recommendation Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">
                        <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                        추천
                    </h3>
                    <div class="recommendation-badge ${result.recommendation.toLowerCase()}">
                        ${this.getRecommendationIcon(result.recommendation)} ${result.recommendation}
                    </div>
                </div>
                <p class="text-gray-600 dark:text-gray-400 mb-4">${result.recommendationReason}</p>
                <button onclick="TrendsModule.createProjectFromTrend()" class="btn-primary px-6 py-2 rounded-lg">
                    <i class="fas fa-arrow-right mr-2"></i>이 트렌드로 프로젝트 만들기
                </button>
            </div>
            
            <!-- Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">평균 검색량</div>
                    <div class="text-2xl font-bold">${result.avgVolume}</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">최근 검색량</div>
                    <div class="text-2xl font-bold">${result.recentVolume}</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">변동성</div>
                    <div class="text-2xl font-bold">${result.volatility}%</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div class="text-sm text-gray-500 mb-1">계절성</div>
                    <div class="text-2xl font-bold">${result.seasonality}</div>
                </div>
            </div>
            
            <!-- Trend Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold mb-4">
                    <i class="fas fa-chart-line text-primary-600 dark:text-primary-400 mr-2"></i>
                    시간별 관심도
                </h3>
                <div class="trend-chart relative">
                    <canvas id="trend-chart-canvas" width="800" height="300"></canvas>
                </div>
            </div>
            
            <!-- Related Queries -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Top Queries -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4">
                        <i class="fas fa-fire text-orange-500 mr-2"></i>
                        인기 연관 검색어
                    </h3>
                    <div class="space-y-3">
                        ${result.relatedQueriesTop.map(q => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div class="flex-1">
                                    <div class="font-medium">${q.query}</div>
                                </div>
                                <div class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                    ${q.value}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Rising Queries -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4">
                        <i class="fas fa-arrow-trend-up text-green-500 mr-2"></i>
                        급상승 검색어
                    </h3>
                    <div class="space-y-3">
                        ${result.relatedQueriesRising.map(q => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div class="flex-1">
                                    <div class="font-medium">${q.query}</div>
                                </div>
                                <div class="text-sm font-semibold text-green-600 dark:text-green-400">
                                    ${q.growth}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Persona Angles -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold mb-4">
                    <i class="fas fa-users text-purple-500 mr-2"></i>
                    추천 앵글 & 훅
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${this.generateAngleSuggestions(result.keyword).map(angle => `
                        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div class="font-semibold text-primary-600 dark:text-primary-400 mb-2">
                                ${angle.persona}
                            </div>
                            <div class="text-sm mb-2">${angle.hook}</div>
                            <div class="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded inline-block">
                                ${angle.thumbnailCopy}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Draw chart
        this.drawTrendChart(result.volumeIndex);
        
        // Scroll to results
        container.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Get recommendation icon
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
    
    // Generate angle suggestions
    generateAngleSuggestions(keyword) {
        return [
            {
                persona: '초보자',
                hook: `${keyword} 처음이신가요? 여기서 시작하세요!`,
                thumbnailCopy: '입문 가이드'
            },
            {
                persona: '중급자',
                hook: `${keyword} 실력을 한 단계 올리세요`,
                thumbnailCopy: '레벨업'
            },
            {
                persona: '고급',
                hook: `${keyword}를 프로처럼 마스터하기`,
                thumbnailCopy: '프로 팁'
            }
        ];
    },
    
    // Draw trend chart (simple canvas visualization)
    drawTrendChart(volumeIndex) {
        const canvas = document.getElementById('trend-chart-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Get values
        const values = volumeIndex.map(v => v.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;
        
        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - padding * 2) * (i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw line
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
        
        // Draw points
        ctx.fillStyle = '#ef4444';
        volumeIndex.forEach((point, i) => {
            const x = padding + (width - padding * 2) * (i / (volumeIndex.length - 1));
            const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        // X-axis labels (show first, middle, last)
        const labels = [0, Math.floor(volumeIndex.length / 2), volumeIndex.length - 1];
        labels.forEach(i => {
            const x = padding + (width - padding * 2) * (i / (volumeIndex.length - 1));
            const date = new Date(volumeIndex[i].date);
            const label = `${date.getMonth() + 1}/${date.getDate()}`;
            ctx.fillText(label, x, height - padding + 20);
        });
    },
    
    // Create project from trend
    createProjectFromTrend() {
        if (!this.currentQuery) return;
        
        const result = JSON.parse(this.currentQuery.resultJson);
        
        // Fill in project form
        document.getElementById('input-topic').value = result.keyword;
        document.getElementById('input-audience').value = '일반 시청자';
        document.getElementById('input-tone').value = 'professional';
        document.getElementById('input-length').value = 'medium';
        
        // Switch to projects view
        document.getElementById('nav-projects').click();
        
        // Scroll to form
        document.getElementById('input-topic').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('input-topic').focus();
        
        showToast('주제가 입력되었습니다! 프로젝트를 생성하세요', 'success');
    },
    
    // YouTube 데이터를 볼륨 인덱스로 변환 (Pro 모드용)
    convertYouTubeToVolumeIndex(youtubeData) {
        // topVideos의 조회수를 기반으로 시간별 트렌드 생성
        const days = 30;
        const baseValue = youtubeData.avgViews / 10000; // 스케일 조정
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
    
    // Load trending keywords
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
            
            // Pro 모드: 실제 YouTube 데이터
            if (APIClient.isProModeAvailable) {
                const response = await fetch(`${APIClient.baseURL}/api/trends/trending?category=${category}&locale=${locale}&period=${period}`);
                const result = await response.json();
                
                if (result.ok) {
                    data = result.data;
                    if (!result.data.mock) {
                        showToast(`실시간 인기 키워드 ${data.totalVideos}개 영상 분석 완료!`, 'success', 2000);
                    }
                } else {
                    throw new Error('Failed to load trending keywords');
                }
            } else {
                // MVP 모드: 모의 데이터
                data = this.generateMockTrendingKeywords(category, locale);
            }
            
            this.trendingData = data;
            this.renderTrendingKeywords(data);
            
        } catch (error) {
            console.error('Error loading trending keywords:', error);
            showToast('인기 키워드를 불러올 수 없습니다', 'error');
            
            // 폴백: 모의 데이터
            const mockData = this.generateMockTrendingKeywords(category, locale);
            this.renderTrendingKeywords(mockData);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i>새로고침';
            }
        }
    },
    
    // Render trending keywords
    renderTrendingKeywords(data) {
        const container = document.getElementById('trending-keywords');
        
        if (!data.keywords || data.keywords.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                    <p>인기 키워드가 없습니다</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = data.keywords.map(kw => `
            <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                 onclick="TrendsModule.selectTrendingKeyword('${kw.keyword}')">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">#${kw.rank}</span>
                        ${this.getTrendIcon(kw.trend)}
                    </div>
                    <div class="text-xs text-gray-500">
                        <i class="fas fa-eye mr-1"></i>${this.formatNumber(kw.avgViews)}
                    </div>
                </div>
                <div class="font-semibold text-lg mb-1 truncate">${kw.keyword}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    <span class="mr-2"><i class="fas fa-video mr-1"></i>${kw.count}개</span>
                    <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">점수: ${kw.score}</span>
                </div>
            </div>
        `).join('');
    },
    
    // Get trend icon
    getTrendIcon(trend) {
        const icons = {
            'up': '<i class="fas fa-arrow-up text-green-500"></i>',
            'down': '<i class="fas fa-arrow-down text-red-500"></i>',
            'stable': '<i class="fas fa-minus text-gray-500"></i>'
        };
        return icons[trend] || icons.stable;
    },
    
    // Format number
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    // Select trending keyword
    selectTrendingKeyword(keyword) {
        // 트렌드 분석 섹션으로 키워드 입력
        document.getElementById('trend-keyword').value = keyword;
        
        // 스크롤
        document.getElementById('trend-keyword').scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        showToast(`"${keyword}" 키워드가 선택되었습니다. 분석하기를 클릭하세요!`, 'info', 3000);
    },
    
    // Generate mock trending keywords (MVP mode)
    generateMockTrendingKeywords(category, locale) {
        const categories = {
            politics: ['대선', '정책', '국회', '정당', '선거', '법안', '정부', '외교', '여론', '공약'],
            economy: ['주식', '부동산', '금리', '환율', '경제', '채권', '투자', '경기', '물가', '고용'],
            society: ['사건', '사고', '교육', '복지', '인권', '환경', '노동', '인구', '보건', '범죄'],
            culture: ['드라마', '영화', '음악', 'K-POP', '예능', '웹툰', '공연', '축제', '전시', '배우'],
            tech: ['AI', '스마트폰', '반도체', '전기차', '메타버스', '블록체인', '앱', '게임', '로봇', '5G'],
            sports: ['야구', '축구', '농구', '골프', '올림픽', '선수', '경기', '우승', '월드컵', '리그'],
            all: ['트렌드', '인기', '화제', '이슈', '핫', 'TOP', '최신', '실시간', '주목', '관심']
        };
        
        const baseKeywords = categories[category] || categories.all;
        
        return {
            category,
            locale,
            period: 'daily',
            updatedAt: new Date().toISOString(),
            totalVideos: 50,
            mock: true,
            keywords: baseKeywords.map((keyword, index) => ({
                keyword,
                rank: index + 1,
                count: Math.round(Math.random() * 20) + 5,
                avgViews: Math.round((Math.random() * 500000) + 100000),
                totalViews: Math.round((Math.random() * 5000000) + 1000000),
                score: Math.round((100 - index * 3) + Math.random() * 10),
                trend: index < 3 ? 'up' : index > 7 ? 'down' : 'stable'
            }))
        };
    },
    
    // Bind events
    bindEvents() {
        document.getElementById('btn-analyze').addEventListener('click', () => {
            this.analyzeTrends();
        });
        
        // Trending keywords refresh
        document.getElementById('btn-refresh-trending').addEventListener('click', () => {
            this.loadTrendingKeywords();
        });
        
        // Category/Period change
        document.getElementById('trending-category').addEventListener('change', () => {
            this.loadTrendingKeywords();
        });
        
        document.getElementById('trending-period').addEventListener('change', () => {
            this.loadTrendingKeywords();
        });
        
        // Enter key on keyword input
        document.getElementById('trend-keyword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeTrends();
            }
        });
    }
};
