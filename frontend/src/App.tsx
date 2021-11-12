import React, {useState, useEffect} from 'react';
import './App.css';
import {Ci, CiReco, ciReco, ciNames} from './core';
import {fetchCiRandom, fetchCiReco} from './requests';

const App: React.FC = () => {
  const [selectedCis, setSelectedCis] = useState<Ci[]>([]);

  const addCi = (ci: Ci) => setSelectedCis([...selectedCis, ci]);

  return (
    <div className="App">
      <p>CI séléctionés: {JSON.stringify(selectedCis)}</p>
      {
        selectedCis.length === 0 ?
          <Start onSelectCi={addCi}/> :
          <Reco onSelectCi={addCi} selectedCis={selectedCis} />
      }
    </div>
  );
}

type OnSelectCi = { onSelectCi: (ci: Ci) => void };

const Start: React.FC<OnSelectCi>
    = ({onSelectCi}) => {

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
        <p>Êtes-vous intéressé par : {ciNames[ci.id]}</p>
        <div className="container">
          <div className="row">
            <div className="column">
              <button onClick={() => onSelectCi(ci)}>Oui</button>
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

const Reco: React.FC<{onSelectCi: (ci: Ci) => void, selectedCis: Ci[]}>
    = ({onSelectCi, selectedCis}) => {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  useEffect(() => {
    console.log(`Fetching ci reco: ${JSON.stringify(selectedCis)}`);
    fetchCiReco(2, selectedCis)
      .then(res => {
        console.log(`Setting siRecoState to ${JSON.stringify(res)}`);
        setCiRecoState(res)
      });
  }, [selectedCis]);

  if (ciRecoState === undefined) {

    return (
      <div>
        <p>Chargement…</p>
      </div>
    );

  } else {

    const mapCisToElements = (cis: Ci[]): JSX.Element[]  => {
      return cis.map(ci => {
        return (
          <li key={ci.id.toString()} onClick={() => onSelectCi(ci)}>
            <a>{ciNames[ci.id]}</a>
          </li>
        );
      });
    }

    const ciClose = mapCisToElements(ciRecoState.ciClose);
    const ciOpening = mapCisToElements(ciRecoState.ciOpening);
    const ciDistant = mapCisToElements(ciRecoState.ciDistant);

    return (
      <div>
        <p>Choisissez un autre centre d'intérêt</p>
        <div className="container">
          <div className="row">
            <div className="column column-30">
              <p>Aimez-vous aussi …?</p>
              <ul> {ciClose} </ul>
            </div>
            <div className="column column-30">
              <p>Avez-vous pensé à …?</p>
              <ul> {ciOpening} </ul>
            </div>
            <div className="column column-30">
              <p>Ou complètement autre chose :</p>
              <ul> {ciDistant} </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const CiItem: React.FC<Ci>
    = (ci: Ci) => {
  return (
    <div>
      {ci.id.toString()}
    </div>
  );
}

export default App;

