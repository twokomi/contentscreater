// Storage module using Table API

const Storage = {
    baseURL: '/tables',

    // Generic fetch wrapper
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Storage request error:', error);
            throw error;
        }
    },

    // Projects
    async getProjects(page = 1, limit = 100) {
        return await this.request(`${this.baseURL}/projects?page=${page}&limit=${limit}`);
    },

    async getProject(id) {
        return await this.request(`${this.baseURL}/projects/${id}`);
    },

    async createProject(data) {
        return await this.request(`${this.baseURL}/projects`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateProject(id, data) {
        return await this.request(`${this.baseURL}/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteProject(id) {
        return await this.request(`${this.baseURL}/projects/${id}`, {
            method: 'DELETE'
        });
    },

    // Scripts
    async getScripts(projectId) {
        return await this.request(`${this.baseURL}/scripts?search=${projectId}`);
    },

    async getScript(id) {
        return await this.request(`${this.baseURL}/scripts/${id}`);
    },

    async createScript(data) {
        return await this.request(`${this.baseURL}/scripts`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateScript(id, data) {
        return await this.request(`${this.baseURL}/scripts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    // Angles
    async getAngles(projectId) {
        return await this.request(`${this.baseURL}/angles?search=${projectId}`);
    },

    async createAngle(data) {
        return await this.request(`${this.baseURL}/angles`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteAngle(id) {
        return await this.request(`${this.baseURL}/angles/${id}`, {
            method: 'DELETE'
        });
    },

    // CTAs
    async getCTAs(projectId) {
        return await this.request(`${this.baseURL}/ctas?search=${projectId}`);
    },

    async createCTA(data) {
        return await this.request(`${this.baseURL}/ctas`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteCTA(id) {
        return await this.request(`${this.baseURL}/ctas/${id}`, {
            method: 'DELETE'
        });
    },

    // SEO
    async getSEO(projectId) {
        return await this.request(`${this.baseURL}/seo?search=${projectId}`);
    },

    async createSEO(data) {
        return await this.request(`${this.baseURL}/seo`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateSEO(id, data) {
        return await this.request(`${this.baseURL}/seo/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    // Products
    async getProducts(projectId) {
        return await this.request(`${this.baseURL}/products?search=${projectId}`);
    },

    async createProduct(data) {
        return await this.request(`${this.baseURL}/products`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteProduct(id) {
        return await this.request(`${this.baseURL}/products/${id}`, {
            method: 'DELETE'
        });
    },

    // Shorts
    async getShorts(projectId) {
        return await this.request(`${this.baseURL}/shorts?search=${projectId}`);
    },

    async createShort(data) {
        return await this.request(`${this.baseURL}/shorts`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteShort(id) {
        return await this.request(`${this.baseURL}/shorts/${id}`, {
            method: 'DELETE'
        });
    },

    // Asset Hints
    async getAssetHints(projectId) {
        return await this.request(`${this.baseURL}/assetHints?search=${projectId}`);
    },

    async createAssetHints(data) {
        return await this.request(`${this.baseURL}/assetHints`, {<span class="cursor">█</span>
cat > js/templates.js << 'EOF'
// Template-based content generation (MVP mode)

const Templates = {
    // Hook templates by tone
    hooks: {
        casual: [
            "안녕하세요 여러분! 오늘은 {topic}에 대해 이야기해볼게요.",
            "여러분, {topic} 궁금하지 않으세요? 지금 바로 알려드릴게요!",
            "오늘 영상 주제는 바로 {topic}입니다. 끝까지 봐주세요!"
        ],
        professional: [
            "{topic}에 대해 전문적으로 분석해보겠습니다.",
            "오늘은 {topic}의 핵심 내용을 다루겠습니다.",
            "{topic}에 관한 중요한 정보를 공유하겠습니다."
        ],
        energetic: [
            "여러분! {topic} 완전 대박이에요! 지금 바로 시작합니다!",
            "와우! {topic} 정말 놀라운 내용이에요! 함께 보시죠!",
            "여러분 준비되셨나요? {topic} 시작합니다!"
        ],
        educational: [
            "오늘 수업 주제는 {topic}입니다. 차근차근 배워봅시다.",
            "{topic}에 대해 체계적으로 학습하겠습니다.",
            "{topic}의 기초부터 차근차근 알아보겠습니다."
        ]
    },

    // Body step templates
    bodyTemplates: {
        short: 3,  // 3 steps for short videos
        medium: 5, // 5 steps for medium videos
        long: 7    // 7 steps for long videos
    },

    // CTA templates
    ctas: {
        opening: [
            "구독과 좋아요 부탁드려요!",
            "알림 설정도 꼭 눌러주세요!",
            "좋아요와 구독은 큰 힘이 됩니다!"
        ],
        mid: [
            "여기까지 도움이 되셨나요? 좋아요 눌러주세요!",
            "댓글로 여러분의 생각을 알려주세요!",
            "공유하기로 더 많은 분들에게 알려주세요!"
        ],
        ending: [
            "영상이 도움되셨다면 구독 부탁드려요!",
            "다음 영상에서 만나요!",
            "좋아요와 알림 설정 잊지 마세요!"
        ]
    },

    // Generate full script
    generateScript(project) {
        const { topic, tone, length, audience } = project;
        
        // Generate opening
        const opening = this.generateOpening(topic, tone);
        
        // Generate body
        const body = this.generateBody(topic, length, tone);
        
        // Generate ending
        const ending = this.generateEnding(topic, tone);
        
        // Generate asset hints
        const brollKeywords = this.generateBrollKeywords(topic);
        const subtitleCues = this.generateSubtitleCues(body);
        
        return {
            opening,
            body,
            ending,
            brollKeywords,
            subtitleCues
        };
    },

    // Generate opening
    generateOpening(topic, tone) {
        const hookTemplate = this.hooks[tone] || this.hooks.casual;
        const hook = hookTemplate[Math.floor(Math.random() * hookTemplate.length)];
        return hook.replace('{topic}', topic);
    },

    // Generate body
    generateBody(topic, length, tone) {
        const stepCount = this.bodyTemplates[length] || 5;
        const steps = [];
        
        for (let i = 1; i <= stepCount; i++) {
            steps.push({
                step: i,
                title: `${i}단계: ${topic} - 포인트 ${i}`,
                content: this.generateStepContent(topic, i, tone),
                duration: length === 'short' ? 30 : length === 'medium' ? 60 : 90
            });
        }
        
        return steps;
    },

    // Generate step content
    generateStepContent(topic, stepNum, tone) {
        const templates = {
            casual: `${topic}의 ${stepNum}번째 포인트를 알려드릴게요. 이 부분은 정말 중요한데요, 여러분이 꼭 알아야 할 내용입니다.`,
            professional: `${stepNum}번째 핵심 사항입니다. ${topic}에서 이 부분은 전문가들도 강조하는 중요한 요소입니다.`,
            energetic: `${stepNum}번째! 이거 정말 대박이에요! ${topic}에서 이 부분만 알아도 완전 달라집니다!`,
            educational: `${stepNum}번째 학습 내용입니다. ${topic}을 이해하기 위해 이 개념을 확실히 알아두셔야 합니다.`
        };
        
        return templates[tone] || templates.casual;
    },

    // Generate ending
    generateEnding(topic, tone) {
        const endings = {
            casual: `오늘은 ${topic}에 대해 알아봤어요. 도움이 되셨나요? 다음에 더 좋은 내용으로 찾아올게요!`,
            professional: `${topic}에 대한 분석을 마치겠습니다. 추가 질문이 있으시면 댓글로 남겨주세요.`,
            energetic: `와! ${topic} 정말 대박이죠? 여러분도 꼭 해보세요! 다음 영상도 기대해주세요!`,
            educational: `${topic}에 대한 수업을 마치겠습니다. 복습하시고 질문 있으면 댓글 남겨주세요.`
        };
        
        return endings[tone] || endings.casual;
    },

    // Generate B-roll keywords
    generateBrollKeywords(topic) {
        const baseKeywords = [topic, '배경', '인서트', '클로즈업', '와이드샷'];
        const topicWords = topic.split(' ');
        return [...baseKeywords, ...topicWords].slice(0, 8);
    },

    // Generate subtitle cues
    generateSubtitleCues(body) {
        return body.map(step => step.title);
    },

    // Generate angles
    generateAngles(project) {
        const { topic, audience } = project;
        
        return [
            {
                persona: '초보자',
                angleTitle: `${topic} 완전 기초 가이드`,
                hook: `${topic}을 처음 접하시나요? 걱정 마세요!`,
                thumbnailCopy: '초보자 필수!'
            },
            {
                persona: '중급자',
                angleTitle: `${topic} 실전 활용법`,
                hook: `${topic}을 제대로 활용하는 방법`,
                thumbnailCopy: '실전 노하우'
            },
            {
                persona: '고급자',
                angleTitle: `${topic} 전문가 팁`,
                hook: `${topic}의 숨겨진 고급 기술`,
                thumbnailCopy: '전문가 비법'
            }
        ];
    },

    // Generate SEO
    generateSEO(project) {
        const { topic, audience } = project;
        
        return {
            titleA: `${topic} 완벽 가이드 | ${audience}를 위한`,
            titleB: `${topic} 이것만 알면 됩니다 | 2024 최신`,
            description: `${topic}에 대한 모든 것! ${audience}를 위한 완벽한 가이드입니다. 이 영상 하나면 ${topic}을 완전히 이해할 수 있습니다.`,
            hashtags: [`#${topic}`, '#유튜브', '#가이드', '#팁', '#노하우'],
            chapters: [
                { time: '0:00', title: '인트로' },
                { time: '0:30', title: '본론 시작' },
                { time: '5:00', title: '핵심 내용' },
                { time: '8:00', title: '마무리' }
            ]
        };
    },

    // Generate shorts
    generateShorts(script) {
        const { opening, body, ending } = script;
        
        return [
            {
                duration: 15,
                hook: opening.substring(0, 100),
                captions: [body[0]?.title || '핵심 포인트'],
                overlayTexts: ['팔로우하세요!', '더 보기 👆']
            },
            {
                duration: 30,
                hook: body[0]?.content.substring(0, 100) || opening,
                captions: body.slice(0, 2).map(s => s.title),
                overlayTexts: ['좋아요 ❤️', '저장하기 📌']
            },
            {
                duration: 45,
                hook: opening.substring(0, 80),
                captions: body.slice(0, 3).map(s => s.title),
                overlayTexts: ['댓글 남기기 💬', '공유하기 🔗']
            }
        ];
    },

    // Generate product integration
    generateProductIntegration(project, product) {
        const { name, url } = product;
        const utmUrl = `${url}${url.includes('?') ? '&' : '?'}utm_source=ycpa&utm_medium=youtube&utm_campaign=${project.id}`;
        
        return {
            ...product,
            utm: utmUrl,
            placements: [
                { type: 'endscreen', text: `${name} 더 알아보기` },
                { type: 'description', text: `🔗 ${name}: ${utmUrl}` },
                { type: 'pinned-comment', text: `영상에서 소개한 ${name} 링크입니다: ${utmUrl}` }
            ]
        };
    }
};
