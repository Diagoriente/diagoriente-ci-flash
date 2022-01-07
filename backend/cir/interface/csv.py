from cir import constants
import csv
import numpy as np
import numpy.typing as npt
import os

from pathlib import Path
from cir.core.model import CiSet
from cir.core.metiers import Metiers
from cir.util import DataSet, pca
from typing import Tuple


def ci_set_from_csv(path: Path) -> Tuple[list[str], CiSet]:
    with open(path) as f:
        data = list(csv.reader(f))

    ci_names = [row[0] for row in data[1:]]

    values: list[npt.NDArray[np.float64]] = []
    for i, row in enumerate(data[1:]):
        try:
            values.append(np.array(row[1:], dtype=np.float64))
        except ValueError:
            raise IOError(
                f"CSV '{path}' could not be loaded. Error on line {i + 2}: \n" +
                f"{row}")
    values_arr = np.array(values, dtype=np.float64)

    projected = pca(values_arr)

    n_axes = values_arr.shape[1]

    return ci_names, CiSet.from_ndarray(projected, n_axes)


def data_version_from_path(p: str) -> str:
    return os.path.splitext(os.path.basename(p))[0]


def metiers_from_csv(path: Path, expected_ci_names: list[str]) -> Metiers:
    with open(path) as f:
        data = list(csv.reader(f))

    metiers_names = [row[0] for row in data[1:]]
    ci_names = data[0][2:]

    expected_ci_names_set = set(expected_ci_names)
    ci_names_set = set(ci_names)

    unexpected_ci_names = ci_names_set - expected_ci_names_set
    if len(unexpected_ci_names) > 0:
        raise ValueError(f"Found unexpected CIs in Métiers CSV file " +
            "{path}: {unexpected_ci_names}.")

    missing_ci_names = expected_ci_names_set - ci_names_set
    if len(missing_ci_names) > 0:
        raise ValueError(f"Expected CIs are missing from Métiers CSV file " +
            "{path}: {missing_ci_names}.")

    # CI name to CI indentifier map.
    ci_id_map = {ci_name: ci_id for ci_id, ci_name in enumerate(expected_ci_names)}

    values: list[npt.NDArray[np.float64]] = []
    for i, row in enumerate(data[1:]):
        try:
            clean = [np.nan if x == '' else np.float64(x) for x in row[2:] ]
            values.append(np.array(clean, dtype=np.float64))
        except ValueError as e:
            raise ValueError(
                f"CSV '{path}' could not be loaded. Error on line {i + 2}: \n" +
                f"{row}. Cause: {e}")
    values_arr = np.array(values, dtype=np.float64)

    # Rows with only nan correspond to categories, not actual jobs. Filter them
    # out
    keep = np.isnan(values_arr).sum(axis=1) < values_arr.shape[1]
    values_arr = values_arr[keep, :]
    metiers_names = [x for x, k in zip(metiers_names, keep) if k]

    # Treat remaining nan values as 0.
    values_arr[np.isnan(values_arr)] = 0

    reordered: npt.NDArray[np.float64] = np.empty(values_arr.shape) * np.nan
    for i, ci_name in enumerate(ci_names):
        try:
            ci_id = ci_id_map[ci_name]
            reordered[:, ci_id] = values_arr[:, i]
        except KeyError as e:
           raise ValueError(f"Unexpected CI name in Métiers CSV file {path}: " +
                   "{ci_name}. Cause: {e}")

    return Metiers(names = metiers_names, coefficients = reordered)


ci_names_dict: dict[DataSet, list[str]] = {}
ci_set_dict: dict[DataSet, CiSet] = {}
metiers_dict: dict[DataSet, Metiers] = {}


def get_ci_names(dataset: DataSet) -> list[str]:
    ci_names, _ = get_ci_names_and_set(dataset)
    return ci_names


def get_ci_set(dataset: DataSet) -> CiSet:
    _, ci_set = get_ci_names_and_set(dataset)
    return ci_set


def get_ci_names_and_set(dataset: DataSet) -> tuple[list[str], CiSet]:
    if dataset not in ci_set_dict:
        ci_names, ci_set = ci_set_from_csv(Path(dataset.ci_path))
        ci_names_dict[dataset] = ci_names
        ci_set_dict[dataset] = ci_set
    return ci_names_dict[dataset], ci_set_dict[dataset]


def get_metiers(dataset: DataSet) -> Metiers:
    if dataset not in metiers_dict:
        ci_names = get_ci_names(dataset)
        metiers_dict[dataset] = metiers_from_csv(dataset.metiers_path,
                ci_names)
    return metiers_dict[dataset]


datasets: list[DataSet] = [
    DataSet(
        ci_path=Path(f),
        metiers_path=constants.METIERS_COEF_FILE
    )
    for f in os.scandir(constants.COEFDATAFOLDER)
]
