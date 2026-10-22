export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const variantStyles = {
    primary: "bg-vault-primary hover:opacity-90 text-white shadow-sm",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-vault-text border border-zinc-700",
    danger:
      "bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/50",
    ghost: "bg-transparent hover:bg-zinc-800 text-vault-text",
  };

  const selectedStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${selectedStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
