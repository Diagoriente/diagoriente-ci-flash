import {throwNetworkError, textOrThrowHttpError} from 'utils/helpers/Requests';

export async function fetchReadme(): Promise<string> {
  const req = new URL(window.location.origin + "/static/" + "Readme.md")
  const errorMsg =  "Could not fetch Readme.md.";
  return (fetch(req.toString())
    .catch(throwNetworkError(req, errorMsg))
    .then(textOrThrowHttpError(req, errorMsg)));
}

