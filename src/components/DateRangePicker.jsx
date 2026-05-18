/**
 * Calculates the number of nights between two date strings.
 * Exported for testability.
 */
export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(checkOut) - new Date(checkIn)
  return Math.ceil(diff / 86_400_000)
}

export default function DateRangePicker({ checkIn, checkOut, onChange, minDate }) {
  const today = minDate || new Date().toISOString().split('T')[0]
  const isInvalid = checkIn && checkOut && checkOut <= checkIn

  return (
    <div className="border border-gray-300 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-gray-300">
        {/* Check-in */}
        <div className="p-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Check-in
          </label>
          <input
            type="date"
            className="w-full text-sm outline-none bg-transparent cursor-pointer"
            value={checkIn}
            min={today}
            onChange={(e) => onChange(e.target.value, checkOut)}
          />
        </div>
        {/* Check-out */}
        <div className="p-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Check-out
          </label>
          <input
            type="date"
            className="w-full text-sm outline-none bg-transparent cursor-pointer"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => onChange(checkIn, e.target.value)}
          />
        </div>
      </div>
      {isInvalid && (
        <p className="text-xs text-red-500 px-3 pb-2">
          Check-out must be after check-in
        </p>
      )}
    </div>
  )
}
