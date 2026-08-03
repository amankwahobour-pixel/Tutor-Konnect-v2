import React from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { syncQueuedBookings } from '@/features/bookings/services/booking-queue.service';
import { trackEvent } from '@/services/analytics';

function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('Notification', message);
  }
}

export const BookingSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    // attempt a sync on mount
    (async () => {
      try {
        const res = await syncQueuedBookings();
        if (res.synced.length > 0) {
          const msg = `Synced ${res.synced.length} queued booking(s)`;
          showToast(msg);
          trackEvent('booking.sync', { synced: res.synced.length, failed: res.failed.length });
        }
      } catch (err) {
        console.debug('Initial booking sync failed', err);
      }
    })();

    // listen to connectivity changes and attempt sync when online
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        (async () => {
          try {
            const res = await syncQueuedBookings();
            if (res.synced.length > 0) {
              const msg = `Synced ${res.synced.length} queued booking(s)`;
              showToast(msg);
              trackEvent('booking.sync', { synced: res.synced.length, failed: res.failed.length });
            }
          } catch (err) {
            console.debug('Background booking sync failed', err);
          }
        })();
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};
