/**
 * YCPA Templates Module
 * Rule-based template generation (MVP mode - works without API keys)
 */

const Templates = {
    // Hook templates based on tone
    hookTemplates: {
        casual: [
            "Hey! Quick question...",
            "So here's something cool...",
            "Let me tell you about...",
            "You know what's crazy?",
            "Real talk..."
        ],
        professional: [
            "Today I'm going to show you...",
            "In this video, we'll explore...",
            "Let's dive into...",
            "Here's what you need to know about...",
            "I'm going to break down..."
        ],
        energetic: [
            "Alright, let's GO!",
            "This is HUGE!",
            "Get ready for this...",
            "You won't BELIEVE...",
            "Let's jump right in!"
        ],
        educational: [
            "Welcome back. Today's lesson...",
            "Let's understand...",
            "I'll explain how...",
            "Here's a comprehensive guide to...",
            "Step by step, we'll learn..."
        ]
    },
    
    // Generate script opening
    generateOpening(topic, tone, audience) {
        const hooks = this.hookTemplates[tone] || this.hookTemplates.professional;
        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        
        const openings = [
            `${hook} ${topic}. If you're ${audience || 'someone interested in this topic'}, this is for you.`,
            `${hook} ${topic}. This will save you hours of frustration.`,
            `${hook} ${topic}. By the end of this video, you'll know exactly what to do.`,
            `${hook} the top secrets about ${topic}. Let's get started.`
        ];
        
        return openings[Math.floor(Math.random() * openings.length)];
    },
    
    // Generate script body based on length
    generateBody(topic, length) {
        const stepCount = {
            short: 3,
            medium: 5,
            long: 7
        }[length] || 5;
        
        const body = [];
        const timePerStep = {
            short: 20,
            medium: 40,
            long: 60
        }[length] || 40;
        
        for (let i = 0; i < stepCount; i++) {
            const timestamp = i * timePerStep;
            body.push({
                t: timestamp,
                line: `Step ${i + 1}: [Key point about ${topic}]. Here's what you need to do. Make sure you understand this part before moving on.`
            });
        }
        
        return body;
    },
    
    // Generate script ending
    generateEnding(topic, tone) {
        const ctas = [
            "If you found this helpful, don't forget to save this video for later.",
            "Drop a comment below if you have questions.",
            "Subscribe for more content like this.",
            "Share this with someone who needs to see it.",
            "Hit that like button if this helped you out."
        ];
        
        const productBridge = [
            "And if you want to dive deeper, check out the link in the description.",
            "I've also included some resources below that can help you further.",
            "For a complete guide, visit the link in the description."
        ];
        
        const cta = ctas[Math.floor(Math.random() * ctas.length)];
        const bridge = productBridge[Math.floor(Math.random() * productBridge.length)];
        
        return `${cta} ${bridge} Thanks for watching!`;
    },
    
    // Generate complete script
    generateScript(projectData) {
        const { topic, tone, length, audience } = projectData;
        
        const opening = this.generateOpening(topic, tone, audience);
        const body = this.generateBody(topic, length);
        const ending = this.generateEnding(topic, tone);
        
        // Create full markdown
        const bodyMarkdown = body.map(step => `**[${formatTime(step.t)}]** ${step.line}`).join('\n\n');
        const fullMarkdown = `## Opening\n\n${opening}\n\n## Body\n\n${bodyMarkdown}\n\n## Ending\n\n${ending}`;
        
        const wordCount = countWords(opening) + body.reduce((sum, step) => sum + countWords(step.line), 0) + countWords(ending);
        
        return {
            opening,
            body,
            ending,
            fullMarkdown,
            wordCount
        };
    },
    
    // Generate persona-based angles
    generateAngles(topic, tone) {
        const personas = [
            { name: 'Beginner', description: 'New to this topic' },
            { name: 'Power User', description: 'Advanced knowledge' },
            { name: 'Professional', description: 'Industry expert' }
        ];
        
        const angles = [];
        
        personas.forEach(persona => {
            angles.push({
                persona: persona.name,
                angleTitle: `${topic} for ${persona.name}s`,
                hook: `Are you a ${persona.name.toLowerCase()} looking to master ${topic}?`,
                thumbnailCopy: `${persona.name}'s Guide`
            });
        });
        
        return angles;
    },
    
    // Generate CTA variations
    generateCTAs(topic) {
        return [
            {
                timing: 'opening',
                text: 'Make sure you save this video because we\'re covering everything.',
                onScreenText: '💾 SAVE THIS',
                destination: 'Save button'
            },
            {
                timing: 'mid',
                text: 'If you\'re getting value from this, drop a comment below.',
                onScreenText: '💬 COMMENT',
                destination: 'Comments'
            },
            {
                timing: 'ending',
                text: 'Subscribe for more content like this every week.',
                onScreenText: '🔔 SUBSCRIBE',
                destination: 'Subscribe button'
            }
        ];
    },
    
    // Generate SEO metadata
    generateSEO(topic, tone) {
        const titleA = `${topic} - Complete Guide (2024)`;
        const titleB = `How to Master ${topic} in 5 Simple Steps`;
        
        const description = `Learn everything about ${topic}. In this comprehensive guide, we'll walk you through the essential steps, tips, and tricks. Perfect for beginners and advanced users alike.

📌 Chapters:
0:00 - Introduction
0:30 - Overview
2:00 - Main Content
5:00 - Advanced Tips
7:00 - Conclusion

🔗 Resources mentioned:
[Links in description]

💡 Don't forget to subscribe for more!`;
        
        const hashtags = [
            `#${topic.replace(/\s+/g, '')}`,
            '#Tutorial',
            '#HowTo',
            '#Guide',
            '#Tips'
        ];
        
        const chapters = [
            { t: 0, label: 'Introduction' },
            { t: 30, label: 'Overview' },
            { t: 120, label: 'Main Content' },
            { t: 300, label: 'Advanced Tips' },
            { t: 420, label: 'Conclusion' }
        ];
        
        return {
            titleA,
            titleB,
            description,
            hashtags,
            chapters
        };
    },
    
    // Generate B-roll keywords and subtitle cues
    generateAssetHints(topic, body) {
        // Extract key phrases from body for B-roll
        const brollKeywords = [
            topic,
            'workspace',
            'computer screen',
            'hands typing',
            'close-up',
            'transition effect'
        ];
        
        // Generate subtitle timing cues (every 6-8 seconds)
        const subtitleCues = [];
        body.forEach((step, index) => {
            subtitleCues.push({
                t: step.t,
                type: 'caption',
                emphasis: index === 0 ? 'high' : 'medium'
            });
        });
        
        return {
            brollKeywords,
            subtitleCues
        };
    },
    
    // Generate shorts from longform
    generateShorts(projectData, script) {
        const { topic, tone } = projectData;
        const body = script.body || [];
        
        const shorts = [];
        
        // Short 1: Hook-focused (15s)
        shorts.push({
            durationSec: 15,
            hook: `${topic} in 15 seconds!`,
            captions: [
                { t: 0, text: 'Quick tip!' },
                { t: 3, text: body[0]?.line.substring(0, 50) + '...' || 'Key insight' },
                { t: 10, text: 'Save for later!' }
            ],
            overlayTexts: ['⚡ QUICK TIP', '👇 SAVE THIS']
        });
        
        // Short 2: Step-by-step (30s)
        shorts.push({
            durationSec: 30,
            hook: `3 steps to master ${topic}`,
            captions: body.slice(0, 3).map((step, i) => ({
                t: i * 10,
                text: `${i + 1}. ${step.line.substring(0, 40)}...`
            })),
            overlayTexts: ['STEP 1', 'STEP 2', 'STEP 3', '✅ DONE']
        });
        
        // Short 3: Problem-solution (45s)
        shorts.push({
            durationSec: 45,
            hook: `Struggling with ${topic}? Here's the fix.`,
            captions: [
                { t: 0, text: 'The problem:' },
                { t: 5, text: 'Most people get this wrong' },
                { t: 15, text: 'Here\'s what actually works:' },
                { t: 20, text: body[0]?.line.substring(0, 50) || 'Solution' },
                { t: 35, text: 'Try this today!' }
            ],
            overlayTexts: ['❌ PROBLEM', '✅ SOLUTION', '🚀 RESULTS']
        });
        
        return shorts;
    }
};
