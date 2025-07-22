**Project Brief: Revamped E-Learning Platform**

**Overview**
This is a solo, learning-focused side project to rebuild and modernize a university e-learning platform. Inspired by the slow and poorly designed official site, the goal is to deliver a cleaner, faster, and more engaging experience for students, lecturers, and administrators — with added motivational features and a delightful UI/UX layer.

**Problem Statement**
The current campus e-learning system is slow, clunky, and visually unappealing. It lacks thoughtful user experience and modern performance standards, causing frustration for daily academic use. It also misses opportunities to engage students with motivation or clarity.

**Target Users**
- **Students**: Need a fast, clear way to manage assignments, access materials, join discussions, and track their academic life.
- **Lecturers**: Want an easy-to-use interface to manage courses, post materials, assign work, and interact with students.
- **Administrators**: Responsible for provisioning courses and student-class mappings based on academic registration data (e.g., KRS approval, payment status). Admins handle course-class linking and overall system management.

**Core Features**
- **For Students**:
  - View and join courses by semester
  - Access materials (PDFs, links, notes)
  - Submit assignments
  - Participate in discussions
  - View calendar with due dates and class events
  - Get automatic notifications
  - See progress dashboard

- **For Lecturers**:
  - Create/manage courses
  - Upload materials
  - Create assignments with deadlines
  - Grade submissions
  - Initiate/manage discussions
  - Highlight students (Top Student)

- **For Administrators**:
  - Manage semester course availability
  - Assign students to courses after academic registration (UKT, KRS approval)
  - Monitor system-wide metrics (usage, classes, submissions)
  - Basic access control and role assignment

**Enhancements / Motivational Features**
- XP System for submissions, participation, attendance
- Praise Wall: showcase top students weekly
- Command bar (ctrl+k) for quick navigation
- Keyboard shortcuts
- Offline access and autosave drafts (PWA behavior)

**Tech Stack**
- **Frontend**: Next.js (App Router), TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: Prisma + PostgreSQL via NeonDB (free tier), Server Actions
- **Auth**: BetterAuth (free tier)
- **Infra**: Vercel (deployment), GitHub CI/CD, Next-PWA (to enable offline mode)
- **Data**: TBD — potentially used for state caching, course configs, or activity logs

**Design Goals**
- Lightning fast and smooth
- Clean, spacious interface with great typography
- Mobile responsive
- Accessible (a11y friendly)
- Dark/light mode

**Out of Scope**
- Peer reviews
- Real-time messaging/chat
- Payment integrations

**Project Goals**
- Build and deploy a polished MVP
- Learn modern full-stack development
- Create a portfolio-worthy project
- Replace use of current e-learning site for personal use

**Success Criteria**
- App loads < 1.5s on slow networks
- MVP done in under 8 weeks
- Functional submission and grading flows
- Fun to use and visually impressive

---
Prepared by: Mary (BMAD Analyst)
Session: Brainstorm > Project Brief

