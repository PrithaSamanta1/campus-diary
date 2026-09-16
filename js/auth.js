/* ==========================================================================
   CAMPUS DIARY - AUTHENTICATION & USER SESSION MODULE
   ========================================================================== */

CampusDiaryApp.prototype.setAuthRole = function(role) {
    document.querySelectorAll('.role-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.role === role);
    });
    const roleInput = document.getElementById('selectedAuthRole');
    if (roleInput) roleInput.value = role;

    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');

    if (emailInput && passInput) {
        if (role === 'student') { emailInput.value = 'student@demo.com'; passInput.value = 'password123'; }
        if (role === 'teacher') { emailInput.value = 'teacher@demo.com'; passInput.value = 'password123'; }
        if (role === 'admin') { emailInput.value = 'admin@demo.com'; passInput.value = 'password123'; }
    }
};

CampusDiaryApp.prototype.handleDemoLogin = function(role) {
    let demoEmail = 'student@demo.com';
    if (role === 'teacher') demoEmail = 'teacher@demo.com';
    if (role === 'admin') demoEmail = 'admin@demo.com';

    const user = this.users.find(u => u.email === demoEmail);
    if (user) {
        this.loginUser(user);
    }
};

CampusDiaryApp.prototype.handleLoginSubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const roleInput = document.getElementById('selectedAuthRole');
    const role = roleInput ? roleInput.value : 'student';

    let user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
        const displayName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'User';
        user = {
            id: 'usr-' + Date.now(),
            name: displayName,
            email: email,
            role: role,
            department: 'Computer Science',
            phone: '+91 98000 00000',
            status: 'Active',
            avatar: displayName.charAt(0).toUpperCase()
        };
        this.users.push(user);
    } else {
        user.role = role;
    }

    this.loginUser(user);
};

CampusDiaryApp.prototype.handleRegisterSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const role = document.getElementById('regRole').value;
    const dept = document.getElementById('regDept').value.trim();

    const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email,
        role,
        department: dept || 'Computer Science',
        phone: '+91 98000 00000',
        status: 'Active',
        avatar: name.charAt(0).toUpperCase()
    };

    this.users.push(newUser);
    this.logAction(name, `Registered new account (${role.toUpperCase()})`, 'Auth');
    this.saveState();
    alert('Registration successful! Redirecting to login page.');
    window.location.href = 'login.html';
};

CampusDiaryApp.prototype.handleForgotSubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        alert(`Password reset instructions sent to ${email}. For demo: Password reset to 'password123'.`);
        window.location.href = 'login.html';
    } else {
        alert('Email address not found in system records.');
    }
};

CampusDiaryApp.prototype.loginUser = function(user) {
    this.currentUser = user;
    this.logAction(user.name, `Logged in as ${user.role.toUpperCase()}`, 'Auth');
    this.saveState();
    window.location.href = 'dashboard.html';
};

CampusDiaryApp.prototype.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        if (this.currentUser) this.logAction(this.currentUser.name, 'Logged out', 'Auth');
        this.currentUser = null;
        localStorage.removeItem('cd_current_user');
        window.location.href = 'index.html';
    }
};
