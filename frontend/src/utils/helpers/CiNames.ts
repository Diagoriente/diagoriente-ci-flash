import {Ci, CiNames} from 'types/types';
import {ci} from 'utils/helpers/Ci';

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

