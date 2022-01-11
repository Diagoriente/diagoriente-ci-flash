import {CiMap, ciMapFromRecord} from "utils/helpers/CiMap";


export type CiAxes = CiMap<number[]>;

export const ciAxesFromRecord = (rec: Record<number, number[]>): CiAxes => {
  const res = ciMapFromRecord<number[]>(rec);
  return res
}
