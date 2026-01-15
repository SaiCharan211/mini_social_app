🧑‍🤝‍🧑 Mini Social App

A full-stack Mini Social Media Application built using React (Vite) for the frontend and Django REST Framework for the backend.
The app supports user authentication, posts, likes, and password reset functionality.

📌 Project Overview

This project is divided into two main parts:

Frontend → React + Vite (User Interface)

Backend → Django + Django REST Framework (API & Authentication)

mini_social_app/
├── backend/                 # Django backend
└── frontend/
    └── social_app/          # React frontend

✨ Features
🔐 Authentication

User registration & login (JWT-based)

Logout

Forgot password with email reset link

📝 Posts

Create posts

View all users' posts

View only your own posts

Delete posts (own posts / admin access)

❤️ Social Interaction

Like & unlike posts

View users who liked a post

🎨 UI / UX

Responsive UI

Loading & error states

Clean separation of personal posts and global feed

🛠 Tech Stack
Frontend

React

Vite

Axios

CSS

Backend

Django

Django REST Framework

PostgreSQL

JWT Authentication

Django CORS Headers

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/SaiCharan211/mini_social_app.git
cd mini_social_app

🖥 Frontend Setup (React + Vite)
📁 Location
frontend/social_app

✅ Prerequisites

Node.js (v16+)

npm

🔧 Environment Configuration

Create a .env file inside:

frontend/social_app/.env

VITE_API_BASE_URL=http://127.0.0.1:8000/api


⚠️ .env is ignored by Git for security.

📦 Install Dependencies
cd frontend/social_app
npm install

▶️ Run Frontend
npm run dev


Frontend runs at:

http://localhost:5173

🧠 Backend Setup (Django + DRF)
📁 Location
backend/

✅ Prerequisites

Python 3.8+

PostgreSQL

🔧 Create Virtual Environment
python -m venv venv


Activate it:

Windows

venv\Scripts\activate


macOS / Linux

source venv/bin/activate

📦 Install Dependencies
pip install -r requirements.txt

🔐 Backend Environment Variables

Create a .env file inside backend/:

SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=social_app
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

ACCESS_TOKEN_LIFETIME=60

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

CORS_ALLOWED_ORIGINS=http://localhost:5173

🗄 Database Setup
python manage.py migrate


(Optional)

python manage.py createsuperuser

▶️ Run Backend
python manage.py runserver


Backend runs at:

http://127.0.0.1:8000/

🔑 Authentication (JWT)

Obtain token: /api/token/

Use token in headers:

Authorization: Bearer <access_token>

📡 API Access

API Root: http://127.0.0.1:8000/api/

Admin Panel: http://127.0.0.1:8000/admin/
