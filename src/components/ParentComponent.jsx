import { useState } from "react";
import Input from "./Input";
import Configuration from "./Configuration";
import MoleculeTable from "./MoleculeTable";

function ParentComponent() {
  const [activeTab, setActiveTab] = useState("INPUT");
  const [generatedData, setGeneratedData] = useState(null);
  const [pdbFiles, setPdbFiles] = useState([]); // State for PDB files

  const generateMolecules = async (pdbFiles) => {
    const formData = new FormData();
    formData.append("protein_file", pdbFiles[0]); // Assuming the first file is used
    formData.append("num_molecules", 10); // Adjust as necessary

    const response = await fetch("http://localhost:8000/generate_molecules/", {
      method: "POST",
      body: formData, // Send the FormData object
    });

    if (response.ok) {
      const data = await response.json();
      setGeneratedData(data); // Update the generated data with the response
      setActiveTab("RESULTS");
    } else {
      console.error("Error fetching molecules:", response.statusText);
    }
  };

  const handleRun = () => {
    generateMolecules(pdbFiles); // Call the new function instead of setting data directly
  };

  return (
    <div className="w-full py-28 h-screen bg-[#041415]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 shadow-md">
        <div className="items-center">
          <div className="text-[#ffffffdc] mb-4 text-xl font-medium">Generation 5</div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("INPUT")}
              className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition ${activeTab === "INPUT" ? "bg-[#7478a0] text-white" : ""}`}
            >
              INPUT
            </button>
            <button
              onClick={() => setActiveTab("CONFIGURATION")}
              className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition ${activeTab === "CONFIGURATION" ? "bg-[#7478a0] text-white" : ""}`}
            >
              CONFIGURATION
            </button>
            {generatedData && (
              <button
                onClick={() => setActiveTab("RESULTS")}
                className={`px-4 py-2 border-[1px] border-zinc-500 rounded-full font-light text-sm uppercase hover:bg-white hover:text-black transition ${activeTab === "RESULTS" ? "bg-[#7478a0] text-white" : ""}`}
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
        {activeTab === "RESULTS" && generatedData && <MoleculeTable data={generatedData} />}
      </div>
    </div>
  );
}

export default ParentComponent;
