export type Ci = { id: number };

export type CiReco = {
    ciClose: Ci[];
    ciOpening: Ci[];
    ciDistant: Ci[];
};

export type CiNames = {
  map: Record<number, string>;
  get: (ci: Ci) => string;
  array: () => {ci: Ci, name: string}[];
}

export type CiScoreVals = {distance: number; ouverture: number};

export type CiScores = {
  map: Record<number, CiScoreVals>;
  get: (ci: Ci) => CiScoreVals;
  distanceAsc: (ciNames: CiNames) => {name: string, val: number}[];
  ouvertureDesc: (ciNames: CiNames) => {name: string, val: number}[];
};

export type GraphType = "distance" | "ouverture";
