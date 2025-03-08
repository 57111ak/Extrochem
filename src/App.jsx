import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import LocomotiveScroll from "locomotive-scroll";
import Configuration from './components/Configuration';
import ParentComponent from './components/ParentComponent';
import MoleculeTable from './components/MoleculeTable';

function App() {
  React.useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
    return () => {
      locomotiveScroll.destroy(); 
    };
  }, []);

  return (
    <Router>
      <div className="w-full min-h-screen text-white bg-zinc-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/input" element={<ParentComponent />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/results" element={<MoleculeTable />} /> {/* Add results route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;