import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercise } from "../hooks/useExercise";
import { useSession } from "../hooks/useSession";
import { ROUTES } from "../utils/constants";
import Loader from "../components/common/Loader";
import InputField from "../components/common/InputField";
import ExerciseCard from "../components/ExerciseCard";

export default function ExerciseSelectionPage() {
  const { exercises, filters, loading, setCategoryFilter, setSearchQuery } =
    useExercise();
  const { startSession } = useSession();
  const navigate = useNavigate();
  const [startingId, setStartingId] = useState(null);

  const categories = ["All", "Lower Body", "Upper Body", "Core", "Stretching"];

  const handleStart = async (id) => {
    setStartingId(id);
    try {
      const exerciseObj = exercises.find((ex) => ex.id === id);
      const session = await startSession(id, exerciseObj);
      navigate(
        `${ROUTES.MONITORING}?sessionId=${session.sessionId}&exerciseId=${id}`,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 bg-surface p-4 rounded-4 border border-outline-variant shadow-sm">
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn rounded-pill px-4 py-2 text-label-sm border ${
                filters.category === cat
                  ? "bg-primary-color text-on-primary border-primary"
                  : "bg-transparent text-on-surface-variant border-outline-variant hover-bg-surface-container"
              }`}
              style={{ transition: "all 0.2s ease" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ minWidth: "250px" }}>
          <InputField
            type="search"
            placeholder="Search exercises..."
            icon="search"
            value={filters.search}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="col-12 col-md-6 col-xl-4"
              style={{ height: 340 }}
            >
              <Loader variant="skeleton" />
            </div>
          ))}
        </div>
      ) : exercises && exercises.length > 0 ? (
        <div className="row g-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="col-12 col-md-6 col-xl-4">
              <ExerciseCard
                exercise={ex}
                onStart={handleStart}
                isStarting={startingId === ex.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-surface rounded-4 border border-outline-variant">
          <span
            className="material-symbols-outlined text-outline mb-3"
            style={{ fontSize: 48 }}
          >
            search_off
          </span>
          <h3 className="text-headline-md">No exercises found</h3>
          <p className="text-body-md text-on-surface-variant">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
