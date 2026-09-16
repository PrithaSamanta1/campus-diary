/* ==========================================================================
   CAMPUS DIARY - TASKS & COURSEWORK MODULE
   ========================================================================== */

CampusDiaryApp.prototype.renderTasks = function(filterStatus = 'all', filterPriority = 'all', searchQuery = '') {
    const container = document.getElementById('tasksGrid');
    if (!container) return;

    let filtered = this.tasks;
    if (filterStatus !== 'all') {
        filtered = filtered.filter(t => t.status === filterStatus);
    }
    if (filterPriority !== 'all') {
        filtered = filtered.filter(t => t.priority === filterPriority);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.assignedTo.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5 text-muted">
            <i class="fas fa-clipboard-check fa-3x mb-3"></i>
            <p>No tasks match the selected criteria.</p>
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(t => this.generateTaskCardHTML(t)).join('');
};

CampusDiaryApp.prototype.generateTaskCardHTML = function(t) {
    return `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="task-card-item priority-${t.priority}">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="fw-bold mb-0 text-truncate" style="max-width: 70%;">${t.title}</h5>
                <span class="badge-priority ${t.priority}">${t.priority}</span>
            </div>
            <p class="text-secondary small mb-3" style="min-height: 40px;">${t.description}</p>
            
            <div class="d-flex align-items-center justify-content-between text-muted small pt-2 border-top">
                <div><i class="fas fa-user-circle me-1"></i> ${t.assignedTo}</div>
                <div><i class="fas fa-calendar-alt me-1"></i> ${t.deadline}</div>
            </div>

            <div class="d-flex align-items-center justify-content-between mt-3">
                <span class="badge-status ${t.status}">${t.status.replace('-', ' ').toUpperCase()}</span>
                <div class="btn-group btn-group-sm">
                    ${t.status !== 'completed' ? `<button class="btn btn-outline-success btn-xs" onclick="app.updateTaskStatus('${t.id}', 'completed')"><i class="fas fa-check"></i></button>` : ''}
                    ${t.status === 'pending' ? `<button class="btn btn-outline-primary btn-xs" onclick="app.updateTaskStatus('${t.id}', 'in-progress')"><i class="fas fa-play"></i></button>` : ''}
                    ${(this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'teacher')) ? `<button class="btn btn-outline-danger btn-xs" onclick="app.deleteTask('${t.id}')"><i class="fas fa-trash"></i></button>` : ''}
                </div>
            </div>
        </div>
    </div>`;
};

CampusDiaryApp.prototype.updateTaskStatus = function(taskId, newStatus) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        this.logAction(this.currentUser ? this.currentUser.name : 'User', `Updated task "${task.title}" status to ${newStatus.toUpperCase()}`, 'Task');
        this.saveState();
        this.renderTasks();
        this.renderDashboardCharts();
        this.updateSidebarUI();
        this.showToast('Task Updated', `Task status changed to ${newStatus.toUpperCase()}`, 'success');
    }
};

CampusDiaryApp.prototype.deleteTask = function(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const task = this.tasks.find(t => t.id === taskId);
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        if (task) this.logAction(this.currentUser ? this.currentUser.name : 'User', `Deleted task "${task.title}"`, 'Task');
        this.saveState();
        this.renderTasks();
        this.renderDashboardCharts();
        this.updateSidebarUI();
        this.showToast('Task Deleted', 'The task was removed successfully.', 'info');
    }
};

CampusDiaryApp.prototype.createTask = function(e) {
    e.preventDefault();
    const titleEl = document.getElementById('taskTitle');
    const descEl = document.getElementById('taskDesc');
    const assigneeEl = document.getElementById('taskAssignee') || document.getElementById('assignTaskStudentSelect');
    const priorityEl = document.getElementById('taskPriority');
    const deadlineEl = document.getElementById('taskDeadline');
    const categoryEl = document.getElementById('taskCategory');

    const title = titleEl ? titleEl.value.trim() : 'New Task';
    const description = descEl ? descEl.value.trim() : '';
    const assignedTo = assigneeEl ? assigneeEl.value : 'Student User';
    const priority = priorityEl ? priorityEl.value : 'medium';
    const deadline = (deadlineEl && deadlineEl.value) ? deadlineEl.value : '2026-09-15';
    const category = categoryEl ? categoryEl.value : 'Assignment';

    const newTask = {
        id: 'tsk-' + Date.now(),
        title,
        description,
        assignedTo,
        priority,
        deadline,
        status: 'pending',
        category
    };

    this.tasks.unshift(newTask);
    this.logAction(this.currentUser ? this.currentUser.name : 'Faculty', `Assigned task "${title}" to ${assignedTo}`, 'Task');
    this.saveState();
    this.renderTasks();
    this.renderDashboardCharts();
    this.updateSidebarUI();

    const modalEl = document.getElementById('taskModal');
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
    e.target.reset();

    this.showToast('Task Assigned', `New task "${title}" assigned to ${assignedTo}`, 'success');
};
