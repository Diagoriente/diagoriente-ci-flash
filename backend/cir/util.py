from pathlib import Path
from dataclasses import dataclass
import numpy as np
import numpy.typing as npt
import cir.constants as constants
import time
from sklearn.decomposition import PCA # type: ignore
from sklearn.preprocessing import scale # type: ignore


# TODO: initialize rng with seconds since Epoch
if constants.RNGSEED != None:
    rg = np.random.default_rng(constants.RNGSEED)
else:
    seed = time.time_ns()
    rg = np.random.default_rng(constants.RNGSEED)


@dataclass(frozen=True)
class DataSet:
    ci_path: Path
    metiers_path: Path


def pca(values: npt.NDArray[np.float64]) -> npt.NDArray[np.float64]:
    no_nan = np.copy(values)
    no_nan[np.isnan(no_nan)] = 0
    scaled = scale(no_nan)
    pca = PCA()
    rotated: npt.NDArray[np.float64] = pca.fit_transform(scaled)
    return rotated
