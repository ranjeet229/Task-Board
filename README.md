# Task Board

A production-quality Task Board application with static login, drag-and-drop columns, and localStorage persistence.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Zustand** for state
- **React Hook Form** + **Zod** for forms and validation
- **@dnd-kit** for drag and drop
- **React Router** for routing
- **Vitest** + **React Testing Library** for tests

## Features

- **Auth**: Login at `/login` with demo credentials; optional “Remember me” (localStorage vs sessionStorage); protected `/board`
- **Board**: Three columns — Todo, Doing, Done
- **Tasks**: Create, edit, delete with validation; priority, due date, tags
- **Drag & drop**: Move tasks between columns; state persists
- **Search**: By title (case-insensitive)
- **Filter**: By priority
- **Sort**: By due date (tasks without due date last)
- **Activity log**: Last 10 actions, persisted
- **Reset board**: Confirmation modal, clears tasks and activity

## Demo credentials

- **Email:** `intern@demo.com`
- **Password:** `intern123`

## Scripts

```bash
npm install
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
npm run test     # watch mode
npm run test:run # single run
```

## Deployment

- **Vercel**: Connect the repo; build command `npm run build`, output directory `dist`.
- **Netlify**: Build command `npm run build`, publish directory `dist`. SPA redirects are in `netlify.toml`.

## Project structure

```
src/
├── features/
│   ├── auth/        # login, schemas, constants
│   ├── board/       # BoardPage, Column
│   ├── tasks/       # TaskCard, TaskFormModal, schemas
│   └── activity/    # ActivityPanel
├── components/      # Button, FormInput, Modal
├── routes/          # ProtectedRoute
├── store/           # board-store (Zustand)
├── utils/           # storage, auth-storage, id
├── types/
└── test/            # setup
```

## Tests

- Login: required-field validation, invalid credentials, successful redirect
- Store: add task (state + localStorage), move task (status update + persist)
