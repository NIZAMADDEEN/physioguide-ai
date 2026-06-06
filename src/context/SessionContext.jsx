import { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { ExerciseContext } from './ExerciseContext';
import {
  startSession as startSessionApi,
  endSession as endSessionApi,
  updateSessionMetrics,
  getProgressData,
  getMobilityScores,
  getWeeklyExercises,
  getTimeline,
} from '../services/sessionService';

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { selectedExercise, selectExercise, clearSelectedExercise } = useContext(ExerciseContext);

  // ─── Live Session States ────────────────────────────────────────────────────
  const [activeSession, setActiveSession] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Camera offline. Click "Enable Camera" to begin.');
  const [accuracyHistory, setAccuracyHistory] = useState([]);
  const [lastSessionSummary, setLastSessionSummary] = useState(null);

  // ─── Dashboard & Analytics States ──────────────────────────────────────────
  const [dashboardStats, setDashboardStats] = useState({
    overallRecovery: '—',
    activeStreak: '—',
    completedSessions: '—',
    nextAppointment: '—',
  });
  const [progressData, setProgressData] = useState([]);
  const [mobilityScores, setMobilityScores] = useState([]);
  const [weeklyExercises, setWeeklyExercises] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // ─── Load analytics from Flask backend on user login ───────────────────────
  const loadAnalyticsData = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [progress, mobility, weekly, timeline] = await Promise.all([
        getProgressData(90),
        getMobilityScores(),
        getWeeklyExercises(),
        getTimeline(10),
      ]);

      setProgressData(progress);
      setMobilityScores(mobility);
      setWeeklyExercises(weekly);
      setTimelineData(timeline);

      // Derive overall recovery from average mobility scores
      const avgMobility =
        Array.isArray(mobility) && mobility.length > 0
          ? Math.round(mobility.reduce((sum, item) => sum + item.score, 0) / mobility.length)
          : 82;

      setDashboardStats((prev) => ({
        ...prev,
        overallRecovery: `${avgMobility}%`,
      }));
    } catch (err) {
      console.error('[SessionContext] Failed to load analytics:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      // Reset all states on logout
      setActiveSession(null);
      setCameraActive(false);
      setReps(0);
      setAccuracy(0);
      setAccuracyHistory([]);
      setLastSessionSummary(null);
      setProgressData([]);
      setMobilityScores([]);
      setWeeklyExercises([]);
      setTimelineData([]);
      setDashboardStats({
        overallRecovery: '—',
        activeStreak: '—',
        completedSessions: '—',
        nextAppointment: '—',
      });
      return;
    }
    loadAnalyticsData();
  }, [user, loadAnalyticsData]);

  // ─── Posture Simulation Loop (runs while camera is active) ─────────────────
  useEffect(() => {
    if (!cameraActive || !activeSession) return;

    setStatusMsg('Calibrating posture...');
    const calibTimer = setTimeout(() => {
      setStatusMsg('Good form! Keep going.');
      setAccuracy(85);
      setAccuracyHistory((prev) => [...prev, 85]);
    }, 2000);

    const simInterval = setInterval(() => {
      setReps((r) => {
        const next = r + 1;
        let currentAccuracy;

        if (next % 3 === 0) {
          setStatusMsg('Adjust your knee angle slightly.');
          currentAccuracy = Math.floor(Math.random() * 20) + 70; // 70–90%
        } else {
          setStatusMsg('Great! Maintain this pace.');
          currentAccuracy = Math.floor(Math.random() * 15) + 85; // 85–100%
        }

        setAccuracy(currentAccuracy);
        setAccuracyHistory((prev) => [...prev, currentAccuracy]);

        // Fire-and-forget periodic metric update to Flask backend
        if (activeSession?.sessionId) {
          updateSessionMetrics(activeSession.sessionId, {
            reps: next,
            accuracy: currentAccuracy,
            statusMsg,
          }).catch((err) =>
            console.warn('[SessionContext] Metric update failed:', err.message)
          );
        }

        return next;
      });
    }, 4500);

    return () => {
      clearTimeout(calibTimer);
      clearInterval(simInterval);
    };
  }, [cameraActive, activeSession, statusMsg]);

  // ─── Start a new exercise session ──────────────────────────────────────────
  const startSession = useCallback(
    async (exerciseId, exerciseObj) => {
      try {
        const session = await startSessionApi(exerciseId);
        selectExercise(exerciseObj);
        setActiveSession(session);
        setCameraActive(false);
        setReps(0);
        setAccuracy(0);
        setAccuracyHistory([]);
        setLastSessionSummary(null);
        setStatusMsg('Camera offline. Click "Enable Camera" to begin.');
        return session;
      } catch (err) {
        console.error('[SessionContext] Failed to start session:', err.message);
        throw err;
      }
    },
    [selectExercise]
  );

  // ─── Enable the posture camera ─────────────────────────────────────────────
  const enableCamera = useCallback(() => {
    setCameraActive(true);
  }, []);

  // ─── End the session, persist to Flask, then refresh analytics ─────────────
  const endSession = useCallback(async () => {
    if (!activeSession) return;

    // Stop camera immediately for UX
    setCameraActive(false);

    // Compute summary from live tracking data
    const finalReps = reps;
    const avgAccuracy =
      accuracyHistory.length > 0
        ? Math.round(
            accuracyHistory.reduce((sum, val) => sum + val, 0) / accuracyHistory.length
          )
        : 85;

    const summary = {
      reps: finalReps,
      accuracy: avgAccuracy,
      exercise: selectedExercise,
      completedAt: new Date().toISOString(),
    };

    setLastSessionSummary(summary);
    setActiveSession(null);

    // Persist session end to Flask backend
    try {
      if (activeSession.sessionId) {
        await endSessionApi(activeSession.sessionId, {
          reps: finalReps,
          accuracy: avgAccuracy,
          duration: null, // could calculate from startedAt if available
        });
      }
    } catch (err) {
      console.warn('[SessionContext] endSession API call failed:', err.message);
    }

    // Re-fetch all analytics from Flask so the dashboard is in sync
    try {
      await loadAnalyticsData();
    } catch (err) {
      // Fallback: apply optimistic local updates if the re-fetch fails
      console.warn('[SessionContext] Analytics re-fetch failed, applying local updates:', err.message);

      // Update dashboard stats
      setDashboardStats((prev) => {
        const prevCount = parseInt(prev.completedSessions, 10) || 24;
        const prevRecovery = parseInt(prev.overallRecovery, 10) || 82;
        const prevStreak = parseInt(prev.activeStreak, 10) || 5;
        const nextCount = prevCount + 1;
        const nextRecovery = Math.min(
          100,
          Math.round((prevRecovery * prevCount + avgAccuracy) / nextCount)
        );
        return {
          ...prev,
          completedSessions: nextCount.toString(),
          overallRecovery: `${nextRecovery}%`,
          activeStreak: `${prevStreak + 1} Days`,
        };
      });

      // Append to timeline locally
      setTimelineData((prev) => [
        {
          id: `evt-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'session',
          title: 'Exercise Session Completed',
          detail: `Completed ${selectedExercise?.name || 'Exercise'} with ${avgAccuracy}% accuracy`,
          status: 'completed',
        },
        ...prev,
      ]);

      // Update weekly exercise adherence locally
      if (selectedExercise) {
        setWeeklyExercises((prev) =>
          prev.map((item) =>
            item.category === selectedExercise.category
              ? { ...item, completed: Math.min(item.target, item.completed + 1) }
              : item
          )
        );
      }

      // Optimistically update today's progress trend
      const todayStr = new Date().toISOString().split('T')[0];
      setProgressData((prev) => {
        const idx = prev.findIndex((d) => d.date === todayStr);
        if (idx !== -1) {
          const updated = [...prev];
          const day = updated[idx];
          const nextSessions = (day.sessions || 0) + 1;
          updated[idx] = {
            ...day,
            score: Math.round(((day.score * day.sessions + avgAccuracy) / nextSessions) * 10) / 10,
            sessions: nextSessions,
          };
          return updated;
        }
        return [...prev, { date: todayStr, score: avgAccuracy, sessions: 1 }];
      });
    }
  }, [activeSession, reps, accuracyHistory, selectedExercise, loadAnalyticsData]);

  // ─── Clear session summary after modal is dismissed ────────────────────────
  const clearSessionSummary = useCallback(() => {
    setLastSessionSummary(null);
    clearSelectedExercise();
  }, [clearSelectedExercise]);

  // ─── Context Value ──────────────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      // Live tracking
      activeSession,
      cameraActive,
      reps,
      accuracy,
      statusMsg,
      lastSessionSummary,
      // Dashboard & Analytics
      dashboardStats,
      progressData,
      mobilityScores,
      weeklyExercises,
      timelineData,
      statsLoading,
      // Actions
      startSession,
      enableCamera,
      endSession,
      clearSessionSummary,
      refreshAnalytics: loadAnalyticsData,
    }),
    [
      activeSession,
      cameraActive,
      reps,
      accuracy,
      statusMsg,
      lastSessionSummary,
      dashboardStats,
      progressData,
      mobilityScores,
      weeklyExercises,
      timelineData,
      statsLoading,
      startSession,
      enableCamera,
      endSession,
      clearSessionSummary,
      loadAnalyticsData,
    ]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
