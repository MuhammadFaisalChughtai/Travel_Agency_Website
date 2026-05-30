"use client";

import { useState } from "react";
import { FlightListCard } from "./FlightListCard";
import { getMoreFlights } from "@/app/actions/flights";
import { Button } from "@/components/roadtoumrah/ui/Button";

interface PaginatedFlightListProps {
  initialFlights: any[];
  totalFlightsCount: number;
}

export function PaginatedFlightList({
  initialFlights,
  totalFlightsCount,
}: PaginatedFlightListProps) {
  const [flights, setFlights] = useState(initialFlights);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const newFlights = await getMoreFlights(flights.length, 6);
      setFlights((prev) => [...prev, ...newFlights]);
    } catch (err) {
      console.error("Failed to load more flights:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = flights.length < totalFlightsCount;

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 w-full">
        {flights.map((flight) => (
          <FlightListCard key={flight.id} {...flight} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-[#064e3b] hover:bg-[#483434] text-white text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md"
          >
            {loading ? "Loading..." : "Load More Flights"}
          </Button>
        </div>
      )}
    </div>
  );
}
