import { Ci, ciFromStringOrFail } from 'utils/helpers/Ci';

export type CiMap<T> = Readonly<{
  entries: () => [Ci, T][];
  keys: () => Ci[];
  rec: Record<number, T>;
  get: (ci: Ci) => T | undefined;
  getOrFail: (ci: Ci) => T;
  update: ([ci, val]: [Ci, T][]) => CiMap<T>;
}>;

export function ciMap<T>(entries: [ci: Ci, val: T][]): CiMap<T> { 
  const rec: Record<number, T> = {};

  for (let [ci, val] of entries) {
    rec[ci.id] = val;
  }

  const get = (ci: Ci): T | undefined => rec[ci.id];

  const getOrFail = (ci: Ci): T => {
    let res = rec[ci.id];
    if (res === undefined) {
      throw Error(`CiMap.getOrFail: CI ${ci} not found.`);
    } else {
      return res;
    }
  };

  const get_entries: () => [ci: Ci, val: T][] = () =>
    Object.entries(rec).map(([ciId, val]) => { 
      return [ciFromStringOrFail(ciId), val];
    });

  const keys: () => Ci[] = () =>
    Object.entries(rec).map(([ciId, val]) => {
      return ciFromStringOrFail(ciId);
    });

  const update = (entries: [Ci, T][]): CiMap<T> =>
    ciMap([...get_entries(), ...entries]);

  const result: CiMap<T> = Object.freeze({
    rec: rec,
    get: get,
    getOrFail: getOrFail,
    entries: get_entries,
    keys: keys,
    update: update,
  });

  return result;
};
