# Core Components

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
