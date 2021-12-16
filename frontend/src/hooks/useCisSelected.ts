import {Ci} from 'utils/helpers/Ci';
import {CiSet, ciSet, ciSetToString, ciSetFromString} from 'utils/helpers/CiSet';
import useStateSP from 'hooks/useStateSP';

export function useCisSelected() {
  const [cisSelected, setCisSelected] =
    useStateSP<CiSet>(ciSet([]), "cisSelected", ciSetFromString, ciSetToString);

  const addCi = (ci: Ci): void => {
    setCisSelected((current: CiSet) => {
      if (current === null) {
        return ciSet([ci]);
      } else {
        return current.insert(ci);
      }
    });
  };

  return [cisSelected, addCi, setCisSelected] as const;
}

export default useCisSelected;
