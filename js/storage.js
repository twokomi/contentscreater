/**
 * YCPA Storage Module
 * Handles data persistence using localStorage (Browser-based)
 */

const StorageAPI = {
    // localStorage keys
    KEYS: {
        PROJECTS: 'ycpa_projects',
        SCRIPTS: 'ycpa_scripts',
        ANGLES: 'ycpa_angles',
        CTAS: 'ycpa_ctas',
        SEO: 'ycpa_seo',
        PRODUCTS: 'ycpa_products',
        SHORTS: 'ycpa_shorts',
        ASSET_HINTS: 'ycpa_asset_hints',
        TREND_QUERIES: 'ycpa_trend_queries'
    },
    
    // Get data from localStorage
    _get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return [];
        }
    },
    
    // Save data to localStorage
    _set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    },
    
    // Projects CRUD
    async getProjects(filters = {}) {
        const projects = this._get(this.KEYS.PROJECTS);
        
        if (filters.status) {
            return projects.filter(p => p.status === filters.status);
        }
        
        return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
    
    async getProject(id) {
        const projects = this._get(this.KEYS.PROJECTS);
        return projects.find(p => p.id === id) || null;
    },
    
    async createProject(data) {
        const projects = this._get(this.KEYS.PROJECTS);
        
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
        
        projects.push(project);
        this._set(this.KEYS.PROJECTS, projects);
        
        return project;
    },
    
    async updateProject(id, updates) {
        const projects = this._get(this.KEYS.PROJECTS);
        const index = projects.findIndex(p => p.id === id);
        
        if (index === -1) return false;
        
        projects[index] = {
            ...projects[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this._set(this.KEYS.PROJECTS, projects);
        return true;
    },
    
    async deleteProject(id) {
        const projects = this._get(this.KEYS.PROJECTS);
        const filtered = projects.filter(p => p.id !== id);
        
        this._set(this.KEYS.PROJECTS, filtered);
        
        // Also delete related data
        this._deleteRelatedData(id);
        
        return true;
    },
    
    // Delete all related data for a project
    _deleteRelatedData(projectId) {
        // Scripts
        const scripts = this._get(this.KEYS.SCRIPTS);
        this._set(this.KEYS.SCRIPTS, scripts.filter(s => s.projectId !== projectId));
        
        // Angles
        const angles = this._get(this.KEYS.ANGLES);
        this._set(this.KEYS.ANGLES, angles.filter(a => a.projectId !== projectId));
        
        // CTAs
        const ctas = this._get(this.KEYS.CTAS);
        this._set(this.KEYS.CTAS, ctas.filter(c => c.projectId !== projectId));
        
        // SEO
        const seo = this._get(this.KEYS.SEO);
        this._set(this.KEYS.SEO, seo.filter(s => s.projectId !== projectId));
        
        // Products
        const products = this._get(this.KEYS.PRODUCTS);
        this._set(this.KEYS.PRODUCTS, products.filter(p => p.projectId !== projectId));
        
        // Shorts
        const shorts = this._get(this.KEYS.SHORTS);
        this._set(this.KEYS.SHORTS, shorts.filter(s => s.projectId !== projectId));
        
        // Asset Hints
        const hints = this._get(this.KEYS.ASSET_HINTS);
        this._set(this.KEYS.ASSET_HINTS, hints.filter(h => h.projectId !== projectId));
    },
    
    // Scripts
    async getScriptByProject(projectId) {
        const scripts = this._get(this.KEYS.SCRIPTS);
        return scripts.find(s => s.projectId === projectId) || null;
    },
    
    async createScript(data) {
        const scripts = this._get(this.KEYS.SCRIPTS);
        
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
        
        scripts.push(script);
        this._set(this.KEYS.SCRIPTS, scripts);
        
        return script;
    },
    
    async updateScript(id, updates) {
        const scripts = this._get(this.KEYS.SCRIPTS);
        const index = scripts.findIndex(s => s.id === id);
        
        if (index === -1) return false;
        
        scripts[index] = {
            ...scripts[index],
            ...updates
        };
        
        this._set(this.KEYS.SCRIPTS, scripts);
        return true;
    },
    
    // Angles
    async getAnglesByProject(projectId) {
        const angles = this._get(this.KEYS.ANGLES);
        return angles.filter(a => a.projectId === projectId);
    },
    
    async createAngle(data) {
        const angles = this._get(this.KEYS.ANGLES);
        
        const angle = {
            id: generateUUID(),
            projectId: data.projectId,
            persona: data.persona,
            angleTitle: data.angleTitle,
            hook: data.hook,
            thumbnailCopy: data.thumbnailCopy
        };
        
        angles.push(angle);
        this._set(this.KEYS.ANGLES, angles);
        
        return angle;
    },
    
    // CTAs
    async getCTAsByProject(projectId) {
        const ctas = this._get(this.KEYS.CTAS);
        return ctas.filter(c => c.projectId === projectId);
    },
    
    async createCTA(data) {
        const ctas = this._get(this.KEYS.CTAS);
        
        const cta = {
            id: generateUUID(),
            projectId: data.projectId,
            timing: data.timing,
            text: data.text,
            onScreenText: data.onScreenText,
            destination: data.destination || ''
        };
        
        ctas.push(cta);
        this._set(this.KEYS.CTAS, ctas);
        
        return cta;
    },
    
    // SEO
    async getSEOByProject(projectId) {
        const seo = this._get(this.KEYS.SEO);
        return seo.find(s => s.projectId === projectId) || null;
    },
    
    async createSEO(data) {
        const seoList = this._get(this.KEYS.SEO);
        
        const seo = {
            id: generateUUID(),
            projectId: data.projectId,
            titleA: data.titleA,
            titleB: data.titleB,
            description: data.description,
            hashtagsJson: JSON.stringify(data.hashtags || []),
            chaptersJson: JSON.stringify(data.chapters || [])
        };
        
        seoList.push(seo);
        this._set(this.KEYS.SEO, seoList);
        
        return seo;
    },
    
    // Products
    async getProductsByProject(projectId) {
        const products = this._get(this.KEYS.PRODUCTS);
        return products.filter(p => p.projectId === projectId);
    },
    
    async createProduct(data) {
        const products = this._get(this.KEYS.PRODUCTS);
        
        const product = {
            id: generateUUID(),
            projectId: data.projectId,
            name: data.name,
            description: data.description || '',
            url: data.url,
            buttonText: data.buttonText || 'Learn More',
            utm: `utm_source=ycpa&utm_medium=short&utm_campaign=${data.projectId}`
        };
        
        products.push(product);
        this._set(this.KEYS.PRODUCTS, products);
        
        return product;
    },
    
    async updateProduct(id, updates) {
        const products = this._get(this.KEYS.PRODUCTS);
        const index = products.findIndex(p => p.id === id);
        
        if (index === -1) return false;
        
        products[index] = {
            ...products[index],
            ...updates
        };
        
        this._set(this.KEYS.PRODUCTS, products);
        return true;
    },
    
    // Shorts
    async getShortsByProject(projectId) {
        const shorts = this._get(this.KEYS.SHORTS);
        return shorts.filter(s => s.projectId === projectId);
    },
    
    async createShort(data) {
        const shorts = this._get(this.KEYS.SHORTS);
        
        const short = {
            id: generateUUID(),
            projectId: data.projectId,
            durationSec: data.durationSec,
            hook: data.hook,
            captionsJson: JSON.stringify(data.captions || []),
            overlayTextsJson: JSON.stringify(data.overlayTexts || [])
        };
        
        shorts.push(short);
        this._set(this.KEYS.SHORTS, shorts);
        
        return short;
    },
    
    // Asset Hints
    async getAssetHintsByProject(projectId) {
        const hints = this._get(this.KEYS.ASSET_HINTS);
        return hints.find(h => h.projectId === projectId) || null;
    },
    
    async createAssetHints(data) {
        const hintsList = this._get(this.KEYS.ASSET_HINTS);
        
        const hints = {
            id: generateUUID(),
            projectId: data.projectId,
            brollKeywordsJson: JSON.stringify(data.brollKeywords || []),
            subtitleCuesJson: JSON.stringify(data.subtitleCues || [])
        };
        
        hintsList.push(hints);
        this._set(this.KEYS.ASSET_HINTS, hintsList);
        
        return hints;
    },
    
    // Trend Queries
    async createTrendQuery(data) {
        const queries = this._get(this.KEYS.TREND_QUERIES);
        
        const query = {
            id: generateUUID(),
            keyword: data.keyword,
            locale: data.locale,
            range: data.range,
            resultJson: JSON.stringify(data.result),
            createdAt: new Date().toISOString()
        };
        
        queries.push(query);
        this._set(this.KEYS.TREND_QUERIES, queries);
        
        return query;
    },
    
    async getTrendQuery(keyword, locale, range) {
        const queries = this._get(this.KEYS.TREND_QUERIES);
        return queries.find(q => 
            q.keyword === keyword && 
            q.locale === locale && 
            q.range === range
        ) || null;
    }
};
