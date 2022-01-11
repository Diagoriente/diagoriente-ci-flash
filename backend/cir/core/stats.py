import numpy as np
import numpy.typing as npt
from sklearn.decomposition import PCA # type: ignore
from sklearn.preprocessing import scale # type: ignore

from dataclasses import dataclass

@dataclass(frozen=True)
class Pca:
    components: npt.NDArray[np.float64]
    explained_variance: npt.NDArray[np.float64]
    explained_variance_ratio: npt.NDArray[np.float64]
    kaiser_criteria: float

    @staticmethod
    def from_values(values: npt.NDArray[np.float64]) -> tuple[npt.NDArray[np.float64], "Pca"]:
        no_nan = np.copy(values)
        no_nan[np.isnan(no_nan)] = 0
        scaled = scale(no_nan)
        sk_pca = PCA()

        projected: npt.NDArray[np.float64] = sk_pca.fit_transform(scaled)

        pca = Pca(
            components = sk_pca.components_,
            explained_variance = sk_pca.explained_variance_,
            explained_variance_ratio = sk_pca.explained_variance_ratio_,
            kaiser_criteria=1/values.shape[1]
        )

        return projected, pca
