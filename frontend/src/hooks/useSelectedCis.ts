import {Ci, ciListFromString, ciListToString} from 'utils/helpers/Ci';
import useStateSP from 'hooks/useStateSP';

export function useSelectedCis() {
  const [selectedCis, setSelectedCis] =
    useStateSP<Ci[]>([], "selectedCis", ciListFromString, ciListToString);

  const addCi = (ci: Ci): void => {
    setSelectedCis((current: Ci[]) => {
      if (current === null) {
        return [ci];
      } else {
        return [...current, ci];
      }
    });
  };

  return [selectedCis, addCi, setSelectedCis] as const;
}

export default useSelectedCis;
