import { categories } from "../data/listings";

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide py-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition flex-shrink-0 ${
                selected === cat.id ? "border-gray-800 opacity-100" : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
