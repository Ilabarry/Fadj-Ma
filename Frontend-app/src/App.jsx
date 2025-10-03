import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogPage from "./pages/logPage";
import NavMedicaments from "./component/headerComponent";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/*" element={<LogPage />} />
          <Route path="/mes-medicaments/*" element={<NavMedicaments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;