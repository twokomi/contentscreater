/**
 * YCPA Storage Module
 * Handles data persistence using Table API
 */

const StorageAPI = {
    baseURL: 'tables/',
    
    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Handle 204 No Content
            if (response.status === 204) {
                return { ok: true };
            }
            
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { ok: false, error: error.message };
        }
    },
    
    // Projects CRUD
    async getProjects(filters = {}) {
        let query = 'projects?limit=100';
        if (filters.status) query += `&search=${filters.status}`;
        
        const result = await this.request(query);
        if (result.ok && result.data) {
            return result.data.data || [];
        }
        return [];
    },
    
    async getProject(id) {
        const result = await this.request(`projects/${id}`);
        return result.ok ? result.data : null;
    },
    
    async createProject(data) {
        const project = {
            id: generateUUID(),
            topic: data.topic,
            audience: data.audience || '',
            tone: data.tone || 'professional',
            length: data.length || 'medium',
            status: 'Draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const result = await this.request('projects', {
            method: 'POST',
            body: JSON.stringify(project)
        });
        
        return result.ok ? project : null;
    },
    
    async updateProject(id, updates) {
        const updated = {
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        const result = await this.request(`projects/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updated)
        });
        
        return result.ok;
    },
    
    async deleteProject(id) {
        const result = await this.request(`projects/${id}`, {
            method: 'DELETE'
        });
        
        return result.ok;
    },
    
    // Scripts
    async getScriptByProject(projectId) {
        const result = await this.request(`scripts?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.find(s => s.projectId === projectId);
        }
        return null;
    },
    
    async createScript(data) {
        const script = {
            id: generateUUID(),
            projectId: data.projectId,
            opening: data.opening || '',
            bodyJson: JSON.stringify(data.body || []),
            ending: data.ending || '',
            fullMarkdown: data.fullMarkdown || '',
            wordCount: data.wordCount || 0,
            version: data.version || 1,
            createdAt: new Date().toISOString()
        };
        
        const result = await this.request('scripts', {
            method: 'POST',
            body: JSON.stringify(script)
        });
        
        return result.ok ? script : null;
    },
    
    async updateScript(id, updates) {
        const result = await this.request(`scripts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
        
        return result.ok;
    },
    
    // Angles
    async getAnglesByProject(projectId) {
        const result = await this.request(`angles?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.filter(a => a.projectId === projectId);
        }
        return [];
    },
    
    async createAngle(data) {
        const angle = {
            id: generateUUID(),
            projectId: data.projectId,
            persona: data.persona,
            angleTitle: data.angleTitle,
            hook: data.hook,
            thumbnailCopy: data.thumbnailCopy
        };
        
        const result = await this.request('angles', {
            method: 'POST',
            body: JSON.stringify(angle)
        });
        
        return result.ok ? angle : null;
    },
    
    // CTAs
    async getCTAsByProject(projectId) {
        const result = await this.request(`ctas?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.filter(c => c.projectId === projectId);
        }
        return [];
    },
    
    async createCTA(data) {
        const cta = {
            id: generateUUID(),
            projectId: data.projectId,
            timing: data.timing,
            text: data.text,
            onScreenText: data.onScreenText,
            destination: data.destination || ''
        };
        
        const result = await this.request('ctas', {
            method: 'POST',
            body: JSON.stringify(cta)
        });
        
        return result.ok ? cta : null;
    },
    
    // SEO
    async getSEOByProject(projectId) {
        const result = await this.request(`seo?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.find(s => s.projectId === projectId);
        }
        return null;
    },
    
    async createSEO(data) {
        const seo = {
            id: generateUUID(),
            projectId: data.projectId,
            titleA: data.titleA,
            titleB: data.titleB,
            description: data.description,
            hashtagsJson: JSON.stringify(data.hashtags || []),
            chaptersJson: JSON.stringify(data.chapters || [])
        };
        
        const result = await this.request('seo', {
            method: 'POST',
            body: JSON.stringify(seo)
        });
        
        return result.ok ? seo : null;
    },
    
    // Products
    async getProductsByProject(projectId) {
        const result = await this.request(`products?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.filter(p => p.projectId === projectId);
        }
        return [];
    },
    
    async createProduct(data) {
        const product = {
            id: generateUUID(),
            projectId: data.projectId,
            name: data.name,
            description: data.description || '',
            url: data.url,
            buttonText: data.buttonText || 'Learn More',
            utm: `utm_source=ycpa&utm_medium=short&utm_campaign=${data.projectId}`
        };
        
        const result = await this.request('products', {
            method: 'POST',
            body: JSON.stringify(product)
        });
        
        return result.ok ? product : null;
    },
    
    async updateProduct(id, updates) {
        const result = await this.request(`products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
        
        return result.ok;
    },
    
    // Shorts
    async getShortsByProject(projectId) {
        const result = await this.request(`shorts?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.filter(s => s.projectId === projectId);
        }
        return [];
    },
    
    async createShort(data) {
        const short = {
            id: generateUUID(),
            projectId: data.projectId,
            durationSec: data.durationSec,
            hook: data.hook,
            captionsJson: JSON.stringify(data.captions || []),
            overlayTextsJson: JSON.stringify(data.overlayTexts || [])
        };
        
        const result = await this.request('shorts', {
            method: 'POST',
            body: JSON.stringify(short)
        });
        
        return result.ok ? short : null;
    },
    
    // Asset Hints
    async getAssetHintsByProject(projectId) {
        const result = await this.request(`assetHints?search=${projectId}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.find(a => a.projectId === projectId);
        }
        return null;
    },
    
    async createAssetHints(data) {
        const hints = {
            id: generateUUID(),
            projectId: data.projectId,
            brollKeywordsJson: JSON.stringify(data.brollKeywords || []),
            subtitleCuesJson: JSON.stringify(data.subtitleCues || [])
        };
        
        const result = await this.request('assetHints', {
            method: 'POST',
            body: JSON.stringify(hints)
        });
        
        return result.ok ? hints : null;
    },
    
    // Trend Queries
    async createTrendQuery(data) {
        const query = {
            id: generateUUID(),
            keyword: data.keyword,
            locale: data.locale,
            range: data.range,
            resultJson: JSON.stringify(data.result),
            createdAt: new Date().toISOString()
        };
        
        const result = await this.request('trendQueries', {
            method: 'POST',
            body: JSON.stringify(query)
        });
        
        return result.ok ? query : null;
    },
    
    async getTrendQuery(keyword, locale, range) {
        const result = await this.request(`trendQueries?search=${keyword}`);
        if (result.ok && result.data && result.data.data) {
            return result.data.data.find(q => 
                q.keyword === keyword && 
                q.locale === locale && 
                q.range === range
            );
        }
        return null;
    }
};
