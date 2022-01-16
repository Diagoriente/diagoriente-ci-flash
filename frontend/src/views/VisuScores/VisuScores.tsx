import {ci} from "utils/helpers/Ci";
import {CiScores, ciScoresFromRecord} from "utils/helpers/CiScores";
import {GraphType, graphTypeFromString, graphTypeToString} from "utils/helpers/GraphType";
import useFetched from "hooks/useFetched";
import {CiNames, ciNamesFromRecord} from 'utils/helpers/CiNames';
import useStateSP from "hooks/useStateSP";
import useCurCi from "hooks/useCurCi";
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
  const [ciNames] = useFetched<CiNames>("ci_names",
    {ci_data_version: dataVersion},
    [dataVersion],
    ciNamesFromRecord);
  const [ciScores] = useFetched<CiScores>(
    "ci_scores",
    {ci_data_version: dataVersion, ci: curCi},
    [dataVersion, curCi],
    ciScoresFromRecord);

  useEffect(() => {
    if (curCi !== null && curGraphType !== null && ciNames !== undefined) {
      const ciDist = ciScores?.distanceAsc(ciNames) || [];
      const ciOuv = ciScores?.ouvertureDesc(ciNames) || [];
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
        y: (d, _) => d.name,
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
  }, [curGraphType, curCi, ciScores, ciNames]);

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
          {ciNames?.entries().map(([ci, val]) => 
             <option key={ci.id} value={ci.id}>
               {val}
             </option>)}
        </select>
      </div>
      <div id="visu-scores" className="flex justify-center"></div>
    </div>
  );
};


export default VisuScores;
