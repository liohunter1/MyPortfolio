# 📘 Development Guide

## 1. Purpose
This document explains how the cybersecurity portfolio is built, structured, secured, and maintained from a **development and engineering perspective**. It is written to demonstrate professional software discipline, not just frontend skills.

---

## 2. Tech Stack

- **Framework**: React (TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Build Tool**: Vite
- **Deployment**: Netlify / Vercel / GitHub Pages

Design choice rationale:
- Minimal dependencies → reduced attack surface
- Static frontend → no backend risk
- TypeScript → safer refactors and clearer intent

---

## 3. Project Structure

```
/
├── App.tsx
├── main.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Projects.tsx
│   ├── Blog.tsx
│   └── Footer.tsx
├── index.html
├── tailwind.config.js
└── package.json
```

Principles:
- Flat, readable structure
- One responsibility per component
- No hidden magic or over-abstraction

---

## 4. Application Flow

1. `main.tsx` mounts the React app
2. `App.tsx` orchestrates layout and navigation
3. Header controls scroll-based navigation
4. Each section renders static, controlled data

No runtime data fetching = no external trust dependency.

---

## 5. State Management

- Local component state only
- `activeSection` used for navigation highlighting
- No global state library (Redux, Zustand) by design

Reason: simplicity, auditability, predictability.

---

## 6. Security Considerations

- No dynamic HTML injection
- No `dangerouslySetInnerHTML`
- No user input processing
- No cookies or localStorage usage

This eliminates entire vulnerability classes:
- XSS
- CSRF
- Injection

---

## 7. Dependency Security

Required practices:
```bash
npm audit
npm audit fix
```

Rules:
- No analytics SDKs
- No tracking scripts
- No abandoned libraries

---

## 8. Build & Release

```bash
npm install
npm run dev
npm run build
```

- Production build outputs static assets
- Assets are immutable and cache-safe

---

## 9. Maintenance Rules

- Update dependencies quarterly
- Remove outdated projects
- Treat documentation as part of the codebase

---

---

# 📊 Data Source Guide

## 1. Data Philosophy

This portfolio intentionally uses **local, static data**.

Why:
- Eliminates supply-chain runtime risk
- Prevents third-party tracking
- Improves reliability and privacy

---

## 2. Data Locations

| Data Type | File |
|---------|------|
| Projects | `Projects.tsx` |
| Articles | `Blog.tsx` |
| Skills | `Hero.tsx` |
| Social Links | `Hero.tsx`, `Footer.tsx` |

---

## 3. Project Data Model

```ts
{
  id: number,
  title: string,
  description: string,
  tech: string[],
  icon: LucideIcon,
  github: string | null,
  demo: string | null
}
```

Security expectations:
- GitHub links only
- No URL shorteners
- No inline scripts or embeds

---

## 4. Blog Data Model

```ts
{
  id: number,
  title: string,
  excerpt: string,
  date: string,
  readTime: string,
  category: string
}
```

Rules:
- ISO date format
- No HTML in excerpts
- Content must be reproducible

---

## 5. Content Integrity

- All content is version-controlled
- Changes are auditable via Git
- No CMS → no admin attack surface

---

## 6. Optional Extensions (Documented Only)

If dynamic content is later introduced:
- Read-only APIs only
- Strict CSP
- No client-side secrets

---

---

# 🎨 UI & UX Guide

## 1. Design Intent

This UI is designed to signal:
- Professional restraint
- Security awareness
- Technical seriousness

It avoids trends that reduce credibility.

---

## 2. Color System

| Purpose | Color |
|------|------|
| Background | `#0a0a0a` |
| Surface | `#0f0f0f` |
| Border | `#1a1a1a` |
| Hover Border | `#2a2a2a` |
| Primary Text | `#ffffff` |
| Secondary Text | `#a0a0a0` |

No gradients. No neon. No visual noise.

---

## 3. Typography

- Default sans-serif
- Monospace for technical emphasis
- Semantic HTML sizing only

Reason: accessibility and predictability.

---

## 4. Layout Rules

- Max width: `max-w-7xl`
- Generous padding (`px-6 py-24`)
- Grid-based layouts only

Avoid:
- Masonry layouts
- Parallax
- Over-animations

---

## 5. Interaction Design

- Hover = border change only
- No motion distractions
- Focus visible for keyboard users

---

## 6. Accessibility Baseline

- Semantic HTML
- ARIA labels on icons
- Sufficient color contrast
- Keyboard navigation supported

---

## 7. Performance

- No images required
- No external fonts
- Minimal JavaScript execution

---

## 8. UI Do / Don’t

Do:
- Keep content factual
- Keep spacing consistent
- Keep language professional

Don’t:
- Add gimmicks
- Add animations for style
- Add marketing fluff

---

## 9. UI Review Checklist

- [ ] Clean on mobile
- [ ] Readable on low brightness
- [ ] No broken layouts
- [ ] Consistent spacing

---

**Version**: 1.0
**Status**: Production-ready

