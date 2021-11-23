import {GraphType} from "types/types";

export const graphType = (name: string | undefined): GraphType | undefined => {
  switch (name) {
    case "distance":
    case "ouverture":
      return name;
    default:
      return undefined;
  }
};
