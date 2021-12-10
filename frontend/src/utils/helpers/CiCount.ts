import { Ci } from 'utils/helpers/Ci';
import { CiMap, ciMap } from 'utils/helpers/CiMap';

export type CiCount = CiMap<number> & {
  increment: (cis: Ci[]) => CiCount;
}

export function ciCount(counts: CiMap<number> = ciMap([])): CiCount {
  return {
    ...counts,
    increment: (cis: Ci[]): CiCount => 
      ciCount(counts.update(
        cis.map((ci: Ci) => [ci, (counts.get(ci) || 0) + 1])
      )),
  };
}
