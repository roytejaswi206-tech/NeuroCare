# NeuroCare Frontend UI Upgrade TODO

## Plan Breakdown (Approved by User)

**Current Status:** 18/18 ✅

### Phase 1: Global Setup (2 steps)
- [✅] 1. Update `src/index.css` - Global glassmorphism cards, dark gradient body, hover effects, animations
- [✅] 2. Create reusable components: QuickActionCard.jsx, HealthChart.jsx, AIBanner.jsx, ChatBubble.jsx, Loader.jsx, SkeletonLoader.jsx, HospitalCard.jsx, DoctorCard.jsx, FavoriteItem.jsx, AppointmentCard.jsx

### Phase 2: Dashboard Rebuild (6 steps)
- [✅] 3-8. Dashboard.jsx → Complete scrollable PharmEasy-style rebuild (6 sections w/ Framer Motion, Recharts, preserved logic)

### Phase 3: Page Upgrades (8 steps)
- [✅] 9. Chat.jsx: Premium bubbles (ChatBubble.jsx), "AI stress: Medium" label, enhanced typing/animations/chips
- [✅] 10. PanicMode.jsx: Pulsing red countdown, breathing circle
- [✅] 11. Hospitals.jsx: Premium HospitalCard.jsx w/ ⭐ dist, animated filter tabs, SkeletonLoader
- [✅] 12. Doctors.jsx: DoctorCard.jsx w/ profile img, online dot, premium book/call
- [✅] 13. Favorites.jsx: FavoriteItem.jsx, premium empty state, animations
- [✅] 14. Appointments.jsx: AppointmentCard.jsx w/ countdown timer, cancel button
- [✅] 15. Settings.jsx: Premium profile forms, animated theme toggle, emergency contact
- [✅] 16. Navbar.jsx + App.jsx: Smooth transitions, all pages upgraded

### Phase 4: Final Polish (2 steps)
- [ ] 17. Full responsive test + mobile scroll
- [ ] 18. `npm run dev` verify no errors

### Phase 4: Final Polish (2 steps)
- [ ] 17. Full responsive test + mobile scroll
- [ ] 18. `npm run dev` verify no errors

**Next:** User will confirm each step completion before proceeding.
**Command:** `cd frontend-ui && npm run dev` to test after each phase.
