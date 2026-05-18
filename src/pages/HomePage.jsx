import ListingCard from "../components/ListingCard";
import { useApp } from "../context/AppContext";

export default function HomePage({ selectedCategory }) {
  const { listings } = useApp();
  const filteredListings = selectedCategory === "all"
    ? listings
    : listings.filter((listing) => listing.category === selectedCategory);

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Find your next stay</h1>
        <p className="max-w-2xl text-gray-600">
          Browse unique homes, cabins, villas, and memorable stays from around the world.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
