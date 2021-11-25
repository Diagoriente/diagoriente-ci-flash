import {Ci, CiNames, CiReco, CiScores} from 'types/types';
import {ci} from 'utils/helpers/Ci';
import {ciNamesFromRecord} from 'utils/helpers/CiNames';
import {ciReco} from 'utils/helpers/CiReco';
import {ciScoresFromRecord} from 'utils/helpers/CiScores';
import {BACKEND_URL} from 'utils/constants';
import {NetworkError, throwNetworkError, HttpError, jsonOrThrowHttpError} from 'utils/helpers/Requests';

export async function fetchCiNames(): Promise<CiNames> {
  const req = new URL(BACKEND_URL + "ci_names")
  const errorMsg =  "Could not fetch CI names.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<Record<number, string>>(req, errorMsg))
    .then(r => ciNamesFromRecord(r)));
}

export async function fetchCiRandom(n: number): Promise<Ci[]> {
  const req = new URL(BACKEND_URL + "ci_random")
  req.searchParams.set("n", n.toString());
  const errorMsg =  "Could not fetch random CIs.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<number[]>(req, errorMsg))
    .then(r => r.map(ci)));
}


export async function fetchCiReco(n: number, selectedCi: Ci[]): Promise<CiReco> {
  const req = new URL(BACKEND_URL + "ci_recommend")
  req.searchParams.set("n", n.toString());
  const errorMsg =  "Could not fetch random CIs.";

  type CiRecoResponse = {
      proches: number[];
      ouverture: number[];
      distant: number[];
  }

  return (fetch(req.toString(), {
      method: "POST",
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(selectedCi.map(ci => ci.id.toString()))
  }).catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<CiRecoResponse>(req, errorMsg))
    .then((r: CiRecoResponse) =>
        ciReco(r.proches.map(ci), r.ouverture.map(ci), r.distant.map(ci))));
}


export async function fetchCiScores(ci: Ci): Promise<CiScores> {
  const req = new URL(BACKEND_URL + "ci_scores")
  req.searchParams.set("ci", ci.id.toString());
  const errorMsg =  "Could not fetch CI scores.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<CiScores>(req, errorMsg))
    .then(r => ciScoresFromRecord(r)));
}
