import {Ci, ci} from 'utils/helpers/Ci';
import {CiNames, ciNamesFromRecord} from 'utils/helpers/CiNames';
import {CiReco, ciReco} from 'utils/helpers/CiReco';
import {CiScores, ciScoresFromRecord} from 'utils/helpers/CiScores';
import {BACKEND_URL} from 'utils/constants';
import {throwNetworkError, jsonOrThrowHttpError} from 'utils/helpers/Requests';

export async function fetchDataVersions(): Promise<string[]> {
  const req = new URL(BACKEND_URL + "data_versions")
  const errorMsg =  "Could not fetch data versions.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<string[]>(req, errorMsg)));
}

export async function fetchCiNames(dataVersion: string): Promise<CiNames> {
  const req = new URL(BACKEND_URL + "ci_names")
  req.searchParams.set("data_version", dataVersion);
  const errorMsg =  "Could not fetch CI names.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<Record<number, string>>(req, errorMsg))
    .then(r => ciNamesFromRecord(r)));
}

export async function fetchCiRandom(dataVersion: string, n: number, 
    excluding: Ci[]): Promise<Ci[]> {
  const req = new URL(BACKEND_URL + "ci_random")
  req.searchParams.set("data_version", dataVersion);
  req.searchParams.set("n", n.toString());
  const errorMsg =  "Could not fetch random CIs.";
  return (fetch(req.toString(), {
      method: "POST",
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(excluding.map(ci => ci.id.toString()))
  }).catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<number[]>(req, errorMsg))
    .then(r => r.map(ci)));
}


export async function fetchCiReco(dataVersion: string, n: number, selectedCi: Ci[]): Promise<CiReco> {
  const req = new URL(BACKEND_URL + "ci_recommend")
  req.searchParams.set("data_version", dataVersion);
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


export async function fetchCiScores(dataVersion: string, ci: Ci): Promise<CiScores> {
  const req = new URL(BACKEND_URL + "ci_scores")
  req.searchParams.set("data_version", dataVersion);
  req.searchParams.set("ci", ci.id.toString());
  const errorMsg =  "Could not fetch CI scores.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError<CiScores>(req, errorMsg))
    .then(r => ciScoresFromRecord(r)));
}
