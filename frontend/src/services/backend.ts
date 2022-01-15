import {Ci, ci} from 'utils/helpers/Ci';
import {CiAxes, ciAxesFromRecord} from 'utils/helpers/CiAxes';
import {Pca} from 'utils/helpers/Pca';
import {CiSet} from 'utils/helpers/CiSet';
import {CiCount} from 'utils/helpers/CiCount';
import {CiNames, ciNamesFromRecord} from 'utils/helpers/CiNames';
import {CiMap, ciMapFromRecord} from 'utils/helpers/CiMap';
import {CiReco, ciReco} from 'utils/helpers/CiReco';
import {CiScores, ciScoresFromRecord} from 'utils/helpers/CiScores';
import {BACKEND_URL} from 'utils/constants';
import {throwNetworkError, jsonOrThrowHttpError} from 'utils/helpers/Requests';
import {DataVersions} from 'utils/helpers/DataVersions';

type ToJSON = {toJSON: () => number | string | boolean | object};
type HttpParamValue = 
  { kind: "Query", value: HttpQueryParamValue } |
  { kind: "Body", value: HttpBodyParamValue };
type HttpQueryParamValue = number | string | boolean;
type HttpBodyParamValue = object;

// An http parameter is treated as a query parameter if it is a primitive type or has a toJSON method that returns a primitive type.
export function httpParamValue(val: number | string | boolean | object): HttpParamValue {

  let json: number | string | boolean | object;
  switch(typeof val) {
    case 'number':
    case 'boolean':
    case 'string':
      json = val;
      break;
    default:
      //@ts-ignore
      json = val.toJSON?.();
      if (json === undefined) {
        json = val;
      }
  }

  switch (typeof json) {
    case 'number':
    case 'boolean':
    case 'string':
      return {kind: "Query", value: json};
    default:
      return {kind: "Body", value: json};
  }
};

export async function fetched<T>(
  endpoint: string,
  params: Record<string, number | string | boolean | object> = {},
  cons: ((r: any) => T) = r => r): Promise<T> {
  const req = new URL(BACKEND_URL + endpoint)

  type Acc = {
    queryParams: {name: string, value: HttpQueryParamValue}[],
    bodyParams: {name: string, value: HttpBodyParamValue}[]
  };

  const {queryParams, bodyParams}: Acc =
    Object.entries(params).reduce(
      (acc: Acc, [name, val]: [string, number | string | boolean | object]): Acc => {
        const param = httpParamValue(val);
        switch (param.kind) {
          case 'Query':
            return {
              queryParams: [...acc.queryParams, {name: name, value: param.value}],
              bodyParams: acc.bodyParams
            };
          case 'Body':
            return {
              queryParams: acc.queryParams,
              bodyParams: [...acc.bodyParams, {name: name, value: param.value}]
            };
        };
      },
      {queryParams: [], bodyParams: []}
    );

    queryParams.forEach(p => {
      req.searchParams.set(p.name, p.value.toString());
    })

  let bodyParamsString: string | undefined;
  switch(bodyParams.length) { 
    case 0:
      bodyParamsString = undefined;
      break;
    case 1:
      bodyParamsString = JSON.stringify(bodyParams[0].value);
      break;
    default:
      bodyParamsString = JSON.stringify(Object.fromEntries(
        bodyParams.map((p: {name: string, value: HttpBodyParamValue}) =>
          [p.name, p.value]
        )
      ));
  }

  const body = bodyParamsString === undefined ? undefined
    : {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: bodyParamsString
      }

  const errorMsg = `Could not fetch from ${req} with body ${JSON.stringify(body)}.`;
  return (fetch(req.toString(), body)
    .catch(throwNetworkError(req, errorMsg))
    .then(jsonOrThrowHttpError(req, errorMsg))
    .then(cons)
  );
}


export async function fetchDataVersions(): Promise<DataVersions> {
  return fetched<DataVersions>("ci_data_versions");
}


export async function fetchPca(dataVersion: string): Promise<Pca> {
  return fetched<Pca>("pca", {ci_data_version: dataVersion});
}


export async function fetchCiInfluence(dataVersion: string, method: string): 
     Promise<CiMap<{influence: number, rank: number}>> {
  return fetched<CiMap<{influence: number, rank: number}>>(
      "ci_influence",
      {ci_data_version: dataVersion, method: method},
      ciMapFromRecord);
};

export async function fetchCiAxes(dataVersion: string): Promise<CiAxes> {
  return (
    fetched<Record<number, number[]>>("ci_axes", {ci_data_version: dataVersion})
   .then(ciAxesFromRecord)
  );
};


export async function fetchAxesNames(dataVersion: string): Promise<string[]> {
  return fetched<string[]>("axes_names", {ci_data_version: dataVersion});
}

export async function fetchCiNames(dataVersion: string): Promise<CiNames> {
  return fetched<CiNames>(
    "ci_names",
    {ci_data_version: dataVersion},
    ciNamesFromRecord);
}

export async function fetchCiCoefsMetiersQuantiles(dataVersion: string,
    quantiles: number[]): Promise<CiMap<number[]>> {
  return fetched<CiMap<number[]>>(
    "ci_coefs_metiers_quantiles",
    {ci_data_version: dataVersion, quantiles: quantiles},
    ciMapFromRecord);
}

export async function fetchCiRandom(dataVersion: string, n: number, 
    excluding: CiSet): Promise<Ci[]> {
  return fetched<Ci[]>(
    "ci_random",
    {ci_data_version: dataVersion, n: n, excluding: excluding},
    (r => r.map(ci)));
}

export async function fetchCiReco(dataVersion: string, n: number,
  cisSelected: CiSet, cisSeen: CiCount, maxSeen: number): Promise<CiReco> {
  return fetched<CiReco>(
    "ci_recommend",
    {ci_data_version: dataVersion, n: n, max_seen: maxSeen, 
     cis_selected: cisSelected, cis_seen: cisSeen},
    (r: { proches: number[], ouverture: number[], distant: number[]}) =>
       ciReco(r.proches.map(ci), r.ouverture.map(ci), r.distant.map(ci)));
}

export async function fetchMetiersReco(dataVersion: string, n: number,
  cisSelected: CiSet): Promise<[string, number][]> {
  return fetched<[string, number][]>(
    "metiers_recommend_with_score",
    {ci_data_version: dataVersion, n: n, cis_selected: cisSelected});
}

export async function fetchCiScores(dataVersion: string, ci: Ci): Promise<CiScores> {
  return fetched<CiScores>(
    "ci_scores",
    {ci_data_version: dataVersion, ci: ci},
    ciScoresFromRecord);
}
