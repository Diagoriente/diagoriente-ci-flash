import { ValidationError } from "utils/helpers/Errors";

export type Ci = { 
  id: number, 
  toJSON: () => string
};

export const ci = (id: number): Ci => { return {
  id: id,
  toJSON(): string {
    if (this === undefined) {
      return ""
    } else {
      return this.id.toString();
    }
  },
}};

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

export const ciFromStringOrFail = (s: string): Ci => {
  const ci = ciFromString(s);
  if (ci === null) {
    throw new ValidationError(`${s} is not a valid ci identifier`);
  } else {
    return ci;
  }
}

export const ciToString = (c: Ci): string => c.id.toString();

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

export const ciListToString = (list: Ci[]): string => {
  return list.map(ci => ci.id.toString()).join(",");
};
