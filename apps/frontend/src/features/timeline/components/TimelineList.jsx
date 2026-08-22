import TimelineEvent from './TimelineEvent';

/**
 * TimelineList
 *
 * Renders the timeline in the order the backend already sorts it in
 * (newest -> oldest) as a single vertical rail — there's no board/grid
 * layout here the way there is for tasks or activities, since the whole
 * point of this view is the chronological order itself.
 */
export default function TimelineList({ events }) {
  return (
    <ul className="relative">
      {events.map((event, index) => (
        <TimelineEvent key={event.id} event={event} isLast={index === events.length - 1} />
      ))}
    </ul>
  );
}
