// Main app initialization
const App = {
    async init() {
        console.log('YCPA App initializing...');
        
        // Check Pro mode
        const health = await APIClient.init();
        if (health.proMode) {
            this.showProModeBadge();
            console.log('Pro mode enabled!');
        }
        
        // Initialize modules
        await Projects.init();
        await Trends.init();
        
        // Setup dark mode
        this.setupDarkMode();
        
        console.log('YCPA App ready!');
    },
    showProModeBadge() {
        const logo = document.querySelector('.logo');
        if (logo) {
            const badge = document.createElement('span');
            badge.className = 'pro-badge ml-2';
            badge.innerHTML = '✨ PRO';
            logo.appendChild(badge);
        }
    },
    setupDarkMode() {
        const darkModeBtn = document.getElementById('dark-mode-toggle');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
