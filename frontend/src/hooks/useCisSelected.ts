import {Ci, ciListFromString, ciListToString} from 'utils/helpers/Ci';
import useStateSP from 'hooks/useStateSP';

export function useCisSelected() {
  const [cisSelected, setCisSelected] =
    useStateSP<Ci[]>([], "cisSelected", ciListFromString, ciListToString);

  const addCi = (ci: Ci): void => {
    setCisSelected((current: Ci[]) => {
      if (current === null) {
        return [ci];
      } else {
        return [...current, ci];
      }
    });
  };

  return [cisSelected, addCi, setCisSelected] as const;
}

export default useCisSelected;
