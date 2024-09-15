import {useCallback, useEffect, useRef, useState} from 'react';

type QueryState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

/**
 * useQuery is a custom hook that executes a given promise and manages its state.
 *
 * @param {function(): Promise<T>} promiseFn - A function that returns a promise to fetch data.
 * @param {any[]} dependencies - An array of dependencies that trigger a refetch when changed.
 * @return {[QueryState<T>, boolean, () => void]} - Returns an array with the query state, a boolean indicating if it's the initial fetch, and a refetch function.
 */
export function useQuery<T>(
    dependencies: any[] = [],
    promiseFn: () => Promise<T>,
): [QueryState<T>, boolean, () => void] {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const isInitialFetch = useRef(true);

  const fetchData = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    try {
      const data = await promiseFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    } finally {
      isInitialFetch.current = false;
    }
  }, [promiseFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, isInitialFetch.current, fetchData];
}