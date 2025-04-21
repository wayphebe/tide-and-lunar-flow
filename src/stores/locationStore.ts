
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationState {
  currentLocation: Location | null;
  savedLocations: Location[];
  setCurrentLocation: (location: Location) => void;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (locationName: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentLocation: null,
      savedLocations: [],
      setCurrentLocation: (location) => set({ currentLocation: location }),
      addSavedLocation: (location) => 
        set((state) => ({
          savedLocations: [...state.savedLocations.filter(loc => loc.name !== location.name), location]
        })),
      removeSavedLocation: (locationName) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter(loc => loc.name !== locationName)
        })),
    }),
    {
      name: 'lunar-tide-location-storage',
    }
  )
);
