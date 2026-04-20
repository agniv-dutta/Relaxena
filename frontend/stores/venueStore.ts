import { create } from 'zustand';
import { Venue, Zone } from '@/types/api';

interface VenueState {
  venue: Venue | null;
  zones: Zone[];
  isLoading: boolean;
  setVenue: (venue: Venue) => void;
  setZones: (zones: Zone[]) => void;
  updateZoneDensity: (zoneId: string, density: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useVenueStore = create<VenueState>((set) => ({
  venue: null,
  zones: [],
  isLoading: false,
  setVenue: (venue) => set({ venue }),
  setZones: (zones) => set({ zones }),
  updateZoneDensity: (zoneId, density) => set((state) => ({
    zones: state.zones.map((z) => z.id === zoneId ? { ...z, density } : z)
  })),
  setLoading: (isLoading) => set({ isLoading }),
}));
