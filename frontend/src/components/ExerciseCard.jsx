import Button from "./common/Button";
import Card from "./common/Card";

export default function ExerciseCard({ exercise, onStart, isStarting }) {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy":
        return "var(--color-secondary)";
      case "Medium":
        return "var(--color-primary)";
      case "Hard":
        return "var(--color-tertiary)";
      default:
        return "var(--color-outline)";
    }
  };

  return (
    <Card
      elevation={2}
      padding="0"
      hoverable
      className="h-100 d-flex flex-column overflow-hidden shadow-none"
    >
      {/* Image Placeholder */}
      <div
        className="bg-surface-container d-flex align-items-center justify-content-center position-relative"
        style={{ height: "180px" }}
      >
        <span
          className="material-symbols-outlined text-outline"
          style={{ fontSize: 64 }}
        >
          fitness_center
        </span>
        <div className="position-absolute top-0 end-0 p-3">
          <span
            className="badge rounded-pill px-3 py-2 text-label-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              color: getDifficultyColor(exercise.difficulty),
              border: `1px solid ${getDifficultyColor(exercise.difficulty)}`,
            }}
          >
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        <h3 className="text-headline-md mb-1">{exercise.name}</h3>
        <p className="text-label-sm text-primary mb-3 text-uppercase tracking-wide">
          {exercise.muscle}
        </p>

        <div className="d-flex align-items-center gap-4 mb-4 text-on-surface-variant">
          <div className="d-flex align-items-center gap-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
            >
              schedule
            </span>
            <span className="text-label-sm">{exercise.duration}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
            >
              repeat
            </span>
            <span className="text-label-sm">{exercise.reps}</span>
          </div>
        </div>

        <Button
          className="w-100 mt-auto"
          icon="play_arrow"
          loading={isStarting}
          disabled={isStarting}
          onClick={() => onStart(exercise.id)}
        >
          Start Exercise
        </Button>
      </div>
    </Card>
  );
}
