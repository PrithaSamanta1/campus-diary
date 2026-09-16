/* ==========================================================================
   CAMPUS DIARY - MAIN APPLICATION CONTROLLER & NAVIGATION ENGINE
   ========================================================================== */

class CampusDiaryApp {
    constructor() {
        const load = (key, fallback) => {
            try {
                const stored = localStorage.getItem(key);
                return stored ? JSON.parse(stored) : fallback;
            } catch (e) {
                return fallback;
            }
        };

        this.users = load('cd_users', INITIAL_USERS);
        this.tasks = load('cd_tasks', INITIAL_TASKS);
        this.resources = load('cd_resources', INITIAL_RESOURCES);
        this.notices = load('cd_notices', INITIAL_NOTICES);
        this.bookings = load('cd_bookings', INITIAL_BOOKINGS);
        this.logs = load('cd_logs', INITIAL_LOGS);
        this.currentUser = load('cd_current_user', null);

        this.currentView = 'dashboard';
        this.charts = {};
    }

    saveState() {
        const state = {
            cd_users: this.users,
            cd_tasks: this.tasks,
            cd_resources: this.resources,
            cd_notices: this.notices,
            cd_bookings: this.bookings,
            cd_logs: this.logs,
            cd_current_user: this.currentUser
        };
        Object.entries(state).forEach(([key, val]) => {
            localStorage.setItem(key, JSON.stringify(val));
        });
    }

    init() {
        this.bindEvents();

        const page = window.location.pathname.split('/').pop() || 'index.html';
        if (page === 'dashboard.html') {
            if (!this.currentUser) {
                window.location.href = 'login.html';
                return;
            }
            this.setupDashboardView();
        } else if (page === 'login.html' && this.currentUser) {
            window.location.href = 'dashboard.html';
        }
    }

    logAction(user, action, type) {
        const now = new Date();
        const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.logs.unshift({ id: 'log-' + Date.now(), timestamp, user: user || 'System', action, type });
        this.saveState();
    }

    // --- DASHBOARD SETUP & NAVIGATION ---
    setupDashboardView() {
        this.updateSidebarUI();
        this.populateStudentDropdowns();
        this.navigateTo('dashboard');
    }

    updateSidebarUI() {
        const u = this.currentUser;
        if (!u) return;

        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setText('sidebarName', u.name);
        setText('sidebarRole', u.role.toUpperCase());
        setText('sidebarAvatar', u.avatar || u.name.charAt(0));

        const isFacultyOrAdmin = u.role === 'teacher' || u.role === 'admin';
        const isAdmin = u.role === 'admin';

        const setDisplay = (id, show) => {
            const el = document.getElementById(id);
            if (el) el.style.display = show ? 'flex' : 'none';
        };

        setDisplay('navStudents', isFacultyOrAdmin);
        setDisplay('navAssignTask', isFacultyOrAdmin);
        setDisplay('navUsers', isAdmin);
        setDisplay('navLogs', isAdmin);

        const pendingCount = this.tasks.filter(t => t.status !== 'completed').length;
        setText('navTaskBadge', pendingCount);
    }

    navigateTo(page) {
        this.currentView = page;

        document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('d-none'));
        const target = document.getElementById(`page-${page}`);
        if (target) {
            target.classList.remove('d-none');
            target.classList.add('animate-fade-in');
        }

        document.querySelectorAll('.nav-item-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        const titles = {
            dashboard: { title: 'Dashboard Overview', sub: 'Welcome back! Here is what is happening across campus today.' },
            tasks: { title: 'Task & Assignment Manager', sub: 'Track, manage, and submit campus assignments and project tasks.' },
            resources: { title: 'Campus Resources & Booking', sub: 'Check classroom, lab, and equipment availability or schedule a slot.' },
            notices: { title: 'Campus Notice Board', sub: 'Stay updated with official campus announcements and events.' },
            students: { title: 'Student Directory', sub: 'Monitor student performance, assignments, and active records.' },
            'assign-task': { title: 'Assign New Task', sub: 'Create and assign academic coursework or project tasks.' },
            users: { title: 'User Access Control', sub: 'Administrative portal for user account management and security.' },
            logs: { title: 'System Activity Audit Logs', sub: 'Audit trail of system events and access logs.' },
            profile: { title: 'Account Settings', sub: 'Update your profile information and preferences.' }
        };

