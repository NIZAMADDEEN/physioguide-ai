# VirtueGym Backend

The VirtueGym backend is built with **Flask** and handles authentication, exercise processing, posture analysis, session management, and report generation. It uses **MediaPipe** for pose detection and **SQLite** as the database.

## Tech Stack

- Python 3.11.x
- Flask
- SQLAlchemy
- SQLite
- MediaPipe
- OpenCV
- NumPy
- JWT Authentication

> **Note:** This project is compatible with **Python 3.11.x only**. Using other Python versions may cause dependency or runtime issues.

## How to Run

1. Navigate to the backend folder:

   ```bash
   cd virtuegym/backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:

   **Windows**

   ```bash
   .venv\Scripts\activate
   ```

   **macOS/Linux**

   ```bash
   source .venv/bin/activate
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Create an environment file:

   ```bash
   cp .env.example .env
   ```

   *(On Windows, copy `.env.example` to `.env` manually.)*

6. Start the server:

   ```bash
   python app.py
   ```

The backend will run at:

```
http://localhost:5000
```