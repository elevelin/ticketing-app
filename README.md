# 🛠️ Ticketing App

A simple full-stack IT ticketing system built with React and Flask. Submit, view, and manage support tickets through a clean and minimal UI.

## 🚀 Features

- Create new tickets with subject, description, priority, and category
- View open and acknowledged tickets on the homepage
- Backend powered by Flask and SQLite
- Frontend built with React
- Basic claim functionality (future)
- Easy local development with clear separation of frontend and backend

---

## 🖥️ Project Structure

\`\`\`
ticketing-app/
│
├── backend/              # Flask backend API
│   ├── app.py            # Flask app and routes
│   └── tickets.db        # SQLite database (auto-generated)
│
├── frontend/             # React frontend
│   ├── src/App.js        # Main app component
│   └── public/           # Static files
│
└── README.md             # You're reading it!
\`\`\`

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

\`\`\`bash
git clone https://github.com/elevelin/ticketing-app.git
cd ticketing-app
\`\`\`

---

### 2. Backend (Flask)

\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate

pip install flask flask-cors flask-sqlalchemy
python app.py
\`\`\`

Runs on: \`http://localhost:5000\`

---

### 3. Frontend (React)

In a new terminal window:

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

Runs on: \`http://localhost:3000\`

---

## 📝 To Do

- [ ] Add filters (by priority, issue type, etc.)
- [ ] Add ability to claim tickets
- [ ] Add authentication for users/admins
- [ ] Deploy to cloud (Render, Railway, or Heroku)

---

## 💡 Credits

Built by [@elevelin](https://github.com/elevelin) with React + Flask for fun and learning.

---
