import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

export default function ReleaseCard({
  release,
  onTradeRequest,
  onDeleteRelease,
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
    coverUrl,
  } = release;

  return (
    <div className="relative group bg-[#18191e] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col hover:border-vault-purple/50 transition-all">
      {/* תגית ליים בולטת להחלפה */}
      {forTrade && (
        <span className="absolute top-2 left-2 z-10 bg-vault-lime text-black font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
          Trade
        </span>
      )}

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
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
            No Cover
          </div>
        )}
      </div>

      {/* גוף הכרטיס */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={format.toLowerCase()}>{format}</Badge>
            <Badge variant="genre">{genre}</Badge>
          </div>
          <h2 className="text-base font-bold text-vault-text line-clamp-1">
            {title}
          </h2>
          <p className="text-sm text-zinc-400 line-clamp-1">{artist}</p>
        </div>

        {/* תחתית הכרטיס - שנת הוצאה, מצב עותק ומחיר */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div>
            <span>{year}</span> • <span>{condition}</span>
          </div>
          <span className="font-mono text-base font-black text-vault-lime">
            ₪{price}
          </span>
        </div>

        {/* שורת כפתורי פעולה מאוזנת */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 mt-auto">
          <div>
            {forTrade ? (
              <Button
                variant="ghost"
                onClick={() => onTradeRequest && onTradeRequest(release)}
                className="text-xs py-1.5 px-3 border border-vault-lime/40 text-vault-lime hover:bg-vault-lime hover:text-black transition-all font-semibold"
              >
                Request Trade
              </Button>
            ) : (
              <span className="text-[11px] text-zinc-500 italic pl-1">
                Vault only (No trade)
              </span>
            )}
          </div>

          {onDeleteRelease && (
            <Button
              variant="ghost"
              onClick={() => onDeleteRelease(id)}
              className="text-xs py-1.5 px-3 border border-vault-orange/40 text-vault-orange hover:bg-vault-orange hover:text-black transition-all font-semibold ml-auto"
              title="Delete release from vault"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
