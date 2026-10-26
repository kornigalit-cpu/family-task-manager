import Button from "../atoms/Button";

export default function ActionBar({
  releasesCount,
  onOpenAdd,
  onOpenLogs,
  logsCount,
}) {
  return (
    <section className="max-w-7xl mx-auto w-full px-6 pt-6 pb-2">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-zinc-800/60">
        <div>
          <h2 className="text-base font-bold text-zinc-200">
            Archive Collection
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            {releasesCount} releases cataloged in vault
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLogs}
            className="px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:border-[#ccff00] text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-2 font-mono"
            title="View Activity Log"
          >
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            ACTIVITY
            {logsCount > 0 && (
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-full border border-zinc-700">
                {logsCount}
              </span>
            )}
          </button>

          <Button
            onClick={onOpenAdd}
            className="bg-vault-purple !text-black hover:bg-vault-purple/90 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <span>+</span>
            <span>ADD RELEASE</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
