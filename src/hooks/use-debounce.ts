import { useEffect, useState } from 'react';

/**
 * Debounces a value by the specified delay.
 *
 * Useful for delaying expensive operations like API calls
 * when the user is typing in a search input.
 *
 * @param value - The value to debounce.
 * @param delay - Delay in milliseconds (default: 300ms).
 * @returns The debounced value, which updates after the delay elapses
 *          without `value` changing.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 *
 * useEffect(() => {
 *   // This runs 500ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
