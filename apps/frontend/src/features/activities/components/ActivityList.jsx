import ActivityCard from './ActivityCard';

/**
 * ActivityList
 *
 * Activities don't move through board columns the way tasks do (there's no
 * TaskBoard equivalent here), so this is a simple stacked list, newest
 * first — the order ActivitiesPage already sorts them in.
 */
export default function ActivityList({ activities, onEdit }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} onEdit={onEdit} />
      ))}
    </div>
  );
}
