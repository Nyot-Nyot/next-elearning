# Data Flow

1. User logs in → JWT issued → Role-based route loads (Next.js middleware)
2. Student dashboard → Fetch assignments, classes, progress from backend
3. File upload → Supabase/Firebase storage with URL returned to DB
4. Submission → Student submits → DB triggers update, notifies lecturer
5. Lecturer grades → Submission updated → Student gets real-time update
