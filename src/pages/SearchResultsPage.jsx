import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";

export default function SearchResultsPage() {
  const { searchParams, listings } = useApp();
  const query = searchParams.location.trim().toLowerCase();

  const results = listings.filter((listing) => {
    if (!query) return true;
    return listing.location.toLowerCase().includes(query) || listing.country.toLowerCase().includes(query) || listing.title.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Search results</p>
        <h1 className="text-3xl font-bold">{query ? `Stays in ${searchParams.location}` : "All listings"}</h1>
        <p className="text-gray-600 max-w-2xl">Showing {results.length} rentals matching your preferences.</p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-xl font-semibold">No results found</p>
          <p className="mt-3 text-gray-600">Try another destination or update your filters.</p>
          <Link to="/" className="mt-6 inline-flex rounded-2xl bg-airbnb px-6 py-3 text-sm font-semibold text-white hover:bg-airbnb-dark transition">Back to home</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
