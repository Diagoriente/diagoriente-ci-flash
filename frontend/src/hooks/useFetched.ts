import {useState, useEffect, useMemo} from 'react';
import {fetched} from "services/backend";


function useFetched<T>(
  path: string,
  params: Record<string, number | string | boolean | object | undefined> = {},
  dependencies: any[] = [],
  cons: (r: any) => T = r => r,
) {

  const params_ = useMemo(() => params, dependencies);

  const [val, setVal] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!Object.values(params_).includes(undefined)) {
      fetched(
         path,
         params_ as Record<string, number | string | boolean | object>,
         cons,
      ).then(setVal);
    }
  }, [params_, setVal]);

  return [val, setVal] as const;
}

export default useFetched;


