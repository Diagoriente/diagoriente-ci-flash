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
