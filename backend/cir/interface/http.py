from cir import constants
from cir.core import model
from cir.interface.csv import ci_set_from_csv
from fastapi import FastAPI, HTTPException
from typing import Optional, Any, Tuple

app = FastAPI()

ci_set = ci_set_from_csv(constants.COEFDATAFILE)

def pass_ci_id_or_raise(i: int, msg: str) -> None:
    if i < 0 or i >= ci_set.size():
        raise HTTPException(status_code=422, detail=msg)


@app.get("/ci_random")
async def ci_random(n: int) -> list[int]:
    pass_ci_id_or_raise(n,
            f"Query parameter 'n' must be a integer between 0 and " +
                    f"{ci_set.size() - 1} included.")
    cis = [x.val for x in model.ci_random(n, ci_set).ids]
    return cis


@app.post("/ci_recommend")
async def ci_recommend(n: int, selected_cis: list[int]) \
        -> Tuple[list[int], list[int], list[int]]:
    pass_ci_id_or_raise(n,
            f"Query parameter 'n' must be a integer between 0 and " +
                    f"{ci_set.size() - 1} included.")

    if len(selected_cis) != ci_set.n_dimensions():
        raise HTTPException(status_code=422,
                detail="Request body must be a list of size " +
                    f"{ci_set.n_dimensions()}, got {selected_cis}")

    try:
        ci_selection = model.CiSelection.from_ints(selected_cis)
    except ValueError:
        raise HTTPException(status_code = 422,
                detail = f"Request body must contain integers between 0 and " +
                        f"{ci_set.size() - 1} included but got {selected_cis}.")

    preferences = model.approximate_preferences(ci_set.select(ci_selection))

    (proches, ouv, distant) = model.ci_recommend(n, ci_set, preferences)
    return (proches.to_ints(), ouv.to_ints(), distant.to_ints())
