import { ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export type LoadingStatus = 'loading' | 'error' | 'empty' | 'success';

interface StateRendererProps {
  status: LoadingStatus;
  loading?: boolean;
  error?: Error | null | string;
  data?: unknown;
  isEmpty?: (data: unknown) => boolean;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptySubtitle?: string;
  children: (data: unknown) => ReactNode;
}

/**
 * StateRenderer provides consistent loading, error, and empty state handling
 * across all screens in the application.
 *
 * @example
 * ```tsx
 * <StateRenderer
 *   status={loading ? 'loading' : error ? 'error' : data?.length === 0 ? 'empty' : 'success'}
 *   data={data}
 *   error={error}
 *   onRetry={refetch}
 *   emptyTitle="No lessons yet"
 *   emptySubtitle="Book your first lesson to get started"
 * >
 *   {(data) => <YourContent data={data} />}
 * </StateRenderer>
 * ```
 */
export function StateRenderer({
  status,
  loading,
  error,
  data,
  isEmpty = (d) => !d || (Array.isArray(d) && d.length === 0),
  loadingMessage = 'Loading…',
  errorTitle = 'Something went wrong',
  errorMessage = 'An error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  emptyIcon,
  emptyTitle = 'No data available',
  emptySubtitle,
  children,
}: StateRendererProps) {
  // Determine actual status if not explicitly provided
  let actualStatus = status;
  if (loading) {
    actualStatus = 'loading';
  } else if (error) {
    actualStatus = 'error';
  } else if (data !== undefined && isEmpty(data)) {
    actualStatus = 'empty';
  } else {
    actualStatus = 'success';
  }

  switch (actualStatus) {
    case 'loading':
      return <LoadingState message={loadingMessage} />;

    case 'error':
      return (
        <ErrorState
          title={errorTitle}
          message={
            typeof error === 'string'
              ? error
              : error instanceof Error
                ? error.message
                : errorMessage
          }
          onRetry={onRetry}
          retryLabel={retryLabel}
        />
      );

    case 'empty':
      return <EmptyState icon={emptyIcon} title={emptyTitle} subtitle={emptySubtitle} />;

    case 'success':
      return children(data);

    default:
      return null;
  }
}
