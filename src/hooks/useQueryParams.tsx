import { useMemo } from 'react';
import { useRouter } from 'next/navigation';


type QueryParams<T extends Record<string, string>> = {
  [K in keyof T]: (value: T[K]) => void;
};

export const useQueryParams = <T extends Record<string, string>>(params: T): QueryParams<T> => {
  const router = useRouter();

  return useMemo(() => {
    return Object.keys(params).reduce((acc, key) => {
      acc[key as keyof T] = (value: T[keyof T]) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        let newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        if (value === '') {
            newUrl = newUrl.replace(`?${key}=`, '').replace(`&${key}=`, '').replace(`&${key}`, '').replace(`?${key}`, '');
        }
        window.history.replaceState(null, '', newUrl);
      };

      return acc;
    }, {} as QueryParams<T>);
  }, [params, router]);
};
