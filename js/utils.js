// Utility functions for YCPA

// Generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Format date
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Format relative time
function formatRelativeTime(date) {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }[type] || 'ℹ';

    toast.innerHTML = `
        <span style="font-size: 1.5rem;">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate project input
function validateProjectInput(data) {
    const errors = [];
    
    if (!data.topic || data.topic.trim().length === 0) {
        errors.push('주제를 입력해주세요');
    }
    
    if (!data.audience || data.audience.trim().length === 0) {
        errors.push('타겟 오디언스를 입력해주세요');
    }
    
    if (!data.tone) {
        errors.push('톤을 선택해주세요');
    }
    
    if (!data.length) {
        errors.push('영상 길이를 선택해주세요');
    }
    
    return errors;
}

// Format number with commas
function formatNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate word count
function calculateWordCount(text) {
    if (!text) return 0;
    // 한글, 영문 등 모든 문자를 카운트
    return text.replace(/\s+/g, '').length;
}

// Estimate reading time (words per minute)
function estimateReadingTime(text, wpm = 150) {
    const wordCount = calculateWordCount(text);
    const minutes = Math.ceil(wordCount / wpm);
    return minutes;
}

// Export to TXT
function exportToTXT(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Export to JSON
function exportToJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('클립보드에 복사되었습니다', 'success');
        return true;
    } catch (err) {
        showToast('복사 실패', 'error');
        return false;
    }
}

// Sanitize HTML
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Get status badge color
function getStatusColor(status) {
    const colors = {
        'draft': 'gray',
        'in-progress': 'blue',
        'review': 'yellow',
        'completed': 'green'
    };
    return colors[status] || 'gray';
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        'draft': '초안',
        'in-progress': '진행중',
        'review': '검토중',
        'completed': '완료'
    };
    return labels[status] || status;
}
