export class NetworkError extends Error {
  constructor(url: URL, message: string, cause: Error) {
    super(message + " Unable to reach '" + url.toString() + "' Cause: " + cause.toString())
    this.name = "NetworkError"
  }
}


export const throwNetworkError = (url: URL, msg: string) => (cause: Error) => {
  if (cause instanceof TypeError) {
    throw new NetworkError(url, msg, cause);
  } else throw cause;
};


export class HttpError extends Error {
  constructor(url: URL, httpResponse: Response, message: string) {
    super(message + " Requested resource: '" + url + "' Status " + httpResponse.status + " Headers: " +
      JSON.stringify(Array.from(httpResponse.headers)));
    this.name = "HttpError";
  }
};


export const jsonOrThrowHttpError = <T> (url: URL, msg: string) => 
    (response: Response): Promise<T> => {
  if (response.ok) {
    return response.json()
  } else {
    throw new HttpError(url, response, msg)
  }
};

export const textOrThrowHttpError = (url: URL, msg: string) => 
    (response: Response): Promise<string> => {
  if (response.ok) {
    return response.text()
  } else {
    throw new HttpError(url, response, msg)
  }
};
