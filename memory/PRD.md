# CyberCopilote TPME - PRD

## Problem Statement
Build a production-ready, mobile-first French web app called "CyberCopilote TPME", an autonomous AI cybersecurity assistant for freelancers, solo founders, self-employed workers, and very small businesses with little or no cybersecurity knowledge.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui (client-side app)
- **Backend**: FastAPI (minimal - only for AI chat proxy)
- **Storage**: 100% client-side (localStorage)
- **AI**: Gemini 3 Flash via emergentintegrations (EMERGENT_LLM_KEY)
- **PWA**: Installable via manifest.json

## User Personas
- Freelancers / Auto-entrepreneurs
- Solo consultants / Coaches
- Local shop owners
- Therapists / Liberal professionals
- Small businesses (1-5 people)

## Core Requirements
- French-language UI throughout
- No account required (guest mode)
- Local-first data storage
- Free-only tools and recommendations
- Non-technical, reassuring tone
- Mobile-first responsive design

## What's Been Implemented (Feb 2026)
- [x] Landing page with hero, CTA, how-it-works, trust signals
- [x] 16-question guided diagnostic wizard with conditional questions
- [x] Cyber hygiene score calculation (7 categories, 0-100)
- [x] Dashboard with score card, category breakdown, quick stats
- [x] Personalized action plan with tasks by period (today/week/month/recurring)
- [x] Task management (done/postponed/skipped with step-by-step instructions)
- [x] AI chat assistant (Gemini 3 Flash, French, cybersecurity context)
- [x] Emergency mode (7 emergency flows with detailed step-by-step guides)
- [x] Learning center (7 educational cards)
- [x] Settings (reminder toggles, JSON export/import, data reset)
- [x] Privacy and disclaimer page
- [x] Bottom navigation
- [x] PWA manifest
- [x] Auto-advance wizard for single-choice questions
- [x] Score recalculation on task completion
- [x] JWT Authentication (email/password login + registration)
- [x] Bearer token auth (stored in localStorage, auto-refresh)
- [x] Multi-email monitoring (add/remove/check up to 10 emails)
- [x] Email breach checking (known breach database + HIBP Pwned Passwords k-anonymity)
- [x] Domain security analysis (DNS/MX/SPF/DKIM/DMARC/SSL checks with scoring)
- [x] Password breach checking (HIBP Pwned Passwords API + strength analysis)
- [x] Security Monitor page with 3 tabs (Emails, Domaine, Mot de passe)
- [x] Brute force protection on login
- [x] Admin seed on startup
- [x] User data sync (diagnostic/scores/plan stored in MongoDB)

## Prioritized Backlog

### P0 (Critical)
- All core features implemented

### P1 (High)
- Service worker for full offline PWA support
- Browser push notification integration for reminders
- Score history/trend chart over time
- Animated score gauge with celebration on improvement

### P2 (Medium)
- Dark mode toggle
- Accessible font size control
- More diagnostic questions for deeper analysis
- Print/PDF export of action plan
- Reminder scheduling with specific dates

### P3 (Low)
- Multi-language support
- Share results as an image
- Community tips section
- Integration with haveibeenpwned API for email breach check

## Next Tasks
1. Add service worker for offline capability
2. Implement score trend history (store snapshots per month)
3. Add browser notification API for reminders
4. Improve mobile touch interactions and animations
5. Add onboarding tutorial overlay for first-time users
