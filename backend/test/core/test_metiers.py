import numpy as np
from cir.core.metiers import *

def test_metiers_scores() -> None:
    ci_names = ["ci 1", "ci 2"]

    metiers = Metiers(
            names=["metier A", "metier B"],
            coefficients=np.array([
                [1.0, 0.0],
                [0.1, 0.2]
                ])
            )

    assert all(
        np.abs(
            metiers.scores(CiSelection.from_ints([]), ci_names)
            - np.array([0.0, 0.0])
        ) < 0.0001
    )
    assert all(
        np.abs(
            metiers.scores(CiSelection.from_ints([0]), ci_names)
            - np.array([1.0, 0.1])
        ) < 0.0001
    )
    assert all(
        np.abs(
            metiers.scores(CiSelection.from_ints([1]), ci_names)
            - np.array([0.0, 0.2])
        ) < 0.0001
    )
    assert all(
        np.abs(
            metiers.scores(CiSelection.from_ints([0, 1]), ci_names)
            - np.array([1.0, 0.3])
        ) < 0.0001
    )

    assert metiers.recommend(CiSelection.from_ints([]), ci_names, 2) \
            == ["metier A", "metier B"]
    assert metiers.recommend(CiSelection.from_ints([0]), ci_names, 2) \
            == ["metier A", "metier B"]
    assert metiers.recommend(CiSelection.from_ints([1]), ci_names, 2) \
            == ["metier B", "metier A"]
    assert metiers.recommend(CiSelection.from_ints([0,1]), ci_names, 2) \
            == ["metier A", "metier B"]
    assert metiers.recommend(CiSelection.from_ints([0,1]), ci_names, 1) \
            == ["metier A"]
