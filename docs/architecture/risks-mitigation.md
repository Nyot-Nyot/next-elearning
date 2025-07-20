# Risks & Mitigation

- 🔸 **Over-complex data model (if using Firebase)** → Mitigate via strict data structure validation
- 🔸 **Role leaks in auth** → Enforce server-side access rules & route guards
- 🔸 **Slow queries (calendar/dashboard)** → Indexing, denormalized views, caching
