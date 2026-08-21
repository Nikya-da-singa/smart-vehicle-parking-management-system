import { useEffect, useState, useMemo } from "react";
import {
  Ticket,
  Car,
  ParkingSquare,
  Clock,
  DollarSign,
  Plus,
  RefreshCw,
  Search,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import "../styles/ParkingTickets.css";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

function ParkingTickets() {
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [tabFilter, setTabFilter] = useState("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Ticket Form
  const [vehicleId, setVehicleId] = useState("");
  const [parkingSlotId, setParkingSlotId] = useState("");
  const [creating, setCreating] = useState(false);

  // Exit Modal
  const [ticketToExit, setTicketToExit] = useState(null);
  const [exiting, setExiting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, vehiclesRes, slotsRes] = await Promise.all([
        api.get("/parking-tickets"),
        api.get("/vehicles"),
        api.get("/parking-slots"),
      ]);

      setTickets(ticketsRes.data || []);
      setVehicles(vehiclesRes.data || []);
      setSlots(slotsRes.data || []);
    } catch (error) {
      console.error("Failed to load ticket data:", error);
      toast.error("Failed to load parking tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Available slots for new entry
  const availableSlots = useMemo(() => {
    return slots.filter((slot) => slot.status === "AVAILABLE");
  }, [slots]);

  // Handle Create Entry Ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!vehicleId || !parkingSlotId) {
      toast.warning("Please select both a vehicle and an available slot.");
      return;
    }

    try {
      setCreating(true);
      await api.post(
        `/parking-tickets/entry?vehicleId=${vehicleId}&parkingSlotId=${parkingSlotId}`
      );

      toast.success("Parking ticket created successfully!");
      setVehicleId("");
      setParkingSlotId("");
      loadData();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(error.response?.data?.message || "Failed to generate parking ticket.");
    } finally {
      setCreating(false);
    }
  };

  // Handle Exit Confirmation
  const handleConfirmExit = async () => {
    if (!ticketToExit) return;

    try {
      setExiting(true);
      const response = await api.post(`/parking-tickets/exit/${ticketToExit.id}`);
      const fee = response.data?.amount ?? 0;
      toast.success(`Vehicle checked out successfully! Total Fee: ₹${fee}`);
      setTicketToExit(null);
      loadData();
    } catch (error) {
      console.error("Error exiting vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to process vehicle exit.");
    } finally {
      setExiting(false);
    }
  };

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesTab =
        tabFilter === "ALL" || (ticket.status && ticket.status.toUpperCase() === tabFilter);

      const plate = ticket.vehicle?.vehicleNumber?.toLowerCase() || "";
      const id = String(ticket.id);
      const slotNum = ticket.parkingSlot?.slotNumber?.toLowerCase() || "";
      const matchesSearch =
        plate.includes(searchQuery.toLowerCase()) ||
        id.includes(searchQuery) ||
        slotNum.includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tickets, tabFilter, searchQuery]);

  return (
    <AppLayout
      title="Parking Tickets"
      subtitle="Automated check-in entries, duration timers, and exit billing"
    >
      {/* Create Entry Card */}
      <div className="glass-card ticket-entry-card">
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} style={{ color: "var(--primary)" }} />
          <span>New Vehicle Entry (Check-In)</span>
        </h3>

        <form onSubmit={handleCreateTicket} className="ticket-entry-form-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Vehicle</label>
            <select
              className="form-select"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
            >
              <option value="">-- Choose Registered Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.ownerName || "No Owner"}) — {v.vehicleType || "Car"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Available Spot</label>
            <select
              className="form-select"
              value={parkingSlotId}
              onChange={(e) => setParkingSlotId(e.target.value)}
              required
            >
              <option value="">-- Choose Free Slot ({availableSlots.length} available) --</option>
              {availableSlots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.slotNumber} (Floor {s.floor?.floorNumber || "1"})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={creating || availableSlots.length === 0}
            style={{ height: "42px" }}
          >
            <Plus size={16} />
            <span>{creating ? "Generating..." : "Generate Ticket"}</span>
          </button>
        </form>
      </div>

      {/* Tickets Toolbar */}
      <div className="tickets-top-actions">
        <div className="search-input-wrapper">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input has-left-icon"
            placeholder="Search by ticket #, plate, or slot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["ACTIVE", "COMPLETED", "ALL"].map((tab) => (
              <button
                key={tab}
                className={`filter-pill-btn ${tabFilter === tab ? "active" : ""}`}
                onClick={() => setTabFilter(tab)}
              >
                {tab === "ACTIVE" ? "🟢 Active" : tab === "COMPLETED" ? "✅ History" : "All"}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="empty-state-box">
          <RefreshCw className="empty-state-icon animate-spin" />
          <p>Loading parking tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="glass-card empty-state-box">
          <Ticket className="empty-state-icon" />
          <h3>No parking tickets found</h3>
          <p>
            {tickets.length === 0
              ? "Create your first vehicle parking entry above."
              : "No tickets matching your filter criteria."}
          </p>
        </div>
      ) : (
        <div className="tickets-grid-list">
          {filteredTickets.map((ticket) => {
            const isActive = ticket.status === "ACTIVE";
            return (
              <div key={ticket.id} className="digital-ticket-card">
                <div>
                  <div className="ticket-header-row">
                    <span className="ticket-id-tag">TICKET #{ticket.id}</span>
                    <span className={`badge ${isActive ? "badge-occupied" : "badge-available"}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="ticket-body-details">
                    <div className="ticket-detail-item">
                      <span className="lbl">
                        <Car size={14} /> License Plate
                      </span>
                      <span className="plate-pill">
                        {ticket.vehicle?.vehicleNumber || "N/A"}
                      </span>
                    </div>

                    <div className="ticket-detail-item">
                      <span className="lbl">
                        <ParkingSquare size={14} /> Allocated Spot
                      </span>
                      <strong className="val font-mono" style={{ color: "#38BDF8" }}>
                        {ticket.parkingSlot?.slotNumber || "N/A"} (Floor {ticket.parkingSlot?.floor?.floorNumber || "1"})
                      </strong>
                    </div>

                    <div className="ticket-detail-item">
                      <span className="lbl">
                        <Clock size={14} /> Entry Time
                      </span>
                      <span className="val" style={{ fontSize: "0.8rem" }}>
                        {ticket.entryTime ? new Date(ticket.entryTime).toLocaleString() : "N/A"}
                      </span>
                    </div>

                    <div className="ticket-detail-item">
                      <span className="lbl">
                        <Clock size={14} /> Exit Time
                      </span>
                      <span className="val" style={{ fontSize: "0.8rem", color: isActive ? "#FBBF24" : "var(--text-secondary)" }}>
                        {ticket.exitTime ? new Date(ticket.exitTime).toLocaleString() : "Currently Parked"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ticket-footer-actions">
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Fee Billed</span>
                    <span className="ticket-amount-pill">
                      ₹{ticket.amount ?? 0}
                    </span>
                  </div>

                  {isActive && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setTicketToExit(ticket)}
                    >
                      <LogOut size={14} />
                      <span>Check-Out</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exit Confirmation Modal */}
      <ConfirmModal
        isOpen={!!ticketToExit}
        title="Check-Out & Calculate Fee"
        message={`Are you sure you want to check-out vehicle ${ticketToExit?.vehicle?.vehicleNumber || ""} from Slot ${ticketToExit?.parkingSlot?.slotNumber || ""}? This will stop the parking timer and generate the total fee.`}
        confirmText="Confirm Exit"
        type="danger"
        loading={exiting}
        onConfirm={handleConfirmExit}
        onCancel={() => setTicketToExit(null)}
      />
    </AppLayout>
  );
}

export default ParkingTickets;