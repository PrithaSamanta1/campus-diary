/* ==========================================================================
   CAMPUS DIARY - DATA ENGINE & INITIAL MOCK DATA
   ========================================================================== */

const INITIAL_USERS = [
    { id: 'usr-1', name: 'John Doe', email: 'student@demo.com', role: 'student', department: 'Computer Science', phone: '+91 98765 43210', status: 'Active', avatar: 'J' },
    { id: 'usr-2', name: 'Sarah Lee', email: 'sarah@college.edu', role: 'student', department: 'Information Technology', phone: '+91 98765 43211', status: 'Active', avatar: 'S' },
    { id: 'usr-3', name: 'Mike Chen', email: 'mike@college.edu', role: 'student', department: 'Computer Science', phone: '+91 98765 43212', status: 'Active', avatar: 'M' },
    { id: 'usr-4', name: 'Dr. Priya Sharma', email: 'teacher@demo.com', role: 'teacher', department: 'Computer Science', phone: '+91 98765 43213', status: 'Active', avatar: 'P' },
    { id: 'usr-5', name: 'Prof. Robert Vance', email: 'robert@college.edu', role: 'teacher', department: 'Electronics', phone: '+91 98765 43214', status: 'Active', avatar: 'R' },
    { id: 'usr-6', name: 'System Administrator', email: 'admin@demo.com', role: 'admin', department: 'IT Administration', phone: '+91 98765 43215', status: 'Active', avatar: 'A' }
];

const INITIAL_TASKS = [
    { id: 'tsk-101', title: 'Database Design Project', description: 'Design an ER diagram and normalized schema for the campus management system.', assignedTo: 'John Doe', priority: 'high', deadline: '2026-08-30', status: 'in-progress', category: 'Assignment' },
    { id: 'tsk-102', title: 'Frontend UI Implementation', description: 'Build the responsive login and dashboard UI using Bootstrap 5 and modern CSS.', assignedTo: 'Sarah Lee', priority: 'medium', deadline: '2026-09-05', status: 'pending', category: 'Lab Task' },
    { id: 'tsk-103', title: 'REST API Authentication Test', description: 'Test endpoint security and JWT token rotation for user auth.', assignedTo: 'Mike Chen', priority: 'low', deadline: '2026-09-12', status: 'completed', category: 'Project' },
    { id: 'tsk-104', title: 'AI & Data Science Assignment 2', description: 'Train a regression model on student performance dataset and write report.', assignedTo: 'John Doe', priority: 'high', deadline: '2026-09-02', status: 'pending', category: 'Assignment' },
    { id: 'tsk-105', title: 'Computer Networks Lab Report', description: 'Submit Wireshark packet capture analysis report.', assignedTo: 'Sarah Lee', priority: 'medium', deadline: '2026-08-28', status: 'completed', category: 'Lab Task' }
];

const INITIAL_RESOURCES = [
    { id: 'res-1', name: 'Classroom 101', type: 'Classroom', capacity: '40 seats', location: 'Building A, 1st Floor', status: 'available', icon: 'fa-chalkboard-user' },
    { id: 'res-2', name: 'Classroom 102', type: 'Classroom', capacity: '35 seats', location: 'Building A, 1st Floor', status: 'booked', icon: 'fa-chalkboard' },
    { id: 'res-3', name: 'Computer Lab 1', type: 'Computer Lab', capacity: '30 systems', location: 'Building B, 2nd Floor', status: 'available', icon: 'fa-laptop-code' },
    { id: 'res-4', name: 'Computer Lab 2', type: 'Computer Lab', capacity: '25 systems', location: 'Building B, 2nd Floor', status: 'maintenance', icon: 'fa-desktop' },
    { id: 'res-5', name: 'Advanced Science Lab', type: 'Science Lab', capacity: '20 workbenches', location: 'Science Wing', status: 'available', icon: 'fa-flask' },
    { id: 'res-6', name: 'Main Seminar Hall', type: 'Seminar Hall', capacity: '120 seats', location: 'Auditorium Block', status: 'booked', icon: 'fa-display' }
];

const INITIAL_NOTICES = [
    { id: 'not-1', title: '📢 Mid-Term Examination Schedule Released', content: 'The mid-term exams for all departments will commence from September 15, 2026. Detailed timetables are uploaded on the student portal.', category: 'exam', date: '2 hours ago', pinned: true, postedBy: 'Dr. Priya Sharma' },
    { id: 'not-2', title: '💻 Server Maintenance & Network Upgrade', content: 'Campus Wi-Fi and Computer Lab 2 systems will undergo scheduled maintenance this Saturday from 10:00 AM to 4:00 PM.', category: 'maintenance', date: 'Yesterday', pinned: false, postedBy: 'System Administrator' },
    { id: 'not-3', title: '🏆 Annual Campus Hackathon 2026 Registration Open', content: 'Assemble your teams of up to 4 members! Cash prizes up to $5,000 for top solutions. Deadline: Sept 10.', category: 'event', date: '3 days ago', pinned: true, postedBy: 'Prof. Robert Vance' },
    { id: 'not-4', title: '📅 Foundation Day Holiday Notice', content: 'The campus will remain closed on September 2, 2026 in observance of Campus Foundation Day.', category: 'general', date: '5 days ago', pinned: false, postedBy: 'System Administrator' }
];

const INITIAL_BOOKINGS = [
    { id: 'bk-1', resourceName: 'Classroom 102', bookedBy: 'Dr. Priya Sharma', date: '2026-08-26', timeSlot: '10:00 AM - 12:00 PM', purpose: 'Guest Lecture' },
    { id: 'bk-2', resourceName: 'Main Seminar Hall', bookedBy: 'Prof. Robert Vance', date: '2026-08-27', timeSlot: '02:00 PM - 05:00 PM', purpose: 'Department Workshop' }
];

const INITIAL_LOGS = [
    { id: 'log-1', timestamp: '2026-08-25 10:30 AM', user: 'Dr. Priya Sharma', action: 'Assigned Task "Database Design Project" to John Doe', type: 'Task' },
    { id: 'log-2', timestamp: '2026-08-25 11:15 AM', user: 'John Doe', action: 'Logged into Student Dashboard', type: 'Auth' },
    { id: 'log-3', timestamp: '2026-08-25 01:00 PM', user: 'Prof. Robert Vance', action: 'Booked Main Seminar Hall for Aug 27', type: 'Resource' }
];
