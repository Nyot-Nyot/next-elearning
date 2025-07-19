**Product Requirements Document (PRD): Kampus LMS Next**

---

**1. Overview**
Kampus LMS Next is a modern, student-focused learning management system for universities, designed to replace slow, outdated platforms. Built with Next.js and inspired by Notion, Duolingo, Trello, and Google Calendar, it enhances usability, engagement, and learning outcomes for students, lecturers, and administrators.

---

**2. Objectives**
- Replace the current legacy LMS with a performant, modern solution
- Provide a modular, role-based dashboard for each user type
- Enable efficient classroom workflows: assignments, grading, materials, discussions
- Incorporate gamification and intuitive UX to improve engagement
- Ensure scalability and maintainability with a clean codebase and documented features

---

**3. Target Users & Roles**
- **Students**: View materials, submit assignments, manage schedules, monitor progress
- **Lecturers**: Create and manage courses, upload materials, grade, communicate with students
- **Admins**: Manage users, configure calendars, oversee data integrity

---

**4. Key Features**
- 📚 **Class Modules**: Each course contains materials, assignments, calendar events, and discussion boards
- ✏️ **Content Editor**: Block-based content creation (inspired by Notion)
- 📅 **Dynamic Calendar**: Drag-and-drop scheduling, personalized student views
- 🏆 **Gamification Layer**: XP bars, streaks, progress dashboards (Duolingo-style)
- 🗂️ **Task Views**: Kanban for assignments (Trello-inspired)
- 💬 **Discussion Boards**: Threaded replies, emoji reactions, notifications
- 🚀 **Auto-saving Submissions**: Smart drafts, visible submission states
- 🧰 **Simplified Grading Panel**: Pre-set scoring templates, inline feedback, filters
- 🔐 **Role-Based Access**: Personalized dashboards for students, lecturers, admins

---

**5. User Stories**
- As a student, I want to view my weekly academic calendar so I can stay on track
- As a student, I want to submit assignments with auto-save and draft states
- As a lecturer, I want to reuse content blocks across classes for faster course prep
- As a lecturer, I want to filter assignment submissions by status or score
- As an admin, I want to create semester calendars with recurring events

---

**6. Non-Functional Requirements**
- Fast load time (<1s for 90% of users)
- Mobile responsive
- Role-based access controls
- Scalable backend (optional at MVP)
- GDPR-compliant data management (if deployed externally)

---

**7. Technical Stack**
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Supabase or Firebase (to be decided)
- **Database**: PostgreSQL (Supabase) or Firestore (Firebase)
- **Auth**: Supabase or Firebase Auth
- **Hosting**: Vercel or Netlify
- **Deployment**: GitHub CI/CD

---

**8. MVP Scope**
- Course creation and material upload (Lecturer)
- Student dashboard with calendar and to-dos
- Assignment creation, submission, and grading
- Discussion board per class
- Authentication and role routing
- Visual progress tracking for students

---

**9. Success Criteria**
- ✅ Fully functional MVP used in one real campus course
- ✅ >90% user tasks completed in ≤3 clicks
- ✅ Page loads under 1 second
- ✅ Positive feedback from at least 5 students and 2 lecturers
- ✅ Codebase published and documented for open-source contribution

---

**10. Future Enhancements (Post-MVP)**
- Reusable content library
- Group projects and peer grading
- Notification center and multi-channel alerts
- Admin analytics dashboard
- Mobile app or PWA version

