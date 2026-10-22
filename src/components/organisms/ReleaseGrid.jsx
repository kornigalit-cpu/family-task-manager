import ReleaseCard from "../molecules/ReleaseCard";

export default function ReleaseGrid({
  releases = [],
  onTradeRequest,
  onDeleteRelease,
  onEditRelease,
}) {
  if (releases.length === 0) {
    return (
      <div className="w-full py-16 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
        No releases found matching your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {releases.map((release) => (
        <ReleaseCard
          key={release.id}
          release={release}
          onTradeRequest={onTradeRequest}
          onDeleteRelease={onDeleteRelease}
          onEditRelease={onEditRelease}
        />
      ))}
    </div>
  );
}
