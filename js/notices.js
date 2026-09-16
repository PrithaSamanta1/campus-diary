/* ==========================================================================
   CAMPUS DIARY - NOTICES & BROADCAST MODULE
   ========================================================================== */

CampusDiaryApp.prototype.renderNotices = function(filterCategory = 'all', searchQuery = '') {
    const container = document.getElementById('noticesList');
    if (!container) return;

    let filtered = this.notices;
    if (filterCategory !== 'all') {
        filtered = filtered.filter(n => n.category === filterCategory);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    container.innerHTML = filtered.map(n => this.generateNoticeHTML(n)).join('');
};

CampusDiaryApp.prototype.generateNoticeHTML = function(n) {
    return `
    <div class="notice-item-card ${n.pinned ? 'border-primary' : ''}">
        <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
                <span class="notice-badge-category cat-${n.category} me-2">${n.category.toUpperCase()}</span>
                ${n.pinned ? '<span class="badge bg-warning text-dark me-2"><i class="fas fa-thumbtack me-1"></i> PINNED</span>' : ''}
                <h5 class="fw-bold d-inline align-middle mb-0">${n.title}</h5>
            </div>
            <small class="text-muted"><i class="far fa-clock me-1"></i> ${n.date}</small>
        </div>
        <p class="text-secondary mb-2">${n.content}</p>
        <div class="text-end small text-muted">
            Posted by: <strong>${n.postedBy}</strong>
        </div>
    </div>`;
};

CampusDiaryApp.prototype.createNotice = function(e) {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value.trim();
    const content = document.getElementById('noticeContent').value.trim();
    const category = document.getElementById('noticeCategory').value;
    const pinned = document.getElementById('noticePinned').checked;

    const newNotice = {
        id: 'not-' + Date.now(),
        title,
        content,
        category,
        date: 'Just now',
        pinned,
        postedBy: this.currentUser ? this.currentUser.name : 'Faculty Admin'
    };

    this.notices.unshift(newNotice);
    this.logAction(this.currentUser ? this.currentUser.name : 'Faculty', `Published notice "${title}"`, 'Notice');
    this.saveState();
    this.renderNotices();
    this.renderDashboardCharts();

    const modalEl = document.getElementById('noticeModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    e.target.reset();

    this.showToast('Announcement Posted', 'New notice published to campus board.', 'success');
};
