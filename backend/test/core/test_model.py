import pytest
import numpy as np
from cir.core.model import *

def test_approximate_preferences() -> None:
    ci_axes = np.array([
        [-1,-1,-1,-1,-1,np.nan,np.nan],
        [ 3, 3, 3, 1, np.nan, 1, np.nan]])
    ci_set = CiSet(axes = ci_axes,
            ids = CiSelection.from_ints(ids = list(range(ci_axes.shape[0]))))

    result = approximate_preferences(ci_set)
    expected = np.array([1,1,1,0,-1,1,np.nan])

    assert np.all(expected[:6] - result.axes[:6] < 0.0000001)
    assert np.all(np.isnan(result.axes[6]))


def test_prox() -> None:
    ci_set = CiSet.from_ndarray(np.array([
        [ 0,  0],
        [ 1,  1],
        [ 1, -1],
        [np.nan, -1],
        [np.nan,  np.nan],
        ]), n_axes = 2)
    preferences = Model(axes = np.array([-1, 0.5]))

    res = prox(ci_set, preferences)
    exp = np.array([
            1.5 / 2,
            2.5 / 2,
            3.5 / 2,
            1.5 / 1,
            np.nan
        ])
    assert np.all((res == exp)[:4])
    assert np.isnan(res[4])


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


def test_ouv() -> None:
    ci_set = CiSet.from_ndarray(np.array([
        [ 0,  0],
        [ 1,  1],
        [ 1, -1],
        [np.nan, -1],
        [np.nan,  np.nan],
        ]), n_axes = 2)

    preferences = Model(axes = np.array([-1, 0.5]))

    res = ouv(ci_set, preferences)
    exp = np.array([
            1 / 1.5,
            2 / 1.5,
            2 / 2.5,
            np.nan,
            np.nan
        ])
    assert np.all((res == exp)[:3])
    assert np.all(np.isnan(res[3:]))


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
    assert res == CiSelection.from_ints([3, 1, 2, 0, 4])


def test_ci_selection_union() -> None:
    ci_sel_1 = CiSelection.from_ints([1,2,3])
    ci_sel_2 = CiSelection.from_ints([3,4,5])
    assert sorted(ci_sel_1.union(ci_sel_2).to_ints()) == [1,2,3,4,5]
