import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { LiveScore } from '@/types/api';
import { useEventStore } from '@/stores/eventStore';

export const useLiveScore = (eventId: string) => {
  const updateScore = useEventStore((state) => state.updateScore);

  const { data, isLoading } = useQuery({
    queryKey: ['live-score', eventId],
    queryFn: async () => {
      const { data } = await api.get<LiveScore>(`/api/events/${eventId}/live-score`);
      return data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  useEffect(() => {
    if (data) {
      updateScore(data);
    }
  }, [data, updateScore]);

  return { score: data, isLoading };
};
