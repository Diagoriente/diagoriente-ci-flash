import {ci, ciFromString, ciToString} from "utils/helpers/Ci";
import useStateSP from 'hooks/useStateSP';

export function useCurCi() {
  return useStateSP(ci(0), "ci", ciFromString, ciToString);
}

export default useCurCi;
