# VirtueGym

VirtueGym is a computer vision-powered physical therapy application that provides real-time posture tracking, exercise feedback, and clinical reporting using Google MediaPipe and React.

---

## System Architecture

The application is split into two independent services:

### Important note:

This implementation works with python 3.11.*.

Anything below or above will highly cause crashes.

### 1. Frontend (`/virtuegym/frontend`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS + Bootstrap 5
- **Features:** Webcam rendering, dashboard charts, real-time feedback UI.

### 2. Backend (`/virtuegym/backend`)
- **Framework:** Flask + SQLAlchemy
- **Database:** SQLite
- **Computer Vision:** MediaPipe (Pose Detection), OpenCV, NumPy
- **Authentication:** JWT (JSON Web Tokens)
- **Features:** Posture angle calculation, rep tracking logic, PDF report generation.

---

## Local Development Setup

### Backend Setup
1. Navigate to the backend directory: `cd virtuegym/backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate the environment:
   - Windows: `.venv\Scripts\activate`
   - Mac/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env`
6. Run the server: `python app.py` (Runs on `http://localhost:5000`)

### Frontend Setup
1. Navigate to the frontend directory: `cd virtuegym/frontend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Start the Vite dev server: `npm run dev` (Runs on `http://localhost:5173`)

---

## Features
- **Real-time Pose Tracking:** Uses MediaPipe to track 33 body landmarks.
- **Form Correction:** Provides instant feedback on joint angles (e.g., knee flexion, shoulder abduction).
- **Rep Tracking & Analytics:** Automatically counts reps and tracks session duration.
- **Clinical Reports:** Generates exportable PDF reports for physical therapists.

---

## Members
Group Members:
- Aryan Karim (2120256008)
- Malcom Kpundeh (2120256029)
- Sheka Ahmed Sesay (2120256041)
- Umar Nizamaddeen (2120256045)
