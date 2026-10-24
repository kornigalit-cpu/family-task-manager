import { useState } from "react";
import Button from "../atoms/Button";
import { validateRelease } from "../../utils/validators";

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

// קומפוננטת הטופס הפנימית
function ReleaseForm({ initialData, onSaveRelease, onClose }) {
  const [formData, setFormData] = useState(initialData || DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateRelease(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSaveRelease({
      ...formData,
      price: Number(formData.price) || 0,
      year: Number(formData.year) || new Date().getFullYear(),
    });

    onClose();
  };

  return (
    <div className="relative w-full max-w-lg bg-[#18191e] border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
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

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pornography"
              className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-vault-text focus:outline-none text-xs transition-colors ${
                errors.title
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-700/70 focus:border-vault-lime"
              }`}
            />
            {errors.title && (
              <span className="text-red-400 text-[11px] mt-1 block font-medium">
                {errors.title}
              </span>
            )}
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">
              Artist *
            </label>
            <input
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="e.g. The Cure"
              className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-vault-text focus:outline-none text-xs transition-colors ${
                errors.artist
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-700/70 focus:border-vault-lime"
              }`}
            />
            {errors.artist && (
              <span className="text-red-400 text-[11px] mt-1 block font-medium">
                {errors.artist}
              </span>
            )}
          </div>
        </div>

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
              className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-vault-text focus:outline-none text-xs transition-colors ${
                errors.year
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-700/70 focus:border-vault-lime"
              }`}
            />
            {errors.year && (
              <span className="text-red-400 text-[11px] mt-1 block font-medium">
                {errors.year}
              </span>
            )}
          </div>
        </div>

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
              className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-vault-lime font-mono text-xs focus:outline-none transition-colors ${
                errors.price
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-700/70 focus:border-vault-lime"
              }`}
            />
            {errors.price && (
              <span className="text-red-400 text-[11px] mt-1 block font-medium">
                {errors.price}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1 font-medium">
            Cover Image URL
          </label>
          <input
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="https://..."
            className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-vault-text focus:outline-none text-xs transition-colors ${
              errors.coverUrl
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-700/70 focus:border-vault-lime"
            }`}
          />
          {errors.coverUrl && (
            <span className="text-red-400 text-[11px] mt-1 block font-medium">
              {errors.coverUrl}
            </span>
          )}
        </div>

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

// מעטפת המודאל
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
