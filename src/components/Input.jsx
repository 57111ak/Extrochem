import { useState, useEffect, useRef } from "react";
import * as NGL from "ngl"; // Import NGL Viewer
import { MdDelete } from "react-icons/md";

function Input({ pdbFiles, setPdbFiles }) {
  // const [pdbFiles, setPdbFiles] = useState([]); // Store uploaded files
  const [isLoading, setIsLoading] = useState(false);
  const viewerRef = useRef(null);
  const stageRef = useRef(null);
  const componentsRef = useRef([]); // Track loaded components

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length > 0) {
      setPdbFiles((prevFiles) => [...prevFiles, ...uploadedFiles]); // Update ParentComponent's state
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleFileDelete = (index) => {
    setPdbFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
  
      if (stageRef.current) {
        const stage = stageRef.current;
  
        if (componentsRef.current[index]) {
          stage.removeComponent(componentsRef.current[index]); // Remove the specific component
          componentsRef.current.splice(index, 1); // Remove from tracker
        }
  
        if (pdbFiles.length === 0 && stageRef.current) {
          stage.dispose();
          stageRef.current = null;
          componentsRef.current = [];
        } else {
          stage.autoView();
          stage.viewer.requestRender(); 
        }
      }
  
      return updatedFiles;
    });
  };
  

  useEffect(() => {
    if (!isLoading && pdbFiles.length > 0) {
      // Fully reset the viewer to prevent residual state issues
      if (stageRef.current) {
        stageRef.current.dispose();
        stageRef.current = null;
        componentsRef.current = [];
      }
  
      // Clear the viewer container before reinitializing
      viewerRef.current.innerHTML = '';
  
      // Reinitialize the viewer
      stageRef.current = new NGL.Stage(viewerRef.current, {
        backgroundColor: "#343435",
      });
  
      const stage = stageRef.current;
  
      // Load each PDB file into the NGL stage
      pdbFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const blob = new Blob([event.target.result], { type: "text/plain" });
          const ext = file.name.endsWith(".pdbqt") ? "pdbqt" : "pdb";
  
          stage.loadFile(blob, { ext }).then((component) => {
            component.addRepresentation("cartoon", { color: index === 0 ? "lightgreen" : "lightblue" });
            componentsRef.current.push(component);
            stage.autoView(); // Automatically adjust the view
            stage.viewer.requestRender(); // Explicitly request a render update
            stage.autoView(); // Automatically adjust the view
            stage.viewer.requestRender(); // Explicitly request a render update
          });
        };
        reader.readAsText(file);
      });
    } else if (pdbFiles.length === 0 && stageRef.current) {
      // Fully reset viewer when no files remain
      stageRef.current.dispose();
      stageRef.current = null;
      componentsRef.current = [];
      stageRef.current.dispose();
      stageRef.current = null;
      componentsRef.current = [];
      stageRef.current.dispose();
      stageRef.current = null;
      componentsRef.current = [];
    }
  }, [isLoading, pdbFiles]);
  
  useEffect(() => {
    // Cleanup function to ensure proper disposal of the NGL stage
    return () => {
      if (stageRef.current) {
        stageRef.current.dispose();
        stageRef.current = null;
        componentsRef.current = [];
      }
    };
  }, []);

  return (
    <div className="flex h-full">
      {/* File Upload Section */}
      <div className="w-1/2 p-6 shadow-lg rounded-lg">
        <h2 className="text-lg text-[#ffffffdc] font-semibold mb-2">Upload Structures</h2>
        <p className="text-[#ffffffa4] mb-4">
          Upload one or more PDB/PDBQT files to visualize them together.
        </p>
        <div className="border-dashed border-2 border-green-900 rounded-lg p-6 text-center">
          {isLoading ? (
            <p className="text-blue-500 flex justify-center items-center">Loading...</p>
          ) : (
            <>
              <p className="text-gray-500">
                Drag and drop PDB/PDBQT files here, or
                <span
                  className="text-green-600 cursor-pointer"
                  onClick={() => document.getElementById("pdbFiles").click()}
                >
                  &nbsp; browse
                </span>
              </p>
              <input
                type="file"
                id="pdbFiles"
                accept=".pdb,.pdbqt"
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              {pdbFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-white">Uploaded Files:</p>
                  <ul className="text-white">
                    {pdbFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{file.name}</span>
                        <button
                          className="text-white hover:text-red-700 ml-2 text-[20px]"
                          onClick={() => handleFileDelete(index)}
                        >
                          <MdDelete />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visualization Section */}
      <div className="w-1/2 p-6 shadow-lg rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Visualization</h2>
        <p className="text-sm text-white mb-4">Uploaded structures will appear below.</p>
        <div
          className="w-full h-96 bg-[#343435] rounded-lg flex items-center justify-center relative overflow-hidden"
          ref={viewerRef}
        >
          {isLoading ? (
            <p className="text-blue-500 flex flex-col items-center absolute inset-0 justify-center">
              Loading structures...
            </p>
          ) : pdbFiles.length === 0 ? (
            <span className="text-white absolute inset-0 flex items-center justify-center">
              Preview
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Input;
