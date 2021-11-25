import {STATIC_URL} from 'utils/constants'
import {NetworkError, throwNetworkError, HttpError, textOrThrowHttpError} from 'utils/helpers/Requests';

export async function fetchReadme(): Promise<string> {
  const req = new URL(STATIC_URL + "Readme.md")
  const errorMsg =  "Could not fetch Readme.md.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(textOrThrowHttpError(req, errorMsg)));
}

