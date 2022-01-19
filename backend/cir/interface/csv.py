import csv
import numpy as np
import numpy.typing as npt

from pathlib import Path
from typing import Tuple


def ci_set_from_csv(path: Path) -> Tuple[list[str], list[str], npt.NDArray[np.float64]]:
    with open(path) as f:
        data = list(csv.reader(f))

    ci_names = [row[0] for row in data[1:]]
    axes_names = data[0][1:]

    values: list[npt.NDArray[np.float64]] = []
    for i, row in enumerate(data[1:]):
        try:
            values.append(np.array(row[1:], dtype=np.float64))
        except ValueError:
            raise IOError(
                f"CSV '{path}' could not be loaded. Error on line {i + 2}: \n" +
                f"{row}")
    values_arr = np.array(values, dtype=np.float64)

    return ci_names, axes_names, values_arr


def metiers_from_csv(path: Path, expected_ci_names: list[str]) -> Tuple[list[str], list[str], npt.NDArray[np.float64]]:
    with open(path) as f:
        data = list(csv.reader(f))

    metiers_names = [row[0] for row in data[1:]]
    metiers_rome = [row[4] for row in data[1:]]
    ci_names = data[0][5:]

    expected_ci_names_set = set(expected_ci_names)
    ci_names_set = set(ci_names)

    unexpected_ci_names = ci_names_set - expected_ci_names_set
    if len(unexpected_ci_names) > 0:
        raise ValueError(f"Found unexpected CIs in Métiers CSV file " +
            f"{path}: {unexpected_ci_names}.")

    missing_ci_names = expected_ci_names_set - ci_names_set
    if len(missing_ci_names) > 0:
        raise ValueError(f"Expected CIs are missing from Métiers CSV file " +
            "{path}: {missing_ci_names}.")

    # CI name to CI indentifier map.
    ci_id_map = {ci_name: ci_id for ci_id, ci_name in enumerate(expected_ci_names)}

    values: list[npt.NDArray[np.float64]] = []
    for i, row in enumerate(data[1:]):
        try:
            clean = [np.nan if x == '' else np.float64(x) for x in row[5:] ]
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
    metiers_rome = [x for x, k in zip(metiers_rome, keep) if k]

    # Treat remaining nan values as 0.
    values_arr[np.isnan(values_arr)] = 0

    # Reorder columns so that they respect the orders in ci_names
    reordered: npt.NDArray[np.float64] = np.empty(values_arr.shape) * np.nan
    for i, ci_name in enumerate(ci_names):
        try:
            ci_id = ci_id_map[ci_name]
            reordered[:, ci_id] = values_arr[:, i]
        except KeyError as e:
           raise ValueError(f"Unexpected CI name in Métiers CSV file {path}: " +
                   "{ci_name}. Cause: {e}")

    return metiers_names, metiers_rome, reordered


