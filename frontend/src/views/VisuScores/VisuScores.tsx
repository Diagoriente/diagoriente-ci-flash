import {ci} from "utils/helpers/Ci";
import {GraphType, graphTypeFromString, graphTypeToString} from "utils/helpers/GraphType";
import useCiNames from "hooks/useCiNames";
import useStateSP from "hooks/useStateSP";
import useCurCi from "hooks/useCurCi";
import useCiScores from "hooks/useCiScores";
import React, {useEffect} from 'react';
import * as d3 from 'd3';
import HorizontalBarChart from "views/VisuScores/HorizontalBarChart";
import useDataVersion from 'hooks/useDataVersion';
import DataVersionSelect from "components/DataVersionSelect";


const VisuScores: React.FC = () => {

  const [curGraphType, setCurGraphType] = useStateSP("distance" as GraphType,
    "graphType", graphTypeFromString, graphTypeToString);
  const [curCi, setCurCi] = useCurCi();
  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const ciNames = useCiNames(dataVersion);
  const [ciDist, ciOuv] = useCiScores(curCi, dataVersion, ciNames);

  useEffect(() => {
    if (curCi !== null && curGraphType !== null && ciNames !== undefined) {
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

  return (
    <div className="flex-col space-y-5">
      <DataVersionSelect
        label="Version des coefficients :"
        curDataVersion={dataVersion}
        onSelect={setDataVersion}
      />
      <div className="text-left">
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
          {ciNames?.array().map(({ci, name}) => 
             <option key={ci.id} value={ci.id}>
               {name}
             </option>)}
        </select>
      </div>
      <div id="visu-scores" className="flex justify-center"></div>
    </div>
  );
};


export default VisuScores;
