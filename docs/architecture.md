**System Architecture Specification: Kampus LMS Next**

---

**1. System Overview**
Kampus LMS Next is a role-based, modular e-learning platform built on a JAMstack architecture. The frontend is served via Next.js (React-based) with Tailwind for styling. The backend is provided via Backend-as-a-Service (Firebase or Supabase), enabling rapid development and auto-scalable infrastructure. Hosting and deployment are managed via Vercel for seamless integration with the Next.js workflow.

---

**2. Core Components**
- **Frontend (Next.js)**
  - SSR and SSG hybrid for performance and SEO
  - Dynamic routing for classes, assignments, dashboards
  - Tailwind UI components for consistent styling

- **Authentication**
  - Supabase Auth or Firebase Auth
  - Role-based redirection after login (student, lecturer, admin)
  - JWT-based session management, optionally persisted

- **Backend**
  - Supabase Functions (PostgreSQL + REST API)
  - Firebase Cloud Functions + Firestore (NoSQL)
  - Real-time listeners for updates (e.g., new grades, assignment status)

- **Database**
  - **Supabase**: Relational schema with normalized structure
  - **Firebase**: Nested collections and documents per user/class

- **File Storage**
  - Supabase Storage or Firebase Storage for assignment uploads and downloadable materials

- **Deployment**
  - Vercel (CI/CD from GitHub)
  - Environment secrets: Supabase/Firebase keys, API endpoints, runtime configs

---

**3. Entity-Relationship Overview (for Supabase)**
- **Users** (id, name, role, email, avatar)
- **Courses** (id, title, code, lecturer_id)
- **Enrollments** (student_id, course_id)
- **Assignments** (id, course_id, title, due_date, type)
- **Submissions** (id, assignment_id, student_id, file_url, submitted_at, grade, feedback)
- **CalendarEvents** (id, course_id, title, datetime, type)
- **Discussions** (id, course_id, thread_title, created_by)
- **Posts** (id, discussion_id, content, author_id, created_at)

---

**4. API Structure (Sample Endpoints)**
- `GET /api/courses` → List courses based on role
- `POST /api/assignments` → Create assignment (lecturer only)
- `POST /api/submissions` → Submit assignment
- `GET /api/submissions/:id` → Get submission with grade
- `GET /api/calendar` → Fetch calendar events (filtered by user)
- `POST /api/discussions/:id/post` → Reply to thread
- `GET /api/user/dashboard` → Aggregated dashboard data

---

**5. Data Flow**
1. User logs in → JWT issued → Role-based route loads (Next.js middleware)
2. Student dashboard → Fetch assignments, classes, progress from backend
3. File upload → Supabase/Firebase storage with URL returned to DB
4. Submission → Student submits → DB triggers update, notifies lecturer
5. Lecturer grades → Submission updated → Student gets real-time update

---

**6. Deployment Strategy**
- GitHub → Vercel CI/CD auto-deploy on `main`
- Preview branches enabled for feature testing
- Supabase DB migrations managed via CLI or dashboard
- Secrets stored in Vercel Project Settings

---

**7. Scalability & Performance**
- Use SWR for client-side data caching (Next.js)
- Enable DB row-level security for data protection
- Optimize calendar & dashboard queries with indexes
- Use edge caching and static generation where possible

---

**8. Monitoring & Logging**
- Vercel analytics for performance
- Supabase/Firebase logs for function usage
- Optional: Sentry or LogRocket for frontend error tracking

---

**9. Risks & Mitigation**
- 🔸 **Over-complex data model (if using Firebase)** → Mitigate via strict data structure validation
- 🔸 **Role leaks in auth** → Enforce server-side access rules & route guards
- 🔸 **Slow queries (calendar/dashboard)** → Indexing, denormalized views, caching

---

End of System Architecture Spec

