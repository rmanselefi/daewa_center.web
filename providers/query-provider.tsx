"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't show error overlays for network errors - they're handled gracefully
      onError: (error) => {
        // Network errors are handled in services, so we can suppress them here
        if (error instanceof AxiosError && !error.response && error.request) {
          // This is a network error, already handled in service layer
          return;
        }
        // For other errors, you might want to log them or show a toast
        // but we won't throw to prevent error overlays for expected errors
      },
      retry: (failureCount, error) => {
        // Don't retry on network errors or 401 errors
        if (error instanceof AxiosError) {
          if (!error.response && error.request) {
            // Network error - don't retry
            return false;
          }
          if (error.response?.status === 401) {
            // Unauthorized - don't retry
            return false;
          }
        }
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
