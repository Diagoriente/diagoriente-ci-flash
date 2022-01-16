import numpy as np
import numpy.typing as npt

from cir.util import rg
from dataclasses import dataclass
from typing import overload, Tuple, Union, Iterator


@dataclass(frozen=True)
class CiId:
    val: int

    @staticmethod
    def from_uint32(v: int, n_ci: int) -> "CiId":
        if v >= n_ci or v <= 0:
            raise ValueError(f"CI.val must be < {n_ci} and >= 0, got: {v}.")
        return CiId(val=v)


@dataclass(frozen=True)
class CiSelection:
    ids: list[CiId]

    @staticmethod
    def from_ints(ids: list[int]) -> "CiSelection":
        return CiSelection(ids=[CiId(val=x) for x in ids])

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
            return CiSelection(ids=self.ids[key])
        else:
            raise TypeError(f"list indices must be integers or slices, not " +
                            f"{type(key)}")

    def __len__(self) -> int:
        return len(self.ids)

    def __iter__(self) -> Iterator[CiId]:
        return iter(self.ids)

    def contains(self, ci_id: CiId) -> bool:
        return ci_id in self.ids

    def union(self, other: "CiSelection") -> "CiSelection":
        id_set = set(self.ids) | set(other.ids)
        return CiSelection(ids=list(id_set))


@dataclass(frozen=True)
class CiSet:
    axes: npt.NDArray[np.float64]
    ids: CiSelection

    @staticmethod
    def from_ndarray(v: npt.NDArray[np.float64], n_axes: int) -> "CiSet":
        if len(v.shape) != 2 or v.shape[1] != n_axes:
            raise ValueError(f"CiSet.axes must have shape " +
                             f"(*, {n_axes}), found: {v.shape}")
        return CiSet(axes=v,
                     ids=CiSelection.from_ints(list(range(v.shape[0]))))

    def size(self) -> int:
        size: int = self.axes.shape[0]
        return size

    def n_dimensions(self) -> int:
        dim: int = self.axes.shape[1]
        return dim

    def select(self, ci_selection: CiSelection) -> "CiSet":
        return CiSet(
            axes=self.axes[ci_selection.to_ints(), :],
            ids=ci_selection)

    def mean_axes(self) -> npt.NDArray[np.float64]:
        mean: npt.NDArray[np.float64] = np.nanmean(
            self.axes, axis=0)  # type: ignore
        return mean

    def contains(self, ci_id: CiId) -> bool:
        return self.ids.contains(ci_id)


@dataclass(frozen=True)
class Model:
    axes: npt.NDArray[np.float64]


def approximate_preferences(ci_set: CiSet) -> Model:
    return Model(axes=ci_set.mean_axes())


def prox(ci_set: CiSet, preferences: Model) -> npt.NDArray[np.float64]:
    n_valid: npt.NDArray[np.float64] = \
        np.sum(
            ~np.isnan(ci_set.axes) & ~np.isnan(preferences.axes),
            axis=1)
    res: npt.NDArray[np.float64] = \
        np.nansum(np.abs(ci_set.axes - preferences.axes),
                  axis=1) / n_valid  # type: ignore
    return res


def ouv(ci_set: CiSet, preferences: Model) -> npt.NDArray[np.float64]:
    (n_ci, n_axes) = ci_set.axes.shape
    abs_diff: npt.NDArray[np.float64] = np.abs(ci_set.axes - preferences.axes)
    res: npt.NDArray[np.float64] = np.array([np.nan] * n_ci)
    for j in range(n_axes):
        d_j = abs_diff[:, j]
        prod_d_j_prim = 1 + \
            np.nanmean(np.delete(abs_diff, j, axis=1), axis=1)  # type: ignore
        res = np.nanmax(np.array([res, d_j / prod_d_j_prim]), axis=0) # type: ignore
    return res


def ci_random(n: int, ci_set: CiSet, excluding: CiSelection) -> CiSelection:
    candidates: list[CiId] = [ciId for ciId in ci_set.ids.ids
                              if not excluding.contains(ciId)]
    random_selection = rg.choice(len(candidates), size=min(
        len(candidates), n), replace=False).tolist()
    result = CiSelection(ids=[candidates[i] for i in random_selection])
    return result


def ci_proches(ci_set: CiSet, preferences: Model) -> CiSelection:
    scores = prox(ci_set, preferences)
    return CiSelection.from_ints(np.argsort(scores).tolist())


def ci_ouverture(ci_set: CiSet, preferences: Model) -> CiSelection:
    scores = ouv(ci_set, preferences)
    ids = np.argsort(scores)
    ids = np.flip(ids)  # type: ignore
    ids_list = ids.tolist()
    return CiSelection.from_ints(ids_list)


def ci_recommend(n: int, ci_selected: CiSelection, ci_seen: dict[CiId, int], max_seen: int, ci_set: CiSet) -> Tuple[CiSelection, CiSelection, CiSelection]:

    exclude = ci_selected.union(CiSelection(
        ids=[ci for ci, count in ci_seen.items() if count >= max_seen]))

    if len(ci_selected) == 0:

        cis = ci_random(n * 3, ci_set, excluding = exclude)
        proches = cis[0:n]
        ouv = cis[n:n*2]
        distants = cis[n*2:n*3]

    else :

        preferences = approximate_preferences(ci_set.select(ci_selected))

        ci_by_proximity: CiSelection = CiSelection(
            ids=[ci for ci in ci_proches(ci_set, preferences)
                 if not exclude.contains(ci)])

        proches = ci_by_proximity[:n]

        exclude_proches = exclude.union(proches)

        ouv = CiSelection(ids=[ci for ci in ci_ouverture(ci_set, preferences)
                               if not exclude_proches.contains(ci)][:n])

        exclude_proches_ouv = exclude_proches.union(ouv)

        distants_list: list[CiId] = []
        for ci in reversed(ci_by_proximity.ids):
            if len(distants_list) < n:
                if not exclude_proches_ouv.contains(ci):
                    distants_list.append(ci)
            else:
                break
        distants = CiSelection(ids=distants_list)

    return (proches, ouv, distants)
