# ⚡ Next.js Starter Template

A production-ready Next.js 15 template with TypeScript, Tailwind CSS, and modern UI components. Perfect for building modern web applications quickly and efficiently.

## 🚀 Quick Start

### Use This Template

Click the **"Use this template"** button at the top of this repository to create a new project with this template.

### Or Clone Directly

```bash
git clone https://github.com/yourusername/nextjs-starter-template.git your-project-name
cd your-project-name
npm install
npm run dev
```

### Or Use with create-next-app

```bash
npx create-next-app@latest your-project-name --example https://github.com/yourusername/nextjs-starter-template
```

## ✨ Features

### 🏗️ Core Stack
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **ESLint** for code quality
- **PostCSS** for CSS processing

### 🎨 UI Components
- **Button Component** with multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card Component** system (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Utility Functions** (cn for class name merging)
- **Responsive Design** with mobile-first approach

### 📁 Project Structure
```
├── src/
│   ├── app/                 # App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   └── ui/             # Reusable UI components
│   │       ├── button.tsx  # Button component
│   │       └── card.tsx    # Card component
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript definitions
│       └── index.ts        # Type definitions
├── public/                 # Static assets
└── Config files
```

### 🛠 Development Tools
- **Turbopack** for lightning-fast builds
- **Hot Module Replacement** for instant updates
- **SEO Optimized** metadata configuration
- **Modern CSS** with CSS variables and design tokens

## 🎯 What's Included

### UI Components
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
```

### Utility Functions
```typescript
import { cn } from '@/lib/utils'
```

### TypeScript Types
```typescript
import type { User, ApiResponse, PaginatedResponse } from '@/types'
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎨 Customization

### Colors
The template uses a modern color system with CSS variables. You can customize colors in `src/app/globals.css`.

### Fonts
The template uses Inter font by default. Change in `src/app/layout.tsx`.

### Components
Add new UI components in `src/components/ui/` following the existing pattern.

## 📚 TypeScript Support

This template includes comprehensive TypeScript types for:
- API responses
- Pagination
- Form data
- Authentication
- User profiles and more

## 🌟 Best Practices Included

- ✅ **Type Safety**: Full TypeScript support
- ✅ **Component Reusability**: Modular UI components
- ✅ **Performance**: Optimized with Turbopack
- ✅ **SEO**: Meta tags and Open Graph support
- ✅ **Accessibility**: Semantic HTML and ARIA support
- ✅ **Modern CSS**: Tailwind with design tokens
- ✅ **Code Quality**: ESLint configuration

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Other Platforms
```bash
npm run build
npm run start
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This template is MIT licensed. Feel free to use it for personal and commercial projects.

---

**Built with ❤️ using Next.js 15 + TypeScript + Tailwind CSS**
```

Now let me create a template configuration file:
