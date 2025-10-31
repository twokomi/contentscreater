/**
 * YCPA Projects Module
 * Handles project management, script editing, and related features
 */

const ProjectsModule = {
    currentProjects: [],
    selectedProject: null,
    autoSaveTimer: null,
    
    // Initialize projects view
    async init() {
        await this.loadProjects();
        this.bindEvents();
    },
    
    // Load all projects
    async loadProjects(filters = {}) {
        try {
            this.currentProjects = await StorageAPI.getProjects(filters);
            this.renderProjectsList();
        } catch (error) {
            console.error('Failed to load projects:', error);
            showToast('프로젝트를 불러오는데 실패했습니다', 'error');
        }
    },
    
    // Render projects list
    renderProjectsList() {
        const container = document.getElementById('projects-list');
        
        if (this.currentProjects.length === 0) {
            container.innerHTML = `
                <div class="p-12 text-center text-gray-500">
                    <i class="fas fa-folder-open text-5xl mb-4 opacity-50"></i>
                    <p class="text-lg">아직 프로젝트가 없습니다. 위에서 첫 프로젝트를 만들어보세요!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.currentProjects.map(project => `
            <div class="project-item" data-project-id="${project.id}">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3">
                            <h3 class="font-semibold text-lg">${project.topic}</h3>
                            <span class="status-badge ${this.getStatusClass(project.status)}">
                                ${project.status}
                            </span>
                        </div>
                        <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span><i class="fas fa-users mr-1"></i>${project.audience || 'General'}</span>
                            <span><i class="fas fa-palette mr-1"></i>${project.tone}</span>
                            <span><i class="fas fa-clock mr-1"></i>${project.length}</span>
                            <span><i class="fas fa-calendar mr-1"></i>${formatRelativeTime(project.createdAt)}</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="btn-secondary px-3 py-2 text-sm" onclick="ProjectsModule.editProject('${project.id}')">
                            <i class="fas fa-edit mr-1"></i>편집
                        </button>
                        <button class="btn-secondary px-3 py-2 text-sm" onclick="ProjectsModule.duplicateProject('${project.id}')">
                            <i class="fas fa-copy mr-1"></i>복제
                        </button>
                        <button class="btn-secondary px-3 py-2 text-sm text-red-600" onclick="ProjectsModule.deleteProject('${project.id}')">
                            <i class="fas fa-trash mr-1"></i>삭제
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add double-click handlers
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('dblclick', (e) => {
                const projectId = e.currentTarget.dataset.projectId;
                this.expandProject(projectId);
            });
        });
    },
    
    // Get status CSS class
    getStatusClass(status) {
        const map = {
            'Draft': 'draft',
            '초안': 'draft',
            'InEditing': 'in-editing',
            '편집중': 'in-editing',
            'Ready': 'ready',
            '완료': 'ready',
            'Published': 'published',
            '게시됨': 'published'
        };
        return map[status] || 'draft';
    },
    
    // Create new project
    async createProject() {
        const topic = document.getElementById('input-topic').value.trim();
        const audience = document.getElementById('input-audience').value.trim();
        const tone = document.getElementById('input-tone').value;
        const length = document.getElementById('input-length').value;
        
        // Validate
        const validation = validateProjectInput({ topic });
        if (!validation.valid) {
            showToast(validation.errors[0], 'error');
            return;
        }
        
        // Show loading
        const btn = document.getElementById('btn-generate');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>생성중...';
        
        try {
            // Create project
            const project = await StorageAPI.createProject({
                topic,
                audience,
                tone,
                length
            });
            
            if (!project) {
                throw new Error('프로젝트 생성 실패');
            }
            
            // Generate script - Pro Mode or MVP Mode
            let scriptData;
            
            if (APIClient.isProModeAvailable) {
                // Pro Mode: AI 생성
                try {
                    showToast('AI로 스크립트를 생성하고 있습니다...', 'info', 2000);
                    
                    const aiResult = await APIClient.generateScript({
                        topic,
                        audience,
                        tone,
                        length
                    });
                    
                    // AI 응답을 우리 형식으로 변환
                    scriptData = {
                        opening: aiResult.script.opening,
                        body: aiResult.script.body,
                        ending: aiResult.script.ending,
                        fullMarkdown: `## 오프닝\n\n${aiResult.script.opening}\n\n## 본문\n\n${aiResult.script.body.map(s => `**[${formatTime(s.t)}]** ${s.line}`).join('\n\n')}\n\n## 엔딩\n\n${aiResult.script.ending}`,
                        wordCount: countWords(aiResult.script.opening) + aiResult.script.body.reduce((sum, step) => sum + countWords(step.line), 0) + countWords(aiResult.script.ending)
                    };
                    
                    console.log('✅ AI 생성 완료:', aiResult.usage);
                    showToast(`AI로 생성되었습니다! (토큰: ${aiResult.usage.total_tokens})`, 'success', 3000);
                } catch (aiError) {
                    console.warn('AI 생성 실패, 템플릿으로 대체:', aiError);
                    showToast('AI 생성 실패 - 템플릿으로 생성합니다', 'warning', 2000);
                    
                    // Fallback to template
                    scriptData = Templates.generateScript({
                        topic,
                        tone,
                        length,
                        audience
                    });
                }
            } else {
                // MVP Mode: 템플릿 생성
                scriptData = Templates.generateScript({
                    topic,
                    tone,
                    length,
                    audience
                });
            }
            
            // Save script
            await StorageAPI.createScript({
                projectId: project.id,
                ...scriptData
            });
            
            // Generate angles
            const angles = Templates.generateAngles(topic, tone);
            for (const angle of angles) {
                await StorageAPI.createAngle({
                    projectId: project.id,
                    ...angle
                });
            }
            
            // Generate CTAs
            const ctas = Templates.generateCTAs(topic);
            for (const cta of ctas) {
                await StorageAPI.createCTA({
                    projectId: project.id,
                    ...cta
                });
            }
            
            // Generate SEO
            const seo = Templates.generateSEO(topic, tone);
            await StorageAPI.createSEO({
                projectId: project.id,
                ...seo
            });
            
            // Generate asset hints
            const hints = Templates.generateAssetHints(topic, scriptData.body);
            await StorageAPI.createAssetHints({
                projectId: project.id,
                ...hints
            });
            
            // Clear form
            document.getElementById('input-topic').value = '';
            document.getElementById('input-audience').value = '';
            
            // Reload projects
            await this.loadProjects();
            
            showToast('프로젝트가 생성되었습니다!', 'success');
            
            // Auto-expand new project
            setTimeout(() => this.expandProject(project.id), 300);
            
        } catch (error) {
            console.error('Error creating project:', error);
            showToast('프로젝트 생성에 실패했습니다', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-magic mr-2"></i>생성하기';
        }
    },
    
    // Expand project details
    async expandProject(projectId) {
        this.selectedProject = projectId;
        
        try {
            // Load project data
            const project = await StorageAPI.getProject(projectId);
            const script = await StorageAPI.getScriptByProject(projectId);
            const angles = await StorageAPI.getAnglesByProject(projectId);
            const ctas = await StorageAPI.getCTAsByProject(projectId);
            const seo = await StorageAPI.getSEOByProject(projectId);
            const products = await StorageAPI.getProductsByProject(projectId);
            const shorts = await StorageAPI.getShortsByProject(projectId);
            const hints = await StorageAPI.getAssetHintsByProject(projectId);
            
            // Render detail panel
            const panel = document.getElementById('project-detail');
            panel.classList.remove('hidden');
            panel.innerHTML = this.renderProjectDetail(project, script, angles, ctas, seo, products, shorts, hints);
            
            // Bind detail events
            this.bindDetailEvents();
            
            // Scroll to detail
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Error loading project details:', error);
            showToast('프로젝트 상세 정보를 불러오는데 실패했습니다', 'error');
        }
    },
    
    // Render project detail panel
    renderProjectDetail(project, script, angles, ctas, seo, products, shorts, hints) {
        const body = script ? JSON.parse(script.bodyJson || '[]') : [];
        const hashtags = seo ? JSON.parse(seo.hashtagsJson || '[]') : [];
        const brollKeywords = hints ? JSON.parse(hints.brollKeywordsJson || '[]') : [];
        
        return `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">${project.topic}</h2>
                    <button onclick="ProjectsModule.closeDetail()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Tabs -->
                <div class="tab-list mb-6">
                    <button class="tab-button active" data-tab="script">
                        <i class="fas fa-file-alt mr-2"></i>스크립트
                    </button>
                    <button class="tab-button" data-tab="angles">
                        <i class="fas fa-lightbulb mr-2"></i>앵글
                    </button>
                    <button class="tab-button" data-tab="seo">
                        <i class="fas fa-search mr-2"></i>SEO
                    </button>
                    <button class="tab-button" data-tab="shorts">
                        <i class="fas fa-video mr-2"></i>쇼츠
                    </button>
                    <button class="tab-button" data-tab="product">
                        <i class="fas fa-shopping-bag mr-2"></i>제품
                    </button>
                </div>
                
                <!-- Tab Contents -->
                <div class="tab-content">
                    <!-- Script Tab -->
                    <div id="tab-script" class="tab-pane active">
                        <div class="space-y-6">
                            <div class="script-section">
                                <div class="script-section-title">
                                    <i class="fas fa-play-circle mr-2"></i>오프닝 (0:00)
                                </div>
                                <textarea id="edit-opening" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[100px]">${script?.opening || ''}</textarea>
                            </div>
                            
                            <div class="script-section">
                                <div class="script-section-title flex justify-between items-center">
                                    <span><i class="fas fa-list-ol mr-2"></i>본문 단계</span>
                                    <span class="text-sm text-gray-500">${script?.wordCount || 0} 단어</span>
                                </div>
                                <div id="body-steps" class="space-y-4">
                                    ${body.map((step, i) => `
                                        <div class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <div class="font-mono text-sm text-gray-500 mt-2">[${formatTime(step.t)}]</div>
                                            <textarea class="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[60px]" data-step="${i}">${step.line}</textarea>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="script-section">
                                <div class="script-section-title">
                                    <i class="fas fa-flag-checkered mr-2"></i>엔딩
                                </div>
                                <textarea id="edit-ending" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[100px]">${script?.ending || ''}</textarea>
                            </div>
                            
                            <div class="flex space-x-3">
                                <button onclick="ProjectsModule.saveScript()" class="btn-primary px-6 py-2 rounded-lg">
                                    <i class="fas fa-save mr-2"></i>스크립트 저장
                                </button>
                                <button onclick="ProjectsModule.exportScript('txt')" class="btn-secondary px-6 py-2">
                                    <i class="fas fa-download mr-2"></i>TXT 내보내기
                                </button>
                                <button onclick="ProjectsModule.exportScript('srt')" class="btn-secondary px-6 py-2">
                                    <i class="fas fa-download mr-2"></i>SRT 내보내기
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Angles Tab -->
                    <div id="tab-angles" class="tab-pane hidden">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${angles.map(angle => `
                                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div class="font-semibold text-primary-600 dark:text-primary-400 mb-2">
                                        ${angle.persona}
                                    </div>
                                    <h4 class="font-medium mb-2">${angle.angleTitle}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${angle.hook}</p>
                                    <div class="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded inline-block">
                                        썸네일: ${angle.thumbnailCopy}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- SEO Tab -->
                    <div id="tab-seo" class="tab-pane hidden">
                        <div class="space-y-4">
                            <div>
                                <label class="block font-medium mb-2">제목 A</label>
                                <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" value="${seo?.titleA || ''}" readonly>
                            </div>
                            <div>
                                <label class="block font-medium mb-2">제목 B</label>
                                <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" value="${seo?.titleB || ''}" readonly>
                            </div>
                            <div>
                                <label class="block font-medium mb-2">설명</label>
                                <textarea class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[150px]" readonly>${seo?.description || ''}</textarea>
                            </div>
                            <div>
                                <label class="block font-medium mb-2">해시태그</label>
                                <div class="flex flex-wrap gap-2">
                                    ${hashtags.map(tag => `<span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Shorts Tab -->
                    <div id="tab-shorts" class="tab-pane hidden">
                        <div class="space-y-4">
                            ${shorts.length === 0 ? `
                                <div class="text-center py-8">
                                    <p class="text-gray-500 mb-4">아직 생성된 쇼츠가 없습니다</p>
                                    <button onclick="ProjectsModule.generateShorts('${project.id}')" class="btn-primary px-6 py-2 rounded-lg">
                                        <i class="fas fa-magic mr-2"></i>쇼츠 생성 (3가지 버전)
                                    </button>
                                </div>
                            ` : shorts.map((short, i) => `
                                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="font-semibold">버전 ${i + 1} (${short.durationSec}초)</h4>
                                        <button onclick="ProjectsModule.exportShort('${short.id}')" class="text-sm text-primary-600 dark:text-primary-400">
                                            <i class="fas fa-download mr-1"></i>내보내기
                                        </button>
                                    </div>
                                    <div class="text-sm">
                                        <div class="font-medium mb-1">훅:</div>
                                        <p class="text-gray-600 dark:text-gray-400 mb-3">${short.hook}</p>
                                        <div class="font-medium mb-1">자막:</div>
                                        <div class="space-y-1">
                                            ${JSON.parse(short.captionsJson).map(cap => `
                                                <div class="text-xs"><span class="font-mono">[${formatTime(cap.t)}]</span> ${cap.text}</div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Product Tab -->
                    <div id="tab-product" class="tab-pane hidden">
                        ${products.length === 0 ? `
                            <div class="text-center py-8">
                                <p class="text-gray-500 mb-4">아직 연결된 제품이 없습니다</p>
                                <button onclick="ProjectsModule.showAddProduct('${project.id}')" class="btn-primary px-6 py-2 rounded-lg">
                                    <i class="fas fa-plus mr-2"></i>제품 추가
                                </button>
                            </div>
                        ` : products.map(product => `
                            <div class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h4 class="font-semibold text-lg mb-2">${product.name}</h4>
                                <p class="text-gray-600 dark:text-gray-400 mb-4">${product.description}</p>
                                <div class="space-y-2 text-sm">
                                    <div><span class="font-medium">URL:</span> <a href="${addUTMParams(product.url, project.id)}" target="_blank" class="text-primary-600 dark:text-primary-400">${product.url}</a></div>
                                    <div><span class="font-medium">UTM:</span> <code class="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">${product.utm}</code></div>
                                    <div><span class="font-medium">버튼 텍스트:</span> ${product.buttonText}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- B-roll Hints -->
                <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h4 class="font-semibold mb-2"><i class="fas fa-film mr-2"></i>B-roll 키워드</h4>
                    <div class="flex flex-wrap gap-2">
                        ${brollKeywords.map(kw => `<span class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm">${kw}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    
    // Bind detail panel events
    bindDetailEvents() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                
                // Update buttons
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Update panes
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
                document.getElementById(`tab-${tab}`).classList.remove('hidden');
            });
        });
        
        // Auto-save on input
        const inputs = document.querySelectorAll('#project-detail textarea, #project-detail input');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                this.markUnsaved();
            }, 500));
        });
    },
    
    // Mark as unsaved
    markUnsaved() {
        const badge = document.getElementById('save-status');
        badge.className = 'badge-unsaved px-3 py-1 rounded-full text-sm font-medium';
        badge.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i>저장 안됨';
    },
    
    // Mark as saved
    markSaved() {
        const badge = document.getElementById('save-status');
        badge.className = 'badge-saved px-3 py-1 rounded-full text-sm font-medium';
        badge.innerHTML = '<i class="fas fa-check-circle mr-1"></i>자동 저장됨';
    },
    
    // Save script
    async saveScript() {
        if (!this.selectedProject) return;
        
        try {
            const opening = document.getElementById('edit-opening').value;
            const ending = document.getElementById('edit-ending').value;
            
            // Get body steps
            const bodySteps = [];
            document.querySelectorAll('#body-steps textarea').forEach((textarea, i) => {
                const timeMatch = textarea.previousElementSibling.textContent.match(/\[(\d+:\d+)\]/);
                const seconds = timeMatch ? parseTimestamp(timeMatch[1]) : i * 40;
                bodySteps.push({
                    t: seconds,
                    line: textarea.value
                });
            });
            
            // Calculate word count
            const wordCount = countWords(opening) + 
                            bodySteps.reduce((sum, step) => sum + countWords(step.line), 0) + 
                            countWords(ending);
            
            // Create full markdown
            const bodyMarkdown = bodySteps.map(step => `**[${formatTime(step.t)}]** ${step.line}`).join('\n\n');
            const fullMarkdown = `## Opening\n\n${opening}\n\n## Body\n\n${bodyMarkdown}\n\n## Ending\n\n${ending}`;
            
            // Get script
            const script = await StorageAPI.getScriptByProject(this.selectedProject);
            
            if (script) {
                await StorageAPI.updateScript(script.id, {
                    opening,
                    bodyJson: JSON.stringify(bodySteps),
                    ending,
                    fullMarkdown,
                    wordCount
                });
            }
            
            // Update project timestamp
            await StorageAPI.updateProject(this.selectedProject, {
                status: 'InEditing'
            });
            
            this.markSaved();
            showToast('스크립트가 저장되었습니다', 'success');
            
        } catch (error) {
            console.error('Error saving script:', error);
            showToast('스크립트 저장에 실패했습니다', 'error');
        }
    },
    
    // Export script as TXT
    async exportScript(format) {
        if (!this.selectedProject) return;
        
        try {
            const project = await StorageAPI.getProject(this.selectedProject);
            const script = await StorageAPI.getScriptByProject(this.selectedProject);
            
            if (format === 'txt') {
                const content = script.fullMarkdown;
                const filename = `${sanitizeFilename(project.topic)}_script.txt`;
                downloadTextFile(content, filename);
            } else if (format === 'srt') {
                const body = JSON.parse(script.bodyJson || '[]');
                let srt = '';
                let index = 1;
                
                // Opening
                srt += `${index}\n00:00:00,000 --> 00:00:10,000\n${script.opening}\n\n`;
                index++;
                
                // Body
                body.forEach((step, i) => {
                    const start = formatTime(step.t);
                    const end = i < body.length - 1 ? formatTime(body[i + 1].t) : formatTime(step.t + 40);
                    srt += `${index}\n00:${start},000 --> 00:${end},000\n${step.line}\n\n`;
                    index++;
                });
                
                const filename = `${sanitizeFilename(project.topic)}_subtitles.srt`;
                downloadTextFile(srt, filename, 'text/srt');
            }
            
            showToast(`${format.toUpperCase()} 형식으로 내보내기 완료`, 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('내보내기에 실패했습니다', 'error');
        }
    },
    
    // Generate shorts
    async generateShorts(projectId) {
        try {
            const project = await StorageAPI.getProject(projectId);
            const script = await StorageAPI.getScriptByProject(projectId);
            
            const shorts = Templates.generateShorts(project, {
                body: JSON.parse(script.bodyJson || '[]')
            });
            
            for (const short of shorts) {
                await StorageAPI.createShort({
                    projectId,
                    ...short
                });
            }
            
            showToast('쇼츠 3개가 생성되었습니다!', 'success');
            await this.expandProject(projectId);
            
        } catch (error) {
            console.error('Error generating shorts:', error);
            showToast('쇼츠 생성에 실패했습니다', 'error');
        }
    },
    
    // Close detail panel
    closeDetail() {
        document.getElementById('project-detail').classList.add('hidden');
        this.selectedProject = null;
    },
    
    // Edit project
    editProject(id) {
        this.expandProject(id);
    },
    
    // Duplicate project
    async duplicateProject(id) {
        try {
            const project = await StorageAPI.getProject(id);
            const newProject = await StorageAPI.createProject({
                ...project,
                topic: `${project.topic} (복사본)`
            });
            
            await this.loadProjects();
            showToast('프로젝트가 복제되었습니다', 'success');
        } catch (error) {
            console.error('Error duplicating project:', error);
            showToast('프로젝트 복제에 실패했습니다', 'error');
        }
    },
    
    // Delete project
    async deleteProject(id) {
        if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;
        
        try {
            await StorageAPI.deleteProject(id);
            await this.loadProjects();
            showToast('프로젝트가 삭제되었습니다', 'success');
            
            if (this.selectedProject === id) {
                this.closeDetail();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            showToast('프로젝트 삭제에 실패했습니다', 'error');
        }
    },
    
    // Bind events
    bindEvents() {
        // Generate button
        document.getElementById('btn-generate').addEventListener('click', () => {
            this.createProject();
        });
        
        // Search
        document.getElementById('search-projects').addEventListener('input', debounce((e) => {
            // TODO: Implement search
        }, 300));
        
        // Filter
        document.getElementById('filter-status').addEventListener('change', (e) => {
            this.loadProjects({ status: e.target.value });
        });
    }
};
