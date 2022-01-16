import {BACKEND_URL} from 'utils/constants';
import {throwNetworkError, jsonOrThrowHttpError} from 'utils/helpers/Requests';

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
