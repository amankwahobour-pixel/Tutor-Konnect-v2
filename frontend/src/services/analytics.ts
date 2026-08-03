import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'tutorkonnect_analytics_events_v1';

export async function trackEvent(name: string, properties: Record<string, any> = {}) {
  const event = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, name, properties, timestamp: new Date().toISOString() };
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(event);
    await AsyncStorage.setItem(KEY, JSON.stringify(events));
  } catch (err) {
    console.debug('Failed to persist analytics event', err);
  }
  console.log('ANALYTICS', event);
}

export async function getEvents() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
