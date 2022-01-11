import {CiMap, ciMapFromRecord } from 'utils/helpers/CiMap';

export type CiNames = CiMap<string>;

export const ciNamesFromRecord = ciMapFromRecord;
//(rec: Record<number, string>): CiNames =>
//  ciMap(Object.entries(rec).map(([ciId, ciName]) =>
//    [ciFromStringOrFail(ciId), ciName]
//  ));
//
