
import { Location } from "@/stores/locationStore";

export type TidePoint = {
  time: string; // Time in HH:MM format
  height: number; // Height in meters
  isHighTide: boolean;
};

// This is a mock tide predictor for our MVP
// In a real app, we would use a tide prediction API or a more accurate algorithm
export const predictTides = (date: Date, location: Location): TidePoint[] => {
  const result: TidePoint[] = [];
  const dateStr = date.toISOString().split('T')[0];
  
  // Use location + date as seed for pseudo-random generation
  const seed = location.latitude + location.longitude + parseInt(dateStr.replace(/-/g, ''));
  const seedRandom = (min: number, max: number) => {
    const x = Math.sin(seed + result.length) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };
  
  // Coastal locations typically have 2 high tides and 2 low tides per day
  // Times are approximately 6 hours apart, but can vary
  
  // First low tide (early morning)
  const firstLowHour = Math.floor(seedRandom(2, 6));
  const firstLowMinute = Math.floor(seedRandom(0, 60));
  result.push({
    time: `${firstLowHour.toString().padStart(2, '0')}:${firstLowMinute.toString().padStart(2, '0')}`,
    height: seedRandom(0.1, 0.5),
    isHighTide: false
  });
  
  // First high tide (morning to noon)
  const firstHighHour = Math.floor(seedRandom(firstLowHour + 5, firstLowHour + 7));
  const firstHighMinute = Math.floor(seedRandom(0, 60));
  result.push({
    time: `${firstHighHour.toString().padStart(2, '0')}:${firstHighMinute.toString().padStart(2, '0')}`,
    height: seedRandom(1.2, 2.2),
    isHighTide: true
  });
  
  // Second low tide (afternoon)
  const secondLowHour = Math.floor(seedRandom(firstHighHour + 5, firstHighHour + 7));
  const secondLowMinute = Math.floor(seedRandom(0, 60));
  result.push({
    time: `${(secondLowHour % 24).toString().padStart(2, '0')}:${secondLowMinute.toString().padStart(2, '0')}`,
    height: seedRandom(0.1, 0.5),
    isHighTide: false
  });
  
  // Second high tide (evening)
  const secondHighHour = Math.floor(seedRandom(secondLowHour + 5, secondLowHour + 7)) % 24;
  const secondHighMinute = Math.floor(seedRandom(0, 60));
  result.push({
    time: `${secondHighHour.toString().padStart(2, '0')}:${secondHighMinute.toString().padStart(2, '0')}`,
    height: seedRandom(1.0, 2.0),
    isHighTide: true
  });
  
  // Sort by time
  return result.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''));
    const timeB = parseInt(b.time.replace(':', ''));
    return timeA - timeB;
  });
};

// Get tide predictions for multiple days
export const getMonthTidePredictions = (
  month: number, 
  year: number, 
  location: Location
): Record<number, TidePoint[]> => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<number, TidePoint[]> = {};
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    result[day] = predictTides(date, location);
  }
  
  return result;
};
