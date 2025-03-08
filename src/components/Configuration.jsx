import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMolecules } from "../redux/moleculeSlice"; // Adjust the import path as necessary
import PropertyInput from "./PropertyInput";

function Configuration({ pdbFiles, onRun }) {
  const [settings, setSettings] = useState({
    mw: [250, 900],
    hbd: [0, 15],
    hba: [0, 15],
    logP: [-4, 8],
    tpsa: [0, 270],
    numO: [0, 10],
    numN: [0, 15],
    numS: [0, 5],
    numCl: [0, 5],
    numF: [0, 10],
    rotBonds: [0, 20],
    maxRing: [0, 10],
    numStereo: [0, 10],
    numAromaticRings: [0, 10],
    wOxygenPortion: [0, 300],
    wNitrogenPortion: [0, 350],
    wAromaticPortion: [0, 1],
    wHeteroPortion: [0, 150],
    mce18: [0, 200],
  });

  const handleChange = (e, key, index) => {
    const value = Number(e.target.value);
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key].map((val, i) => (i === index ? value : val)),
    }));
  };

  const dispatch = useDispatch();

  const handleRun = async () => {
    const formData = new FormData();
    pdbFiles.forEach((file) => {
      formData.append("protein_file", file); // Append each PDB file
    });
    formData.append("num_molecules", 10); // Adjust as necessary
    formData.append("logp_min", settings.logP[0]); // Append logP min
    formData.append("logp_max", settings.logP[1]); // Append logP max

    try {
      await dispatch(fetchMolecules(formData)).unwrap();
      onRun(); // Call the onRun function passed from ParentComponent
    } catch (error) {
      console.error("Failed to fetch molecules:", error);
    }
  };

  const ro5Properties = [
    {
      header: "RO5-Related Properties",
      properties: [
        { label: "LogP", key: "logP", range: [-4, 8] },
        { label: "Molecular Weight (MW)", key: "mw", range: [250, 900] },
        { label: "Hydrogen Bond Donor (HBD)", key: "hbd", range: [0, 15] },
        { label: "Hydrogen Bond Acceptor (HBA)", key: "hba", range: [0, 15] },
        { label: "TopoPSA", key: "tpsa", range: [0, 270] },
      ],
    },
  ];

  const atomTypeProperties = [
    {
      header: "Atom-Type Count Properties",
      properties: [
        { label: "Number of Oxygen atoms", key: "numO", range: [0, 10] },
        { label: "Number of Nitrogen atoms", key: "numN", range: [0, 15] },
        { label: "Number of Sulfur atoms", key: "numS", range: [0, 5] },
        { label: "Number of Chlorine atoms", key: "numCl", range: [0, 5] },
        { label: "Number of Fluorine atoms", key: "numF", range: [0, 10] },
      ],
    },
  ];

  const weightedAtomTypeProperties = [
    {
      header: "Weighted Atom-Type Portion Properties",
      properties: [
        { label: "Weighted Oxygen Portion", key: "wOxygenPortion", range: [0, 300] },
        { label: "Weighted Nitrogen Portion", key: "wNitrogenPortion", range: [0, 350] },
        { label: "Weighted Aromatic Portion", key: "wAromaticPortion", range: [0, 1] },
        { label: "Weighted Heteroatom Portion", key: "wHeteroPortion", range: [0, 150] },
      ],
    },
  ];

  const structuralProperties = [
    {
      header: "Structural Properties",
      properties: [
        { label: "Number of Rotatable Bonds", key: "rotBonds", range: [0, 20] },
        { label: "Maximum Ring Size", key: "maxRing", range: [0, 10] },
        { label: "Number of Stereocenters", key: "numStereo", range: [0, 10] },
        { label: "Number of Aromatic Rings", key: "numAromaticRings", range: [0, 10] },
        { label: "MCE-18", key: "mce18", range: [0, 200] },
      ],
    },
  ];

  return (
    <div className="w-full  p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Configuration</h1>

      {/* RO5 Related Properties */}
      {ro5Properties.map((group) => (
        <div key={group.header} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{group.header}</h2>
          <div className="grid grid-cols-2 gap-6">
            {group.properties.map((prop) => (
              <PropertyInput
                key={prop.key}
                label={prop.label}
                keyName={prop.key}
                range={prop.range}
                settings={settings}
                handleChange={handleChange}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Atom-Type Count Properties */}
      {atomTypeProperties.map((group) => (
        <div key={group.header} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{group.header}</h2>
          <div className="grid grid-cols-2 gap-6">
            {group.properties.map((prop) => (
              <PropertyInput
                key={prop.key}
                label={prop.label}
                keyName={prop.key}
                range={prop.range}
                settings={settings}
                handleChange={handleChange}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Weighted Atom-Type Portion Properties */}
      {weightedAtomTypeProperties.map((group) => (
        <div key={group.header} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{group.header}</h2>
          <div className="grid grid-cols-2 gap-6">
            {group.properties.map((prop) => (
              <PropertyInput
                key={prop.key}
                label={prop.label}
                keyName={prop.key}
                range={prop.range}
                settings={settings}
                handleChange={handleChange}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Structural Properties */}
      {structuralProperties.map((group) => (
        <div key={group.header} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{group.header}</h2>
          <div className="grid grid-cols-2 gap-6">
            {group.properties.map((prop) => (
              <PropertyInput
                key={prop.key}
                label={prop.label}
                keyName={prop.key}
                range={prop.range}
                settings={settings}
                handleChange={handleChange}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleRun}
          className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition `}
        >
          RUN
        </button>
      </div>
    </div>
  );
}

export default Configuration;