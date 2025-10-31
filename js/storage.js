// Storage module using localStorage (fallback)
const Storage = {
    // Projects
    async getProjects(page = 1, limit = 100) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        return { data: projects, total: projects.length };
    },

    async getProject(id) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        return projects.find(p => p.id === id);
    },

    async createProject(data) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const newProject = {
            ...data,
            id: generateUUID(),
            created_at: Date.now(),
            updated_at: Date.now()
        };
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        return newProject;
    },

    async updateProject(id, data) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...data, updated_at: Date.now() };
            localStorage.setItem('projects', JSON.stringify(projects));
            return projects[index];
        }
        return null;
    },

    async deleteProject(id) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(filtered));
        return { ok: true };
    },

    // Scripts
    async getScripts(projectId) {
        const scripts = JSON.parse(localStorage.getItem('scripts') || '[]');
        return { data: scripts.filter(s => s.projectId === projectId) };
    },

    async createScript(data) {
        const scripts = JSON.parse(localStorage.getItem('scripts') || '[]');
        const newScript = { ...data, id: generateUUID() };
        scripts.push(newScript);
        localStorage.setItem('scripts', JSON.stringify(scripts));
        return newScript;
    },

    // Other methods - minimal implementation
    async getAngles() { return { data: [] }; },
    async createAngle(data) { return data; },
    async deleteAngle() { return { ok: true }; },
    async getCTAs() { return { data: [] }; },
    async createCTA(data) { return data; },
    async deleteCTA() { return { ok: true }; },
    async getSEO() { return { data: [] }; },
    async createSEO(data) { return data; },
    async updateSEO(id, data) { return data; },
    async getProducts() { return { data: [] }; },
    async createProduct(data) { return data; },
    async deleteProduct() { return { ok: true }; },
    async getShorts() { return { data: [] }; },
    async createShort(data) { return data; },
    async deleteShort() { return { ok: true }; },
    async getAssetHints() { return { data: [] }; },
    async createAssetHints(data) { return data; },
    async updateAssetHints(id, data) { return data; },
    async getTrendQuery() { return { data: [] }; },
    async createTrendQuery(data) { return data; }
};
