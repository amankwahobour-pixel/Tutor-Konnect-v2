import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBooking } from '@/features/bookings/api/booking.api';
import { BookingPayload } from '@/types';

const STORAGE_KEY = 'tutorkonnect_queued_bookings_v1';

export interface QueuedBooking<T extends BookingPayload = BookingPayload> {
  id: string; // local id
  payload: T;
  created_at: string;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getQueuedBookings(): Promise<QueuedBooking[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedBooking[];
  } catch (err) {
    console.error('Failed to read queued bookings', err);
    return [];
  }
}

export async function enqueueBooking(payload: BookingPayload): Promise<QueuedBooking> {
  const entry: QueuedBooking = {
    id: makeId(),
    payload,
    created_at: new Date().toISOString(),
  };

  try {
    const existing = await getQueuedBookings();
    existing.unshift(entry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return entry;
  } catch (err) {
    console.error('Failed to enqueue booking', err);
    throw err;
  }
}

export async function removeQueuedBooking(id: string): Promise<void> {
  try {
    const existing = await getQueuedBookings();
    const next = existing.filter((e) => e.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Failed to remove queued booking', err);
    throw err;
  }
}

// Attempt to sync queued bookings to backend. Returns list of synced ids.
export async function syncQueuedBookings(): Promise<{ synced: string[]; failed: string[] }> {
  const synced: string[] = [];
  const failed: string[] = [];

  const queue = await getQueuedBookings();

  for (const entry of queue.slice().reverse()) {
    try {
      // send to backend
      await createBooking(entry.payload);
      // remove from storage
      await removeQueuedBooking(entry.id);
      synced.push(entry.id);
    } catch (err) {
      console.debug('Failed to sync queued booking', entry.id, err);
      failed.push(entry.id);
      // continue with others
    }
  }

  return { synced, failed };
}
