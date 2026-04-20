import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Venue, Zone, WaitTime } from '@/types/api';

export const useVenueData = (venueId: string) => {
  const venueQuery = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const { data } = await api.get<Venue>(`/venues/${venueId}`);
      return data;
    },
  });

  const zonesQuery = useQuery({
    queryKey: ['zones', venueId],
    queryFn: async () => {
      const { data } = await api.get<Zone[]>(`/venues/${venueId}/zones`);
      return data;
    },
  });

  const waitsQuery = useQuery({
    queryKey: ['waits', venueId],
    queryFn: async () => {
      const { data } = await api.get<WaitTime[]>(`/venues/${venueId}/waits`);
      return data;
    },
  });

  return {
    venue: venueQuery.data,
    zones: zonesQuery.data,
    waits: waitsQuery.data,
    isLoading: venueQuery.isLoading || zonesQuery.isLoading || waitsQuery.isLoading,
    error: venueQuery.error || zonesQuery.error || waitsQuery.error,
  };
};
