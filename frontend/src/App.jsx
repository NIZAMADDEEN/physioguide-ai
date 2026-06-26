import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./utils/constants";

import { AuthProvider } from "./context/AuthContext";
import { ExerciseProvider } from "./context/ExerciseContext";
import { SessionProvider } from "./context/SessionContext";
import { VoiceCoachProvider } from "./context/VoiceCoachContext";
import ErrorBoundary from "./components/ErrorBoundary";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import ExerciseSelectionPage from "./pages/ExerciseSelectionPage";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportPage from "./pages/ReportPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ExerciseProvider>
          <SessionProvider>
            <VoiceCoachProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path={ROUTES.HOME} element={<LandingPage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                  </Route>

                  {/* Authenticated Routes */}
                  <Route element={<AppLayout />}>
                    <Route
                      path={ROUTES.DASHBOARD}
                      element={<DashboardPage />}
                    />
                    <Route
                      path={ROUTES.EXERCISES}
                      element={<ExerciseSelectionPage />}
                    />
                    <Route
                      path={ROUTES.MONITORING}
                      element={<LiveMonitoringPage />}
                    />
                    <Route
                      path={ROUTES.ANALYTICS}
                      element={<AnalyticsPage />}
                    />
                    <Route path={ROUTES.REPORTS} element={<ReportPage />} />
                    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  </Route>

                  {/* Catch all 404 - redirect to home */}
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </BrowserRouter>
            </VoiceCoachProvider>
          </SessionProvider>
        </ExerciseProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
