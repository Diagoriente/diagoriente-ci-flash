import {useState, useEffect} from 'react';
import {CiAxes} from "utils/helpers/CiAxes";
import {fetchCiAxes} from "services/backend";


function useCiAxes(dataVersion: string | undefined) {
  const [ciAxes, setCiAxes] = useState<CiAxes | undefined>(undefined);

  useEffect(() => {
    console.log("DATAVERSION CHANGED");
    if (dataVersion !== undefined) {
      fetchCiAxes(dataVersion)
      .then(r => {
        return setCiAxes(r)
      });
    }
  }, [dataVersion, setCiAxes]);

  return ciAxes;
}

export default useCiAxes;

