import { useEffect } from 'react';
import { wsManager } from '@/lib/websocket';
import { useVenueStore } from '@/stores/venueStore';
import { useAlertStore } from '@/stores/alertStore';
import { useQueueStore } from '@/stores/queueStore';

export const useWebSocket = (venueId: string) => {
  const updateZoneDensity = useVenueStore((state) => state.updateZoneDensity);
  const addAlert = useAlertStore((state) => state.addAlert);
  const updateQueuePosition = useQueueStore((state) => state.updatePosition);

  useEffect(() => {
    wsManager.connect();

    wsManager.on(`crowd_update:${venueId}`, (data) => {
      updateZoneDensity(data.zone_id, data.density);
    });

    wsManager.on(`alert:${venueId}`, (data) => {
      addAlert(data);
    });

    wsManager.on('queue_update', (data) => {
      updateQueuePosition(data.position, data.eta);
    });

    return () => {
      wsManager.disconnect();
    };
  }, [venueId, updateZoneDensity, addAlert, updateQueuePosition]);
};
