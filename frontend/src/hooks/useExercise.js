import { useContext } from "react";
import { ExerciseContext } from "../context/ExerciseContext";

/**
 * Custom hook to consume ExerciseContext.
 * Throws an error if used outside of an ExerciseProvider.
 */
export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error("useExercise must be used within an ExerciseProvider");
  }
  return context;
}
