import csv
import numpy as np

from pathlib import Path
from cir.core.model import CiSet
from typing import Tuple



def ci_set_from_csv(path: Path) -> Tuple[list[str], CiSet]:
    with open(path) as f:
        data = list(csv.reader(f))

    ci_names = [row[0] for row in data[1:]]
    values = np.array([row[1:] for row in data[1:]], dtype = np.float64)
    n_axes = values.shape[1]

    return ci_names, CiSet.from_ndarray(values, n_axes)
