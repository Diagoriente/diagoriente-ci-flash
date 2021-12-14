from pathlib import Path
from dataclasses import dataclass
import numpy as np
import cir.constants as constants
import time

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
