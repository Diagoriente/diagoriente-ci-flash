import {Ci, ci} from 'utils/helpers/Ci';


export type CiNames = {
  map: Record<number, string>;
  get: (ci: Ci) => string;
  array: () => {ci: Ci, name: string}[];
}


export const ciNamesFromRecord = (rec: Record<number, string>): CiNames => {
  return {
    map: rec,
    get: (ci: Ci): string => rec[ci.id],
    array: (): {ci: Ci, name: string}[] => {
      return Object.entries(rec).map(([ciId, ciName]) => { 
        return{ci: ci(+ciId), name: ciName}
      });
    },
  };
};

