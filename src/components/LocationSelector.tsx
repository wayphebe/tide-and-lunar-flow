
import { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLocationStore } from "@/stores/locationStore";

export const LocationSelector = () => {
  const { currentLocation, setCurrentLocation, savedLocations } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // On first load, try to get user's location
    if (!currentLocation) {
      getUserLocation();
    }
  }, []);

  const getUserLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use the coordinates to get the location name
          // For now, we'll just use "Current Location"
          setCurrentLocation({
            name: "当前位置",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location
          setCurrentLocation({
            name: "北京",
            latitude: 39.9042,
            longitude: 116.4074
          });
          setIsLoading(false);
        }
      );
    } else {
      // Geolocation not supported
      setCurrentLocation({
        name: "北京",
        latitude: 39.9042,
        longitude: 116.4074
      });
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-secondary/30">
          {isLoading ? "加载中..." : currentLocation?.name || "选择位置"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={getUserLocation}>
          获取当前位置
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrentLocation({
            name: "青岛",
            latitude: 36.0671,
            longitude: 120.3826
          })}
        >
          青岛
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrentLocation({
            name: "汕头",
            latitude: 23.3535,
            longitude: 116.6820
          })}
        >
          汕头
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrentLocation({
            name: "厦门",
            latitude: 24.4798,
            longitude: 118.0894
          })}
        >
          厦门
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrentLocation({
            name: "深圳",
            latitude: 22.5431,
            longitude: 114.0579
          })}
        >
          深圳
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

