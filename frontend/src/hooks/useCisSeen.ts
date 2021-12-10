import {Ci} from 'utils/helpers/Ci';
import {CiCount, ciCount} from 'utils/helpers/CiCount';
import { useState, useCallback } from 'react';

export function useCisSeen() {
  const [cisSeen, setCisSeen] =
    useState<CiCount>(ciCount());

  const addCiSeen = useCallback(
    (cis: Ci[]): void => {

      if (cis.length > 0) {
        setCisSeen((current: CiCount) => {
          console.log("CURRENT: " + JSON.stringify(current.entries));
          const newCounts = current.increment(cis);
          console.log("NEW CISSEEN: " + JSON.stringify(newCounts.entries()));
          return newCounts;
        });
      };
    },
    [setCisSeen]
  );

  return [cisSeen, addCiSeen, setCisSeen] as const;
}

export default useCisSeen;
