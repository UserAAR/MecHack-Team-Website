# Qarabag MecHack

<div align="center">
  <img src="/logo/logo.jpg" alt="Qarabag MecHack Logo" width="200" height="200" style="border-radius: 50%;" />

  [![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.2.13-0055FF)](https://www.framer.com/motion/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

  *Empowering youth through robotics, innovation, and community engagement*
</div>

## 🌟 About

**Qarabag MecHack** is the official website for FIRST Robotics Competition Team from Qarabag region. We are dedicated to inspiring and empowering youth through robotics education, STEM innovation, and community service. Our mission is to prepare the next generation of engineers, leaders, and problem-solvers for tomorrow's challenges.

## ✨ Features

### 🚀 Core Functionality
- **Modern Web Design**: Responsive, mobile-first design with smooth animations
- **Multi-language Support**: English, Azerbaijani (Azərbaycan), and Russian
- **Dynamic Content**: Real-time updates for news, events, and achievements
- **Interactive Programs**: Detailed information about FLL, FTC, and FRC programs
- **Community Engagement**: News updates, sponsor showcases, and outreach events

### 🎨 Design & UX
- **Brand Identity**: Custom color scheme with Qarabag MecHack branding
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Accessibility**: WCAG compliant design with proper ARIA labels
- **Performance**: Optimized images and lazy loading for fast page loads

### 🔧 Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **Component Library**: shadcn/ui components with custom styling
- **SEO Optimized**: Meta tags, structured data, and performance optimizations
- **PWA Ready**: Service worker support for offline functionality

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript 5** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible, unstyled UI primitives
- **Framer Motion** - Animation library

### Internationalization
- **next-intl 4** - Internationalization framework
- **Multi-language Support**: EN, AZ, RU

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm/bun)
- **Git** >= 2.30.0

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/qarabag-mechack-website.git
cd qarabag-mechack-website
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
qarabag-mechack-website/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Dynamic locale routes
│   │   ├── layout.tsx     # Root layout with locale
│   │   └── page.tsx       # Home page
│   ├── favicon.ico        # Site favicon
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── shared/           # Shared components
│   │   ├── BrandButton.tsx
│   │   ├── FeatureCard.tsx
│   │   └── SectionHeader.tsx
│   └── ui/               # UI components (shadcn/ui)
├── i18n/                 # Internationalization
│   └── request.ts        # i18n configuration
├── lib/                  # Utility libraries
│   └── utils.ts          # Helper functions
├── messages/             # Translation files
│   ├── en.json          # English translations
│   ├── az.json          # Azerbaijani translations
│   └── ru.json          # Russian translations
├── public/               # Static assets
│   ├── intro/           # Video assets
│   ├── logo/            # Logo files
│   ├── news/            # News images
│   ├── rules/           # Documentation
│   └── sponsors/        # Sponsor logos
├── styles/              # Additional styles
├── middleware.ts        # Next.js middleware
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## ⚙️ Configuration

### Internationalization Setup

The project uses `next-intl` for internationalization. Language files are located in the `messages/` directory:

- `en.json` - English translations
- `az.json` - Azerbaijani translations  
- `ru.json` - Russian translations

To add a new language:
1. Create a new JSON file in `messages/`
2. Update the `middleware.ts` to include the new locale
3. Add translations for all keys

### Styling Configuration

The project uses Tailwind CSS with custom brand colors defined in CSS variables:

```css
:root {
  --color-brand-cream: #f5f2e1;
  --color-brand-navy: #000080;
  --color-brand-gold: #e38d1a;
}
```

### Component Library

UI components are built using shadcn/ui. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Code Quality
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/qarabag-mechack-website.git`
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes
5. **Test** thoroughly
6. **Commit** with descriptive messages: `git commit -m "Add: feature description"`
7. **Push** to your branch: `git push origin feature/your-feature-name`
8. **Create** a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use descriptive component and variable names
- Write meaningful commit messages
- Ensure all tests pass
- Follow the existing code style

### Content Updates
- News articles should be added to the `newsItems` array in `app/[locale]/page.tsx`
- Sponsor logos should be placed in `public/sponsors/`
- Team photos should be placed in `public/news/`

## 📊 Performance

The website is optimized for performance with:
- **Next.js Image Optimization**: Automatic image optimization and lazy loading
- **Code Splitting**: Automatic code splitting for faster page loads
- **CSS Optimization**: Tailwind CSS purging and minification
- **Font Optimization**: Next.js automatic font optimization
- **Bundle Analysis**: Built-in bundle analyzer support

## 🔧 Customization

### Brand Colors
Update brand colors in `app/globals.css`:

```css
:root {
  --color-brand-cream: #your-color;
  --color-brand-navy: #your-color;
  --color-brand-gold: #your-color;
}
```

### Adding New Programs
Add new robotics programs to the `programs` array in `app/[locale]/page.tsx`:

```typescript
{
  key: "new-program",
  title: "New Program Name",
  age: "Age Range",
  color: "#hex-color",
  link: "https://program-website.com",
  tag: "TAG",
  description: "Program description"
}
```

### Content Management
All content is managed through the main page component. Update:
- Hero section text
- Mission statements
- News items
- Sponsor information

## 📞 Support & Contact

- **Email**: info@qarabagmechack.org
- **Website**: [qarabagmechack.org](https://qarabagmechack.org)
- **Social Media**: 
  - Instagram: [@qarabagmechack](https://instagram.com/qarabagmechack)
  - YouTube: [Qarabag MecHack](https://youtube.com/@qarabagmechack)
  - GitHub: [qarabag-mechack](https://github.com/qarabag-mechack)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Sponsors & Partners
We gratefully acknowledge the support of our sponsors and partners:
- **BMU** (Bundesministerium für Umwelt)
- **UNEC** (Azerbaijan State University of Economics)
- **YAŞAT Foundation**
- **Gençlər İdman Nazirliyi**
- **Azercell**

### Technologies & Tools
- **FIRST Robotics** for the inspiration and framework
- **Vercel** for hosting and deployment
- **shadcn/ui** for the beautiful component library
- **Framer** for the animation library

### Community
Special thanks to:
- Our mentors and coaches
- Team members and families
- Local community supporters
- FIRST Robotics volunteers

---

<div align="center">
  <p>Made with ❤️ by Qarabag MecHack Robotics Team</p>
  <p>
    <a href="#qarabag-mechack">Home</a> •
    <a href="#about">About</a> •
    <a href="#programs">Programs</a> •
    <a href="#news">News</a>
  </p>
</div>
