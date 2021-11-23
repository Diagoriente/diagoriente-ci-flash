import {Ci, CiScores, CiScoreVals, CiNames} from "types/types";
import {ci} from 'utils/helpers/Ci';

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
