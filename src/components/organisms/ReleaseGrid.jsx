import ReleaseCard from '../molecules/ReleaseCard';

export default function ReleaseGrid({ releases = [], onTradeRequest, onDeleteRelease }) {
  // Empty State - אם אין תוצאות או שהאוסף ריק
  if (!releases || releases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-center">
        <span className="text-3xl mb-2">📻</span>
        <h3 className="text-base font-semibold text-vault-text">Vault is Empty</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-sm">
          No releases match your criteria or none have been cataloged yet.
        </p>
      </div>
    );
  }

  // רשת רספונסיבית של כרטיסים
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {releases.map((release) => (
        <ReleaseCard
          key={release.id}
          release={release}
          onTradeRequest={onTradeRequest}
          onDeleteRelease={onDeleteRelease}
        />
      ))}
    </div>
  );
}