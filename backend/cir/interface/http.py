from cir import constants
from cir.core import model, stats
import cir.interface.csv as csv
from cir.util import DataSet
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pathlib import Path
from typing import Optional
from pydantic import BaseModel
from dataclasses import dataclass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=constants.FRONTEND_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def pass_ci_id_or_raise(dataset: DataSet, i: int, msg: str) -> None:
    ci_set = csv.get_ci_set(dataset)
    if i < 0 or i >= ci_set.size():
        raise HTTPException(status_code=422, detail=msg)


class DataVersions(BaseModel):
    default: Path
    list: list[Path]


@app.get("/axes_names")
async def get_axes_names(
        ci_data_version: Optional[Path] = None
        ) -> list[str]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    axes_names = csv.get_axes_names(dataset)
    return axes_names


@app.get("/ci_axes")
async def get_ci_axes(
        ci_data_version: Optional[Path] = None
        ) -> dict[int, list[np.float64]]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    return dict(enumerate(csv.get_ci_set(dataset).axes.tolist()))


@app.get("/ci_data_versions")
async def get_ci_data_versions() -> DataVersions:
    return DataVersions(
            default=constants.DEFAULTCOEFDATAFILE,
            list=sorted([d.ci_path for d in csv.datasets])
    )


@dataclass(frozen=True)
class CiInfluenceOut:
    influence: float
    rank: int


@app.get("/ci_influence")
async def get_ci_influence(
        ci_data_version: Optional[Path] = None,
        method: stats.CiInfluenceMethod = stats.CiInfluenceMethod.SUM
        ) -> dict[int, CiInfluenceOut]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    metiers = csv.get_metiers(dataset)
    ci_ids: list[model.CiId] = csv.get_ci_set(dataset).ids.ids
    infl, rank = stats.ci_influence(metiers, method = method)
    return {ci_id.val: CiInfluenceOut(influence=float(infl), rank=int(r)) for ci_id, infl,r in zip(ci_ids, infl, rank)}


@app.post("/ci_coefs_metiers_quantiles")
async def get_ci_coefs_metiers_quantiles(
        ci_data_version: Optional[Path] = None,
        quantiles: list[float] = [0.25, 0.5, 0.75]
        ) -> dict[int, list[float]]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    metiers = csv.get_metiers(dataset)
    ci_ids: list[int] = [x.val for x in csv.get_ci_set(dataset).ids.ids]
    result: list[list[float]] = stats.ci_coefs_metiers_quantiles(metiers, quantiles = quantiles).tolist()
    return dict(zip(ci_ids, result))



@app.get("/ci_names")
async def get_ci_names(
        ci_data_version: Optional[Path] = None
        ) -> dict[int, str]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    ci_names = csv.get_ci_names(dataset)
    return dict(enumerate(ci_names))


@app.post("/ci_random")
async def ci_random(
        n: int,
        selected_cis: list[int],
        ci_data_version: Optional[Path] = None
        ) -> list[int]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    ci_set = csv.get_ci_set(dataset)
    pass_ci_id_or_raise(dataset, n,
            f"Query parameter 'n' must be a integer between 0 and " +
                    f"{ci_set.size() - 1} included.")
    excluding: model.CiSelection = model.CiSelection.from_ints(selected_cis)
    cis = [x.val for x in model.ci_random(n, ci_set, excluding).ids]
    return cis


@app.post("/ci_recommend")
async def ci_recommend(
        n: int, 
        cis_selected: list[int],
        cis_seen: dict[int, int], 
        max_seen: int,
        ci_data_version: Optional[Path] = None
        ) -> dict[str, list[int]]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    ci_set = csv.get_ci_set(dataset)
    pass_ci_id_or_raise(dataset, n,
                        f"Query parameter 'n' must be a integer between 0 and " +
                        f"{ci_set.size() - 1} included.")

    try:
        cis_seen_t = {model.CiId(val = i): s for i, s in cis_seen.items()}
    except ValueError:
        raise HTTPException(status_code=422,
                            detail=f"Request body's field 'cis_seen' must " +
                            f"contain an dictionary of CI ids (integers between"
                            f" 0 and {ci_set.size() - 1} included) to counts " +
                            f"(integers >= 0) between 0 and but got {cis_seen}.")

    try:
        cis_selected_t = model.CiSelection.from_ints(cis_selected)
    except ValueError:
        raise HTTPException(status_code=422,
                            detail=f"Request body's field 'cis_selected' must " +
                            f"contain an array of integers between 0 and " +
                            f"{ci_set.size() - 1} included but got {cis_selected}.")

    (proches, ouv, distant) = model.ci_recommend(n, cis_selected_t, cis_seen_t, max_seen, ci_set)
    return {
        "proches": proches.to_ints(),
        "ouverture": ouv.to_ints(),
        "distant": distant.to_ints()
    }


@app.get("/ci_scores")
async def ci_scores(
        ci: int,
        ci_data_version: Optional[Path] = None
        ) -> dict[int, dict[str,float]]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    ci_set = csv.get_ci_set(dataset)
    pref = model.approximate_preferences(ci_set.select(model.CiSelection.from_ints([ci])))
    score_distance = model.prox(ci_set, pref)
    score_ouv = model.ouv(ci_set, pref)
    return {ci_id.val:
             {"distance": score_distance[ci_id.val],
              "ouverture": score_ouv[ci_id.val]}
           for ci_id in ci_set.ids 
           if ci_id.val != ci and ~np.isnan(score_ouv[ci_id.val]) and ~np.isnan(score_distance[ci_id.val])}


@app.post("/metiers_recommend")
async def metiers_recommend(
        n: int,
        cis_selected: list[int],
        ci_data_version: Optional[Path] = None
        ) -> list[str]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    ci_names = csv.get_ci_names(dataset)
    metiers = csv.get_metiers(dataset)

    return metiers.recommend(model.CiSelection.from_ints(cis_selected), 
            ci_names, n)


@app.post("/metiers_recommend_with_score")
async def metiers_recommend_with_score(
        n: int,
        cis_selected: list[int],
        ci_data_version: Optional[Path] = None
        ) -> list[tuple[str, np.float64]]:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    ci_names = csv.get_ci_names(dataset)
    metiers = csv.get_metiers(dataset)

    return metiers.recommend_with_score(
            model.CiSelection.from_ints(cis_selected), ci_names, n)


@dataclass
class PcaOut:
    components: list[list[np.float64]]
    explained_variance: list[list[np.float64]]
    explained_variance_ratio: list[np.float64]
    kaiser_criteria: float

@app.get("/pca")
async def get_pca(
        ci_data_version: Optional[Path] = None
        ) -> PcaOut:
    dataset = DataSet(
            ci_path = ci_data_version or constants.DEFAULTCOEFDATAFILE,
            metiers_path=constants.METIERS_COEF_FILE
    )
    pca = csv.get_pca(dataset)
    return PcaOut(
        components = pca.components.tolist(),
        explained_variance = pca.explained_variance.tolist(),
        explained_variance_ratio=pca.explained_variance_ratio.tolist(),
        kaiser_criteria=pca.kaiser_criteria
    )


