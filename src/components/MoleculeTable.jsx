import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stage } from "ngl";
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import { fetchMolecules } from "../redux/moleculeSlice";

function MoleculeTable() {
  const dispatch = useDispatch();
  const moleculesState = useSelector((state) => state.molecules);
  const [selectedPdb, setSelectedPdb] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    // Automatically fetch molecules if needed
    if (moleculesState.data.length === 0) {
      dispatch(fetchMolecules({}));
    }
  }, [dispatch, moleculesState]);

  const handleViewClick = (pdbFile) => {
    setSelectedPdb(pdbFile);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPdb(null);
  };

  useEffect(() => {
    if (selectedPdb && viewerRef.current) {
      const stage = new Stage(viewerRef.current, { backgroundColor: "black" });
      stage.loadFile(selectedPdb).then((component) => {
        component.addRepresentation("cartoon", { color: "residueindex" });
        component.autoView();
      });
      return () => stage.dispose();
    }
  }, [selectedPdb]);

  if (moleculesState.loading) return <p>Loading molecules...</p>;
if (moleculesState.error) return <p>Error: {moleculesState.error}</p>;

return (
  <div>
    <h2 className="text-xl font-bold mb-4">Generated Molecules</h2>
    <table className="w-full border-collapse">
      {/* Table headers */}
      <thead>
        <tr className="text-center bg-zinc-700 text-white">
          <th className="border border-zinc-500 p-2">SMILES</th>
          <th className="border border-zinc-500 p-2">Num Atoms</th>
          <th className="border border-zinc-500 p-2">Docking Score</th>
          <th className="border border-zinc-500 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {moleculesState.data.map((molecule, index) => (
          <tr key={index} className="text-center">
            <td className="border-r border-t border-b border-zinc-500 p-2">{molecule.smiles}</td>
            <td className="border border-zinc-500 p-2">{molecule.NumAtoms}</td>
            <td className="border border-zinc-500 p-2">{molecule.docking_score}</td>
            <td className="border-l border-b border-t border-zinc-500 p-2">
              <button onClick={() => handleViewClick(molecule.docked_pdb_path)}>
                <RxEyeOpen />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Modal for PDB viewer */}
    {showModal && (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="backdrop-blur-3xl bg-black p-6 rounded-lg w-[80%] max-w-[800px] h-[600px] relative">
          <button onClick={closeModal} className="absolute top-2 right-2">
            <GoEyeClosed />
          </button>
          <h3 className="text-lg font-semibold mb-4">PDB Viewer</h3>
          <div ref={viewerRef} style={{ width: "100%", height: "calc(100% - 60px)" }}></div>
        </div>
      </div>
    )}
  </div>
);
}

export default MoleculeTable;