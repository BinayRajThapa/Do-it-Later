# 🧠 Do It Later – Task Manager App

> A beautifully crafted task management web app built with React, Redux, and SCSS for managing daily tasks, editing, deleting, prioritizing, and organizing your workflow like a beast.


---

## ✅ Features

- 🔐 **Authentication**: Sign up & login using secure localStorage
- 📝 **Create Tasks**: Add new tasks with title, description, and priority
- 🛠 **Edit Tasks**: Inline editing modal to update your task
- 🗑 **Delete Tasks**: Delete individual or multiple selected tasks
- 📦 **Drag and Drop**: Move tasks across columns (To Do → Doing → Done)
- 🎨 **Priority Tags**: Colored tags (high, medium, low)
- 🌙 **Dark/Light Theme Ready** (with minor changes)
- 🧠 **Persistent State**: Saves tasks per user using Redux + localStorage
- 🎉 **Confetti**: Celebration when tasks are completed!
- 🚀 **Fully Responsive**: Looks great on desktop and mobile
- 💬 **Toast Notifications**: Real-time feedback using `react-hot-toast`

---

## 📸 Screenshots


---

## ⚙️ Tech Stack

- **Frontend**: React, Redux Toolkit
- **Styling**: SCSS (modular with variables, mixins, and main styles)
- **Routing**: React Router
- **Notifications**: `react-hot-toast`
- **Confetti**: `canvas-confetti`
- **Form UX**: Fully accessible and keyboard friendly

---

## 📁 Folder Structure

```bash
├── public
├── src
│   ├── components
│   │   ├── AuthForm.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskColumn.jsx
│   │   ├── TaskCard.jsx
│   │   ├── Modals.jsx         
│   │   ├── CustomModal.jsx
│   │   ├── UserDropdown.jsx
│   ├── store
│   │   ├── authSlice.js
│   │   ├── tasksSlice.js
│   ├── styles
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── main.scss
│   ├── utils
│   │   └── auth.js
│   ├── App.jsx
│   └── index.js
├── .gitignore
├── package.json
└── README.md

