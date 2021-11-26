export type Ci = { id: number };

export const ci = (id: number): Ci => Object.freeze({id: id});

export const ciFromString = (s: string | undefined | null): Ci | null => {
  if (s === undefined || s === null) {
    return null
  }

  const ciId = parseInt(s);
  if (isNaN(ciId)) {
    return null;
  }

  return ci(ciId);
};

export const ciListFromString = (s: string | undefined | null): Ci[] | null => {
  if (s === undefined || s === null) {
    return [];
  } else {
    let res: Ci[] = [];
    for (const ciId of (s ? s.split(',') : [])) {
      const ciIdInt = parseInt(ciId);
      if (isNaN(ciIdInt)) {
        return null;
      } else {
        res.push(ci(ciIdInt));
      }
    }
    return res;
  }
};

