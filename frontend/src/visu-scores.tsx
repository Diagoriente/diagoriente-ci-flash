import React, {useState, useEffect} from 'react';
import './App.css';
import {Ci, ci, ciFromString, CiReco, ciReco, CiNames, ciNamesFromRecord, CiScores, GraphType,
graphType} from './core';
import {fetchCiNames, fetchCiRandom, fetchCiReco, fetchCiScores} from './requests';
import * as d3 from 'd3';
import {BarChart} from './d3/horizontal-bar-chart';
import useCiNames from './hooks/use-ci-names';
import {useSearchParams} from 'react-router-dom';

const VisuScores: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const spGraphType: GraphType | undefined =
    graphType(searchParams.get("graphType") || undefined);
  const [curGraphType, setCurGraphType] =
    useState<GraphType>(spGraphType || "distance");

  const spCi: Ci | undefined = ciFromString(searchParams.get("ci"));
  const [curCi, setCurCi] = useState(spCi || ci(0));

  const [ciDist, setCiDist] = useState<{name: string, val: number}[]>([]);
  const [ciOuv, setCiOuv] = useState<{name: string, val: number}[]>([]);
  const [ciNames, setCiNames] = useCiNames();

  useEffect(() => {
    console.log("EFFECT UPDATE GRAPH TYPE SP");
    searchParams.set("graphType", curGraphType);
    setSearchParams(searchParams);
  }, [curGraphType]);

  useEffect(() => {
    console.log("EFFECT UPDATE CI SP");
    searchParams.set("ci", curCi.id.toString());
    setSearchParams(searchParams);
  }, [curCi]);

  useEffect(() => {
      fetchCiScores(curCi).then((ciScores: CiScores): void => {
        setCiDist(ciScores.distanceAsc(ciNames));
        setCiOuv(ciScores.ouvertureDesc(ciNames));
      });
  }, [curCi, ciNames]);

  useEffect(() => {
    let xLabel;
    let yDomain;
    switch(curGraphType) {
      case "distance":
        xLabel = `Distance du centre d'intéret "${ciNames.get(curCi)}"`;
        yDomain = d3.groupSort(ciDist, ([d]) => d.val, d => d.name);
        break;
      case "ouverture":
        xLabel = `Ouverture par rapport centre d'intéret "${ciNames.get(curCi)}"`;
        yDomain = d3.groupSort(ciDist, ([d]) => -d.val, d => d.name);
        break;
    }

    const barChart = BarChart(ciDist, {
      x: d => d.val,
      y: (d, i) => d.name,
      title: (d: any): string => `${d3.format(".2f")(d.val)}`,
      height: 2500,
      width: 640,
      marginLeft:400,
      xDomain: [0, 
        ciDist.map(({val}) => val).reduce((a, b) => Math.max(a,b), 0)],
      //yDomain: ciDist.map(({name}) => name),
      yDomain: yDomain,
      xFormat: "",
      xLabel: xLabel,
      yRange: undefined,
    });


    d3.select("#visu-scores").append(() => barChart);

    return () => {
      barChart?.remove();
    };
  }, [curGraphType, curCi, ciDist, ci, ciNames]);

  return (
    <div className="App">
      <label htmlFor="vis-score-graph-type">Visualiser</label>
      <select 
        name="vis-score-graph-type" 
        id="vis-score-graph-type"
        defaultValue={curGraphType}
        onChange={e => setCurGraphType(e.target.value as GraphType)}
      >
        <option key="distance" value="distance">
          la distance
        </option>
        <option key="ouverture" value="ouverture">
          le score d'ouverture
        </option>
      </select>
      <label htmlFor="vis-score-cur-ci">par rapport au centre d'intérêt :</label>
      <select 
        name="vis-score-cur-ci" 
        id="vis-score-cur-ci"
        defaultValue={curCi.id}
        onChange={e => setCurCi(ci(+e.target.value))}
      >
        {ciNames.array().map(({ci, name}) => 
             <option key={ci.id} value={ci.id}>
               {name}
             </option>)}
      </select>
      <div id="visu-scores"></div>
    </div>
  );
};

export default VisuScores;
