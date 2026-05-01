# NeuroCare - AI Mental Health Support Platform

NeuroCare is a full-stack mental health support application that combines a Flask API backend with a React/Tailwind frontend. The platform supports authentication, dashboards, AI-powered chat, panic mode, and hospital lookup.

## Tech Stack

### Backend
- Python 3.14
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-CORS
- python-dotenv
- SQLite for local development

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- Chart.js / react-chartjs-2
- @react-google-maps/api
- Lucide React

## Repository Structure

- `backend/` — Flask API and data models
- `frontend-ui/` — React single-page application
- `.gitignore` — excludes local dependencies, build outputs, env files, and caches

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

The backend will be available at `http://127.0.0.1:5000`.

### Frontend

```bash
cd frontend-ui
npm install
copy .env.example .env
npm start
```

The frontend will be available at `http://localhost:3000`.

## Environment Variables

### `backend/.env.example`

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
SQLALCHEMY_DATABASE_URI=sqlite:///instance/neurocare.db
FLASK_ENV=development
```

### `frontend-ui/.env.example`

```env
VITE_API_URL=http://127.0.0.1:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

> Note: Vite uses `VITE_` prefixes for environment variables.

## Production Deployment

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or any container host
- Use environment variables in production instead of `.env`
- In production, use `gunicorn` for the backend server

## Important Notes

- `frontend-ui/node_modules/` is ignored and should not be committed
- `backend/instance/` and `backend/logs/` are ignored
- Persistent secrets should remain out of git

## API Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Health
- `GET /api/health`
- `POST /api/health/data`
- `GET /api/health/data`

### Prediction
- `POST /api/predict`

### Chat
- `POST /api/chat`

### Hospitals
- `GET /api/hospitals`
- `GET /api/hospitals/<id>/doctors`

## Validation Steps Completed

- Frontend builds successfully with `npm run build`
- Backend app initializes successfully with Flask and SQLite
- `.gitignore` created and tracked artifacts cleaned
- Git repository prepared for push to GitHub
