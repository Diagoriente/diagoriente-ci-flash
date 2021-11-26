import {Ci, ci, ciFromString} from "utils/helpers/Ci";
import {CiScores} from "utils/helpers/CiScores";
import {GraphType, graphType} from "utils/helpers/GraphType";
import useCiNames from "hooks/useCiNames";
import useStateSP from "hooks/useStateSP";
import {fetchCiScores} from "services/backend";
import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import HorizontalBarChart from "views/VisuScores/HorizontalBarChart";
import {useSearchParams} from 'react-router-dom';

const VisuScores: React.FC = () => {

  const [curGraphType, setCurGraphType] = useStateSP(
    "distance" as GraphType,
    "graphType",
    (s: string | null): GraphType | null => graphType(s),
    (g: GraphType): string => g.toString()
  )

  const [curCi, setCurCi] = useStateSP(
    ci(0),
    "ci",
    (s: string | null): Ci | null => s === null ? null : ciFromString(s),
    (c: Ci): string => c.id.toString()
  );

  const [ciDist, setCiDist] = useState<{name: string, val: number}[]>([]);
  const [ciOuv, setCiOuv] = useState<{name: string, val: number}[]>([]);
  const ciNames = useCiNames();

  useEffect(() => {
    if (curCi !== null) {
      fetchCiScores(curCi).then((ciScores: CiScores): void => {
        setCiDist(ciScores.distanceAsc(ciNames));
        setCiOuv(ciScores.ouvertureDesc(ciNames));
      });
    }
  }, [curCi, ciNames]);

  useEffect(() => {
    if (curCi !== null && curGraphType !== null) {
      let xLabel;
      let yDomain;
      let data;
      switch(curGraphType) {
        case "distance":
          xLabel = `Distance du centre d'intéret "${ciNames.get(curCi)}"`;
          yDomain = d3.groupSort(ciDist, ([d]) => d.val, d => d.name);
          data = ciDist;
          break;
        case "ouverture":
          xLabel = `Ouverture par rapport centre d'intéret "${ciNames.get(curCi)}"`;
          yDomain = d3.groupSort(ciOuv, ([d]) => -d.val, d => d.name);
          data = ciOuv;
          break;
      }

      const barChart = HorizontalBarChart(data, {
        x: d => d.val,
        y: (d, i) => d.name,
        title: (d: any): string => `${d3.format(".2f")(d.val)}`,
        height: 2500,
        width: 640,
        marginLeft:400,
        xDomain: [0, 
          data.map(({val}) => val).reduce((a, b) => Math.max(a,b), 0)],
        yDomain: yDomain,
        xFormat: "",
        xLabel: xLabel,
        yRange: undefined,
        color: "#3730A3"
      });


      d3.select("#visu-scores").append(() => barChart);

      return () => {
        barChart?.remove();
      };
    }
  }, [curGraphType, curCi, ciDist, ciOuv, ciNames]);

  if (curCi === null) {
    return (<p>Error in url search parameter curCi</p>)
  } else if (curGraphType === null) {
    return (<p>Error in url search parameter curCi</p>)
  } else {
    return (
      <div className="flex-col space-y-5">
        <div className="text-center">
          <label htmlFor="vis-score-graph-type">Visualiser</label>
          <select 
            className="rounded bg-indigo-200"
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
            className="rounded bg-indigo-200"
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
        </div>
        <div id="visu-scores" className="flex justify-center"></div>
      </div>
    );
  }
};


export default VisuScores;
