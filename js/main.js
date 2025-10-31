/**
 * YCPA Main Application
 * Application initialization and global event handlers
 */

// Application state
const App = {
    currentView: 'projects',
    initialized: false,
    
    // Initialize application
    async init() {
        if (this.initialized) return;
        
        console.log('🚀 YCPA Initializing...');
        
        // Initialize theme
        initTheme();
        
        // Initialize keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Initialize navigation
        this.initNavigation();
        
        // Initialize Pro Mode
        await APIClient.init();
        
        // Show Pro Mode status
        if (APIClient.isProModeAvailable) {
            console.log('✨ Pro 모드 활성화 - AI 기반 생성 사용 가능');
            // Pro 모드 배지 표시 (선택사항)
            this.showProModeBadge();
        } else {
            console.log('📝 MVP 모드 - 템플릿 기반 생성 사용');
        }
        
        // Initialize modules
        await ProjectsModule.init();
        TrendsModule.init();
        
        // Bind global events
        this.bindGlobalEvents();
        
        // Show initial view
        this.showView('projects');
        
        this.initialized = true;
        console.log('✅ YCPA Ready!');
    },
    
    // Initialize navigation
    initNavigation() {
        const navButtons = {
            'nav-projects': 'projects',
            'nav-trends': 'trends'
        };
        
        Object.keys(navButtons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.showView(navButtons[btnId]);
                });
            }
        });
    },
    
    // Show view
    showView(viewName) {
        this.currentView = viewName;
        
        // Update nav buttons
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`nav-${viewName}`).classList.add('active');
        
        // Update views
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.add('hidden');
        });
        document.getElementById(`view-${viewName}`).classList.remove('hidden');
        
        // Update URL (without reload)
        history.pushState({ view: viewName }, '', `#${viewName}`);
    },
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts() {
        initKeyboardShortcuts({
            save: () => {
                if (this.currentView === 'projects' && ProjectsModule.selectedProject) {
                    ProjectsModule.saveScript();
                }
            },
            commandPalette: () => {
                this.toggleCommandPalette();
            },
            next: () => {
                // Navigate through project list
                if (this.currentView === 'projects') {
                    const items = document.querySelectorAll('.project-item');
                    // TODO: Implement navigation
                }
            },
            prev: () => {
                // Navigate through project list
                if (this.currentView === 'projects') {
                    const items = document.querySelectorAll('.project-item');
                    // TODO: Implement navigation
                }
            },
            escape: () => {
                this.closeCommandPalette();
                if (ProjectsModule.selectedProject) {
                    ProjectsModule.closeDetail();
                }
            }
        });
    },
    
    // Toggle command palette
    toggleCommandPalette() {
        const palette = document.getElementById('command-palette');
        const isHidden = palette.classList.contains('hidden');
        
        if (isHidden) {
            palette.classList.remove('hidden');
            document.getElementById('command-input').focus();
            this.updateCommandList('');
        } else {
            this.closeCommandPalette();
        }
    },
    
    // Close command palette
    closeCommandPalette() {
        const palette = document.getElementById('command-palette');
        palette.classList.add('hidden');
        document.getElementById('command-input').value = '';
    },
    
    // Update command list
    updateCommandList(query) {
        const commands = [
            { icon: 'fa-plus', text: '새 프로젝트 만들기', action: () => document.getElementById('input-topic').focus() },
            { icon: 'fa-chart-line', text: '트렌드 분석', action: () => this.showView('trends') },
            { icon: 'fa-folder-open', text: '프로젝트 보기', action: () => this.showView('projects') },
            { icon: 'fa-save', text: '현재 프로젝트 저장', action: () => ProjectsModule.saveScript() },
            { icon: 'fa-download', text: 'TXT로 내보내기', action: () => ProjectsModule.exportScript('txt') },
            { icon: 'fa-download', text: 'SRT로 내보내기', action: () => ProjectsModule.exportScript('srt') },
            { icon: 'fa-moon', text: '다크 모드 전환', action: () => toggleTheme() }
        ];
        
        const filtered = query ? commands.filter(cmd => 
            cmd.text.toLowerCase().includes(query.toLowerCase())
        ) : commands;
        
        const listContainer = document.getElementById('command-list');
        listContainer.innerHTML = filtered.map((cmd, i) => `
            <div class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg flex items-center space-x-3" data-cmd-index="${i}">
                <i class="fas ${cmd.icon} text-primary-600 dark:text-primary-400"></i>
                <span>${cmd.text}</span>
            </div>
        `).join('');
        
        // Bind click events
        listContainer.querySelectorAll('[data-cmd-index]').forEach((el, i) => {
            el.addEventListener('click', () => {
                filtered[i].action();
                this.closeCommandPalette();
            });
        });
    },
    
    // Bind global events
    bindGlobalEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                toggleTheme();
            });
        }
        
        // Command palette input
        const commandInput = document.getElementById('command-input');
        if (commandInput) {
            commandInput.addEventListener('input', (e) => {
                this.updateCommandList(e.target.value);
            });
            
            commandInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const firstCmd = document.querySelector('[data-cmd-index="0"]');
                    if (firstCmd) firstCmd.click();
                }
            });
        }
        
        // Click outside command palette
        const commandPalette = document.getElementById('command-palette');
        if (commandPalette) {
            commandPalette.addEventListener('click', (e) => {
                if (e.target === commandPalette) {
                    this.closeCommandPalette();
                }
            });
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.showView(e.state.view);
            }
        });
        
        // Handle hash navigation
        if (window.location.hash) {
            const view = window.location.hash.substring(1);
            if (['projects', 'trends'].includes(view)) {
                this.showView(view);
            }
        }
        
        // Prevent form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        });
        
        // Auto-save indicator simulation
        setInterval(() => {
            // Check if there are unsaved changes
            // This is a placeholder - actual implementation would track changes
        }, 2000);
        
        // Welcome message
        this.showWelcomeMessage();
    },
    
    // Show Pro Mode badge
    showProModeBadge() {
        const badge = document.createElement('span');
        badge.className = 'ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full';
        badge.innerHTML = '✨ PRO';
        badge.title = 'AI 기반 생성 활성화';
        
        const logo = document.querySelector('h1');
        if (logo) {
            logo.appendChild(badge);
        }
    },
    
    // Show welcome message
    showWelcomeMessage() {
        setTimeout(() => {
            const message = APIClient.isProModeAvailable 
                ? 'YCPA Pro에 오신 것을 환영합니다! AI로 전문 스크립트를 생성해보세요. ✨'
                : 'YCPA에 오신 것을 환영합니다! 첫 프로젝트를 만들어보세요.';
            showToast(message, 'info', 5000);
        }, 1000);
    },
    
    // Error handler
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        showToast(`Something went wrong: ${error.message}`, 'error');
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init().catch(error => {
            console.error('Failed to initialize app:', error);
            showToast('Failed to initialize application', 'error');
        });
    });
} else {
    App.init().catch(error => {
        console.error('Failed to initialize app:', error);
        showToast('Failed to initialize application', 'error');
    });
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Export for debugging
window.YCPA = {
    App,
    ProjectsModule,
    TrendsModule,
    Templates,
    StorageAPI,
    version: '1.0.0'
};

console.log('%c🎬 YCPA - YouTube Content Producer App', 'color: #ef4444; font-size: 20px; font-weight: bold;');
console.log('%cVersion 1.0.0 - MVP Mode', 'color: #6b7280; font-size: 12px;');
console.log('%cAccess YCPA object: window.YCPA', 'color: #3b82f6; font-size: 12px;');
