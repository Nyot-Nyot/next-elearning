**Product Requirements Document (PRD): Revamped E-Learning Platform**

**Document Owner:** John (Product Manager)  
**Last Updated:** July 22, 2025

---

### 1. Product Summary
This project aims to rebuild the university e-learning platform as a side project for learning full-stack development. The product will focus on delivering a fast, clean, and user-friendly experience for students, lecturers, and administrators, including motivational and quality-of-life enhancements missing from the original.

### 2. Goals & Objectives
- Replace current e-learning with a faster, more usable alternative
- Practice full-stack app development using modern tech
- Support three user roles: Student, Lecturer, Administrator
- Keep infrastructure costs at zero (free-tier usage only)

### 3. Functional Requirements (FRs)
- User authentication with role-based access (Student, Lecturer, Admin)
- Student dashboard with course, assignment, calendar, and XP views
- Lecturer dashboard to manage courses, materials, assignments, and grading
- Admin dashboard to provision semesters, manage enrollment, and assign roles
- Material upload (PDFs, links, markdown)
- Assignment creation and submission with autosave
- XP tracking system based on user activity
- Praise Wall functionality
- Command bar and keyboard shortcuts for navigation

### 4. Non-Functional Requirements (NFRs)
- Load time under 1.5s on 3G
- Responsive design across devices
- Progressive Web App (PWA) with offline capability
- Accessible (WCAG AA compliance)
- Supports at least 3 concurrent users under free-tier constraints

### 5. Key Use Cases
- Students can join courses, view materials, submit assignments, and track progress
- Lecturers can create assignments, upload materials, grade submissions, and manage courses
- Administrators can provision courses, assign students, and oversee system-wide activity

### 6. Features by Role

#### A. Students
- Course list (auto-populated from admin backend)
- Material viewer (PDF, links, notes)
- Assignment submission with autosave
- Calendar of due dates and classes
- XP system for engagement
- Notifications panel

#### B. Lecturers
- Course management (title, semester, visibility)
- Assignment creation and grading
- Material uploads
- Top Student tagging
- Discussion moderation

#### C. Administrators
- Semester and course provisioning
- KRS-based student enrollment
- System metrics dashboard
- User role assignment

### 7. Epics & Stories

#### Epic 1: Authentication & Authorization
Enable secure, role-based access for all user types.
- Story: As a user, I can register and log in using BetterAuth
- Story: As a user, I am redirected based on my role after login
- Story: As an admin, I can assign or change user roles

#### Epic 2: Student Learning Experience
Design a smooth and motivating academic experience for students.
- Story: As a student, I can view my semester courses
- Story: As a student, I can access and read course materials
- Story: As a student, I can submit assignments with autosave
- Story: As a student, I can see upcoming due dates in a calendar
- Story: As a student, I can view XP and get recognition for activity

#### Epic 3: Lecturer Course Management
Give lecturers powerful tools to manage teaching activities.
- Story: As a lecturer, I can create and manage courses and assignments
- Story: As a lecturer, I can upload materials to a course
- Story: As a lecturer, I can grade student submissions
- Story: As a lecturer, I can tag students for praise visibility

#### Epic 4: Administrative Control
Provide system-wide operational control through admin tools.
- Story: As an admin, I can provision semesters and courses
- Story: As an admin, I can enroll students after KRS approval
- Story: As an admin, I can view system metrics and user activity

#### Epic 5: Productivity & UX Enhancements
Deliver delightful UX with offline functionality and fast navigation.
- Story: As a user, I can use a command bar to navigate quickly
- Story: As a user, I can use keyboard shortcuts to speed up actions
- Story: As a user, I can work offline and sync drafts automatically

### 8. Tech Stack & Constraints
- **Frontend:** Next.js, TailwindCSS, shadcn/ui, Framer Motion
- **Backend:** Prisma, NeonDB PostgreSQL (free tier), Server Actions
- **Auth:** BetterAuth
- **Infra:** Vercel (free), GitHub Actions, Next-PWA

### 9. Milestones & Timeline (MVP Target: 8 weeks)
1. Auth & Layout Setup (Week 1)
2. Course + User Models (Week 2)
3. Student Dashboard + Course Viewer (Week 3)
4. Assignment Submission Flow (Week 4)
5. Lecturer Dashboard + Grading (Week 5)
6. Admin Controls + Provisioning (Week 6)
7. XP & Praise System + Polish (Week 7)
8. Bugfix, testing, deploy (Week 8)

### 10. Open Questions
- How to simulate KRS approval logic for this project?
- Which free auth/email provider to use with BetterAuth?
- Is notifications system local-only or push-enabled?

---

**Status:** Draft  
**Next Step:** Finalize open questions and prepare wireframes

