# CodeAi

A modern web application built with Next.js 14, featuring AI-powered code assistance and a beautiful UI.

## Features

- 🚀 Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🔐 Clerk Authentication
- 🤖 AI-powered code assistance
- 📱 Responsive design
- 🌙 Dark mode support
- 🎯 TypeScript support
- 🔍 Code syntax highlighting
- 📝 Markdown support


## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **UI Components**: Radix UI
- **State Management**: React Query
- **Code Highlighting**: React Syntax Highlighter
- **Markdown**: React Markdown
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Query](https://tanstack.com/query/latest)

- ## Getting Started

1. Clone the repository:
```bash
git clone [https://github.com/Amitpallai/CodeAi]
cd CodeAi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
CodeAi/
├── app/                 # Next.js app directory
├── components/          # React components
├── public/             # Static assets
├── styles/             # Global styles
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

