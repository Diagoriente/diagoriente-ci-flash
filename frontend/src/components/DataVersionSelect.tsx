import React from 'react';
import useDataVersions from 'hooks/useDataVersions';


const DataVersionSelect: React.FC<{
    label: string,
    curDataVersion: string | undefined,
    onSelect: (dataVersion: string) => void}>
    =
    ({label, curDataVersion, onSelect}) => {

  const dataVersions = useDataVersions(curDataVersion, onSelect);

  console.log(`DataVersionSelect: curDataVersion is ${curDataVersion}`)

  return (
    <div className="text-left">
      <label className="inline" htmlFor="data-version-select">{label}</label>
      <select 
        className="rounded bg-indigo-200"
        name="data-version-select"
        id="data-version-select"
        defaultValue={curDataVersion}
        value={curDataVersion}
        onChange={e => onSelect(e.target.value)}
      >
        {
          dataVersions?.list.map((version) => 
            <option key={version} value={version}>
              {version}
            </option>
          )
        }
      </select>
    </div>
  );
}

export default DataVersionSelect;
