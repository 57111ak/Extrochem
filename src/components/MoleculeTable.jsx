import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Stage } from "ngl"; // Import NGL Stage
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";

function MoleculeTable() {
  const moleculesState = useSelector((state) => state.molecules);
  const [selectedPdb, setSelectedPdb] = useState(null); // Selected PDB file path
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const viewerRef = useRef(null); // Reference for the NGL viewer container

  useEffect(() => {
    console.log("Molecules state:", moleculesState); // Debugging statement
  }, [moleculesState]);

  // Handle click on the <RxEyeOpen /> button
  const handleViewClick = (pdbFile) => {
    setSelectedPdb(pdbFile); // Set the selected PDB file
    setShowModal(true); // Open the modal
  };

  // Close the modal and reset the NGL stage
  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedPdb(null); // Reset the selected PDB file
    if (viewerRef.current) {
      viewerRef.current.innerHTML = ""; // Clear the NGL viewer container
    }
  };

  // Initialize the NGL stage when a PDB file is selected
  useEffect(() => {
    if (selectedPdb && viewerRef.current) {
      const stage = new Stage(viewerRef.current, {
        backgroundColor: "black", // Background color
        cameraType: "perspective", // Camera type
        fog: true, // Enable fog effect
      });

      // Load the PDB file into the NGL stage
      stage.loadFile(selectedPdb).then((component) => {
        component.addRepresentation("cartoon", {
          color: "residueindex", // Default color scheme
          opacity: 0.8,
        });
        stage.autoView(); // Auto-adjust the view
      });

      // Cleanup function to dispose of the stage when the modal is closed
      return () => {
        stage.dispose();
      };
    }
  }, [selectedPdb]); // Re-run this effect when `selectedPdb` changes

  // Show loading message if data is still being fetched
  if (moleculesState.loading && moleculesState.data.length === 0) {
    return <p>Loading molecules...</p>;
  }

  // Show error message if there's an error
  if (moleculesState.error) {
    return <p>Error: {moleculesState.error}</p>;
  }

  // Show a message if no molecules are generated yet
  if (moleculesState.data.length === 0) {
    return <p>No molecules generated yet.</p>;
  }

  // Descriptor labels mapping
  const descriptorLabels = {
    LogP: "LogP",
    MolecularWeight: "Molecular Weight",
    HBondDonors: "H-Bond Donors",
    HBondAcceptors: "H-Bond Acceptors",
    TopoPSA: "Topo PSA",
  };

  // Descriptor priority list
  const descriptorPriority = [
    "LogP",
    "MolecularWeight",
    "HBondDonors",
    "HBondAcceptors",
    "TopoPSA",
  ];

  // Utility function to extract top descriptors
  const getTopDescriptors = (descriptors, count = 5) => {
    // Filter descriptors based on priority
    const prioritizedDescriptors = descriptorPriority
      .filter((key) => key in descriptors) // Include only keys present in the descriptors object
      .map((key) => [descriptorLabels[key] || key, descriptors[key]]); // Map to [label, value]

    // Return the top `count` prioritized descriptors
    return prioritizedDescriptors.slice(0, count);
  };

  // Get dynamic headers based on the first molecule's descriptors
  const dynamicHeaders = moleculesState.data.length > 0
    ? getTopDescriptors(moleculesState.data[0].descriptors).map(([key]) => key)
    : [];

  // Utility function to format float values
  const formatValue = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2); // Format to 2 decimal places
    }
    return value || "N/A"; // Return "N/A" for undefined or null values
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generated Molecules</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-center bg-zinc-700 text-white">
            <th className="border border-zinc-500 p-2">SMILES</th>
            {dynamicHeaders.map((header, index) => (
              <th key={index} className="border border-zinc-500 p-2">
                {header}
              </th>
            ))}
            <th className="border border-zinc-500 p-2">Docking Score</th>
            <th className="border border-zinc-500 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {moleculesState.data.map((molecule, index) => {
            const topDescriptors = getTopDescriptors(molecule.descriptors);

            return (
              <tr key={index} className="text-center">
                <td className="border-r border-t border-b border-zinc-500 p-2">
                  {molecule.smiles || "N/A"}
                </td>
                {topDescriptors.map(([key, value], idx) => (
                  <td key={idx} className="border border-zinc-500 p-2">
                    {formatValue(value)} {/* Format the value */}
                  </td>
                ))}
                <td className="border border-zinc-500 p-2">
                  {formatValue(molecule.docking_score)} {/* Format docking score */}
                </td>
                <td className="border-l border-b border-t border-zinc-500 p-2">
                  <button
                    onClick={() => handleViewClick(molecule.docked_pdb_path)}
                    className="hover:text-blue-500"
                  >
                    <RxEyeOpen />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal for PDB Viewer */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg w-[80%] max-w-[800px] h-[600px] relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white hover:text-red-500"
            >
              <GoEyeClosed />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-white">PDB Viewer</h3>
            <div
              ref={viewerRef}
              style={{ width: "100%", height: "calc(100% - 60px)" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoleculeTable;