import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sheet from "./pages/Sheet";
import SheetsList from "./pages/SheetsList";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import CompanySheet from "./pages/CompanySheet";
import CreateSheet from "./pages/CreateSheet";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import XPToast from "./components/XPToast";

function App() {
  return (
    <BrowserRouter>
      <XPToast />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Public routes - accessible without login */}
        <Route path="/" element={<Home />} />
        <Route path="/sheets" element={<SheetsList />} />
        <Route path="/sheet/:sheetName" element={<Sheet />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/company/faang" element={<CompanySheet />} />
        {/* Protected routes - require login */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sheets/create"
          element={
            <ProtectedRoute>
              <CreateSheet />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
