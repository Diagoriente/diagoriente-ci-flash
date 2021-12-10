import {Ci, ciFromStringOrFail} from 'utils/helpers/Ci';
import {CiNames} from 'utils/helpers/CiNames';
import {CiMap, ciMap} from 'utils/helpers/CiMap';


export type CiScoreVals = {distance: number; ouverture: number};


export type CiScores = CiMap<CiScoreVals> & {
  distanceAsc: (ciNames: CiNames) => {name: string, val: number}[];
  ouvertureDesc: (ciNames: CiNames) => {name: string, val: number}[];
};

export const ciScores = (map: CiMap<CiScoreVals> = ciMap([])): CiScores => {
  return {
    ...map,
    distanceAsc: (ciNames: CiNames): {name: string, val: number}[] => 
      map.entries().map(([ci, score]) => { return {
        name: ciNames.getOrFail(ci),
        val: score.distance
      }}),
    ouvertureDesc: (ciNames: CiNames): {name: string, val: number}[] => 
      map.entries().map(([ci, score]) => { return {
        name: ciNames.getOrFail(ci),
        val: score.ouverture
      }}),
  };
}

export const ciScoresFromRecord = (rec: Record<number, CiScoreVals>): CiScores => {
  return ciScores(ciMap(Object.entries(rec).map(([ciId, cisv]) => {
    let res: [Ci, CiScoreVals] = [ciFromStringOrFail(ciId), cisv];
    return res;
  })));
};
