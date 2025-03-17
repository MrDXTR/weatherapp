import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { MagicCard } from "~/components/magicui/magic-card";
import { motion } from "motion/react";
import { getCurrentLocation } from "~/lib/utils";
import { Search, MapPin } from "lucide-react";

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
  onPostalCodeSearch: (postalCode: string) => void;
  onCitySearch: (city: string) => void;
}

export function LocationSearch({
  onLocationSelect,
  onPostalCodeSearch,
  onCitySearch,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { latitude, longitude } = await getCurrentLocation();
      onLocationSelect(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For numeric inputs, try as postal code first
      if (/^\d+$/.test(searchQuery.trim())) {
        onPostalCodeSearch(searchQuery.trim());
      } else {
        // Otherwise treat it as a city name
        onCitySearch(searchQuery.trim());
      }
    }
  };

  return (
    <MagicCard className="mb-6">
      <Card className="border-none bg-black/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
                className="w-full bg-white/20 text-white hover:bg-white/30 sm:w-auto"
                variant="outline"
              >
                <MapPin className="mr-2" />
                {isLoading ? "Getting location..." : "Use Current Location"}
              </Button>
            </motion.div>
            <div className="flex-1">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter city or postal code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-white/30 bg-black/30 text-white placeholder:text-white/70"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="mr-2" />
                    Search
                  </Button>
                </motion.div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </MagicCard>
  );
}
