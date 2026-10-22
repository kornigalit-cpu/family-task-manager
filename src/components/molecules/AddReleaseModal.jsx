import { useState } from "react";
import Button from "../atoms/Button";

const DEFAULT_STATE = {
  title: "",
  artist: "",
  format: "Vinyl",
  genre: "",
  year: new Date().getFullYear(),
  condition: "VG+",
  price: "",
  forTrade: false,
  coverUrl: "",
};

// קומפוננטת הטופס הפנימית - מנהלת את ה-state ישירות ללא צורך ב-useEffect
function ReleaseForm({ initialData, onSaveRelease, onClose }) {
  const [formData, setFormData] = useState(initialData || DEFAULT_STATE);
  const isEditing = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.artist.trim()) return;

    onSaveRelease({
      ...formData,
      price: Number(formData.price) || 0,
      year: Number(formData.year) || new Date().getFullYear(),
    });

    onClose();
  };

  return (
    <div className="relative w-full max-w-lg bg-[#18191e] border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
      {/* כותרת החלון */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-vault-text">
            {isEditing ? "EDIT RELEASE" : "ADD NEW RELEASE"}
          </h2>
          <p className="text-xs text-zinc-400">
            {isEditing
              ? "Update catalog details in the Vault"
              : "Catalog a record or cassette into the Vault"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-vault-orange p-1 rounded-md transition-colors"
        >
          ✕
        </button>
      </div>

      {/* טופס הנתונים */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Title & Artist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Title *
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pornography"
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Artist *
            </label>
            <input
              required
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="e.g. The Cure"
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
            />
          </div>
        </div>

        {/* Format, Condition & Year */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Format
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-2.5 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
            >
              <option value="Vinyl">Vinyl</option>
              <option value="Cassette">Cassette</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-2.5 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
            >
              <option value="Mint">Mint</option>
              <option value="NM">NM</option>
              <option value="VG+">VG+</option>
              <option value="VG">VG</option>
              <option value="G">G</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
            />
          </div>
        </div>

        {/* Genre & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Genre
            </label>
            <input
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Post-Punk / New Wave"
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Price (₪)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="150"
              className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3 py-2 text-vault-lime font-mono text-xs focus:outline-none focus:border-vault-lime"
            />
          </div>
        </div>

        {/* Cover URL */}
        <div>
          <label className="block text-zinc-400 mb-1 font-medium">
            Cover Image URL
          </label>
          <input
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3 py-2 text-vault-text focus:outline-none focus:border-vault-lime text-xs"
          />
        </div>

        {/* For Trade Checkbox */}
        <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            name="forTrade"
            checked={formData.forTrade}
            onChange={handleChange}
            className="accent-vault-lime w-4 h-4 rounded"
          />
          <span className="text-zinc-300">Available for trade</span>
        </label>

        {/* כפתורי פעולה */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            className="px-5 py-2 bg-vault-lime !text-black hover:bg-vault-lime/90 font-extrabold rounded-lg shadow-sm cursor-pointer"
          >
            {isEditing ? "Save Changes" : "Add to Vault"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// מעטפת המודאל - משתמשת ב-key כדי לאפס את הטופס באופן טבעי ונקי
export default function AddReleaseModal({
  isOpen,
  onClose,
  onSaveRelease,
  initialData = null,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <ReleaseForm
        key={initialData?.id || "new-release"}
        initialData={initialData}
        onSaveRelease={onSaveRelease}
        onClose={onClose}
      />
    </div>
  );
}
