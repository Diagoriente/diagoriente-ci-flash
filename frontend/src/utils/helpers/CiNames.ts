import {ciFromStringOrFail} from 'utils/helpers/Ci';
import {CiMap, ciMap} from 'utils/helpers/CiMap';

export type CiNames = CiMap<string>;

export const ciNamesFromRecord = (rec: Record<number, string>): CiNames =>
  ciMap(Object.entries(rec).map(([ciId, ciName]) =>
    [ciFromStringOrFail(ciId), ciName]
  ));

