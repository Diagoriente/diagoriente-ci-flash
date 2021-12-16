import { Ci, ciListFromString, ciListToString } from 'utils/helpers/Ci';
import { CiMap, ciMap } from 'utils/helpers/CiMap';

export type CiSet = CiMap<null> & {
  values: () => Ci[];
  insert: (ci: Ci | Ci[]) => CiSet;
};

export function ciSet(values_: Ci[]): CiSet {
  const map = ciMap(values_.map((ci: Ci) => [ci, null]));

  const values = (): Ci[] => map.keys();
  const insert = (ci:Ci | Ci[]): CiSet =>
    Array.isArray(ci) ?
      ciSet([...values(), ...ci]) :
      ciSet([...values(), ci]);

  return {...map, values: values, insert: insert};
}

export const ciSetFromString = (s: string | undefined | null): CiSet | null => {
  const list = ciListFromString(s);
  return list === null ? null : ciSet(list);
};

export const ciSetToString = (cis: CiSet): string => {
  return ciListToString(cis.values());
};
