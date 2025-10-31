// Projects module
const Projects = {
    currentProject: null,
    async init() {
        await this.loadProjects();
    },
    async loadProjects() {
        try {
            const response = await Storage.getProjects();
            const projects = response.data || [];
            this.renderProjects(projects);
        } catch (error) {
            console.error('Load error:', error);
            showToast('프로젝트 로드 실패', 'error');
        }
    },
    renderProjects(projects) {
        const container = document.getElementById('projects-list');
        if (!container) return;
        if (projects.length === 0) {
            container.innerHTML = '<div class="text-center py-12">프로젝트가 없습니다</div>';
            return;
        }
        container.innerHTML = projects.map(p => `
            <div class="bg-white p-6 rounded shadow">
                <h3 class="font-bold">${p.topic}</h3>
                <p class="text-sm text-gray-600">${p.audience}</p>
                <span class="badge ${p.status}">${p.status}</span>
            </div>
        `).join('');
    },
    async generateScript() {
        if (!this.currentProject) return;
        try {
            const scriptData = Templates.generateScript(this.currentProject);
            showToast('스크립트 생성 완료!', 'success');
            return scriptData;
        } catch (error) {
            showToast('생성 실패', 'error');
        }
    }
};
