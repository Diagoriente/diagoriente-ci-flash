import {Ci, ci, CiReco, ciReco} from './core';
import {BACKEND_URL} from './constants'

export async function fetchCiRandom(n: number): Promise<Ci[]> {
  const req = new URL(BACKEND_URL + "/ci_random")
  req.searchParams.set("n", n.toString());
  const errorMsg =  "Could not fetch random CIs.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(resultOrThrowHttpError<number[]>(req, errorMsg))
    .then(r => r.map(ci)));
}


export async function fetchCiReco(n: number, selectedCi: Ci[]): Promise<CiReco> {
  const req = new URL(BACKEND_URL + "/ci_recommend")
  req.searchParams.set("n", n.toString());
  const errorMsg =  "Could not fetch random CIs.";
  return (fetch(req.toString(), {
      method: "POST",
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(selectedCi.map(ci => ci.id.toString()))
  }).catch(throwNetworkError(req, errorMsg))
    .then(resultOrThrowHttpError<CiRecoResponse>(req, errorMsg))
    .then((r: CiRecoResponse) =>
        ciReco(r.proches.map(ci), r.ouverture.map(ci), r.distant.map(ci))));
}

type CiRecoResponse = {
    proches: number[];
    ouverture: number[];
    distant: number[];
}

class NetworkError extends Error {
  constructor(url: URL, message: string, cause: Error) {
    super(message + " Unable to reach '" + url.toString() + "' Cause: " + cause.toString())
    this.name = "NetworkError"
  }
}


const throwNetworkError = (url: URL, msg: string) => (cause: Error) => {
  if (cause instanceof TypeError) {
    throw new NetworkError(url, msg, cause);
  } else throw cause;
};


class HttpError extends Error {
  constructor(url: URL, httpResponse: Response, message: string) {
    super(message + " Requested resource: '" + url + "' Status " + httpResponse.status + " Headers: " +
      JSON.stringify(Array.from(httpResponse.headers)));
    this.name = "HttpError";
  }
};


const resultOrThrowHttpError = <T> (url: URL, msg: string) => 
    (response: Response): Promise<T> => {
  if (response.ok) {
    return response.json()
  } else {
    throw new HttpError(url, response, msg)
  }
};
