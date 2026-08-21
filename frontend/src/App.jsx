import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import ParkingFloors from "./pages/ParkingFloors";
import ParkingSlots from "./pages/ParkingSlots";
import ParkingTickets from "./pages/ParkingTickets";
import Analytics from "./pages/Analytics";

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parking-floors"
            element={
              <ProtectedRoute>
                <ParkingFloors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parking-slots"
            element={
              <ProtectedRoute>
                <ParkingSlots />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parking-tickets"
            element={
              <ProtectedRoute>
                <ParkingTickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;