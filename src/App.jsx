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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sheets"
          element={
            <ProtectedRoute>
              <SheetsList />
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
        <Route
          path="/sheet/:sheetName"
          element={
            <ProtectedRoute>
              <Sheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/faang"
          element={
            <ProtectedRoute>
              <CompanySheet />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
