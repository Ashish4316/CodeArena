import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sheet from "./pages/Sheet";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sheet/:sheetName" element={<Sheet />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
