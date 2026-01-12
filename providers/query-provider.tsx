"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Network errors are handled gracefully in services (return null instead of throwing)
      // Retry logic: Don't retry on network errors or 401 errors
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
