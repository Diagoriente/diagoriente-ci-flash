import numpy as np
import numpy.typing as npt

from cir.core.model import CiSelection
from dataclasses import dataclass

@dataclass(frozen=True)
class Metiers:
    names: list[str]
    coefficients: npt.NDArray[np.float64]

    def scores(self, cis_selected: CiSelection, ci_names: list[str]) -> npt.NDArray[np.float64]:
        cis_col_matrix: npt.NDArray[np.float64] = np.zeros(len(ci_names), 
                dtype=np.float64)
        cis_col_matrix[cis_selected.to_ints()] = 1
        res = np.dot(self.coefficients, cis_col_matrix)
        return np.asarray(res).flatten()


    def recommend(self, cis_selected: CiSelection, ci_names: list[str], n: int) -> list[str]:
        scores = self.scores(cis_selected, ci_names)
        recommended_metiers_ids = sorted(
                range(len(self.names)),
                key = lambda i: scores[i], 
                reverse=True
                )[:n]
        recommended_metiers_names = [self.names[i] for i in recommended_metiers_ids]
        return recommended_metiers_names


    def recommend_with_score(self, cis_selected: CiSelection, ci_names: list[str], n: int) -> list[tuple[str, np.float64]]:
        scores = self.scores(cis_selected, ci_names)
        recommended_metiers_ids = sorted(
                range(len(self.names)),
                key = lambda i: scores[i], 
                reverse=True
                )[:n]
        recommended_metiers = [(self.names[i], scores[i]) for i in recommended_metiers_ids]
        return recommended_metiers
