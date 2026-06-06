import Card from './common/Card';
import Button from './common/Button';

export default function FeedbackPanel({ exercise, onEndSession }) {
  if (!exercise) return null;

  return (
    <>
      <Card padding="lg">
        <h2 className="text-headline-md mb-2">{exercise.name}</h2>
        <div className="text-label-sm text-on-surface-variant mb-4">Target: {exercise.reps} • {exercise.duration}</div>
        <p className="text-body-md text-on-surface mb-0">{exercise.description}</p>
      </Card>

      <Button variant="outline-white" className="w-100 bg-error text-white border-error hover-bg-error py-3 mt-auto" onClick={onEndSession}>
        End Session
      </Button>
    </>
  );
}
