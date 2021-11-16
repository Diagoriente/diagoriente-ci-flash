import React, {useState, useEffect} from 'react';
import './App.css';
import {Ci, CiReco, ciReco, CiNames, ciNamesFromRecord} from './core';
import {fetchCiNames, fetchCiRandom, fetchCiReco} from './requests';

const App: React.FC = () => {
  const [selectedCis, setSelectedCis] = useState<Ci[]>([]);
  const [nReco, setNReco] = useState<number>(3);
  const [ciNames, setCiNames] = useState<CiNames>(ciNamesFromRecord({}));

  const addCi = (ci: Ci) => setSelectedCis([...selectedCis, ci]);

  useEffect((): void => {
    fetchCiNames()
      .then(setCiNames)
  }, []);

  return (
    <div className="App">
      <div className="row">
        <div className="column column-70">
          {
            selectedCis.length === 0 ?
              <Start onSelectCi={addCi} ciNames={ciNames}/> :
              <Reco onSelectCi={addCi} selectedCis={selectedCis} nReco={nReco} ciNames={ciNames} />
          }
        </div>
        <div className="column">
          <label htmlFor="n-reco">Nombre de recommendation par liste :</label>
          <input 
            type="number" id="n-reco" name="n-reco"
            onChange={e => setNReco(+e.target.value)}
            value={nReco}
          />
          <p>CI séléctionés:</p>
          <ul>
            {selectedCis.slice().reverse().map(ci => <li key={ci.id}>{ciNames.get(ci)}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

type OnSelectCi = { onSelectCi: (ci: Ci) => void, ciNames: CiNames };

const Start: React.FC<OnSelectCi>
    = ({onSelectCi, ciNames}) => {

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

const Reco: React.FC<{onSelectCi: (ci: Ci) => void, selectedCis: Ci[], 
  nReco: number, ciNames: CiNames}>
    = ({onSelectCi, selectedCis, nReco, ciNames}) => {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  useEffect(() => {
    console.log(`Fetching ci reco: ${JSON.stringify(selectedCis)}`);
    fetchCiReco(nReco, selectedCis)
      .then(res => {
        console.log(`Setting siRecoState to ${JSON.stringify(res)}`);
        setCiRecoState(res)
      });
  }, [selectedCis, nReco]);

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
            <a>{ciNames.get(ci)}</a>
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
              <p>(proches)</p>
              <ul> {ciClose} </ul>
            </div>
            <div className="column column-30">
              <p>(ouverture)</p>
              <ul> {ciOpening} </ul>
            </div>
            <div className="column column-30">
              <p>(distants)</p>
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

