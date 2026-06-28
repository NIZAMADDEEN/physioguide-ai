# VirtuGym

VirtuGym delivers professional AI physiotherapy and rehabilitation in your own home. Benefit from real-time pose tracking, smart exercise logging, and detailed progress insights

## System Architecture

The application is split into two independent services:

### 1. Frontend (`/virtu-gym/frontend`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS + Bootstrap 5
- **Features:** Webcam rendering, dashboard charts, real-time feedback UI.

### 2. Backend (`/virtu-gym/backend`)
- **Framework:** Flask + SQLAlchemy
- **Database:** SQLite
- **Computer Vision:** MediaPipe (Pose Detection), OpenCV, NumPy
- **Authentication:** JWT (JSON Web Tokens)
- **Features:** Posture angle calculation, rep tracking logic, PDF report generation.

## Local Development Setup

### Backend Setup
1. Navigate to the backend directory: `cd virtu-gym/backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate the environment:
   - Windows: `.venv\Scripts\activate`
   - Mac/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env`
6. Run the server: `python app.py` (Runs on `http://localhost:5000`)

### Frontend Setup
1. Navigate to the frontend directory: `cd virtu-gym/frontend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Start the Vite dev server: `npm run dev` (Runs on `http://localhost:5173`)

## Features
- **Real-time Pose Tracking:** Uses MediaPipe to track 33 body landmarks.
- **Form Correction:** Provides instant feedback on joint angles (e.g., knee flexion, shoulder abduction).
- **Rep Tracking & Analytics:** Automatically counts reps and tracks session duration.
- **Clinical Reports:** Generates exportable PDF reports for physical therapists.

## License
Group Members
