import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {fetchCiNames} from 'services/backend';


// Hook for a states that is also sychronized to a search parameter.
// The returned state is null if the query parameter is present and could not
// be decoded.
export function useStateSP<T>(defaultVal: T, paramName: string, 
    decode: (s: string | null) => T | null, encode: (v: T) => string) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamString: string | null = searchParams.get(paramName);
  const searchParamValue: T | null = searchParamString === null ?
    defaultVal :
    decode(searchParamString);
  const [state, setState] = useState<T | null>(searchParamValue);

  useEffect(() => {
    if (state !== null) {
      searchParams.set(paramName, encode(state));
      setSearchParams(searchParams);
    }
  }, [state, searchParams, setSearchParams, searchParams]);

  return [state, setState] as const; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useStateSP;
