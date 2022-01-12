import {Ci} from "utils/helpers/Ci";
import {CiMap} from "utils/helpers/CiMap";
import useCiInfluence from "hooks/useCiInfluence";
import useCiCoefsMetiersQuantiles from "hooks/useCiCoefsMetiersQuantiles";
import useAxesNames from "hooks/useAxesNames";
import React, { useEffect } from 'react';
import useDataVersion from 'hooks/useDataVersion';
import DataVersionSelect from "components/DataVersionSelect";
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";


const CiInfluence: React.FC = () => {

  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const ciCoefsMetiersQuantiles = useCiCoefsMetiersQuantiles(dataVersion,
    [0.5, 0.75, 0.95, 0.99, 1]);
  const ciInfluenceSum = useCiInfluence(dataVersion, "sum");
  const ciInfluenceVar = useCiInfluence(dataVersion, "var");

  useEffect(() => {
    if (ciCoefsMetiersQuantiles !== undefined && ciInfluenceSum !== undefined && ciInfluenceVar !== undefined ) {

      const a: [Ci, number[]][] = ciCoefsMetiersQuantiles.entries();
      const data = a.map(
        ([ci, [q50, q75, q95, q99, q1]]) => {
          return {ci: ci, q50: q50, q75: q75, q95: q95, q99: q99, q1: q1,
                  rank_sum: ciInfluenceSum.get(ci)?.rank,
                  influence_sum: ciInfluenceSum.get(ci)?.influence,
                  rank_var: ciInfluenceVar.get(ci)?.rank,
                  influence_var: ciInfluenceVar.get(ci)?.influence
                 }
        });

      const plotSum = Plot.plot({
        width: 400,
        height: 400,
        y: {
          domain: [0, 1.5]
        },
        color: {
          domain: [0.0, 4.0],
          range: ["black", "#AAAAAA"],
        },
        marks: [
          Plot.barY(data, {x: "rank_sum", y: "q50", fill: 0.0}),
          Plot.barY(data, {x: "rank_sum", y1: "q50", y2: "q75", fill: 1.0}),
          Plot.barY(data, {x: "rank_sum", y1: "q75", y2: "q95", fill: 2.0}),
          Plot.barY(data, {x: "rank_sum", y1: "q95", y2: "q99", fill: 3.0}),
          Plot.barY(data, {x: "rank_sum", y1: "q99", y2: "q1", fill: 4.0}),
        ],
      });

      const plotVar = Plot.plot({
        width: 400,
        height: 400,
        y: {
          domain: [0, 1.5]
        },
        color: {
          domain: [0.0, 4.0],
          range: ["black", "#AAAAAA"],
        },
        marks: [
          Plot.barY(data, {x: "rank_var", y: "q50", fill: 0.0}),
          Plot.barY(data, {x: "rank_var", y1: "q50", y2: "q75", fill: 1.0}),
          Plot.barY(data, {x: "rank_var", y1: "q75", y2: "q95", fill: 2.0}),
          Plot.barY(data, {x: "rank_var", y1: "q95", y2: "q99", fill: 3.0}),
          Plot.barY(data, {x: "rank_var", y1: "q99", y2: "q1", fill: 4.0})
        ],
      });

      const plotInfSum = Plot.plot({
        width: 400,
        height: 400,
        marks: [
          Plot.dot(data, {x: "rank_sum", y: "influence_sum"})
        ]
      });

      const plotInfVar = Plot.plot({
        width: 400,
        height: 400,
        marks: [
          Plot.dot(data, {x: "rank_var", y: "influence_var"})
        ]
      });

      d3.select("#ci-influences-sum").append(() => plotSum);
      d3.select("#ci-influences-sum").append(() => plotInfSum);
      d3.select("#ci-influences-var").append(() => plotVar);
      d3.select("#ci-influences-var").append(() => plotInfVar);

      return () => {
        plotSum?.remove();
        plotInfSum?.remove();
        plotVar?.remove();
        plotInfVar?.remove();
      };
    };
  },
  [ciCoefsMetiersQuantiles, ciInfluenceSum, ciInfluenceVar]);

  return (
    <div>
      <h1 className="font-bold text-lg mb-6">
        Scores d'influence des CI sur les métiers
      </h1>
      <DataVersionSelect
        label="Version des coefficients :"
        curDataVersion={dataVersion}
        onSelect={setDataVersion}
      />
      <div className="flex flex-wrap">
        <figure className="m-4">
          <div id="ci-influences-sum" className="flex justify-center"></div>
          <figcaption className="flex justify-center text-justify">Distribution
          des coefficients CI/Métiers. CI triés par la somme des coefficients.</figcaption>
        </figure>
        <figure className="m-4">
          <div id="ci-influences-var" className="flex justify-center"></div>
          <figcaption className="flex justify-center text-justify">Distribution
          des coefficients CI/Métiers. CI triés par la variance des coefficients.</figcaption>
        </figure>
      </div>
    </div>
  );
};


export default CiInfluence;
