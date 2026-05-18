export default function SkeletonCard({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-luxury-3 border border-gold/10" />
          <div className="mt-3 space-y-2 px-1">
            <div className="flex justify-between">
              <div className="h-3.5 bg-gold/10 rounded w-3/5" />
              <div className="h-3.5 bg-gold/10 rounded w-8" />
            </div>
            <div className="h-3 bg-gold/10 rounded w-2/5" />
            <div className="h-3 bg-gold/10 rounded w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
}
