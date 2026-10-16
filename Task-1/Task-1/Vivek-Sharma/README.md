# TaskFlow — To-Do List

**Name:** Vivek Sharma  
**Track:** Development

## Approach

TaskFlow is a frontend-only to-do list application. It uses a clean responsive interface with browser `localStorage` for persistence, so tasks remain available after refresh without requiring a backend or database.

## Features

- Add tasks with the Enter key or Add task button
- Edit task titles, priorities, and due dates
- Delete tasks
- Mark tasks complete and restore them to pending
- Clear visual distinction between pending and completed tasks
- All, Active, and Completed filters
- Low, Medium, and High priorities
- Optional due dates with overdue indicators
- Light/dark theme toggle
- Responsive mobile and desktop layout

## Technology

- React with JavaScript source components
- Vite project configuration
- HTML/CSS/JavaScript offline entry page for direct browser preview
- Browser `localStorage`

## Setup and run

From this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The `index.html` file can also be opened directly for the offline preview.

To create a production build:

```bash
npm run build
```

## Persistence

Tasks are stored in the browser under `taskflow.tasks.v1`. The selected theme is stored under `taskflow.theme.v1`. Invalid stored task data is ignored safely.

## Deployment link

Not deployed. The project is ready for deployment to Vercel, Netlify, or GitHub Pages if required.

## Demo video

**Action required before submission:** record a 2–5 minute screen recording showing the app running and demonstrating add, edit, delete, complete/uncomplete, filters, persistence, and theme switching. Replace the placeholder below with the uploaded Drive or YouTube URL:

`VIDEO_LINK_TO_ADD`

## Screenshots

Add screenshots of the working app to a `screenshots/` folder before opening the pull request, then link them here. Recommended captures are the main task list, a completed task, and dark mode.

## Pull request details

Suggested PR title:

```text
Task-1: Vivek Sharma - Development
```

The PR description should include:

- Track: Development
- Tech used: React, JavaScript, Vite, CSS, localStorage
- Deployment link: none currently
- Video link: add the uploaded demo URL
