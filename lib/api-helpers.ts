export const getResponseData = <T = any>(response: any): T | null => {
  if (!response?.data) {
    return null;
  }

  if (response.data.data !== undefined) {
    return response.data.data as T;
  }

  return response.data as T;
};

export const getResponseMessage = (
  response: any,
  fallback: string
): string => {
  return response?.data?.message || fallback;
};

export const getErrorMessage = (error: any, fallback: string): string => {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export const getNestedValue = <T = any>(
  payload: any,
  keys: string[],
  fallback: T
): T => {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  for (const key of keys) {
    if (payload[key] !== undefined) {
      return payload[key] as T;
    }
  }

  return fallback;
};
