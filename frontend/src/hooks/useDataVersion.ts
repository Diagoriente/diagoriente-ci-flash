import {useStateSP} from 'hooks/useStateSP';


const decode = (x: string | null): string | undefined => x === null ? undefined : x;
const encode = (x: string | undefined): string | null => x === undefined ? null : x;


export function useDataVersion(defaultValue: string | undefined) {
  const [dataVersion, setDataVersion] = 
    useStateSP<string | undefined>(defaultValue, "dataVersion", decode, encode);
  return [dataVersion, setDataVersion] as const;
}

export default useDataVersion;
