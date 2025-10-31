// API Client for Pro mode features

const APIClient = {
    baseURL: window.location.origin,
    isProModeAvailable: false,

    // Initialize and check Pro mode availability
    async init() {
        try {
            const response = await fetch(`${this.baseURL}/api/ai/health`);
            if (response.ok) {
                const data = await response.json();
                this.isProModeAvailable = data.proMode;
                return data;
            }
        } catch (error) {
            console.warn('Pro mode not available:', error);
            this.isProModeAvailable = false;
        }
        return { ok: false, proMode: false };
    },

    // Generate script with AI
    async generateScript(projectData) {
        if (!this.isProModeAvailable) {
            throw new Error('Pro mode not available');
        }

        try {
            const response = await fetch(`${this.baseURL}/api/ai/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.fallback) {
                throw new Error('AI generation failed, use template fallback');
            }

            return data;
        } catch (error) {
            console.error('AI generation error:', error);
            throw error;
        }
    },

    // Search YouTube trends
    async searchYouTubeTrends(keyword, locale = 'KR') {
        try {
            const response = await fetch(
                `${this.baseURL}/api/trends/youtube?keyword=${encodeURIComponent(keyword)}&locale=${locale}`
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('YouTube trends error:', error);
            throw error;
        }
    },

    // Get trending keywords
    async getTrendingKeywords(category = 'all', locale = 'KR') {
        try {
            const response = await fetch(
                `${this.baseURL}/api/trends/trending?category=${category}&locale=${locale}`
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Trending keywords error:', error);
            throw error;
        }
    },

    // Get news trends
    async getNewsTrends(category = 'all', locale = 'kr') {
        try {
            const response = await fetch(
                `${this.baseURL}/api/trends/news-trends?category=${category}&locale=${locale}`
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('News trends error:', error);
            throw error;
        }
    }
};
