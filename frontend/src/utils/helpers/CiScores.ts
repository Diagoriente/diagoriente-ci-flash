import {Ci,  ci} from 'utils/helpers/Ci';
import {CiNames} from 'utils/helpers/CiNames';


export type CiScoreVals = {distance: number; ouverture: number};


export type CiScores = {
  map: Record<number, CiScoreVals>;
  get: (ci: Ci) => CiScoreVals;
  distanceAsc: (ciNames: CiNames) => {name: string, val: number}[];
  ouvertureDesc: (ciNames: CiNames) => {name: string, val: number}[];
};


export const ciScoresFromRecord = (rec: Record<number, CiScoreVals>): CiScores => {
  return {
    map: rec,
    get: (ci: Ci): CiScoreVals => rec[ci.id],
    distanceAsc: (ciNames: CiNames): {name: string, val: number}[] => Object.entries(rec)
      .map(([ciId, score]) => {return{name: ciNames.get(ci(+ciId)), val: score.distance}}),
    ouvertureDesc: (ciNames: CiNames): {name: string, val: number}[] => Object.entries(rec)
      .map(([ciId, score]) => {return{name: ciNames.get(ci(+ciId)), val: score.ouverture}}),
  };
};
