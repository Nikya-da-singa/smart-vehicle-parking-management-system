import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Layers,
  ParkingSquare,
  Ticket,
  ArrowRight,
  TrendingUp,
  Clock,
  PlusCircle,
  BarChart3,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import "../styles/Dashboard.css";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [floors, setFloors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ticket Exit State
  const [selectedTicketToExit, setSelectedTicketToExit] = useState(null);
  const [exiting, setExiting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        vehiclesRes,
        floorsRes,
        slotsRes,
        ticketsRes,
        activeTicketsRes,
      ] = await Promise.all([
        api.get("/vehicles"),
        api.get("/parking-floors"),
        api.get("/parking-slots"),
        api.get("/parking-tickets"),
        api.get("/parking-tickets/status/ACTIVE"),
      ]);

      setVehicles(vehiclesRes.data || []);
      setFloors(floorsRes.data || []);
      setSlots(slotsRes.data || []);
      setTickets(ticketsRes.data || []);
      setActiveTickets(activeTicketsRes.data || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Telemetry Calculations
  const totalSlots = slots.length;
  const availableSlots = slots.filter((s) => s.status === "AVAILABLE").length;
  const occupiedSlots = slots.filter((s) => s.status === "OCCUPIED").length;
  const reservedSlots = slots.filter((s) => s.status === "RESERVED").length;

  const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
  const availableRate = totalSlots > 0 ? Math.round((availableSlots / totalSlots) * 100) : 0;
  const reservedRate = totalSlots > 0 ? Math.round((reservedSlots / totalSlots) * 100) : 0;

  // Handle Vehicle Exit
  const handleConfirmExit = async () => {
    if (!selectedTicketToExit) return;

    try {
      setExiting(true);
      const response = await api.post(`/parking-tickets/exit/${selectedTicketToExit.id}`);
      toast.success(
        `Vehicle exited successfully! Fee: ₹${response.data?.amount ?? 0}`
      );
      setSelectedTicketToExit(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Exit failed:", error);
      toast.error("Failed to process vehicle exit.");
    } finally {
      setExiting(false);
    }
  };

  return (
    <AppLayout
      title="Facility Overview"
      subtitle="Real-time telemetry and management controls"
    >
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero-banner">
        <div className="hero-banner-text">
          <h2>ParkFlow Command Center 🚗</h2>
          <p>
            Monitor real-time occupancy rates, manage multi-floor capacities,
            and automate entry/exit billing workflows.
          </p>
        </div>
        <div className="banner-quick-stats">
          <div className="banner-stat-box">
            <div className="stat-val">{occupancyRate}%</div>
            <div className="stat-lbl">Occupancy</div>
          </div>
          <div className="banner-stat-box">
            <div className="stat-val">{availableSlots}</div>
            <div className="stat-lbl">Free Spots</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card" onClick={() => navigate("/vehicles")}>
          <div className="kpi-info-group">
            <span className="kpi-label">Registered Vehicles</span>
            <div className="kpi-value">{loading ? "..." : vehicles.length}</div>
            <span className="kpi-subtext">Active in fleet directory</span>
          </div>
          <div className="kpi-icon-box vehicles">
            <Car size={26} />
          </div>
        </div>

        <div className="glass-card kpi-card" onClick={() => navigate("/parking-floors")}>
          <div className="kpi-info-group">
            <span className="kpi-label">Parking Floors</span>
            <div className="kpi-value">{loading ? "..." : floors.length}</div>
            <span className="kpi-subtext">Active parking levels</span>
          </div>
          <div className="kpi-icon-box floors">
            <Layers size={26} />
          </div>
        </div>

        <div className="glass-card kpi-card" onClick={() => navigate("/parking-slots")}>
          <div className="kpi-info-group">
            <span className="kpi-label">Total Parking Slots</span>
            <div className="kpi-value">{loading ? "..." : totalSlots}</div>
            <span className="kpi-subtext">{availableSlots} available right now</span>
          </div>
          <div className="kpi-icon-box slots">
            <ParkingSquare size={26} />
          </div>
        </div>

        <div className="glass-card kpi-card" onClick={() => navigate("/parking-tickets")}>
          <div className="kpi-info-group">
            <span className="kpi-label">Active Tickets</span>
            <div className="kpi-value">{loading ? "..." : activeTickets.length}</div>
            <span className="kpi-subtext">Vehicles parked currently</span>
          </div>
          <div className="kpi-icon-box tickets">
            <Ticket size={26} />
          </div>
        </div>
      </div>

      {/* 2-Column Section: Live Telemetry + Quick Actions */}
      <div className="dashboard-grid-2col">
        {/* Occupancy Telemetry */}
        <div className="glass-card occupancy-telemetry-card">
          <div className="section-header-compact">
            <h3>Facility Occupancy Telemetry</h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="occupancy-gauge-box">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Utilization Meter
              </span>
              <strong style={{ color: "#F8FAFC", fontSize: "0.9rem" }}>
                {occupiedSlots} / {totalSlots} Slots Taken
              </strong>
            </div>

            <div className="occupancy-gauge-bar-wrapper">
              <div
                className="gauge-segment occupied"
                style={{ width: `${occupancyRate}%` }}
                title={`Occupied: ${occupiedSlots}`}
              />
              <div
                className="gauge-segment reserved"
                style={{ width: `${reservedRate}%` }}
                title={`Reserved: ${reservedSlots}`}
              />
              <div
                className="gauge-segment available"
                style={{ width: `${availableRate}%` }}
                title={`Available: ${availableSlots}`}
              />
            </div>

            <div className="occupancy-legend">
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: "var(--color-occupied)" }} />
                <span>Occupied ({occupiedSlots})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: "var(--color-reserved)" }} />
                <span>Reserved ({reservedSlots})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: "var(--color-available)" }} />
                <span>Available ({availableSlots})</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "18px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Detailed metrics & revenue reporting:
            </span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: "#38BDF8" }}
              onClick={() => navigate("/analytics")}
            >
              <span>View Analytics</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card quick-actions-card">
          <div className="section-header-compact">
            <h3>Quick Control Actions</h3>
          </div>

          <div className="quick-action-btns-grid">
            <div
              className="action-card-btn"
              onClick={() => navigate("/vehicles")}
            >
              <div className="action-icon">
                <Car size={20} />
              </div>
              <div className="action-text">
                <strong>Register Vehicle</strong>
                <span>Add plate & owner</span>
              </div>
            </div>

            <div
              className="action-card-btn"
              onClick={() => navigate("/parking-tickets")}
            >
              <div className="action-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24" }}>
                <Ticket size={20} />
              </div>
              <div className="action-text">
                <strong>New Parking Entry</strong>
                <span>Generate ticket</span>
              </div>
            </div>

            <div
              className="action-card-btn"
              onClick={() => navigate("/parking-slots")}
            >
              <div className="action-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34D399" }}>
                <ParkingSquare size={20} />
              </div>
              <div className="action-text">
                <strong>Manage Slots</strong>
                <span>Adjust status</span>
              </div>
            </div>

            <div
              className="action-card-btn"
              onClick={() => navigate("/parking-floors")}
            >
              <div className="action-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#C084FC" }}>
                <Layers size={20} />
              </div>
              <div className="action-text">
                <strong>Add Floor</strong>
                <span>Scale capacity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Vehicles Table */}
      <div className="glass-card recent-activity-card">
        <div className="section-header-compact">
          <div>
            <h3>Currently Parked Vehicles</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Active tickets with live duration tracking
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/parking-tickets")}
          >
            <span>View All Tickets</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {activeTickets.length === 0 ? (
          <div className="empty-state-box">
            <CheckCircle2 className="empty-state-icon" style={{ color: "#34D399" }} />
            <h4>No vehicles currently parked</h4>
            <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
              All slots are currently free or pending new check-ins.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Plate / Vehicle</th>
                  <th>Assigned Slot</th>
                  <th>Floor</th>
                  <th>Entry Timestamp</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeTickets.slice(0, 6).map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <span className="font-mono" style={{ color: "#818CF8", fontWeight: "700" }}>
                        #{ticket.id}
                      </span>
                    </td>
                    <td>
                      <span className="plate-pill">
                        {ticket.vehicle?.vehicleNumber || `Vehicle #${ticket.vehicle?.id || "N/A"}`}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "var(--text-main)" }}>
                        {ticket.parkingSlot?.slotNumber || `Slot #${ticket.parkingSlot?.id || "N/A"}`}
                      </strong>
                    </td>
                    <td>
                      Floor {ticket.parkingSlot?.floor?.floorNumber || "1"}
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {ticket.entryTime ? new Date(ticket.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                    </td>
                    <td>
                      <span className="badge badge-occupied">
                        ACTIVE
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setSelectedTicketToExit(ticket)}
                      >
                        <LogOut size={13} />
                        <span>Exit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Exit Modal */}
      <ConfirmModal
        isOpen={!!selectedTicketToExit}
        title="Check-Out Vehicle"
        message={`Are you sure you want to check-out vehicle ${selectedTicketToExit?.vehicle?.vehicleNumber || ""} from Slot ${selectedTicketToExit?.parkingSlot?.slotNumber || ""}? This will complete the session and calculate the bill.`}
        confirmText="Confirm Exit & Bill"
        type="danger"
        loading={exiting}
        onConfirm={handleConfirmExit}
        onCancel={() => setSelectedTicketToExit(null)}
      />
    </AppLayout>
  );
}

export default Dashboard;