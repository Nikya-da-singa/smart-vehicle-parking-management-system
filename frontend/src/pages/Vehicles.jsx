import { useEffect, useMemo, useState } from "react";
import {
  Car,
  Search,
  Plus,
  Edit2,
  Trash2,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Sparkles,
  Bike,
  Truck
} from "lucide-react";
import "../styles/Vehicles.css";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

function Vehicles() {
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    ownerName: "",
    vehicleNumber: "",
    vehicleType: "Car",
    status: "Exited",
    entryTime: "",
    exitTime: "",
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vehicles");
      setVehicles(response.data || []);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      toast.error("Failed to load vehicle directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filtered list
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.ownerName && v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        typeFilter === "ALL" ||
        (v.vehicleType && v.vehicleType.toUpperCase() === typeFilter.toUpperCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (v.status && v.status.toUpperCase() === statusFilter.toUpperCase());

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, searchQuery, typeFilter, statusFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setFormData({
      ownerName: "",
      vehicleNumber: "",
      vehicleType: "Car",
      status: "Exited",
      entryTime: "",
      exitTime: "",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      ownerName: vehicle.ownerName || "",
      vehicleNumber: vehicle.vehicleNumber || "",
      vehicleType: vehicle.vehicleType || "Car",
      status: vehicle.status || "Exited",
      entryTime: vehicle.entryTime || "",
      exitTime: vehicle.exitTime || "",
    });
    setShowModal(true);
  };

  // Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNumber.trim() || !formData.ownerName.trim()) {
      toast.warning("Please provide both license plate and owner name.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, formData);
        toast.success("Vehicle updated successfully!");
      } else {
        await api.post("/vehicles", formData);
        toast.success("Vehicle registered successfully!");
      }
      setShowModal(false);
      fetchVehicles();
    } catch (error) {
      console.error("Save vehicle failed:", error);
      toast.error(error.response?.data?.message || "Failed to save vehicle details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/vehicles/${vehicleToDelete.id}`);
      toast.success("Vehicle deleted successfully!");
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (error) {
      console.error("Delete vehicle error:", error);
      toast.error(error.response?.data?.message || "Failed to delete vehicle.");
    } finally {
      setDeleting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "bike":
      case "motorcycle":
        return <Bike size={14} />;
      case "truck":
        return <Truck size={14} />;
      default:
        return <Car size={14} />;
    }
  };

  return (
    <AppLayout
      title="Vehicle Registry"
      subtitle="Fleet management and license plate registry"
    >
      {/* Top Toolbar */}
      <div className="vehicles-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input has-left-icon"
            placeholder="Search license plate or owner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={fetchVehicles} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Register Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div className="filter-pills-row">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Type:</span>
          {["ALL", "Car", "Bike", "Truck", "EV"].map((t) => (
            <button
              key={t}
              className={`filter-pill-btn ${typeFilter === t ? "active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="filter-pills-row">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Status:</span>
          {["ALL", "Parked", "Exited"].map((s) => (
            <button
              key={s}
              className={`filter-pill-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="empty-state-box">
          <RefreshCw className="empty-state-icon animate-spin" />
          <p>Loading vehicle directory...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="glass-card empty-state-box">
          <Car className="empty-state-icon" />
          <h3>No vehicles found</h3>
          <p>Try clearing your filters or register a new vehicle.</p>
          <button className="btn btn-primary" style={{ marginTop: "16px" }} onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        </div>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.map((vehicle) => {
            const isParked = vehicle.status?.toLowerCase() === "parked";
            return (
              <div key={vehicle.id} className="glass-card vehicle-card">
                <div>
                  <div className="vehicle-card-top">
                    <span className="plate-pill">{vehicle.vehicleNumber}</span>
                    <span className={`badge ${isParked ? "badge-occupied" : "badge-available"}`}>
                      {vehicle.status || "EXITED"}
                    </span>
                  </div>

                  <div className="vehicle-card-meta">
                    <div className="meta-row">
                      <span className="label">
                        <User size={14} /> Owner
                      </span>
                      <span className="val">{vehicle.ownerName || "Unknown"}</span>
                    </div>

                    <div className="meta-row">
                      <span className="label">
                        {getTypeIcon(vehicle.vehicleType)} Type
                      </span>
                      <span className="vehicle-type-tag">
                        {vehicle.vehicleType || "Car"}
                      </span>
                    </div>

                    {vehicle.entryTime && (
                      <div className="meta-row">
                        <span className="label">
                          <Clock size={14} /> Registered Entry
                        </span>
                        <span className="val" style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          {new Date(vehicle.entryTime).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="vehicle-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(vehicle)}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setVehicleToDelete(vehicle)}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" style={{ padding: "28px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Car size={20} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-main)" }}>
                  {editingVehicle ? "Edit Vehicle" : "Register New Vehicle"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">License Plate Number *</label>
                <input
                  type="text"
                  className="form-input plate-number"
                  placeholder="e.g. MH12AB1234 or DL01XY9999"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select
                    className="form-select"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike / Motorcycle</option>
                    <option value="Truck">Truck / SUV</option>
                    <option value="EV">Electric Vehicle (EV)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Exited">Exited</option>
                    <option value="Parked">Parked</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingVehicle ? "Update Vehicle" : "Register Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!vehicleToDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to remove vehicle ${vehicleToDelete?.vehicleNumber || ""} owned by ${vehicleToDelete?.ownerName || ""}? This action cannot be undone.`}
        confirmText="Delete Vehicle"
        type="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setVehicleToDelete(null)}
      />
    </AppLayout>
  );
}

export default Vehicles;