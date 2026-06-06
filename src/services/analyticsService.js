/**
 * @deprecated analyticsService.js is deprecated.
 * All analytics endpoints have been consolidated into sessionService.js.
 * This shim re-exports from sessionService for backwards compatibility.
 */
export {
  getProgressData,
  getMobilityScores,
  getWeeklyExercises,
  getTimeline,
} from './sessionService';
