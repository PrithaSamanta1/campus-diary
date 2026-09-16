/* ==========================================================================
   CAMPUS DIARY - RESOURCES & LAB BOOKING MODULE (With Collision Check)
   ========================================================================== */

CampusDiaryApp.prototype.renderResources = function(filterType = 'all', searchQuery = '') {
    const container = document.getElementById('resourcesGrid');
    if (!container) return;

    let filtered = this.resources;
    if (filterType !== 'all') {
        filtered = filtered.filter(r => r.type === filterType);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q));
    }

    container.innerHTML = filtered.map(r => `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="resource-card">
            <div class="resource-icon">
                <i class="fas ${r.icon}"></i>
            </div>
            <h5 class="fw-bold mb-1">${r.name}</h5>
            <p class="text-muted small mb-2">${r.location} • <strong>${r.capacity}</strong></p>
            <div class="mb-3">
                <span class="badge-availability ${r.status}">${r.status.toUpperCase()}</span>
            </div>
            <div>
                ${r.status === 'available' ? `
                    <button class="btn btn-primary btn-sm w-100" onclick="app.openBookingModal('${r.name}')">
                        <i class="fas fa-calendar-check me-1"></i> Book Slot
                    </button>
                ` : `
                    <button class="btn btn-secondary btn-sm w-100" disabled>
                        <i class="fas fa-lock me-1"></i> Unavailable
                    </button>
                `}
            </div>
        </div>
    </div>`).join('');

    this.renderBookingsTable();
};

CampusDiaryApp.prototype.openBookingModal = function(resourceName) {
    document.getElementById('bookingResourceName').value = resourceName;
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
};

CampusDiaryApp.prototype.handleBookingSubmit = function(e) {
    e.preventDefault();
    const resourceName = document.getElementById('bookingResourceName').value;
    const date = document.getElementById('bookingDate').value;
    const timeSlot = document.getElementById('bookingTimeSlot').value;
    const purpose = document.getElementById('bookingPurpose').value.trim();

    // FR-RES-04 Collision Check: Double-booking prevention
    const conflict = this.bookings.find(b => b.resourceName === resourceName && b.date === date && b.timeSlot === timeSlot);
    if (conflict) {
        this.showToast('Booking Conflict!', `${resourceName} is already reserved on ${date} (${timeSlot}) by ${conflict.bookedBy}.`, 'danger');
        alert(`🚨 CONFLICT ALERT!\n"${resourceName}" is already reserved on ${date} during ${timeSlot}.\n\nPlease choose another date or time slot.`);
        return;
    }

    const newBooking = {
        id: 'bk-' + Date.now(),
        resourceName,
        bookedBy: this.currentUser ? this.currentUser.name : 'Guest User',
        date,
        timeSlot,
        purpose
    };

    this.bookings.unshift(newBooking);

    const res = this.resources.find(r => r.name === resourceName);
    if (res) res.status = 'booked';

    this.logAction(this.currentUser ? this.currentUser.name : 'User', `Booked ${resourceName} for ${date} (${timeSlot})`, 'Resource');
    this.saveState();
    this.renderResources();
    this.renderDashboardCharts();

    const modalEl = document.getElementById('bookingModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    e.target.reset();

    this.showToast('Resource Booked', `${resourceName} successfully booked for ${date}`, 'success');
};

CampusDiaryApp.prototype.renderBookingsTable = function() {
    const tbody = document.getElementById('myBookingsTableBody');
    if (!tbody) return;

    if (this.bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No active bookings recorded.</td></tr>`;
        return;
    }

    tbody.innerHTML = this.bookings.map(b => `
    <tr>
        <td><strong>${b.resourceName}</strong></td>
        <td>${b.bookedBy}</td>
        <td>${b.date} (${b.timeSlot})</td>
        <td>${b.purpose}</td>
        <td>
            <button class="btn btn-outline-danger btn-xs" onclick="app.cancelBooking('${b.id}', '${b.resourceName}')">
                <i class="fas fa-times me-1"></i> Cancel
            </button>
        </td>
    </tr>`).join('');
};

CampusDiaryApp.prototype.cancelBooking = function(bookingId, resourceName) {
    if (confirm(`Cancel reservation for ${resourceName}?`)) {
        this.bookings = this.bookings.filter(b => b.id !== bookingId);

        const hasOtherBookings = this.bookings.some(b => b.resourceName === resourceName);
        if (!hasOtherBookings) {
            const res = this.resources.find(r => r.name === resourceName);
            if (res) res.status = 'available';
        }

        this.logAction(this.currentUser ? this.currentUser.name : 'User', `Cancelled booking for ${resourceName}`, 'Resource');
        this.saveState();
        this.renderResources();
        this.renderDashboardCharts();
        this.showToast('Booking Cancelled', `Reservation for ${resourceName} released.`, 'info');
    }
};
