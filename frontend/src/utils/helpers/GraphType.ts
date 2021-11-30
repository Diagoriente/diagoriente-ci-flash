export type GraphType = "distance" | "ouverture";

export const graphType = (name: string | null): GraphType | null => {
  switch (name) {
    case "distance":
    case "ouverture":
      return name;
    default:
      return null;
  }
};

export const graphTypeFromString = (s: string | null): GraphType | null =>
  graphType(s);

export const graphTypeToString = (g: GraphType): string => g.toString();
