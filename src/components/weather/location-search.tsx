import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { motion } from "motion/react";
import { getCurrentLocation } from "~/lib/utils";
import { Search, MapPin, Loader2 } from "lucide-react";

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
  onPostalCodeSearch: (postalCode: string) => void;
  onCitySearch: (city: string) => void;
  isLoading?: boolean;
}

export function LocationSearch({
  onLocationSelect,
  onPostalCodeSearch,
  onCitySearch,
  isLoading = false,
}: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = () => {
    setSearchError(null);

    if (!searchTerm.trim()) {
      setSearchError("Please enter a city name ");
      return;
    }

    // Check if input is a postal code (simple check for numbers only)
    if (/^\d+$/.test(searchTerm)) {
      onPostalCodeSearch(searchTerm);
    } else {
      onCitySearch(searchTerm);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setSearchError(null);

    try {
      const { latitude, longitude } = await getCurrentLocation();
      onLocationSelect(latitude, longitude);
    } catch (error) {
      setSearchError(
        "Unable to get your location. Please check your browser permissions.",
      );
      console.error(error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl"
    >
      <Card className="bg-black/40 backdrop-blur-md">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter city name "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 bg-white/10 pr-10 text-white placeholder:text-white/50 focus-visible:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-white/70" />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="h-11 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>

              <Button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation || isLoading}
                variant="outline"
                className="h-11 border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                {isGettingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Current Location
              </Button>
            </div>
          </div>

          {searchError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-400"
            >
              {searchError}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
