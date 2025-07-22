# Architecture Overview: Revamped E-Learning Platform

**Project Type**: Full-Stack Web App\
**Stack**: Next.js (App Router), Prisma + NeonDB, TailwindCSS, shadcn/ui, BetterAuth, Vercel (Free Tier)

---

## 1. Goals & Design Principles

- Build a modern, performant, free-tier e-learning app
- Optimize for clean developer experience (DX)
- Use current-gen frameworks (Next.js App Router, PWA)
- Prioritize role-based access, offline support, and UI delight

---

## 2. System Overview

### 🌐 Frontend

- **Framework**: Next.js App Router
- **Styling**: TailwindCSS + shadcn/ui + Framer Motion
- **Routing**: Nested layouts based on user role (`/dashboard/student`, `/dashboard/lecturer`, etc.)
- **UI**: Component-based with responsive layout and offline-ready via PWA

### ⚙️ Backend Logic

- **API Functions**: Next.js Server Actions + route handlers (REST-like)
- **Validation**: Zod
- **Authentication**: BetterAuth (email/password or magic link)
- **Session**: JWT via cookies with middleware protection per role

### 🔐 Authorization Flow

- Role-based redirects after login
- Middleware for protected routes
- `lib/roles.ts` for role mapping and auth guards

### 🧬 Database

- **ORM**: Prisma
- **DB**: NeonDB PostgreSQL (free tier)
- **Schema Domains**: `User`, `Course`, `Assignment`, `Submission`, `Material`, `XPLog`, `Enrollment`

---

## 3. Folder Structure Plan

```
/app
  /dashboard/[role]
  /courses/[id]
  /assignments/[id]
  /api/[entity]/route.ts
/lib
/components
/prisma
/types
/public
```

---

## 4. Data Flow & Component Mapping

| View               | Data Source            | Components                                                           |
| ------------------ | ---------------------- | -------------------------------------------------------------------- |
| Student Dashboard  | Enrollment, XPLog      | `<CourseList />`, `<XPBar />`, `<UpcomingAssignments />`             |
| Course Detail      | Course, Material       | `<CourseHeader />`, `<MaterialList />`, `<DiscussionPanel />`        |
| Assignment View    | Assignment, Submission | `<AssignmentDetail />`, `<SubmissionEditor />`, `<StatusPanel />`    |
| Lecturer Dashboard | Course, Submission     | `<LecturerCourseCard />`, `<GradingPanel />`, `<PraiseWall />`       |
| Admin Dashboard    | User, Course           | `<ProvisioningTool />`, `<UserManagementTable />`, `<SystemStats />` |

---

## 5. Offline & PWA Support

- **Tool**: `next-pwa`
- Service worker handles page caching, assignment drafts
- `localStorage` for unsaved form input

---

## 6. Dev Setup Guide

```bash
pnpm install
cp .env.example .env.local # Add BetterAuth + NeonDB credentials
npx prisma db push
npx prisma db seed
pnpm dev
```

---

## 7. Deployment

- **Host**: Vercel (free tier)
- **CI/CD**: GitHub Actions (build + preview deploy)
- **Domain**: Optional custom via Vercel UI

---

## 8. Future Considerations

- Add push notifications (optional)
- Add dark/light theme toggle (shadcn ready)
- Add admin metrics and monitoring panel

---

**Maintainer**: Alex (Architect)\
**Last Updated**: July 22, 2025

