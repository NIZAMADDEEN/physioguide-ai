# VirtueGym Frontend

The VirtueGym frontend is built with **React** and **Vite**. It provides the user interface for real-time exercise tracking, webcam visualization, posture feedback, progress dashboards, and session analytics.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Bootstrap 5
- Vanilla CSS

## How to Run

1. Navigate to the frontend folder:

   ```bash
   cd virtuegym/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an environment file:

   ```bash
   cp .env.example .env.local
   ```

   *(On Windows, copy `.env.example` to `.env.local` manually.)*

4. Start the development server:

   ```bash
   npm run dev
   ```

The frontend will run at:

```
http://localhost:5173
```

Make sure the backend server is running before using features that require API communication.