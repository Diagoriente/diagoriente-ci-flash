from   dataclasses import dataclass
from   cir.core.metiers import Metiers
from   cir.core.model import CiSet
from   cir.core import stats
from   cir.interface.csv import ci_set_from_csv, metiers_from_csv
from   enum import Enum
from   functools import lru_cache
import numpy as np
import numpy.typing as npt
from   pathlib import Path
from   typing import Tuple, Callable, Generic, TypeVar, Any, Optional



T = TypeVar('T')
CiPreprocessing = Callable[
        [list[str], list[str], npt.NDArray[np.float64]],
        Tuple[list[str], list[str], npt.NDArray[np.float64], T]
]

MetiersPreprocessing = Callable[
        [list[str], list[str], npt.NDArray[np.float64]],
        Tuple[list[str], list[str], npt.NDArray[np.float64], T]
]


def no_preprocessing(rows_names: list[str], columns_names: list[str], values: npt.NDArray[np.float64]) -> Tuple[list[str], list[str], npt.NDArray[np.float64], None]:
        return rows_names, columns_names, values, None


def pca(rows_names: list[str], columns_names: list[str], values: npt.NDArray[np.float64]) -> Tuple[list[str], list[str], npt.NDArray[np.float64], stats.Pca]:
        projected, pca = stats.Pca.from_values(values, columns_names)
        factors = [f"F{i+1}" for i in range(len(columns_names))]
        return rows_names, factors, projected, pca


C = TypeVar('C')
M = TypeVar('M')


@dataclass(frozen=True)
class DataSet(Generic[C, M]):
    ci_path: Path
    metiers_path: Path
    ci_preprocessing: CiPreprocessing[C]
    metiers_preprocessing: MetiersPreprocessing[M]


def get_axes_names(dataset: DataSet) -> list[str]:
    _, axes_names, _, _ = get_ci_data(dataset)
    return axes_names


def get_ci_names(dataset: DataSet) -> list[str]:
    ci_names, _, _, _ = get_ci_data(dataset)
    return ci_names


def get_ci_set(dataset: DataSet) -> CiSet:
    _, _, ci_set, _ = get_ci_data(dataset)
    return ci_set


def get_preprocessing_info(dataset: DataSet[C, Any]) -> C:
    preproc_info: C
    _, _, _, preproc_info = get_ci_data(dataset) #type: ignore because lru_cache confuses type checkers
    return preproc_info 


def get_pca(dataset: DataSet[Any, Any]) -> Optional[stats.Pca]:
    pi = get_preprocessing_info(dataset)
    if isinstance(pi, stats.Pca):
        return pi
    else:
        return None


@lru_cache(typed = True)
def get_ci_data(dataset: DataSet[C, Any]) -> tuple[list[str], list[str], CiSet, C]:
    ci_names, axes_names, values, preproc_info = \
            dataset.ci_preprocessing(*ci_set_from_csv(Path(dataset.ci_path)))
    ci_set = CiSet.from_ndarray(values, len(axes_names))
    return ci_names, axes_names, ci_set, preproc_info


def get_metiers(dataset: DataSet[Any, Any]) -> Metiers:
    metiers, _ = get_metiers_data(dataset)
    return metiers


@lru_cache(typed = True)
def get_metiers_data(dataset: DataSet[Any, M]) -> tuple[Metiers, M]:
    ci_names = get_ci_names(dataset)
    metiers_names, metiers_rome, values, preproc_info  = dataset.metiers_preprocessing(*metiers_from_csv(dataset.metiers_path, ci_names))
    metiers = Metiers(names = metiers_names, rome = metiers_rome, coefficients = values)
    return metiers, preproc_info


class DataSetName(Enum):
    _2022_03_24_ACP = "2022-03-24_ACP"
    _2022_03_24 = "2022-03-24"
    _2021_11_26b_6_AXES_ACP = "2021-11-26b 6 Axes ACP"
    _2022_01_21b_6_AXES_ACP = "2022-01-21b 6 Axes ACP"


datasets: dict[DataSetName, DataSet] = {
        DataSetName._2022_03_24_ACP: DataSet(
            ci_path = Path("data/cotations/2022-03-24_ACP.csv"),
            metiers_path = Path("data/métiers/2022-03-24.csv"),
            ci_preprocessing = no_preprocessing,
            metiers_preprocessing = no_preprocessing,
        ),
        DataSetName._2022_03_24: DataSet(
            ci_path = Path("data/cotations/2022-03-24.csv"),
            metiers_path = Path("data/métiers/2022-03-24.csv"),
            ci_preprocessing = pca,
            metiers_preprocessing = no_preprocessing,
        ),
        DataSetName._2021_11_26b_6_AXES_ACP: DataSet(
            ci_path = Path("data/cotations/2021-11-26b_Cotations CI - Coefficients aggrégés - Sans Thématique-Identité.csv"),
            metiers_path = Path("data/métiers/Métiers CI correctifs du 23_11_21.csv"),
            ci_preprocessing = pca,
            metiers_preprocessing = no_preprocessing,
        ),
        DataSetName._2022_01_21b_6_AXES_ACP: DataSet(
            ci_path = Path("data/cotations/2022-01-21b_Cotations CI - Coefficients aggrégés - Sans Thématique-Identité.csv"),
            metiers_path = Path("data/métiers/Métiers CI correctifs du 23_11_21.csv"),
            ci_preprocessing = pca,
            metiers_preprocessing = no_preprocessing,
        )
}

