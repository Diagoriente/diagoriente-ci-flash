from cir import constants
from cir.core import model
from cir.interface.csv import ci_set_collection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[constants.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def pass_ci_id_or_raise(data_version: str, i: int, msg: str) -> None:
    _, ci_set = ci_set_collection[data_version]
    if i < 0 or i >= ci_set.size():
        raise HTTPException(status_code=422, detail=msg)


@app.get("/data_versions")
async def get_data_versions() -> list[str]:
    return sorted(list(ci_set_collection.keys()))


@app.get("/ci_names")
async def get_ci_names(data_version: str) -> dict[int, str]:
    print("AAAAA" + data_version)
    ci_names, _ = ci_set_collection[data_version]
    return dict(enumerate(ci_names))


@app.post("/ci_random")
async def ci_random(data_version: str, n: int, selected_cis: list[int]) -> list[int]:
    _, ci_set = ci_set_collection[data_version]
    pass_ci_id_or_raise(data_version, n,
            f"Query parameter 'n' must be a integer between 0 and " +
                    f"{ci_set.size() - 1} included.")
    excluding: model.CiSelection = model.CiSelection.from_ints(selected_cis)
    cis = [x.val for x in model.ci_random(n, ci_set, excluding).ids]
    return cis


@app.post("/ci_recommend")
async def ci_recommend(data_version: str, n: int, cis_selected: list[int],
        cis_seen: dict[int, int], max_seen: int) -> dict[str, list[int]]:
    _, ci_set = ci_set_collection[data_version]
    pass_ci_id_or_raise(data_version, n,
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
async def ci_scores(data_version: str, ci: int) -> dict[int, dict[str,float]]:
    _, ci_set = ci_set_collection[data_version]
    pref = model.approximate_preferences(ci_set.select(model.CiSelection.from_ints([ci])))
    score_distance = model.prox(ci_set, pref)
    score_ouv = model.ouv(ci_set, pref)
    return {ci_id.val:
             {"distance": score_distance[ci_id.val],
              "ouverture": score_ouv[ci_id.val]}
           for ci_id in ci_set.ids 
           if ci_id.val != ci and ~np.isnan(score_ouv[ci_id.val]) and ~np.isnan(score_distance[ci_id.val])}
