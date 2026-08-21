import { useEffect, useState, useMemo } from "react";
import {
  ParkingSquare,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from "lucide-react";
import "../styles/ParkingSlots.css";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

function ParkingSlots() {
  const toast = useToast();

  const [floors, setFloors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [loadingFloors, setLoadingFloors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add Slot Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [slotNumber, setSlotNumber] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [submitting, setSubmitting] = useState(false);

  // Delete Slot
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Floors
  const fetchFloors = async () => {
    try {
      setLoadingFloors(true);
      const response = await api.get("/parking-floors");
      const floorData = response.data || [];
      setFloors(floorData);

      if (floorData.length > 0 && !selectedFloor) {
        setSelectedFloor(floorData[0].id);
      }
    } catch (error) {
      console.error("Failed to load floors:", error);
      toast.error("Failed to load parking floors.");
    } finally {
      setLoadingFloors(false);
    }
  };

  // Fetch Slots for Floor
  const fetchSlots = async (floorId) => {
    if (!floorId) {
      setSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      const response = await api.get(`/parking-slots/floor/${floorId}`);
      setSlots(response.data || []);
    } catch (error) {
      console.error("Failed to load slots:", error);
      toast.error("Failed to load parking slots for this floor.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  useEffect(() => {
    if (selectedFloor) {
      fetchSlots(selectedFloor);
    }
  }, [selectedFloor]);

  // Open Add Slot Modal
  const handleOpenAdd = () => {
    const currentFloor = floors.find((f) => String(f.id) === String(selectedFloor));
    const floorNum = currentFloor ? currentFloor.floorNumber : "1";
    const nextSlotNum = `F${floorNum}-S${String(slots.length + 1).padStart(2, "0")}`;
    setSlotNumber(nextSlotNum);
    setStatus("AVAILABLE");
    setShowAddModal(true);
  };

  // Add Slot Submit
  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!selectedFloor || !slotNumber.trim()) {
      toast.warning("Please specify floor and slot code.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/parking-slots/floor/${selectedFloor}`, {
        slotNumber: slotNumber.trim().toUpperCase(),
        status: status,
      });

      toast.success(`Slot ${slotNumber} created successfully!`);
      setShowAddModal(false);
      fetchSlots(selectedFloor);
    } catch (error) {
      console.error("Add slot error:", error);
      toast.error(error.response?.data?.message || "Failed to create parking slot.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Quick Status Change
  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await api.put(`/parking-slots/${slotId}/status`, null, {
        params: { status: newStatus },
      });
      toast.success(`Slot status updated to ${newStatus}`);
      fetchSlots(selectedFloor);
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update slot status.");
    }
  };

  // Confirm Delete Slot
  const handleConfirmDelete = async () => {
    if (!slotToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/parking-slots/${slotToDelete.id}`);
      toast.success(`Slot ${slotToDelete.slotNumber} deleted successfully!`);
      setSlotToDelete(null);
      fetchSlots(selectedFloor);
    } catch (error) {
      console.error("Delete slot error:", error);
      toast.error(error.response?.data?.message || "Failed to delete slot.");
    } finally {
      setDeleting(false);
    }
  };

  // Calculations for active floor
  const floorStats = useMemo(() => {
    const total = slots.length;
    const available = slots.filter((s) => s.status === "AVAILABLE").length;
    const occupied = slots.filter((s) => s.status === "OCCUPIED").length;
    const reserved = slots.filter((s) => s.status === "RESERVED").length;
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, available, occupied, reserved, rate };
  }, [slots]);

  // Filtered Slots
  const filteredSlots = useMemo(() => {
    if (statusFilter === "ALL") return slots;
    return slots.filter((s) => s.status === statusFilter);
  }, [slots, statusFilter]);

  const currentFloorObj = floors.find((f) => String(f.id) === String(selectedFloor));

  return (
    <AppLayout
      title="Parking Slots"
      subtitle="Interactive spot grid telemetry and allocation"
    >
      {/* Top Bar: Floor selector & Actions */}
      <div className="slots-top-bar">
        <div className="floor-tabs-scroller">
          {floors.map((floor) => (
            <button
              key={floor.id}
              className={`floor-tab-btn ${String(selectedFloor) === String(floor.id) ? "active" : ""}`}
              onClick={() => setSelectedFloor(floor.id)}
            >
              <Layers size={16} />
              <span>Floor {floor.floorNumber}</span>
            </button>
          ))}
          {floors.length === 0 && !loadingFloors && (
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No floors created yet.
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => selectedFloor && fetchSlots(selectedFloor)}
            disabled={loadingSlots || !selectedFloor}
          >
            <RefreshCw size={16} className={loadingSlots ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={!selectedFloor}
          >
            <Plus size={18} />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Floor Telemetry Banner */}
      {selectedFloor && (
        <div className="glass-card floor-stats-banner">
          <div className="floor-stat-item">
            <div className="stat-icon-circle" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818CF8" }}>
              <ParkingSquare size={20} />
            </div>
            <div className="stat-meta">
              <span>Total Spots</span>
              <strong>{floorStats.total}</strong>
            </div>
          </div>

          <div className="floor-stat-item">
            <div className="stat-icon-circle" style={{ background: "var(--bg-available)", color: "var(--color-available)" }}>
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-meta">
              <span>Available</span>
              <strong style={{ color: "var(--color-available)" }}>{floorStats.available}</strong>
            </div>
          </div>

          <div className="floor-stat-item">
            <div className="stat-icon-circle" style={{ background: "var(--bg-occupied)", color: "var(--color-occupied)" }}>
              <Clock size={20} />
            </div>
            <div className="stat-meta">
              <span>Occupied</span>
              <strong style={{ color: "var(--color-occupied)" }}>{floorStats.occupied}</strong>
            </div>
          </div>

          <div className="floor-stat-item">
            <div className="stat-icon-circle" style={{ background: "var(--bg-reserved)", color: "var(--color-reserved)" }}>
              <AlertTriangle size={20} />
            </div>
            <div className="stat-meta">
              <span>Reserved</span>
              <strong style={{ color: "var(--color-reserved)" }}>{floorStats.reserved}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["ALL", "AVAILABLE", "OCCUPIED", "RESERVED"].map((st) => (
          <button
            key={st}
            className={`filter-pill-btn ${statusFilter === st ? "active" : ""}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Slots Grid */}
      {loadingSlots ? (
        <div className="empty-state-box">
          <RefreshCw className="empty-state-icon animate-spin" />
          <p>Loading slots for Floor {currentFloorObj?.floorNumber || ""}...</p>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="glass-card empty-state-box">
          <ParkingSquare className="empty-state-icon" />
          <h3>No parking slots found</h3>
          <p>
            {slots.length === 0
              ? "No slots created on this floor yet."
              : "No slots matching the selected filter."}
          </p>
          {slots.length === 0 && (
            <button className="btn btn-primary" style={{ marginTop: "16px" }} onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Create First Slot</span>
            </button>
          )}
        </div>
      ) : (
        <div className="slots-interactive-grid">
          {filteredSlots.map((slot) => {
            const statusClass = slot.status ? slot.status.toLowerCase() : "available";
            return (
              <div key={slot.id} className={`slot-visual-card ${statusClass}`}>
                <div>
                  <div className="slot-card-header">
                    <span className="slot-number-code">{slot.slotNumber}</span>
                    <span className={`badge badge-${statusClass}`}>
                      {slot.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Floor Level: {currentFloorObj?.floorNumber || "1"}
                  </div>
                </div>

                <div className="slot-controls-row">
                  <select
                    className="slot-select-status"
                    value={slot.status}
                    onChange={(e) => handleStatusChange(slot.id, e.target.value)}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: "6px 8px" }}
                    onClick={() => setSlotToDelete(slot)}
                    title="Delete Slot"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" style={{ padding: "28px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ParkingSquare size={20} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-main)" }}>
                  Add Parking Slot
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label className="form-label">Floor Assignment</label>
                <select
                  className="form-select"
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                >
                  {floors.map((floor) => (
                    <option key={floor.id} value={floor.id}>
                      Floor {floor.floorNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Slot Identifier / Number *</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. A-101, F1-04"
                  value={slotNumber}
                  onChange={(e) => setSlotNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="AVAILABLE">AVAILABLE (Free for parking)</option>
                  <option value="OCCUPIED">OCCUPIED (Vehicle parked)</option>
                  <option value="RESERVED">RESERVED (Hold for VIP/Staff)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Allocating..." : "Create Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!slotToDelete}
        title="Delete Parking Slot"
        message={`Are you sure you want to delete Slot ${slotToDelete?.slotNumber}?`}
        confirmText="Delete Slot"
        type="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSlotToDelete(null)}
      />
    </AppLayout>
  );
}

export default ParkingSlots;