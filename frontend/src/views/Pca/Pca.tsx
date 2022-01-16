import {CiAxes, ciAxesFromRecord} from 'utils/helpers/CiAxes';
import {CiNames, ciNamesFromRecord} from 'utils/helpers/CiNames';
import useFetched from "hooks/useFetched";
import React, { useEffect, useMemo } from 'react';
import {Pca as Pca_} from 'utils/helpers/Pca';
import useDataVersion from 'hooks/useDataVersion';
import DataVersionSelect from "components/DataVersionSelect";
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";


const Pca: React.FC = () => {

  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const [ciNames] = useFetched<CiNames>("ci_names",
    {ci_data_version: dataVersion},
    [dataVersion],
    ciNamesFromRecord);
  const [axesNames] = useFetched<string[]>("axes_names",
    {ci_data_version: dataVersion},
    [dataVersion]);
  const [ciAxes] = useFetched<CiAxes>("ci_axes",
    {ci_data_version: dataVersion},
    [dataVersion],
    ciAxesFromRecord);
  const [pca] = useFetched<Pca_>("pca",
    {ci_data_version: dataVersion},
    [dataVersion]);

  useEffect(() => {
    if (ciAxes !== undefined && ciNames !== undefined) {
      const data = ciAxes?.entries().map(([ci, axes]) => {
          return {F1: axes[0], F2: axes[1], label: ciNames.get(ci)};
      });

      const [dmin, dmax] = data.reduce(
        ([dmin, dmax], {F1, F2}) => [
          Math.min(dmin, F1, F2),
          Math.max(dmax, F1, F2)
        ],
        [0, 0]
      );

      const plot = Plot.plot({
        width: 1000,
        height: 1000,
        x: {domain: [dmin, dmax], grid: true},
        y: {domain: [dmin, dmax], grid: true},
        marks: [
          Plot.text(data, {x: "F1", y: "F2", text: "label"}), 
        ]
      });

      d3.select("#scatter-ci").append(() => plot);

      return () => {
        plot?.remove();
      };
    }
  },
  [ciAxes, ciNames]);

  useEffect(() => {
    if (pca !== undefined) {
      const plot = Plot.plot({
        marks: [
          Plot.barY(pca?.explained_variance_ratio.entries(), {
            y: (d: number[]) => d[1],
            x: (d: number[]) => `F${d[0]+1}`
          }),
          Plot.ruleY([pca?.kaiser_criteria],
            {"stroke": "red"}
          )
        ],
        width: 400,
        height: 250,
      });

      d3.select("#scree-plot").append(() => plot);

      return () => {plot?.remove();};
    }
  },
  [pca]);

  useEffect(() => {
    if (pca !== undefined && axesNames !== undefined) {
      const components = pca?.components.map((comp: number[], i: number) => {
          return {label: (axesNames?.[i] || i), F1: comp[0], F2: comp[1]};
      });

      const unitCirclePoints = 100;
      const unitCircleCoords =
        Array.from({length: unitCirclePoints}, (v, i) => {
          const x = i * 2 * 3.14159 / (unitCirclePoints - 1); 
          return [Math.cos(x), Math.sin(x)]
        });

      const plot = Plot.plot({
        x: {domain: [-1, 1], grid: true},
        y: {domain: [-1, 1], grid: true},
        width: 400,
        height: 400,
        marks: [
          Plot.text(components, {x: "F1", y: "F2", text: "label"}), 
          Plot.link(components, {x1: 0, y1: 0, x2: "F1", y2: "F2", text: "label"}),
          Plot.line(unitCircleCoords)
        ]
      });

      d3.select("#scatter-features").append(() => plot);

      return () => {
        plot?.remove();
      };
    }
  },
  [pca, axesNames]);

  return (
    <div>
      <h1 className="font-bold text-lg mb-6">
        Résultats de l'ACP sur les coefficients des CI.
      </h1>
      <DataVersionSelect
        label="Version des coefficients :"
        curDataVersion={dataVersion}
        onSelect={setDataVersion}
      />
      <div className="flex flex-wrap items-baseline justify-center">
        <figure className="w-96 m-4">
          <div id="scree-plot" className="flex justify-center"></div>
          <figcaption className="flex justify-center text-justify">Éboulis (scree
          plot). Proportion de variance expliquée par chaque composante
          principale.</figcaption>
        </figure>
        <figure className="w-96 m-4">
          <div id="scatter-features" className="flex justify-center"></div>
          <figcaption className="flex justify-center text-justify">Cercle des corrélations</figcaption>
        </figure>
        <figure className="w-full m-4">
          <div id="scatter-ci" className="flex justify-center"></div>
          <figcaption className="flex justify-center text-justify">Nuage des centres
          d'intérêts dans le plan principal. Centres d'intérets projetés dans le plan des 2 premières 
          composantes principales</figcaption>
        </figure>
      </div>
    </div>
  );
};


export default Pca;
