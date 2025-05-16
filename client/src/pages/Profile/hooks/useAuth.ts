/**
 * Custom React hook for providing authentication headers used in API requests.
 * Ensures headers are memoized to prevent unnecessary recalculations.
 */

import { useMemo } from "react";
import { getAuthHeaders } from "../types/api";

// Hook for accessing authentication headers
export const useAuth = () => {
  const headers = useMemo(() => getAuthHeaders(), []);
  return { headers };
};