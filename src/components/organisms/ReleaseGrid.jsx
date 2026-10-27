import ReleaseCard from "../molecules/ReleaseCard";

export default function ReleaseGrid({
  releases = [],
  onTradeRequest,
  onDeleteRelease,
  onEditRelease,
}) {
  if (releases.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full py-16 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl font-mono text-sm"
      >
        No releases found matching your search.
      </div>
    );
  }

  return (
    <ul
      role="list"
      aria-label="Releases catalog"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 list-none p-0 m-0"
    >
      {releases.map((release) => (
        <li key={release.id} className="h-full">
          <ReleaseCard
            release={release}
            onTradeRequest={onTradeRequest}
            onDeleteRelease={onDeleteRelease}
            onEditRelease={onEditRelease}
          />
        </li>
      ))}
    </ul>
  );
}
