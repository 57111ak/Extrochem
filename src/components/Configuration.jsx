import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMolecules } from "../redux/moleculeSlice"; // Adjust the import path as necessary
import PropertyInput from "./PropertyInput";

function Configuration({ pdbFiles, onRun }) {
  const [settings, setSettings] = useState({
    mw: [250, 750],
    hbd: [0, 10],
    hba: [0, 10],
    logP: [-2, 6],
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
      formData.append('protein_file', file); // Append each PDB file
    });
    formData.append('num_molecules', 10); // Adjust as necessary
    formData.append('logp_min', settings.logP[0]); // Append logP min
    formData.append('logp_max', settings.logP[1]); // Append logP max

    try {
      await dispatch(fetchMolecules(formData)).unwrap();
      onRun(); // Call the onRun function passed from ParentComponent
    } catch (error) {
      console.error("Failed to fetch molecules:", error);
    }
  };

  const properties = [
    { label: "Molecular Weight (MW)", key: "mw", range: [0, 900] },
    { label: "Hydrogen Bond Donor (HBD)", key: "hbd", range: [0, 10] },
    { label: "Hydrogen Bond Acceptor (HBA)", key: "hba", range: [0, 10] },
    { label: "Octanol-water Partition Coefficient (LogP)", key: "logP", range: [-2, 6] },
  ];

  return (
    <div className="w-full h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Configuration</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 rounded-lg ">
          <h2 className="text-lg font-semibold mb-2">RO5 Related Properties</h2>
          {properties.slice(0, 4).map((prop) => (
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