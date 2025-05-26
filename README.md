
![Screenshot 2025-05-26 133230](https://github.com/user-attachments/assets/1c76adcd-cff2-4075-9507-23262ca8b6df)
![Screenshot 2025-05-26 202629](https://github.com/user-attachments/assets/a4a52a26-34a0-4761-802f-e0878fdb20a9)
![Screenshot 2025-05-26 203258](https://github.com/user-attachments/assets/3c63c58a-08c4-436a-b4fb-3cd10135ba33)

## 📂 Project Structure: A Deep Dive

Understanding the project structure helps with contributions and customizations:

```
code-mind-ai-bolt-clone/
├── app/                      # Main application logic
│   ├── (main)/               # Main app routes and layouts
│   │   ├── pricing/          # Pricing page
│   │   └── workspace/        # Workspace page for projects
│   ├── api/                  # API routes
│   │   ├── ai-chat/          # AI chat API endpoint
│   │   └── gen-ai-code/      # Code generation API endpoint
│   ├── ConvexClientProvider.jsx # Convex provider setup
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   ├── page.js               # Home page
│   └── provider.jsx          # Global state providers
├── components/               # Reusable UI components
│   ├── custom/               # Custom application-specific components
│   └── ui/                   # Shadcn UI components
├── configs/                  # Configuration for AI models and other settings
├── context/                  # React context for global state
├── convex/                   # Convex backend functions
│   ├── schema.js             # Database schema
│   ├── users.js              # User-related database operations
│   ├── workspace.js          # Workspace-related database operations
│   └── _generated/           # Auto-generated Convex files
├── data/                     # Static data (prompts, lookups, colors)
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── public/                   # Public assets (images, icons)
├── .env.example              # Example environment variables
├── components.json           # Shadcn UI components configuration
├── jsconfig.json             # JavaScript configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
└── tailwind.config.mjs       # Tailwind CSS configuration
```

