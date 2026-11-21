# ⚡ TaskFlow – Smart Project Management Application

TaskFlow is a modern, responsive **project management application** built with pure **HTML5, CSS3 and JavaScript (ES6+)** — no frameworks. It helps individuals and teams organise projects, manage daily tasks, set priorities, track deadlines and monitor productivity through an interactive Kanban dashboard.

> 💾 All data is persisted in the browser using the **Local Storage API** — no backend required.

![Tech](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![Tech](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Tech](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)

---

## 🎯 Project Aim

The aim of TaskFlow is to demonstrate strong **JavaScript fundamentals** in a real-world application: DOM manipulation, event handling, array methods, the Drag & Drop API, Local Storage, and modular, reusable code — a perfect portfolio project for JavaScript Developer interviews.

---

## ✨ Features

### 📊 Dashboard
- Total Projects / Total Tasks / Completed / In-Progress / To-Do / Overdue counters
- Animated task-completion percentage ring
- **Chart.js** analytics: tasks by status (doughnut) and by priority (bar)
- Recent activity feed (every action is logged)

### 📁 Project Management
- Create, edit and delete projects
- Description, start date, deadline, status (Planning / Active / On Hold / Completed)
- Automatic progress bar calculated from project tasks
- Live project search

### ✅ Task Management
- Create, edit and delete tasks
- Priority levels: **Low, Medium, High, Critical**
- Due dates and descriptions
- Search + filter by keyword, priority and project

### 🏗️ Kanban Board
- Three columns: **To Do → In Progress → Completed**
- Full **HTML5 Drag & Drop** — move cards between columns to update status
- Overdue badges and completion toasts

### 📅 Calendar
- Monthly calendar view with task due dates
- Colour-coded by status, overdue tasks highlighted in red
- Previous / Next / Today navigation

### 🔔 Notifications
- Overdue task alerts
- Deadline-approaching reminders (within 2 days)
- Toast notifications for create / update / delete / complete actions

### ⚙️ Settings
- 🌙 Dark Mode / ☀️ Light Mode (persisted)
- Export all data as a JSON backup
- Danger zone: clear all application data

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling, themes, responsive layout |
| JavaScript ES6+ | All application logic |
| DOM API | Dynamic user interface |
| Local Storage | Persistent data |
| HTML5 Drag & Drop API | Kanban board |
| Chart.js (CDN) | Dashboard analytics |

---

## 🚀 Getting Started

No build tools or installation required.

1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. Done! 🎉 (Demo data loads automatically on first run.)

```bash
# or serve it locally (optional)
npx serve .
```

> **Tip:** Chart.js loads from a CDN, so an internet connection is needed for the dashboard charts. Everything else works fully offline.

---

## 🧪 How to Test

| # | Test | Expected result |
|---|---|---|
| 1 | Open the app for the first time | Demo projects & tasks load; dashboard counters populate |
| 2 | Click **+ New Project**, fill the form | Project appears in the grid; activity logged |
| 3 | Create a task, drag its card to **Completed** | Status updates, toast shows, dashboard counters change |
| 4 | Set a task due date in the past | Red *overdue* pill appears; notification badge increments |
| 5 | Use search / priority / project filters | Kanban board filters live |
| 6 | Toggle 🌙 in the topbar | Dark theme applies and persists after reload |
| 7 | Calendar page | Tasks appear on their due dates |
| 8 | Settings → Clear data | All data is wiped, fresh demo data is reloaded |

---

## 📁 Folder Structure

```text
taskflow-project-management/
│
├── index.html                  # Dashboard
│
├── pages/
│   ├── projects.html           # Project management
│   ├── tasks.html              # Kanban board
│   ├── calendar.html           # Monthly calendar
│   └── settings.html           # Themes, data & preferences
│
├── css/
│   ├── style.css               # Base layout, components, themes
│   ├── dashboard.css           # KPI cards, Kanban, calendar
│   └── responsive.css          # Tablet & mobile breakpoints
│
├── js/
│   ├── storage.js              # Local Storage data layer
│   ├── app.js                  # Shared helpers, theme, modals
│   ├── notifications.js        # Notification centre
│   ├── dashboard.js            # Dashboard logic + charts
│   ├── projects.js             # Project CRUD
│   ├── tasks.js                # Kanban + drag & drop CRUD
│   └── calendar.js             # Calendar rendering
│
├── assets/
│   ├── images/
│   └── icons/
│
├── screenshots/                # Add your app screenshots here
└── README.md
```

---

## 📸 Screenshots

> Add screenshots of the Dashboard, Kanban Board and Calendar here before publishing.

| Dashboard | Kanban Board | Calendar |
|---|---|---|
| `screenshots/dashboard.png` | `screenshots/kanban.png` | `screenshots/calendar.png` |

---

## 🧠 What This Project Demonstrates

| Concept | Where it is used |
|---|---|
| Variables, functions, arrays & objects | All modules |
| Array methods (`filter`, `map`, `find`) | Stats, search, filters |
| DOM manipulation | Every dynamic view |
| Event listeners | Forms, buttons, drag & drop |
| ES6+ (arrow fns, `const`, template strings) | Entire codebase |
| Local Storage | `js/storage.js` data layer |
| Drag & Drop API | Kanban board |
| Form validation | Create/edit modals |
| Responsive design | `css/responsive.css` |

---

## 🔮 Future Enhancements

- User accounts and authentication
- Backend API + real database (Node.js / Firebase)
- Team collaboration and task assignment
- Subtasks, checklists and file attachments
- Due-date email / push reminders
- React migration (Project 03: ShopSphere follows next)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using vanilla JavaScript. Show some ⭐ love if you find it useful!</p>
