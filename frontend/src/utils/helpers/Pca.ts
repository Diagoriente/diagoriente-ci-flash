export type Pca = {
  variables_names: string[];
  components: number[][];
  explained_variance_ratio: number[];
  kaiser_criteria: number;
}
