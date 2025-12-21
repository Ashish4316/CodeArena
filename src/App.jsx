
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sheet from "./pages/Sheet";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/sheet/:sheetName" element={<Sheet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

