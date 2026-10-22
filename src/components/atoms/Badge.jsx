export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    // תקליט: סגול חשמלי
    vinyl: "bg-vault-purple/20 text-vault-purple border border-vault-purple/40",
    // קלטת: כתום בוהק
    cassette:
      "bg-vault-orange/20 text-vault-orange border border-vault-orange/40",
    // ז'אנר: רקע כהה עדין
    genre: "bg-zinc-800/80 text-zinc-300 border border-zinc-700/50",
    // סטטוס ליים
    lime: "bg-vault-lime/20 text-vault-lime border border-vault-lime/40",
    default: "bg-zinc-800 text-vault-text border border-zinc-700",
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
