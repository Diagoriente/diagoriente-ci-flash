import { Ci, ci, ciFromStringOrFail} from 'utils/helpers/Ci';


export type CiMap<T> = Readonly<{
  entries: () => [Ci, T][];
  keys: () => Ci[];
  rec: Map<number, T>;
  get: (ci: Ci) => T | undefined;
  getOrFail: (ci: Ci) => T;
  update: ([ci, val]: [Ci, T][]) => CiMap<T>;
  size: () => number;
}>;


export function ciMap<T>(entries: [ci: Ci, val: T][]): CiMap<T> {
  const rec: Map<number, T> = new Map();

  for (let [ci, val] of entries) {
    rec.set(ci.id, val);
  }

  const size = () => rec.size;

  const get = (ci: Ci): T | undefined => rec.get(ci.id);

  const getOrFail = (ci: Ci): T => {
    let res = rec.get(ci.id);
    if (res === undefined) {
      throw Error(`CiMap.getOrFail: CI ${ci} not found.`);
    } else {
      return res;
    }
  };

  const get_entries: () => [ci: Ci, val: T][] = () =>
    Array.from(rec.entries()).map(([ciId, val]) => [ci(ciId), val]);

  const keys: () => Ci[] = () =>
    Array.from(rec.entries()).map(([ciId]) => ci(ciId));

  const update = (entries: [Ci, T][]): CiMap<T> =>
    ciMap([...get_entries(), ...entries]);

  const result: CiMap<T> = Object.freeze({
    rec: rec,
    get: get,
    getOrFail: getOrFail,
    entries: get_entries,
    keys: keys,
    update: update,
    size: size,
  });

  return result;
};


export const ciMapFromRecord = <T>(rec: Record<string, T>): CiMap<T> => {

  const f = ([ciId, val]: [string, T]): [Ci, T] =>
    [ciFromStringOrFail(ciId), val];
  const entr: [Ci, T][] = Object.entries(rec).map(r => {return f(r)});
  const map: CiMap<T> = ciMap<T>(entr);

  return map;
};

