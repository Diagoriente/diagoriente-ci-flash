import numpy as np
import cir.constants as constants
import time

# TODO: initialize rng with seconds since Epoch
if constants.RNGSEED != None:
    rg = np.random.default_rng(constants.RNGSEED)
else:
    seed = time.time_ns()
    rg = np.random.default_rng(constants.RNGSEED)
