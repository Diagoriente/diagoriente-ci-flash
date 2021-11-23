import {Ci} from "types/types";

export const ci = (id: number): Ci => Object.freeze({id: id});

export const ciFromString = (s: string | undefined | null): Ci | undefined => {
  if (s === undefined || s === null) {
    return undefined
  }

  const ciId = parseInt(s);
  if (isNaN(ciId)) {
    return undefined;
  }

  return ci(ciId);
};

export const ciListFromString = (s: string | undefined | null): Ci[] => {
  if (s === undefined || s === null) {
    return [];
  } else {
    return (
      (s ? s.split(',') : [])
      .map((ciId: string): Ci => ci(parseInt(ciId)))
    );
  }
};

