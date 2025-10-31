/**
 * YCPA Pro Mode - API Client
 * 백엔드 API와 통신하는 클라이언트
 */

const APIClient = {
    // API 기본 URL (프로덕션에서는 자동으로 설정됨)
    baseURL: window.location.origin,
    
    // Pro 모드 활성화 여부 확인
    isProModeAvailable: false,
    
    // Pro 모드 초기화
    async init() {
        try {
            // Health check로 Pro 모드 사용 가능 여부 확인
            const response = await fetch(`${this.baseURL}/api/ai/health`, {
                method: 'GET',
            });
            
            if (response.ok) {
                this.isProModeAvailable = true;
                console.log('✅ Pro 모드 활성화됨');
            } else {
                console.log('ℹ️ Pro 모드 비활성화 - MVP 모드로 작동');
            }
        } catch (error) {
            console.log('ℹ️ Pro 모드 사용 불가 - MVP 모드로 작동');
            this.isProModeAvailable = false;
        }
    },
    
    // AI 스크립트 생성 (Pro 모드)
    async generateScript(data) {
        if (!this.isProModeAvailable) {
            throw new Error('Pro 모드를 사용할 수 없습니다');
        }
        
        try {
            const response = await fetch(`${this.baseURL}/api/ai/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'API 호출 실패');
            }
            
            return result.data;
        } catch (error) {
            console.error('AI 생성 오류:', error);
            throw error;
        }
    },
    
    // YouTube 트렌드 분석 (Pro 모드)
    async analyzeYouTubeTrends(data) {
        if (!this.isProModeAvailable) {
            throw new Error('Pro 모드를 사용할 수 없습니다');
        }
        
        try {
            const response = await fetch(`${this.baseURL}/api/trends/youtube`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'API 호출 실패');
            }
            
            return result.data;
        } catch (error) {
            console.error('트렌드 분석 오류:', error);
            throw error;
        }
    }
};

// Health check 엔드포인트 (Pro 모드 사용 가능 여부 확인용)
// api/ai/health.js 파일이 필요합니다