        const info = titles[page] || { title: 'Campus Diary', sub: '' };
        const titleEl = document.getElementById('pageTitle');
        const subEl = document.getElementById('pageSubtitle');
        if (titleEl) titleEl.textContent = info.title;
        if (subEl) subEl.textContent = info.sub;

        const viewRenderers = {
            dashboard: () => this.renderDashboardCharts(),
            tasks: () => this.renderTasks(),
            resources: () => this.renderResources(),
            notices: () => this.renderNotices(),
            students: () => this.renderStudents(),
            users: () => this.renderUsers(),
            logs: () => this.renderActivityLogs(),
            profile: () => this.populateProfile()
        };

        if (viewRenderers[page]) viewRenderers[page]();

        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }

    renderStats() {
        const stats = {
            statTotalTasks: this.tasks.length,
            statCompletedTasks: this.tasks.filter(t => t.status === 'completed').length,
            statPendingTasks: this.tasks.filter(t => t.status === 'pending').length,
            statAvailableRes: this.resources.filter(r => r.status === 'available').length,
            statTotalNotices: this.notices.length,
            statTotalUsers: this.users.length
        };

        Object.entries(stats).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        });
    }

    renderDashboardCharts() {
        this.renderStats();

        const dashTaskContainer = document.getElementById('dashRecentTasksGrid');
        if (dashTaskContainer) {
            dashTaskContainer.innerHTML = this.tasks.slice(0, 3).map(t => this.generateTaskCardHTML(t)).join('');
        }

        const dashNoticeContainer = document.getElementById('dashRecentNoticesList');
        if (dashNoticeContainer) {
            dashNoticeContainer.innerHTML = this.notices.slice(0, 3).map(n => this.generateNoticeHTML(n)).join('');
        }

        const ctxTask = document.getElementById('taskStatusChart');
        if (ctxTask) {
            if (this.charts.taskChart) this.charts.taskChart.destroy();
            this.charts.taskChart = new Chart(ctxTask, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'In Progress', 'Pending'],
                    datasets: [{
                        data: [
                            this.tasks.filter(t => t.status === 'completed').length,
                            this.tasks.filter(t => t.status === 'in-progress').length,
                            this.tasks.filter(t => t.status === 'pending').length
                        ],
                        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                    cutout: '70%'
                }
            });
        }

        const ctxRes = document.getElementById('resourceUtilChart');
        if (ctxRes) {
            if (this.charts.resChart) this.charts.resChart.destroy();
            this.charts.resChart = new Chart(ctxRes, {
                type: 'bar',
                data: {
                    labels: ['Available', 'Booked', 'Maintenance'],
                    datasets: [{
                        label: 'Resource Count',
                        data: [
                            this.resources.filter(r => r.status === 'available').length,
                            this.resources.filter(r => r.status === 'booked').length,
                            this.resources.filter(r => r.status === 'maintenance').length
                        ],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        }
    }

    showToast(title, message, type = 'info') {
        const toastEl = document.getElementById('liveToast');
        if (!toastEl) return;

        const titleEl = document.getElementById('toastTitle');
        const bodyEl = document.getElementById('toastBody');
        const iconEl = document.getElementById('toastIcon');

        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.textContent = message;

        if (iconEl) {
            const icons = {
                success: 'fas fa-check-circle text-success me-2',
                danger: 'fas fa-exclamation-circle text-danger me-2',
                info: 'fas fa-info-circle text-info me-2'
            };
            iconEl.className = icons[type] || icons.info;
        }

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    bindEvents() {
        const globalSearch = document.getElementById('globalSearchInput');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                const query = e.target.value;
                if (this.currentView === 'tasks') this.renderTasks('all', 'all', query);
                if (this.currentView === 'resources') this.renderResources('all', query);
                if (this.currentView === 'notices') this.renderNotices('all', query);
            });
        }
    }
}

// Global App Instance
const app = new CampusDiaryApp();

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
