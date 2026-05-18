import { categories } from "../data/listings";

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="sticky top-16 z-40 bg-luxury border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-hide py-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition flex-shrink-0 ${
                selected === cat.id
                  ? "border-gold opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80 hover:border-gold/40"
              }`}
            >
              <span className="text-xl sm:text-2xl">{cat.icon}</span>
              <span className={`text-xs font-medium whitespace-nowrap ${selected === cat.id ? "text-gold" : "text-gold/60"}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
