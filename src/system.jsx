'use client'

// Local Storage based Attendance System with Dummy Data
class AttendanceSystem {
    constructor() {
        if (typeof window !== 'undefined') {
            this.initializeDummyData();
            this.restoreSession();
        }
    }

    initializeDummyData() {
        // Initialize with dummy data if not exists
        if (typeof window === 'undefined') return;
        
        if (!localStorage.getItem('users')) {
            const users = [
                { id: 1, email: 'admin@test.com', password: 'admin123', name: 'Admin User', role: 'admin', username: 'admin' },
                { id: 2, email: 'teacher@test.com', password: 'teacher123', name: 'John Teacher', role: 'teacher', username: 'teacher' },
                { id: 3, email: 'student@test.com', password: 'student123', name: 'Jane Student', role: 'student', username: 'student', rollNo: 'S001' },
                { id: 4, email: 'student2@test.com', password: 'student123', name: 'Bob Student', role: 'student', username: 'student2', rollNo: 'S002' },
                { id: 5, email: 'student3@test.com', password: 'student123', name: 'Alice Student', role: 'student', username: 'student3', rollNo: 'S003' }
            ];
            localStorage.setItem('users', JSON.stringify(users));
        }

        if (!localStorage.getItem('courses')) {
            const courses = [
                { id: 1, code: 'CS101', name: 'Introduction to Programming', teacherId: 2 },
                { id: 2, code: 'CS202', name: 'Data Structures', teacherId: 2 },
                { id: 3, code: 'CS303', name: 'Database Systems', teacherId: 2 }
            ];
            localStorage.setItem('courses', JSON.stringify(courses));
        }

        if (!localStorage.getItem('courseStudents')) {
            const courseStudents = [
                { courseId: 1, studentId: 3 },
                { courseId: 1, studentId: 4 },
                { courseId: 1, studentId: 5 },
                { courseId: 2, studentId: 3 },
                { courseId: 2, studentId: 4 }
            ];
            localStorage.setItem('courseStudents', JSON.stringify(courseStudents));
        }

        if (!localStorage.getItem('attendance')) {
            const today = new Date().toISOString().split('T')[0];
            const attendance = [
                { id: 1, studentId: 3, courseId: 1, date: today, status: 'present' },
                { id: 2, studentId: 4, courseId: 1, date: today, status: 'present' }
            ];
            localStorage.setItem('attendance', JSON.stringify(attendance));
        }
    }

    restoreSession() {
        if (typeof window === 'undefined') return;
        
        const storedUser = sessionStorage.getItem('authUser');
        this.currentUser = storedUser ? JSON.parse(storedUser) : null;
        this.token = sessionStorage.getItem('authToken') || null;
    }

    setAuth(token, user) {
        if (typeof window === 'undefined') return;
        this.token = token;
        this.currentUser = user;
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('authUser', JSON.stringify(user));
    }

    getToken() {
        if (typeof window === 'undefined') return null;
        if (!this.token) {
            this.token = sessionStorage.getItem('authToken');
        }
        return this.token;
    }

    getCurrentUser() {
        if (typeof window === 'undefined') return null;
        if (!this.currentUser) {
            const storedUser = sessionStorage.getItem('authUser');
            this.currentUser = storedUser ? JSON.parse(storedUser) : null;
        }
        return this.currentUser;
    }

    clearAuth() {
        if (typeof window === 'undefined') return;
        this.token = null;
        this.currentUser = null;
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
    }

    async login(username, password) {
        if (typeof window === 'undefined') return { success: false, message: 'Not available on server' };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
            (u.email === username || u.username === username || u.rollNo === username) && 
            u.password === password
        );

        if (user) {
            const token = 'token_' + Date.now();
            this.setAuth(token, user);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    }

