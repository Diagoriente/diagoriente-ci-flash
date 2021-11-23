import {Ci, CiNames} from "types/types";
import React, {useState, useEffect} from 'react';
import {fetchCiRandom} from 'services/backend';


const Start: React.FC<{ onYes: (ci: Ci) => void, ciNames: CiNames }>
    = ({onYes, ciNames}) => {

  const [ci, setCi] = useState<Ci | undefined>(undefined);

  const getNewRandomCi = (): void => {
    fetchCiRandom(1)
      .then(cis =>
        cis.length === 0 ?
          console.error("Received 0 random CI from backend.") :
          setCi(cis[0])
      )
  };

  useEffect(() => {
    if (ci === undefined) {
      getNewRandomCi()
    }
  });

  if (ci === undefined) {
    return (
      <div>
        <p>Chargement…</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>Êtes-vous intéressé par : {ciNames.get(ci)}</p>
        <div className="container">
          <div className="row">
            <div className="column">
              <button onClick={() => onYes(ci)}>Oui</button>
            </div>
            <div className="column">
              <button onClick={() => getNewRandomCi()}>Non</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Start;