import { useState } from "react";
import Input from "./Input";
import Configuration from "./Configuration";
import MoleculeTable from "./MoleculeTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMolecules } from "../redux/moleculeSlice";

function ParentComponent() {
  const [activeTab, setActiveTab] = useState("INPUT");
  const [pdbFiles, setPdbFiles] = useState([]); // State for PDB files
  const dispatch = useDispatch();
  const moleculesState = useSelector((state) => state.molecules);

  const generateMolecules = async (pdbFiles) => {
    const formData = new FormData();
    pdbFiles.forEach((file) => {
      formData.append("protein_file", file); // Append each PDB file
    });
    formData.append("num_molecules", 10); // Adjust as necessary

    // Dispatch the fetchMolecules action
    await dispatch(fetchMolecules(formData));
    setActiveTab("RESULTS");
  };

  const handleRun = () => {
    generateMolecules(pdbFiles); // Call the new function instead of setting data directly
  };

  return (
    <div className="w-full py-28 bg-[#041415]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 shadow-md">
        <div className="items-center">
          <div className="text-[#ffffffdc] mb-4 text-xl font-medium">Generation 5</div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("INPUT")}
              className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition ${
                activeTab === "INPUT" ? "bg-[#7478a0] text-white" : ""
              }`}
            >
              INPUT
            </button>
            <button
              onClick={() => setActiveTab("CONFIGURATION")}
              className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition ${
                activeTab === "CONFIGURATION" ? "bg-[#7478a0] text-white" : ""
              }`}
            >
              CONFIGURATION
            </button>
            {moleculesState.data && (
              <button
                onClick={() => setActiveTab("RESULTS")}
                className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition ${
                  activeTab === "RESULTS" ? "bg-[#7478a0] text-white" : ""
                }`}
              >
                RESULTS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-full px-6 py-4">
        {activeTab === "INPUT" && <Input pdbFiles={pdbFiles} setPdbFiles={setPdbFiles} />}
        {activeTab === "CONFIGURATION" && <Configuration pdbFiles={pdbFiles} onRun={handleRun} />}
        {activeTab === "RESULTS" && moleculesState.data && (
          <MoleculeTable data={moleculesState.data} />
        )}
      </div>
    </div>
  );
}

export default ParentComponent;