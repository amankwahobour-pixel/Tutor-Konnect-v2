import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for graceful error handling
 * Catches errors in child components and displays a fallback UI
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-red-50 px-4">
          <View className="bg-white rounded-lg p-6 border border-red-200 w-full">
            <Text className="text-red-600 font-bold text-lg mb-2">Something went wrong</Text>
            <Text className="text-red-600 text-sm mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Text 
              onPress={() => this.setState({ hasError: false, error: null })}
              className="text-blue-600 font-semibold"
            >
              Try Again
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
