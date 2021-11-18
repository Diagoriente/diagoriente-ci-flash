import cir.constants as constants
import numpy as np
import numpy.typing as npt

from cir.util import rg
from dataclasses import dataclass
from typing import overload, Tuple, Union, Iterator


@dataclass(frozen = True)
class CiId:
    val: int

    @staticmethod
    def from_uint32(v: int, n_ci: int) -> "CiId":
        if v >= n_ci or v <= 0:
            raise ValueError(f"CI.val must be < {n_ci} and >= 0, got: {v}.")
        return CiId(val = v)


@dataclass(frozen = True)
class CiSelection:
    ids: list[CiId]

    @staticmethod
    def from_ints(ids: list[int]) -> "CiSelection":
        return CiSelection(ids = [CiId(val = x) for x in ids])

    def to_ints(self) -> list[int]:
        return [i.val for i in self.ids]

    @overload
    def __getitem__(self, key: int) -> CiId:
        pass

    @overload
    def __getitem__(self, key: slice) -> "CiSelection":
        pass

    def __getitem__(self, key: Union[int, slice]) -> Union[CiId, "CiSelection"]:
        if isinstance(key, int):
            return self.ids[key]
        if isinstance(key, slice):
            return CiSelection(ids = self.ids[key])
        else:
            raise TypeError(f"list indices must be integers or slices, not " +
                    f"{type(key)}")

    def __iter__(self) -> Iterator[CiId]:
        return iter(self.ids)

    def contains(self, ci_id: CiId) -> bool:
        return ci_id in self.ids

    def union(self, other: "CiSelection") -> "CiSelection":
        id_set = set(self.ids) | set(other.ids)
        return CiSelection(ids = list(id_set))



@dataclass(frozen = True)
class CiSet:
    axes: npt.NDArray[np.float64]
    ids: CiSelection

    @staticmethod
    def from_ndarray(v: npt.NDArray[np.float64], n_axes: int) -> "CiSet":
        if len(v.shape) != 2 or v.shape[1] != n_axes:
            raise ValueError(f"CiSet.axes must have shape " +
                    f"(*, {n_axes}), found: {v.shape}")
        return CiSet(axes = v,
                ids = CiSelection.from_ints(list(range(v.shape[0]))))

    def size(self) -> int:
        size: int = self.axes.shape[0]
        return size

    def n_dimensions(self) -> int:
        dim: int = self.axes.shape[1]
        return dim

    def select(self, ci_selection: CiSelection) -> "CiSet":
        return CiSet(
                axes = self.axes[ci_selection.to_ints(), :],
                ids = ci_selection)

    def mean_axes(self) -> npt.NDArray[np.float64]:
        mean: npt.NDArray[np.float64] = self.axes.mean(axis = 0)
        return mean

    def contains(self, ci_id: CiId) -> bool:
        return self.ids.contains(ci_id)


@dataclass(frozen = True)
class Model:
    axes: npt.NDArray[np.float64]


def approximate_preferences(ci_set: CiSet) -> Model:
    return Model(axes = ci_set.mean_axes())


def prox(ci_set: CiSet, preferences: Model) -> npt.NDArray[np.float64]:
    res: npt.NDArray[np.float64] = \
        np.sqrt(np.sum((ci_set.axes - preferences.axes) ** 2, axis = 1))
    return res


def ouv(ci_set: CiSet, preferences: Model) -> npt.NDArray[np.float64]:
    (n_ci, n_axes) = ci_set.axes.shape
    abs_diff: npt.NDArray[np.float64] = np.abs(ci_set.axes - preferences.axes)
    res: npt.NDArray[np.float64] = np.zeros(n_ci)
    for i in range(n_axes):
        o_i = np.ones(n_axes)
        o_i[i] = -1
        res = np.array([res, np.sum(abs_diff * o_i, axis = 1)]).max(axis = 0)
    return res


def ci_random(n: int, ci_set: CiSet) -> CiSelection:
    ids: list[CiId] = ci_set.ids.ids
    random_selection = rg.choice(len(ids), size = n, replace = False).tolist()
    result = CiSelection.from_ints(random_selection)
    return result


def ci_proches(ci_set: CiSet, preferences: Model) -> CiSelection:
    scores = prox(ci_set, preferences)
    return CiSelection.from_ints(np.argsort(scores).tolist())


def ci_ouverture(ci_set: CiSet, preferences: Model) -> CiSelection:
    scores = ouv(ci_set, preferences)
    ids = np.argsort(scores)
    ids = np.flip(ids) # type: ignore
    ids_list = ids.tolist()
    return CiSelection.from_ints(ids_list)


def ci_recommend(n: int, ci_selected: CiSelection,  ci_set: CiSet, preferences: Model) \
        -> Tuple[CiSelection, CiSelection, CiSelection]:

    exclude = ci_selected
    ci_by_proximity: CiSelection = CiSelection(ids =
            [ci for ci in ci_proches(ci_set, preferences)
                if not ci_selected.contains(ci)])
    proches = ci_by_proximity[:n]

    exclude = exclude.union(proches)
    ouv = CiSelection(ids = [ci for ci in ci_ouverture(ci_set, preferences)
        if not exclude.contains(ci)][:n])

    exclude = exclude.union(ouv)
    distants_list: list[CiId] = []
    for ci in reversed(ci_by_proximity.ids):
        if len(distants_list) < n:
            if not exclude.contains(ci):
                distants_list.append(ci)
        else:
            break
    distants = CiSelection(ids = distants_list)

    return (proches, ouv, distants)

