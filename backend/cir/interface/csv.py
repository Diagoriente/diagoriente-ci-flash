import csv
import numpy as np

from pathlib import Path
from cir.core.model import CiSet


def ci_set_from_csv(path: Path) -> CiSet:
    with open(path) as f:
        data = list(csv.reader(f))

    values = np.array([row[1:] for row in data[1:]], dtype = np.float64)
    n_axes = values.shape[1]

    return CiSet.from_ndarray(values, n_axes)
