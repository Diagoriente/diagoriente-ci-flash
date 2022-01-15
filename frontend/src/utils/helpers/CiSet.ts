import { Ci, ciListFromString, ciListToString } from 'utils/helpers/Ci';
import { CiMap, ciMap } from 'utils/helpers/CiMap';

export type CiSet = {
  map: CiMap<null>;
  size: () => number;
  values: () => Ci[];
  insert: (ci: Ci | Ci[]) => CiSet;
  toJSON: () => number[];
};

export function ciSet(values_: Ci[]): CiSet {
  const map = ciMap(values_.map((ci: Ci) => [ci, null]));

  const values = (): Ci[] => map.keys();

  const size = (): number => map.size();

  const insert = (ci:Ci | Ci[]): CiSet =>
    Array.isArray(ci) ?
      ciSet([...values(), ...ci]) :
      ciSet([...values(), ci]);

  const toJSON = (): number[] => values().map(ci => ci.id);

  return {map: map, size: size, values: values, insert: insert, toJSON: toJSON };
}

export const ciSetFromString = (s: string | undefined | null): CiSet | null => {
  const list = ciListFromString(s);
  return list === null ? null : ciSet(list);
};

export const ciSetToString = (cis: CiSet): string => {
  return ciListToString(cis.values());
};
