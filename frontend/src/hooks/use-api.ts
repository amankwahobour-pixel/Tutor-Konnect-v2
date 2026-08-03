import { useEffect, useState } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: React.DependencyList = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call refetch asynchronously to avoid synchronous setState inside effect
    (async () => {
      try {
        await refetch();
      } catch {}
    })();
    // We intentionally mirror the incoming dependencies array here. ESLint can't verify a non-literal dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
