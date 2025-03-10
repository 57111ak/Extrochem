import { useState, useEffect, useRef } from "react";
import * as NGL from "ngl"; // Import NGL Viewer
import { MdDelete } from "react-icons/md";

function Input({
  pdbFiles,
  setPdbFiles,
  selectedStyle,
  setSelectedStyle,
  selectedColorScheme,
  setSelectedColorScheme,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const viewerRef = useRef(null);
  const stageRef = useRef(null);
  const componentsRef = useRef([]);

  // File upload handler
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length > 0) {
      setPdbFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  // File deletion handler
  const handleFileDelete = (index) => {
    setPdbFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      if (stageRef.current) {
        const stage = stageRef.current;
        if (componentsRef.current[index]) {
          stage.removeComponent(componentsRef.current[index]);
          componentsRef.current.splice(index, 1);
        }
        stage.autoView();
        stage.viewer.requestRender();
      }
      return updatedFiles;
    });
  };

  // Update representation style
  const updateRepresentation = (style) => {
    setSelectedStyle(style);
    if (stageRef.current) {
      const stage = stageRef.current;
      componentsRef.current.forEach((component) => {
        component.removeAllRepresentations();
        component.addRepresentation(style, {
          color: selectedColorScheme,
          opacity: 0.8,
          aspectRatio: 3,
        });
      });
      stage.autoView();
      stage.viewer.requestRender();
    }
  };

  // Update color scheme
  const updateColorScheme = (scheme) => {
    setSelectedColorScheme(scheme);
    if (stageRef.current) {
      const stage = stageRef.current;
      componentsRef.current.forEach((component) => {
        component.removeAllRepresentations();
        component.addRepresentation(selectedStyle, {
          color: scheme,
          opacity: 0.8,
          aspectRatio: 3,
        });
      });
      stage.autoView();
      stage.viewer.requestRender();
    }
  };

  // Toggle water molecules
  const toggleWater = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      componentsRef.current.forEach((component) => {
        const waterRepresentation = component.representations.find(
          (rep) => rep.type === "ball+stick" && rep.params.sele === "water"
        );
        if (waterRepresentation) {
          component.removeRepresentation(waterRepresentation);
        } else {
          component.addRepresentation("ball+stick", {
            sele: "water",
            color: "lightblue",
            opacity: 0.8,
          });
        }
      });
      stage.autoView();
      stage.viewer.requestRender();
    }
  };

  // Toggle ions
  const toggleIons = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      componentsRef.current.forEach((component) => {
        const ionRepresentation = component.representations.find(
          (rep) => rep.type === "sphere" && rep.params.sele === "ion"
        );
        if (ionRepresentation) {
          component.removeRepresentation(ionRepresentation);
        } else {
          component.addRepresentation("sphere", {
            sele: "ion",
            color: "red",
            radius: 0.5,
          });
        }
      });
      stage.autoView();
      stage.viewer.requestRender();
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current) {
        stageRef.current.handleResize();
        stageRef.current.autoView();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize NGL stage
  useEffect(() => {
    if (!isLoading && pdbFiles.length > 0) {
      if (stageRef.current) {
        stageRef.current.dispose();
        stageRef.current = null;
        componentsRef.current = [];
      }
      viewerRef.current.innerHTML = "";
      stageRef.current = new NGL.Stage(viewerRef.current, {
        backgroundColor: "#1e1e1e",
        cameraType: "perspective",
        fog: true,
        clipNear: 1,
        clipFar: 1000,
      });
      const stage = stageRef.current;
      stage.setParameters({
        ambient: 0.4,
        directional: 0.6,
      });
      pdbFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const blob = new Blob([event.target.result], { type: "text/plain" });
          const ext = file.name.endsWith(".pdbqt") ? "pdbqt" : "pdb";
          stage.loadFile(blob, { ext }).then((component) => {
            component.addRepresentation(selectedStyle, {
              color: selectedColorScheme,
              opacity: 0.8,
              aspectRatio: 3,
            });
            componentsRef.current.push(component);
            stage.autoView();
            stage.viewer.requestRender();
          });
        };
        reader.readAsText(file);
      });
    } else if (pdbFiles.length === 0 && stageRef.current) {
      stageRef.current.dispose();
      stageRef.current = null;
      componentsRef.current = [];
    }
  }, [isLoading, pdbFiles, selectedStyle, selectedColorScheme]);

  return (
    <div className="flex h-full">
      {/* Left Panel */}
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

        {/* Control Panel */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Controls</h3>
          <div className="space-y-2">
            <div>
              <label className="text-white mr-2">Style:</label>
              <select
                value={selectedStyle}
                onChange={(e) => updateRepresentation(e.target.value)}
                className="bg-gray-700 text-white p-1 rounded"
              >
                <option value="cartoon">Cartoon</option>
                <option value="surface">Surface</option>
                <option value="spacefill">Spacefill</option>
                <option value="licorice">Licorice</option>
                <option value="line">Line</option>
                <option value="ball+stick">Ball & Stick</option>
              </select>
            </div>
            <div>
              <label className="text-white mr-2">Color Scheme:</label>
              <select
                value={selectedColorScheme}
                onChange={(e) => updateColorScheme(e.target.value)}
                className="bg-gray-700 text-white p-1 rounded"
              >
                <option value="chainindex">By Chain</option>
                <option value="element">By Element</option>
                <option value="rainbow">Rainbow</option>
                <option value="secondaryStructure">Secondary Structure</option>
              </select>
            </div>
            <div>
              <button
                onClick={toggleWater}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Toggle Water
              </button>
            </div>
            <div>
              <button
                onClick={toggleIons}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Toggle Ions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="w-1/2 p-6 shadow-lg rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Visualization</h2>
        <p className="text-sm text-white mb-4">Uploaded structures will appear below.</p>
        <div
          className="w-full h-[600px] bg-[#1e1e1e] rounded-lg relative overflow-hidden"
          ref={viewerRef}
        >
          {isLoading ? (
            <p className="text-blue-500 absolute inset-0 flex items-center justify-center">
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