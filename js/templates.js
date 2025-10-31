// Template-based content generation (MVP mode)
const Templates = {
    hooks: {
        casual: [
            "안녕하세요 여러분! 오늘은 {topic}에 대해 이야기해볼게요.",
            "여러분, {topic} 궁금하지 않으세요? 지금 바로 알려드릴게요!"
        ],
        professional: [
            "{topic}에 대해 전문적으로 분석해보겠습니다.",
            "오늘은 {topic}의 핵심 내용을 다루겠습니다."
        ],
        energetic: [
            "여러분! {topic} 완전 대박이에요! 지금 바로 시작합니다!",
            "와우! {topic} 정말 놀라운 내용이에요!"
        ],
        educational: [
            "오늘 수업 주제는 {topic}입니다. 차근차근 배워봅시다.",
            "{topic}에 대해 체계적으로 학습하겠습니다."
        ]
    },
    bodyTemplates: {
        short: 3,
        medium: 5,
        long: 7
    },
    generateScript(project) {
        const { topic, tone, length } = project;
        const opening = this.generateOpening(topic, tone);
        const body = this.generateBody(topic, length, tone);
        const ending = this.generateEnding(topic, tone);
        const brollKeywords = [topic, '배경', '인서트'];
        const subtitleCues = body.map(s => s.title);
        return { opening, body, ending, brollKeywords, subtitleCues };
    },
    generateOpening(topic, tone) {
        const hooks = this.hooks[tone] || this.hooks.casual;
        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        return hook.replace('{topic}', topic);
    },
    generateBody(topic, length, tone) {
        const stepCount = this.bodyTemplates[length] || 5;
        const steps = [];
        for (let i = 1; i <= stepCount; i++) {
            steps.push({
                step: i,
                title: `${i}단계: ${topic} 포인트 ${i}`,
                content: `${topic}의 ${i}번째 핵심 내용입니다.`,
                duration: length === 'short' ? 30 : 60
            });
        }
        return steps;
    },
    generateEnding(topic, tone) {
        return `오늘은 ${topic}에 대해 알아봤습니다. 도움이 되셨나요?`;
    },
    generateAngles(project) {
        const { topic } = project;
        return [
            {
                persona: '초보자',
                angleTitle: `${topic} 완전 기초`,
                hook: `${topic}을 처음 접하시나요?`,
                thumbnailCopy: '초보자 필수!'
            }
        ];
    },
    generateSEO(project) {
        const { topic } = project;
        return {
            titleA: `${topic} 완벽 가이드`,
            titleB: `${topic} 2024 최신`,
            description: `${topic}에 대한 완벽한 설명입니다.`,
            hashtags: [`#${topic}`, '#유튜브'],
            chapters: [
                { time: '0:00', title: '인트로' },
                { time: '5:00', title: '본론' }
            ]
        };
    },
    generateShorts(script) {
        return [
            {
                duration: 15,
                hook: script.opening.substring(0, 50),
                captions: ['핵심 포인트'],
                overlayTexts: ['팔로우!']
            }
        ];
    }
};
