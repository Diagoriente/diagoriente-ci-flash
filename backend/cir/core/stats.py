from enum import Enum
import numpy as np
import numpy.typing as npt
from sklearn.decomposition import PCA # type: ignore
from sklearn.preprocessing import scale # type: ignore

from dataclasses import dataclass
from cir.core.metiers import Metiers

@dataclass(frozen=True)
class Pca:
    variables_names: list[str]
    components: npt.NDArray[np.float64]
    explained_variance: npt.NDArray[np.float64]
    explained_variance_ratio: npt.NDArray[np.float64]
    kaiser_criteria: float

    @staticmethod
    def from_values(values: npt.NDArray[np.float64], variables_names: list[str]) -> tuple[npt.NDArray[np.float64], "Pca"]:
        no_nan = np.copy(values)
        no_nan[np.isnan(no_nan)] = 0
        scaled = scale(no_nan)
        sk_pca = PCA()

        projected: npt.NDArray[np.float64] = sk_pca.fit_transform(scaled)

        pca = Pca(
            variables_names = variables_names,
            components = sk_pca.components_,
            explained_variance = sk_pca.explained_variance_,
            explained_variance_ratio = sk_pca.explained_variance_ratio_,
            kaiser_criteria=1/values.shape[1]
        )

        return projected, pca


class CiInfluenceMethod(Enum):
    SUM = 'sum'
    VAR = 'var'


def ci_coefs_metiers_quantiles(
        metiers: Metiers,
        quantiles: list[float] = [.25, .5, .75]) -> npt.NDArray[np.float64]:
    mc = metiers.coefficients
    quant = np.quantile(mc, q=quantiles, axis=0).transpose()
    return quant



def ci_influence(
        metiers: Metiers,
        method: CiInfluenceMethod = CiInfluenceMethod.SUM
        ) -> tuple[npt.NDArray[np.float64], npt.NDArray[np.int32]]:
    mc = metiers.coefficients
    if method == CiInfluenceMethod.SUM:
        score = mc.sum(axis=0)
    elif method == CiInfluenceMethod.VAR:
        score = mc.var(axis=0)
    else:
        raise RuntimeError(f"CiInfluenceMethod {method} not implemented ")
    index_sort = score.argsort()
    rank = np.array([r for r, _ in sorted(list(enumerate(index_sort)), key = lambda x: x[1])])
    return score, rank
