# Cybersecurity Portfolio - Emilio Ogega

A professional cybersecurity portfolio built with security-first principles. Features real-time GitHub integration and a clean, modern light theme.

## Tech Stack

- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **GitHub API** for dynamic project loading

## Features

- ✅ Real-time GitHub repository integration
- ✅ Light mode design for professional presentation
- ✅ Zero external dependencies for tracking/analytics
- ✅ No dynamic HTML injection
- ✅ Static, auditable codebase
- ✅ Minimal attack surface
- ✅ Full TypeScript type safety
- ✅ Responsive design
- ✅ Accessible navigation

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Configuration

1. Update your GitHub username in [src/components/Projects.tsx](src/components/Projects.tsx#L31):
   ```typescript
   const GITHUB_USERNAME = 'your-github-username';
   ```

2. Update your social links in:
   - [src/components/Header.tsx](src/components/Header.tsx)
   - [src/components/Footer.tsx](src/components/Footer.tsx)

3. Update your email address throughout the components

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://www.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Click "Deploy site"

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

### Deploy to GitHub Pages

```bash
npm install -g gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

## GitHub API Rate Limits

The portfolio fetches repositories using the GitHub API. Without authentication:
- 60 requests per hour per IP

To increase the limit:
1. Create a GitHub Personal Access Token (no scopes needed for public repos)
2. Create a `.env` file (copy from `.env.example`)
3. Add: `VITE_GITHUB_TOKEN=your_token_here`

## Customization

### Update Personal Information

- Name: Update in [src/components/Hero.tsx](src/components/Hero.tsx), [src/components/Header.tsx](src/components/Header.tsx), and [src/components/Footer.tsx](src/components/Footer.tsx)
- Skills: Modify in [src/components/Hero.tsx](src/components/Hero.tsx)
- Blog articles: Update in [src/components/Blog.tsx](src/components/Blog.tsx)

### Theme Colors

All colors are defined using Tailwind CSS classes. Main colors:
- Background: `bg-white`, `bg-gray-50`
- Text: `text-gray-900`, `text-gray-600`
- Borders: `border-gray-200`, `border-gray-300`
- Accents: `bg-gray-900`, `hover:bg-gray-800`

## Security

This project follows security best practices:

- No user input processing
- No cookies or localStorage
- No third-party analytics
- Static assets only
- Regular dependency audits

Run security audit:

```bash
npm audit
```

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── Header.tsx      (Navigation bar)
│   │   ├── Hero.tsx        (Hero section with name/skills)
│   │   ├── Projects.tsx    (GitHub repos integration)
│   │   ├── Blog.tsx        (Blog articles)
│   │   └── Footer.tsx      (Footer with links)
│   ├── App.tsx             (Main app component)
│   ├── main.tsx            (Entry point)
│   └── index.css           (Global styles)
├── index.html
├── package.json
├── netlify.toml            (Netlify config)
├── vercel.json             (Vercel config)
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Maintenance

- Update dependencies quarterly
- Run `npm audit` regularly
- Review and update blog content
- Verify all external links
- Keep GitHub repositories updated

## License

MIT

---

**Built by Emilio Ogega** | Cybersecurity Professional
