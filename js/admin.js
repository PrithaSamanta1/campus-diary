/* ==========================================================================
   CAMPUS DIARY - USER DIRECTORY, AUDIT LOGS & ADMIN MODULE
   ========================================================================== */

CampusDiaryApp.prototype.renderStudents = function() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    const students = this.users.filter(u => u.role === 'student');
    tbody.innerHTML = students.map((s, idx) => {
        const studentTasks = this.tasks.filter(t => t.assignedTo === s.name);
        const completed = studentTasks.filter(t => t.status === 'completed').length;

        return `
        <tr>
            <td>${idx + 1}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar-circle" style="width:34px; height:34px; font-size:0.9rem;">${s.avatar || s.name.charAt(0)}</div>
                    <span class="fw-bold">${s.name}</span>
                </div>
            </td>
            <td>${s.email}</td>
            <td>${s.department}</td>
            <td><span class="badge bg-secondary">${studentTasks.length} Assigned</span> (${completed} Done)</td>
            <td><span class="badge bg-success">${s.status}</span></td>
            <td>
                <button class="btn btn-outline-primary btn-xs" onclick="app.quickAssignTaskToStudent('${s.name}')">
                    <i class="fas fa-plus me-1"></i> Assign Task
                </button>
            </td>
        </tr>`;
    }).join('');
};

CampusDiaryApp.prototype.quickAssignTaskToStudent = function(studentName) {
    this.navigateTo('assign-task');
    const select = document.getElementById('assignTaskStudentSelect');
    if (select) select.value = studentName;
};

CampusDiaryApp.prototype.renderUsers = function() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.users.map(u => `
    <tr>
        <td>
            <div class="d-flex align-items-center gap-2">
                <div class="avatar-circle" style="width:34px; height:34px; font-size:0.9rem;">${u.avatar || u.name.charAt(0)}</div>
                <div>
                    <div class="fw-bold">${u.name}</div>
                    <div class="small text-muted">${u.email}</div>
                </div>
            </div>
        </td>
        <td><span class="badge bg-info text-dark">${u.role.toUpperCase()}</span></td>
        <td>${u.department}</td>
        <td><span class="badge bg-success">${u.status}</span></td>
        <td>
            <button class="btn btn-outline-danger btn-xs" onclick="app.deleteUser('${u.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </td>
    </tr>`).join('');
};

CampusDiaryApp.prototype.createUser = function(e) {
    e.preventDefault();
    const name = document.getElementById('newUserName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const role = document.getElementById('newUserRole').value;
    const department = document.getElementById('newUserDept').value.trim();

    const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email,
        role,
        department: department || 'General',
        phone: '+91 98000 00000',
        status: 'Active',
        avatar: name.charAt(0).toUpperCase()
    };

    this.users.push(newUser);
    this.logAction(this.currentUser ? this.currentUser.name : 'Admin', `Created user account for ${name} (${role})`, 'User');
    this.saveState();
    this.renderUsers();
    this.renderStudents();
    this.populateStudentDropdowns();

    const modalEl = document.getElementById('userModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    e.target.reset();

    this.showToast('User Created', `User account for ${name} added.`, 'success');
};

CampusDiaryApp.prototype.deleteUser = function(userId) {
    if (confirm('Delete this user account permanently?')) {
        const user = this.users.find(u => u.id === userId);
        this.users = this.users.filter(u => u.id !== userId);
        if (user) this.logAction(this.currentUser ? this.currentUser.name : 'Admin', `Deleted user account ${user.name}`, 'User');
        this.saveState();
        this.renderUsers();
        this.renderStudents();
        this.populateStudentDropdowns();
        this.showToast('User Deleted', 'Account removed.', 'info');
    }
};

CampusDiaryApp.prototype.renderActivityLogs = function() {
    const tbody = document.getElementById('activityLogsTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.logs.map((l, idx) => `
    <tr>
        <td>${idx + 1}</td>
        <td><small class="text-muted">${l.timestamp}</small></td>
        <td><strong>${l.user}</strong></td>
        <td>${l.action}</td>
        <td><span class="badge bg-secondary">${l.type}</span></td>
    </tr>`).join('');
};

CampusDiaryApp.prototype.populateStudentDropdowns = function() {
    const studentSelects = [
        document.getElementById('taskAssignee'),
        document.getElementById('assignTaskStudentSelect')
    ];

    const students = this.users.filter(u => u.role === 'student');

    studentSelects.forEach(select => {
        if (select) {
            select.innerHTML = students.map(s => `<option value="${s.name}">${s.name} (${s.department})</option>`).join('');
        }
    });
};

CampusDiaryApp.prototype.populateProfile = function() {
    if (!this.currentUser) return;
    document.getElementById('profName').value = this.currentUser.name;
    document.getElementById('profEmail').value = this.currentUser.email;
    document.getElementById('profDept').value = this.currentUser.department;
    document.getElementById('profPhone').value = this.currentUser.phone || '';
    document.getElementById('profAvatarCircle').textContent = this.currentUser.avatar || this.currentUser.name.charAt(0);
    document.getElementById('profTitleName').textContent = this.currentUser.name;
    document.getElementById('profTitleRole').textContent = this.currentUser.role.toUpperCase();
};

CampusDiaryApp.prototype.updateProfile = function(e) {
    e.preventDefault();
    if (!this.currentUser) return;

    this.currentUser.name = document.getElementById('profName').value.trim();
    this.currentUser.email = document.getElementById('profEmail').value.trim();
    this.currentUser.department = document.getElementById('profDept').value.trim();
    this.currentUser.phone = document.getElementById('profPhone').value.trim();
    this.currentUser.avatar = this.currentUser.name.charAt(0).toUpperCase();

    const idx = this.users.findIndex(u => u.id === this.currentUser.id);
    if (idx !== -1) {
        this.users[idx] = this.currentUser;
    }

    this.saveState();
    this.updateSidebarUI();
    this.populateProfile();
    this.showToast('Profile Saved', 'Your account profile details have been updated.', 'success');
};
