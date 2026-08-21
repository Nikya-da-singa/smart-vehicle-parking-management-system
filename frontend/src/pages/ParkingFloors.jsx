import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Plus,
  Trash2,
  ParkingSquare,
  RefreshCw,
  X,
  CheckCircle2,
  Building,
  ArrowRight
} from "lucide-react";
import "../styles/ParkingFloors.css";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

function ParkingFloors() {
  const navigate = useNavigate();
  const toast = useToast();

  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Floor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [floorNumber, setFloorNumber] = useState("");
  const [totalSlots, setTotalSlots] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Floor
  const [floorToDelete, setFloorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/parking-floors");
      setFloors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch floors:", error);
      toast.error("Failed to fetch parking floors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  // Open Add Modal with smart default
  const handleOpenAdd = () => {
    const nextFloorNumber = floors.length > 0 ? Math.max(...floors.map((f) => Number(f.floorNumber) || 0)) + 1 : 1;
    setFloorNumber(String(nextFloorNumber));
    setTotalSlots("20");
    setShowAddModal(true);
  };

  // Add Floor Submit
  const handleAddFloor = async (e) => {
    e.preventDefault();
    if (!floorNumber || !totalSlots) {
      toast.warning("Please fill in all floor properties.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/parking-floors", {
        floorNumber: Number(floorNumber),
        totalSlots: Number(totalSlots),
      });

      toast.success(`Parking Floor ${floorNumber} created successfully!`);
      setShowAddModal(false);
      fetchFloors();
    } catch (error) {
      console.error("Failed to add floor:", error);
      toast.error(error.response?.data?.message || "Failed to add parking floor.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete Floor
  const handleConfirmDelete = async () => {
    if (!floorToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/parking-floors/${floorToDelete.id}`);
      toast.success(`Floor ${floorToDelete.floorNumber} deleted successfully!`);
      setFloorToDelete(null);
      fetchFloors();
    } catch (error) {
      console.error("Delete floor error:", error);
      toast.error(error.response?.data?.message || "Failed to delete parking floor.");
    } finally {
      setDeleting(false);
    }
  };

  const totalCapacity = floors.reduce((acc, f) => acc + (Number(f.totalSlots) || 0), 0);

  return (
    <AppLayout
      title="Parking Floors"
      subtitle="Configure facility levels and allocate maximum slot limits"
    >
      {/* Top Banner Toolbar */}
      <div className="floors-header-banner">
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div className="glass-card" style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Building size={20} style={{ color: "#A855F7" }} />
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Floors</div>
              <strong style={{ fontSize: "1.2rem", color: "#F8FAFC" }}>{floors.length}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <ParkingSquare size={20} style={{ color: "#38BDF8" }} />
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Planned Capacity</div>
              <strong style={{ fontSize: "1.2rem", color: "#F8FAFC" }}>{totalCapacity} Slots</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={fetchFloors} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add Parking Floor</span>
          </button>
        </div>
      </div>

      {/* Floors Grid */}
      {loading ? (
        <div className="empty-state-box">
          <RefreshCw className="empty-state-icon animate-spin" />
          <p>Loading floor layouts...</p>
        </div>
      ) : floors.length === 0 ? (
        <div className="glass-card empty-state-box">
          <Layers className="empty-state-icon" />
          <h3>No parking floors defined</h3>
          <p>Create your first floor level to begin managing parking spots.</p>
          <button className="btn btn-primary" style={{ marginTop: "16px" }} onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Level 1</span>
          </button>
        </div>
      ) : (
        <div className="floors-grid">
          {floors.map((floor) => (
            <div key={floor.id} className="glass-card floor-card">
              <div>
                <div className="floor-card-top">
                  <div className="brand-icon-box" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", width: "44px", height: "44px" }}>
                    <Layers size={22} />
                  </div>
                  <span className="floor-badge-id">ID: #{floor.id}</span>
                </div>

                <div className="floor-level-title">
                  <span>Level</span>
                  <strong>Floor {floor.floorNumber}</strong>
                </div>

                <div className="floor-capacity-box">
                  <span className="cap-label">Capacity Limit:</span>
                  <span className="cap-val">{floor.totalSlots} Slots</span>
                </div>
              </div>

              <div className="floor-card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => navigate("/parking-slots")}
                >
                  <ParkingSquare size={14} />
                  <span>Manage Slots</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setFloorToDelete(floor)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Floor Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" style={{ padding: "28px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Layers size={20} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-main)" }}>
                  Add Parking Floor
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFloor}>
              <div className="form-group">
                <label className="form-label">Floor Number (e.g. 1, 2, 3) *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g. 1"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Allocated Slot Capacity *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g. 50"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(e.target.value)}
                  required
                />
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
                  {submitting ? "Creating Floor..." : "Add Parking Floor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!floorToDelete}
        title="Delete Floor Level"
        message={`Are you sure you want to delete Floor ${floorToDelete?.floorNumber}? Any slots registered under this floor may also be impacted.`}
        confirmText="Delete Floor"
        type="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setFloorToDelete(null)}
      />
    </AppLayout>
  );
}

export default ParkingFloors;