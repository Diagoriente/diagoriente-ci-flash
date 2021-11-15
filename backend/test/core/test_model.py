import pytest
import numpy as np
from cir.core.model import *

def test_approximate_preferences() -> None:
    ci_axes = np.array([
        [-1,-1,-1,-1,-1,-1,-1],
        [ 3, 3, 3, 1, 1, 1, 1]])
    ci_set = CiSet(axes = ci_axes,
            ids = CiSelection.from_ints(ids = list(range(ci_axes.shape[0]))))

    result = approximate_preferences(ci_set)
    expected = np.array([1,1,1,0,0,0,0])

    assert np.all(expected - result.axes < 0.0000001)


def test_ci_proches() -> None:
    ci_set = CiSet.from_ndarray(np.array([
        [ 0,  0],
        [ 1,  1],
        [ 1, -1],
        [-1, -1],
        [-1,  1],
        ]), n_axes = 2)

    preferences = Model(axes = np.array([-1, 0.5]))

    res = ci_proches(ci_set, preferences)
    assert res == CiSelection.from_ints([4, 0, 3, 1, 2])


def test_ci_ouverture() -> None:
    ci_set = CiSet.from_ndarray(np.array([
        [ 0,  0],
        [ 1,  1],
        [ 1, -1],
        [-1, -1],
        [-1,  1],
        ]), n_axes = 2)

    preferences = Model(axes = np.array([-1, 0.5]))

    res = ci_ouverture(ci_set, preferences)
    assert res == CiSelection.from_ints([3, 1, 4, 2, 0])


def test_ci_selection_union() -> None:
    ci_sel_1 = CiSelection.from_ints([1,2,3])
    ci_sel_2 = CiSelection.from_ints([3,4,5])
    assert sorted(ci_sel_1.union(ci_sel_2).to_ints()) == [1,2,3,4,5]
