import { useState } from "react";

export default function TradeProposalModal({
  isOpen,
  onClose,
  release,
  onSubmit,
}) {
  const [offeredItem, setOfferedItem] = useState("");
  const [proposerName, setProposerName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !release) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!offeredItem.trim() || !proposerName.trim()) {
      setError("Please fill in both your name and what you offer.");
      return;
    }

    onSubmit({
      releaseId: release.id,
      releaseTitle: release.title,
      offeredItem: offeredItem.trim(),
      proposerName: proposerName.trim(),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      {/* רקע שמאפשר סגירה בלחיצה בחוץ */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* גוף המודאל בסגנון סגול של ה-Vault */}
      <div className="relative w-full max-w-lg bg-[#14151a] border border-vault-purple/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(157,78,221,0.2)] text-zinc-100 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* כותרת וכפתור סגירה */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-vault-purple shadow-[0_0_8px_rgba(157,78,221,0.8)]" />
            <h2 className="text-lg font-bold tracking-wider uppercase font-mono text-vault-purple">
              Initiate Trade Proposal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* תקציר הריליס המבוקש */}
        <div className="my-4 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-vault-purple/30 flex items-center justify-center text-xs font-mono text-vault-purple">
            VAULT
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block">
              Requested Release
            </span>
            <div className="text-sm font-bold text-zinc-200">
              {release.title}
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              {release.artist} • {release.format}
            </div>
          </div>
        </div>

        {/* הודעת שגיאה מקומית */}
        {error && (
          <div className="mb-4 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg">
            {error}
          </div>
        )}

        {/* שדות הטופס */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Your Name / Collector Tag *
            </label>
            <input
              type="text"
              value={proposerName}
              onChange={(e) => setProposerName(e.target.value)}
              placeholder="e.g. VinylJunkie_99"
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-vault-purple focus:outline-none rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              What Are You Offering in Trade? *
            </label>
            <input
              type="text"
              value={offeredItem}
              onChange={(e) => setOfferedItem(e.target.value)}
              placeholder="e.g. Joy Division - Unknown Pleasures (1st UK Press)"
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-vault-purple focus:outline-none rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Notes or Trade Conditions (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Condition, matrix numbers, cash adjustment..."
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-vault-purple focus:outline-none rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 font-mono transition-colors resize-none"
            />
          </div>

          {/* כפתורי פעולה */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 text-xs font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-vault-purple hover:bg-vault-purple/80 text-black font-bold text-xs uppercase tracking-wider font-mono transition-colors shadow-[0_0_15px_rgba(157,78,221,0.4)]"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
