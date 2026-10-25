import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

export default function ReleaseCard({
  release,
  onTradeRequest,
  onDeleteRelease,
  onEditRelease,
}) {
  const {
    id,
    title,
    artist,
    format,
    genre,
    condition,
    year,
    price,
    forTrade,
    status,
    coverUrl,
  } = release;

  return (
    <div className="relative group bg-[#18191e] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col hover:border-vault-purple/60 hover:shadow-[0_0_20px_rgba(157,78,221,0.15)] transition-all duration-300">
      {/* תגית סטטוס עליונה: Pending סגול זוהר או Trade ליים */}
      {status === "Pending" ? (
        <span className="absolute top-2 left-2 z-10 bg-vault-purple text-black font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-[0_0_10px_rgba(157,78,221,0.5)] animate-pulse">
          Pending Trade
        </span>
      ) : forTrade ? (
        <span className="absolute top-2 left-2 z-10 bg-vault-lime text-black font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
          Trade
        </span>
      ) : null}

      {/* תמונת עטיפה */}
      <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${title} cover`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
            No Cover
          </div>
        )}
      </div>

      {/* גוף הכרטיס */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              variant={format.toLowerCase()}
              className={
                format.toLowerCase() === "vinyl"
                  ? "!border-vault-purple/50 !bg-vault-purple/15 !text-vault-purple shadow-[0_0_8px_rgba(157,78,221,0.25)]"
                  : ""
              }
            >
              {format}
            </Badge>
            <Badge variant="genre">{genre}</Badge>
          </div>
          <h2 className="text-base font-bold text-vault-text line-clamp-1">
            {title}
          </h2>
          <p className="text-sm text-zinc-400 line-clamp-1 font-sans">
            {artist}
          </p>
        </div>

        {/* שנת יציאה, מצב ומחיר */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span>{year}</span>
            <span>•</span>
            <span className="text-zinc-300 font-semibold">{condition}</span>
          </div>
          <span className="font-mono text-base font-black text-vault-lime">
            ₪{price}
          </span>
        </div>

        {/* שורת פעולות בתחתית */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 mt-auto">
          <div>
            {status === "Pending" ? (
              <span className="text-xs font-mono text-vault-purple bg-vault-purple/10 border border-vault-purple/40 px-2.5 py-1 rounded-lg shadow-[0_0_8px_rgba(157,78,221,0.2)]">
                Trade Pending
              </span>
            ) : forTrade ? (
              <Button
                variant="ghost"
                onClick={() => onTradeRequest && onTradeRequest(release)}
                className="text-xs py-1.5 px-3 border border-vault-lime/40 text-vault-lime hover:border-vault-lime hover:text-vault-lime hover:bg-vault-lime/10 transition-all font-semibold rounded-lg shadow-sm"
              >
                Request Trade
              </Button>
            ) : (
              <span className="text-[11px] font-mono text-zinc-500 italic pl-1">
                Vault only (No trade)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {onEditRelease && (
              <Button
                variant="ghost"
                onClick={() => onEditRelease(release)}
                className="text-xs py-1.5 px-2.5 border border-vault-purple/40 text-vault-purple hover:border-vault-purple hover:text-vault-purple hover:bg-vault-purple/10 transition-all font-semibold rounded-lg"
                title="Edit release"
              >
                Edit
              </Button>
            )}

            {onDeleteRelease && (
              <Button
                variant="ghost"
                onClick={() => onDeleteRelease(id)}
                className="text-xs py-1.5 px-2.5 border border-vault-orange/40 text-vault-orange hover:border-vault-orange hover:text-vault-orange hover:bg-vault-orange/10 transition-all font-semibold rounded-lg"
                title="Delete release from vault"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