    async signup(email, password, fullName, role, rollNo) {
        if (typeof window === 'undefined') return { success: false, message: 'Not available on server' };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: users.length + 1,
            email,
            password,
            name: fullName,
            role,
            username: email.split('@')[0],
            ...(rollNo && { rollNo })
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, user: newUser };
    }

    logout() {
        this.clearAuth();
        window.location.replace('/');
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    async refreshCurrentUser() {
        return this.currentUser;
    }

    getAuthHeaders(contentType) {
        const headers = {};
        if (contentType) headers['Content-Type'] = contentType;
        return headers;
    }

    async generateQRCode(courseId, durationMinutes = 15) {
        if (typeof window === 'undefined') return { ok: false, message: 'Not available on server' };
        
        const user = this.getCurrentUser();
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.code === courseId || c.id === courseId);
        
        if (!course) {
            return { ok: false, message: 'Course not found' };
        }

        const today = new Date().toISOString().split('T')[0];
        const expiresAt = Date.now() + (durationMinutes * 60 * 1000);
        
        const qrData = {
            courseId: course.code,
            courseName: course.name,
            teacherId: user.id,
            teacherName: user.name,
            timestamp: Date.now(),
            expiry: expiresAt,
            date: today
        };
        
        const qrString = JSON.stringify(qrData);
        
        // Store the active QR session
        localStorage.setItem('currentQR_' + course.code, JSON.stringify({
            code: qrString,
            courseId: course.code,
            teacherId: user.id,
            expiresAt: expiresAt,
            createdAt: Date.now()
        }));
        
        // Also store in global active sessions
        const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
        activeSessions.push({
            courseId: course.code,
            courseName: course.name,
            teacherId: user.id,
            teacherName: user.name,
            expiresAt: expiresAt,
            qrCode: qrString
        });
        localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
        
        return { 
            ok: true, 
            qrString: qrString,
            session: {
                courseId: course.code,
                expiry: expiresAt
            }
        };
    }

    async getCurrentQR() {
        if (typeof window === 'undefined') return null;
        const user = this.getCurrentUser();
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        for (const course of courses) {
            const qrData = localStorage.getItem('currentQR_' + course.code);
            if (qrData) {
                const qr = JSON.parse(qrData);
                if (Date.now() <= qr.expiresAt && qr.teacherId === user.id) {
                    return { qrString: qr.code };
                } else if (Date.now() > qr.expiresAt) {
                    localStorage.removeItem('currentQR_' + course.code);
                }
            }
        }
        
        return null;
    }

    async markAttendance(qrString) {
        if (typeof window === 'undefined') return { success: false, message: 'Not available on server' };
        try {
            const qrData = JSON.parse(qrString);
            const user = this.getCurrentUser();
            const today = new Date().toISOString().split('T')[0];
            
            // Verify QR is still valid
            const storedQR = localStorage.getItem('currentQR_' + qrData.courseId);
            if (!storedQR) {
                return { success: false, message: 'QR code session has ended' };
            }
            
            const qr = JSON.parse(storedQR);
            if (Date.now() > qr.expiresAt) {
                localStorage.removeItem('currentQR_' + qrData.courseId);
                return { success: false, message: 'QR code has expired' };
            }
            
            // Check if student is enrolled in the course
            const courses = JSON.parse(localStorage.getItem('courses') || '[]');
            const course = courses.find(c => c.code === qrData.courseId);
            if (!course) {
                return { success: false, message: 'Course not found' };
            }
            
            const courseStudents = JSON.parse(localStorage.getItem('courseStudents') || '[]');
            const isEnrolled = courseStudents.some(cs => 
                cs.courseId === course.id && cs.studentId === user.id
            );
            
            if (!isEnrolled) {
                return { success: false, message: 'You are not enrolled in this course' };
            }
            
            // Check if already marked
            const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
            const existing = attendance.find(a => 
                a.studentId === user.id && 
                a.courseId === course.id && 
                a.date === today
            );

            if (existing) {
                return { success: false, message: 'Attendance already marked for today' };
            }

            // Mark attendance
            attendance.push({
                id: attendance.length + 1,
                studentId: user.id,
                courseId: course.id,
                date: today,
                status: 'present',
                timestamp: Date.now()
            });

            localStorage.setItem('attendance', JSON.stringify(attendance));
            
            return { 
                success: true, 
                message: 'Attendance marked successfully',
                course: course.name
            };
        } catch (err) {
            console.error('Error marking attendance:', err);
            return { success: false, message: 'Invalid QR code format' };
        }
    }

    async getAttendanceToday() {
        if (typeof window === 'undefined') return [];
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const today = new Date().toISOString().split('T')[0];
        return attendance.filter(a => a.date === today);
    }

    async getAttendanceMonth(month, year) {
        if (typeof window === 'undefined') return [];
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        return attendance.filter(a => {
            const date = new Date(a.date);
            return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
        });
    }

    async addStudent(name, rollNo) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.rollNo === rollNo)) {
            return { success: false, message: 'Roll number already exists' };
        }

        const newStudent = {
            id: users.length + 1,
            email: rollNo + '@student.com',
            password: 'student123',
            name,
            role: 'student',
            username: rollNo,
            rollNo
        };

        users.push(newStudent);
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, student: newStudent };
    }

    async addCourse(code, name) {
        if (typeof window === 'undefined') return { success: false };
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        if (courses.find(c => c.code === code)) {
            return { success: false, message: 'Course code already exists' };
        }

        const newCourse = {
            id: courses.length + 1,
            code,
            name,
            teacherId: null
        };

        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));
        return { success: true, course: newCourse };
    }

    // Admin methods
    async getAllStudents() {
        if (typeof window === 'undefined') return [];
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.role === 'student');
    }

    async getAllTeachers() {
        if (typeof window === 'undefined') return [];
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.role === 'teacher');
    }

    async getAllCourses() {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('courses') || '[]');
    }

    async getAllAttendance() {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('attendance') || '[]');
    }

    async deleteStudent(username) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = users.filter(u => !(u.username === username && u.role === 'student'));
        localStorage.setItem('users', JSON.stringify(filtered));
        return { success: true };
    }

    async deleteTeacher(username) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = users.filter(u => !(u.username === username && u.role === 'teacher'));
        localStorage.setItem('users', JSON.stringify(filtered));
        return { success: true };
    }

    async deleteCourse(code) {
        if (typeof window === 'undefined') return { success: false };
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const filtered = courses.filter(c => c.code !== code);
        localStorage.setItem('courses', JSON.stringify(filtered));
        return { success: true };
    }

    async addTeacher(name, username) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'Username already exists' };
        }

        const newTeacher = {
            id: users.length + 1,
            email: username + '@teacher.com',
            password: 'teacher123',
            name,
            role: 'teacher',
            username
        };

        users.push(newTeacher);
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, teacher: newTeacher };
    }

    async getUserByUsername(username) {
        if (typeof window === 'undefined') return null;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.username === username) || null;
    }

    async updateUserCourses(username, courseIds) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username);
        
        if (user) {
            user.courseIds = courseIds;
            localStorage.setItem('users', JSON.stringify(users));
            return { success: true };
        }
        return { success: false };
    }

    async assignCoursesToTeacher(teacherUsername, courseIds) {
        if (typeof window === 'undefined') return { success: false };
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const teacher = users.find(u => u.username === teacherUsername);
        
        if (!teacher) return { success: false };

        courses.forEach(course => {
            if (courseIds.includes(course.id.toString()) || courseIds.includes(course.code)) {
                course.teacherId = teacher.id;
            }
        });

        localStorage.setItem('courses', JSON.stringify(courses));
        return { success: true };
    }

    async assignStudentsToCourse(courseCode, studentUsernames) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.code === courseCode);
        
        if (!course) return { success: false };

        const courseStudents = JSON.parse(localStorage.getItem('courseStudents') || '[]');
        
        studentUsernames.forEach(username => {
            const student = users.find(u => u.username === username);
            if (student && !courseStudents.find(cs => cs.courseId === course.id && cs.studentId === student.id)) {
                courseStudents.push({
                    courseId: course.id,
                    studentId: student.id
                });
            }
        });

        localStorage.setItem('courseStudents', JSON.stringify(courseStudents));
        return { success: true };
    }

    async getAttendanceByCourse(courseId) {
        if (typeof window === 'undefined') return [];
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.code === courseId || c.id === parseInt(courseId));
        if (!course) return [];
        
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        return attendance.filter(a => a.courseId === course.id);
    }

    // Teacher methods
    async getTeacherCourses() {
        if (typeof window === 'undefined') return [];
        const user = this.getCurrentUser();
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        return courses.filter(c => c.teacherId === user.id);
    }

    async checkGlobalSession() {
        if (typeof window === 'undefined') return [];
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const sessions = [];
        const now = Date.now();
        
        // Clean up expired sessions
        courses.forEach(course => {
            const qrData = localStorage.getItem('currentQR_' + course.code);
            if (qrData) {
                const qr = JSON.parse(qrData);
                if (now > qr.expiresAt) {
                    localStorage.removeItem('currentQR_' + course.code);
                } else {
                    sessions.push({
                        courseId: course.code,
                        courseCode: course.code,
                        courseName: course.name,
                        teacherId: qr.teacherId,
                        expiresAt: qr.expiresAt
                    });
                }
            }
        });
        
        return sessions;
    }

    async markNoClass(date, courseId) {
        if (typeof window === 'undefined') return { success: false };
        const noClass = JSON.parse(localStorage.getItem('noClass') || '[]');
        noClass.push({ date, courseId, timestamp: Date.now() });
        localStorage.setItem('noClass', JSON.stringify(noClass));
        return { success: true };
    }

    async getStudentsByCourse(courseId) {
        if (typeof window === 'undefined') return [];
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.code === courseId || c.id === parseInt(courseId));
        if (!course) return [];
        
        const courseStudents = JSON.parse(localStorage.getItem('courseStudents') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const studentIds = courseStudents
            .filter(cs => cs.courseId === course.id)
            .map(cs => cs.studentId);
        
        return users.filter(u => studentIds.includes(u.id));
    }

    async markManualAttendance(courseCode, studentUsernames, date) {
        if (typeof window === 'undefined') return { success: false };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        
        const course = courses.find(c => c.code === courseCode);
        if (!course) return { success: false, message: 'Course not found' };
        
        studentUsernames.forEach(username => {
            const student = users.find(u => u.username === username);
            if (student) {
                const existing = attendance.find(a => 
                    a.studentId === student.id && 
                    a.courseId === course.id && 
                    a.date === date
                );
                
                if (!existing) {
                    attendance.push({
                        id: attendance.length + 1,
                        studentId: student.id,
                        courseId: course.id,
                        date,
                        status: 'present',
                        manual: true,
                        timestamp: Date.now()
                    });
                }
            }
        });
        
        localStorage.setItem('attendance', JSON.stringify(attendance));
        return { success: true };
    }

    // Student methods
    async getStudentCourses() {
        if (typeof window === 'undefined') return [];
        const user = this.getCurrentUser();
        const courseStudents = JSON.parse(localStorage.getItem('courseStudents') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        const courseIds = courseStudents
            .filter(cs => cs.studentId === user.id)
            .map(cs => cs.courseId);
        
        return courses.filter(c => courseIds.includes(c.id));
    }

    async getActiveSessions() {
        if (typeof window === 'undefined') return [];
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const user = this.getCurrentUser();
        const courseStudents = JSON.parse(localStorage.getItem('courseStudents') || '[]');
        const sessions = [];
        const now = Date.now();
        
        // Get student's enrolled courses
        const enrolledCourseIds = courseStudents
            .filter(cs => cs.studentId === user.id)
            .map(cs => cs.courseId);
        
        // Check for active QR sessions in enrolled courses
        courses.forEach(course => {
            if (enrolledCourseIds.includes(course.id)) {
                const qrData = localStorage.getItem('currentQR_' + course.code);
                if (qrData) {
                    const qr = JSON.parse(qrData);
                    if (now <= qr.expiresAt) {
                        sessions.push({
                            courseId: course.code,
                            courseCode: course.code,
                            courseName: course.name,
                            qrCode: qr.code,
                            expiresAt: qr.expiresAt
                        });
                    } else {
                        // Clean up expired session
                        localStorage.removeItem('currentQR_' + course.code);
                    }
                }
            }
        });
        
        return sessions;
    }

    async getMyAttendance() {
        if (typeof window === 'undefined') return [];
        const user = this.getCurrentUser();
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        return attendance.filter(a => a.studentId === user.id);
    }

    async refreshCurrentUser() {
        // For localStorage, just return current user
        return this.getCurrentUser();
    }

    async getCurrentQR() {
        if (typeof window === 'undefined') return null;
        // Check if current teacher has an active QR
        const user = this.getCurrentUser();
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        for (const course of courses) {
            const qrData = localStorage.getItem('currentQR_' + course.id);
            if (qrData) {
                const qr = JSON.parse(qrData);
                if (Date.now() <= qr.expiresAt && qr.teacherId === user.id) {
                    return { qrString: qr.code };
                }
            }
        }
        
        return null;
    }

    // Notifications (dummy - return empty)
    async getNotifications() {
        return { notifications: [] };
    }

    async getUnreadNotifications() {
        return { count: 0 };
    }

    async markNotificationRead(id) {
        return { success: true };
    }

    async markAllNotificationsRead() {
        return { success: true };
    }
}

export const system = new AttendanceSystem();