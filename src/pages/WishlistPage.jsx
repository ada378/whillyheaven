import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";

export default function WishlistPage() {
  const { wishlist, listings } = useApp();
  const items = listings.filter((listing) => wishlist.includes(listing.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Your wishlist</h1>
        <p className="mt-2 text-gray-600">Manage the stays you want to revisit later.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-xl font-semibold">Your wishlist is empty</p>
          <p className="mt-3 text-gray-600">Browse homes and tap the heart icon to save favorites.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
