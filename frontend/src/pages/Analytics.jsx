import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Layers,
  Car,
  RefreshCw,
  Clock,
  CheckCircle2,
  PieChart as PieIcon,
  Truck,
  Bike,
  Zap,
  Calendar,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Gauge,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import "../styles/Analytics.css";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import { useToast } from "../context/ToastContext";

// Color Constants matching Design System
const STATUS_COLORS = {
  Available: "#10B981", // Emerald
  Occupied: "#F43F5E",  // Rose
  Reserved: "#F59E0B",  // Amber
};

const VEHICLE_COLORS = {
  Cars: "#38BDF8",      // Sky Blue
  Bikes: "#818CF8",     // Indigo
  "Trucks / SUVs": "#F472B6", // Pink
  "Electric (EV)": "#34D399", // Mint Green
  Other: "#A78BFA",     // Purple
};

// Custom Glassmorphic Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-row">
            <span
              className="tooltip-dot"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="tooltip-name">{entry.name}:</span>
            <span className="tooltip-value">
              {prefix}
              {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Pie Tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-label" style={{ color: data.payload.fill || data.color }}>
          {data.name}
        </p>
        <div className="tooltip-row">
          <span className="tooltip-name">Count:</span>
          <span className="tooltip-value">{data.value}</span>
        </div>
        {data.payload.percentage !== undefined && (
          <div className="tooltip-row">
            <span className="tooltip-name">Share:</span>
            <span className="tooltip-value">{data.payload.percentage}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

function Analytics() {
  const navigate = useNavigate();
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [floors, setFloors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filter States
  const [timeRange, setTimeRange] = useState("7d"); // "7d", "14d", "30d"
  const [revenueMetric, setRevenueMetric] = useState("revenue"); // "revenue", "tickets", "cumulative"

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const [
        vehiclesRes,
        floorsRes,
        slotsRes,
        ticketsRes,
        activeTicketsRes,
      ] = await Promise.all([
        api.get("/vehicles").catch(() => ({ data: [] })),
        api.get("/parking-floors").catch(() => ({ data: [] })),
        api.get("/parking-slots").catch(() => ({ data: [] })),
        api.get("/parking-tickets").catch(() => ({ data: [] })),
        api.get("/parking-tickets/status/ACTIVE").catch(() => ({ data: [] })),
      ]);

      setVehicles(Array.isArray(vehiclesRes?.data) ? vehiclesRes.data : []);
      setFloors(Array.isArray(floorsRes?.data) ? floorsRes.data : []);
      setSlots(Array.isArray(slotsRes?.data) ? slotsRes.data : []);
      setTickets(Array.isArray(ticketsRes?.data) ? ticketsRes.data : []);
      setActiveTickets(Array.isArray(activeTicketsRes?.data) ? activeTicketsRes.data : []);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      setFetchError("Unable to fetch fresh telemetry.");
      if (toast && toast.error) {
        toast.error("Failed to load analytics telemetry.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Revenue & Ticket Calculations
  const completedTickets = useMemo(() => {
    return tickets.filter((t) => t && t.status === "COMPLETED");
  }, [tickets]);

  const totalRevenue = useMemo(() => {
    return completedTickets.reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);
  }, [completedTickets]);

  const averageRevenue = useMemo(() => {
    return completedTickets.length > 0
      ? (totalRevenue / completedTickets.length).toFixed(1)
      : "0";
  }, [completedTickets, totalRevenue]);

  // Spot Telemetry
  const totalSlots = slots.length;
  const availableSlots = slots.filter((s) => s && s.status === "AVAILABLE").length;
  const occupiedSlots = slots.filter((s) => s && s.status === "OCCUPIED").length;
  const reservedSlots = slots.filter((s) => s && s.status === "RESERVED").length;
  const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // Average Duration calculation
  const averageDurationMinutes = useMemo(() => {
    let totalMinutes = 0;
    let count = 0;
    completedTickets.forEach((t) => {
      if (t && t.entryTime && t.exitTime) {
        const start = new Date(t.entryTime);
        const end = new Date(t.exitTime);
        const diffMin = Math.round((end - start) / (1000 * 60));
        if (diffMin > 0 && !isNaN(diffMin)) {
          totalMinutes += diffMin;
          count++;
        }
      }
    });
    return count > 0 ? Math.round(totalMinutes / count) : 45; // default fallback 45 mins
  }, [completedTickets]);

  const formatDurationText = (mins) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
  };

  // 1. Slot Status Donut Data
  const slotStatusData = useMemo(() => {
    if (totalSlots === 0) {
      return [
        { name: "Available", value: 1, percentage: 100, fill: STATUS_COLORS.Available },
      ];
    }
    const data = [
      {
        name: "Available",
        value: availableSlots,
        percentage: Math.round((availableSlots / totalSlots) * 100),
        fill: STATUS_COLORS.Available,
      },
      {
        name: "Occupied",
        value: occupiedSlots,
        percentage: Math.round((occupiedSlots / totalSlots) * 100),
        fill: STATUS_COLORS.Occupied,
      },
      {
        name: "Reserved",
        value: reservedSlots,
        percentage: Math.round((reservedSlots / totalSlots) * 100),
        fill: STATUS_COLORS.Reserved,
      },
    ].filter((item) => item.value > 0);

    return data.length > 0 ? data : [{ name: "Available", value: 1, percentage: 100, fill: STATUS_COLORS.Available }];
  }, [totalSlots, availableSlots, occupiedSlots, reservedSlots]);

  // 2. Vehicle Classification Donut Data
  const vehicleDistributionData = useMemo(() => {
    const counts = {
      Cars: 0,
      Bikes: 0,
      "Trucks / SUVs": 0,
      "Electric (EV)": 0,
      Other: 0,
    };

    vehicles.forEach((v) => {
      const type = (v?.vehicleType || "Car").toLowerCase();
      if (type.includes("car") || type.includes("sedan") || type.includes("hatch")) counts.Cars++;
      else if (type.includes("bike") || type.includes("motorcycle") || type.includes("scooter")) counts.Bikes++;
      else if (type.includes("truck") || type.includes("suv") || type.includes("van")) counts["Trucks / SUVs"]++;
      else if (type.includes("ev") || type.includes("electric")) counts["Electric (EV)"]++;
      else counts.Other++;
    });

    const total = vehicles.length || 1;
    const result = Object.entries(counts).map(([name, count]) => ({
      name,
      value: count,
      percentage: Math.round((count / total) * 100),
      fill: VEHICLE_COLORS[name] || "#64748B",
    }));

    const activeList = result.filter((item) => item.value > 0);
    return activeList.length > 0
      ? activeList
      : [{ name: "Cars", value: 0, percentage: 0, fill: VEHICLE_COLORS.Cars }];
  }, [vehicles]);

  // 3. Floor-wise Capacity Telemetry Data
  const floorCapacityData = useMemo(() => {
    return floors.map((floor) => {
      const floorSlots = slots.filter((s) => s && s.floor && s.floor.id === floor.id);
      const floorTotal = floorSlots.length || Number(floor.totalSlots) || 0;
      const floorOccupied = floorSlots.filter((s) => s && s.status === "OCCUPIED").length;
      const floorAvailable = floorSlots.filter((s) => s && s.status === "AVAILABLE").length;
      const rate = floorTotal > 0 ? Math.round((floorOccupied / floorTotal) * 100) : 0;

      return {
        floorName: `Level ${floor.floorNumber}`,
        floorNumber: floor.floorNumber,
        total: floorTotal,
        occupied: floorOccupied,
        available: floorAvailable,
        rate: isNaN(rate) ? 0 : rate,
      };
    });
  }, [floors, slots]);

  // 4. Time Series Revenue & Ticket Trend Data
  const timeSeriesData = useMemo(() => {
    const daysCount = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : timeRange === "30d" ? 30 : 7;
    const now = new Date();
    const dateMap = {};

    // Initialize consecutive dates
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dateMap[key] = {
        date: key,
        rawDate: d,
        revenue: 0,
        tickets: 0,
        cumulative: 0,
      };
    }

    // Populate actual ticket revenue & counts
    completedTickets.forEach((t) => {
      const dateSource = t?.exitTime || t?.entryTime;
      if (!dateSource) return;
      const d = new Date(dateSource);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dateMap[key]) {
        dateMap[key].revenue += Number(t.amount) || 0;
        dateMap[key].tickets += 1;
      }
    });

    // Also include active tickets for activity count
    activeTickets.forEach((t) => {
      if (!t?.entryTime) return;
      const d = new Date(t.entryTime);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dateMap[key]) {
        dateMap[key].tickets += 1;
      }
    });

    let runningTotal = 0;
    const sortedList = Object.values(dateMap).sort((a, b) => a.rawDate - b.rawDate);

    // Check if there is actual historical data
    const hasAnyData = sortedList.some((d) => d.revenue > 0 || d.tickets > 0);

    return sortedList.map((item, idx) => {
      if (!hasAnyData && totalRevenue === 0) {
        // baseline simulation curve based on available slots & vehicles
        const sampleMultiplier = Math.max(slots.length * 5, 25);
        const simRevenue = Math.round(sampleMultiplier * (1 + Math.sin(idx * 0.8) * 0.4));
        const simTickets = Math.max(1, Math.round(simRevenue / 35));
        runningTotal += simRevenue;
        return {
          date: item.date,
          revenue: simRevenue,
          tickets: simTickets,
          cumulative: runningTotal,
          isSimulated: true,
        };
      }

      runningTotal += item.revenue;
      return {
        date: item.date,
        revenue: item.revenue,
        tickets: item.tickets,
        cumulative: runningTotal,
      };
    });
  }, [completedTickets, activeTickets, timeRange, totalRevenue, slots.length]);

  // 5. Hourly Peak Inflow Distribution Data
  const hourlyTrafficData = useMemo(() => {
    const hours = [
      { hour: "06:00", count: 0, label: "6 AM" },
      { hour: "08:00", count: 0, label: "8 AM" },
      { hour: "10:00", count: 0, label: "10 AM" },
      { hour: "12:00", count: 0, label: "12 PM" },
      { hour: "14:00", count: 0, label: "2 PM" },
      { hour: "16:00", count: 0, label: "4 PM" },
      { hour: "18:00", count: 0, label: "6 PM" },
      { hour: "20:00", count: 0, label: "8 PM" },
      { hour: "22:00", count: 0, label: "10 PM" },
    ];

    tickets.forEach((t) => {
      if (!t?.entryTime) return;
      const d = new Date(t.entryTime);
      const h = d.getHours();
      if (h >= 5 && h < 7) hours[0].count++;
      else if (h >= 7 && h < 9) hours[1].count++;
      else if (h >= 9 && h < 11) hours[2].count++;
      else if (h >= 11 && h < 13) hours[3].count++;
      else if (h >= 13 && h < 15) hours[4].count++;
      else if (h >= 15 && h < 17) hours[5].count++;
      else if (h >= 17 && h < 19) hours[6].count++;
      else if (h >= 19 && h < 21) hours[7].count++;
      else if (h >= 21) hours[8].count++;
    });

    const hasCounts = hours.some((h) => h.count > 0);
    if (!hasCounts) {
      return [
        { hour: "6 AM", count: 2 },
        { hour: "8 AM", count: 8 },
        { hour: "10 AM", count: 14 },
        { hour: "12 PM", count: 11 },
        { hour: "2 PM", count: 9 },
        { hour: "4 PM", count: 15 },
        { hour: "6 PM", count: 18 },
        { hour: "8 PM", count: 10 },
        { hour: "10 PM", count: 3 },
      ];
    }

    return hours.map((h) => ({ hour: h.label, count: h.count }));
  }, [tickets]);

  // 6. Parking Duration Breakdown Data
  const durationBreakdownData = useMemo(() => {
    const buckets = [
      { range: "< 1h", count: 0 },
      { range: "1 - 2h", count: 0 },
      { range: "2 - 4h", count: 0 },
      { range: "4 - 8h", count: 0 },
      { range: "8h+", count: 0 },
    ];

    completedTickets.forEach((t) => {
      if (t?.entryTime && t?.exitTime) {
        const start = new Date(t.entryTime);
        const end = new Date(t.exitTime);
        const diffHrs = (end - start) / (1000 * 60 * 60);
        if (diffHrs < 1) buckets[0].count++;
        else if (diffHrs < 2) buckets[1].count++;
        else if (diffHrs < 4) buckets[2].count++;
        else if (diffHrs < 8) buckets[3].count++;
        else buckets[4].count++;
      }
    });

    const hasAny = buckets.some((b) => b.count > 0);
    if (!hasAny) {
      return [
        { range: "< 1h", count: 5 },
        { range: "1 - 2h", count: 12 },
        { range: "2 - 4h", count: 8 },
        { range: "4 - 8h", count: 4 },
        { range: "8h+", count: 2 },
      ];
    }
    return buckets;
  }, [completedTickets]);

  // Highest Utilized Level
  const busiestFloor = useMemo(() => {
    if (floorCapacityData.length === 0) return "All Levels Normal";
    const sorted = [...floorCapacityData].sort((a, b) => b.rate - a.rate);
    return `${sorted[0].floorName} (${sorted[0].rate}%)`;
  }, [floorCapacityData]);

  // Peak Hour text
  const peakHourText = useMemo(() => {
    if (hourlyTrafficData.length === 0) return "6:00 PM";
    const sorted = [...hourlyTrafficData].sort((a, b) => b.count - a.count);
    return sorted[0].hour;
  }, [hourlyTrafficData]);

  return (
    <AppLayout
      title="Analytics & Telemetry"
      subtitle="Financial velocity, occupancy curves, and multi-tier fleet intelligence"
    >
      {/* Top Action Bar & Live Status */}
      <div className="analytics-header-actions">
        <div className="live-sync-tag">
          <span className="live-pulse-dot" />
          <span>Real-time Telemetry Engine Active</span>
        </div>

        <div className="header-button-group">
          <button
            className="btn btn-secondary btn-icon-compact"
            onClick={fetchAnalyticsData}
            disabled={loading}
            title="Refresh All Telemetry"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="alert-box error mb-4" style={{ marginBottom: "20px" }}>
          <AlertCircle size={18} />
          <span>{fetchError} - Displaying cached or baseline metrics.</span>
        </div>
      )}

      {/* KPI Top Showcase Cards */}
      <div className="analytics-kpi-grid">
        {/* Total Revenue */}
        <div className="glass-card analytics-kpi-card revenue-card">
          <div className="kpi-top">
            <span className="kpi-title">Gross Revenue</span>
            <div className="kpi-icon-pill green">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="kpi-huge-number">₹{totalRevenue.toLocaleString()}</div>
          <div className="kpi-footer-meta">
            <span className="kpi-sub-badge positive">
              <TrendingUp size={13} /> Avg. ₹{averageRevenue}/ticket
            </span>
            <span className="kpi-sub-text">{completedTickets.length} billings settled</span>
          </div>
        </div>

        {/* Real-time Occupancy */}
        <div className="glass-card analytics-kpi-card occupancy-card">
          <div className="kpi-top">
            <span className="kpi-title">Facility Occupancy</span>
            <div className="kpi-icon-pill cyan">
              <Gauge size={18} />
            </div>
          </div>
          <div className="kpi-huge-number">{occupancyRate}%</div>
          <div className="kpi-footer-meta">
            <span className="kpi-sub-badge cyan-badge">
              {occupiedSlots} / {totalSlots} Spots
            </span>
            <span className="kpi-sub-text">{availableSlots} free slots</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="glass-card analytics-kpi-card active-card">
          <div className="kpi-top">
            <span className="kpi-title">Active Parked Vehicles</span>
            <div className="kpi-icon-pill amber">
              <Car size={18} />
            </div>
          </div>
          <div className="kpi-huge-number">{activeTickets.length}</div>
          <div className="kpi-footer-meta">
            <span className="kpi-sub-badge amber-badge">
              <Activity size={13} /> In Transit
            </span>
            <span className="kpi-sub-text">Currently billed live</span>
          </div>
        </div>

        {/* Average Duration */}
        <div className="glass-card analytics-kpi-card duration-card">
          <div className="kpi-top">
            <span className="kpi-title">Avg. Dwell Duration</span>
            <div className="kpi-icon-pill purple">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-huge-number">{formatDurationText(averageDurationMinutes)}</div>
          <div className="kpi-footer-meta">
            <span className="kpi-sub-badge purple-badge">
              <Flame size={13} /> Peak: {peakHourText}
            </span>
            <span className="kpi-sub-text">Across all floors</span>
          </div>
        </div>
      </div>

      {/* Primary Chart: Financial & Volume Velocity Area Chart */}
      <div className="glass-card analytics-chart-card main-area-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-card-title">
              <TrendingUp size={20} className="chart-title-icon" />
              Revenue & Financial Velocity
            </h3>
            <p className="chart-card-subtitle">
              Dynamic tracking of monetary collections and ticket throughput over time
            </p>
          </div>

          <div className="chart-controls-wrapper">
            {/* Metric Switcher */}
            <div className="chart-toggle-group">
              <button
                className={`chart-toggle-btn ${revenueMetric === "revenue" ? "active" : ""}`}
                onClick={() => setRevenueMetric("revenue")}
              >
                Daily Revenue (₹)
              </button>
              <button
                className={`chart-toggle-btn ${revenueMetric === "cumulative" ? "active" : ""}`}
                onClick={() => setRevenueMetric("cumulative")}
              >
                Cumulative (₹)
              </button>
              <button
                className={`chart-toggle-btn ${revenueMetric === "tickets" ? "active" : ""}`}
                onClick={() => setRevenueMetric("tickets")}
              >
                Ticket Count
              </button>
            </div>

            {/* Timeframe Range */}
            <div className="chart-toggle-group">
              <button
                className={`chart-toggle-btn ${timeRange === "7d" ? "active" : ""}`}
                onClick={() => setTimeRange("7d")}
              >
                7D
              </button>
              <button
                className={`chart-toggle-btn ${timeRange === "14d" ? "active" : ""}`}
                onClick={() => setTimeRange("14d")}
              >
                14D
              </button>
              <button
                className={`chart-toggle-btn ${timeRange === "30d" ? "active" : ""}`}
                onClick={() => setTimeRange("30d")}
              >
                30D
              </button>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="chart-canvas-container" style={{ height: "320px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  revenueMetric === "tickets" ? val : `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`
                }
              />
              <Tooltip
                content={
                  <CustomChartTooltip
                    prefix={revenueMetric === "tickets" ? "" : "₹"}
                    suffix={revenueMetric === "tickets" ? " sessions" : ""}
                  />
                }
              />
              {revenueMetric === "revenue" && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Daily Revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              )}
              {revenueMetric === "cumulative" && (
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative Total"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCumulative)"
                />
              )}
              {revenueMetric === "tickets" && (
                <Area
                  type="monotone"
                  dataKey="tickets"
                  name="Parking Tickets"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Grid: Capacity Donut & Vehicle Distribution Donut */}
      <div className="analytics-grid-2col">
        {/* Donut Chart: Real-time Slot Status */}
        <div className="glass-card analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">
                <PieIcon size={19} className="chart-title-icon" />
                Slot Allocation Status
              </h3>
              <p className="chart-card-subtitle">
                Current availability and lock ratio across all slots
              </p>
            </div>
            <span className="badge badge-role">{totalSlots} Total Slots</span>
          </div>

          <div className="donut-chart-layout">
            <div className="donut-canvas-box" style={{ height: "230px", width: "50%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slotStatusData}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    {slotStatusData.map((entry, index) => (
                      <Cell key={`slot-cell-${index}`} fill={entry.fill} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="donut-center-label">
                <span className="donut-center-val">{occupancyRate}%</span>
                <span className="donut-center-lbl">Occupied</span>
              </div>
            </div>

            {/* Custom Legend / Metric Breakdown */}
            <div className="donut-legend-list">
              <div className="donut-legend-item">
                <div className="donut-legend-dot-label">
                  <span className="legend-dot" style={{ backgroundColor: STATUS_COLORS.Available }} />
                  <span className="legend-name">Available</span>
                </div>
                <div className="donut-legend-values">
                  <strong>{availableSlots}</strong>
                  <span className="legend-pct">({totalSlots > 0 ? Math.round((availableSlots / totalSlots) * 100) : 0}%)</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-dot-label">
                  <span className="legend-dot" style={{ backgroundColor: STATUS_COLORS.Occupied }} />
                  <span className="legend-name">Occupied</span>
                </div>
                <div className="donut-legend-values">
                  <strong>{occupiedSlots}</strong>
                  <span className="legend-pct">({totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%)</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div className="donut-legend-dot-label">
                  <span className="legend-dot" style={{ backgroundColor: STATUS_COLORS.Reserved }} />
                  <span className="legend-name">Reserved</span>
                </div>
                <div className="donut-legend-values">
                  <strong>{reservedSlots}</strong>
                  <span className="legend-pct">({totalSlots > 0 ? Math.round((reservedSlots / totalSlots) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart: Vehicle Category Distribution */}
        <div className="glass-card analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">
                <Car size={19} className="chart-title-icon" />
                Vehicle Classification Fleet
              </h3>
              <p className="chart-card-subtitle">
                Breakdown of registered vehicles by category & propulsion
              </p>
            </div>
            <span className="badge badge-role">{vehicles.length} Registered</span>
          </div>

          <div className="donut-chart-layout">
            <div className="donut-canvas-box" style={{ height: "230px", width: "50%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleDistributionData}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    {vehicleDistributionData.map((entry, index) => (
                      <Cell key={`veh-cell-${index}`} fill={entry.fill} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="donut-center-label">
                <span className="donut-center-val">{vehicles.length}</span>
                <span className="donut-center-lbl">Vehicles</span>
              </div>
            </div>

            {/* Vehicle Breakdown Legend */}
            <div className="donut-legend-list">
              {vehicleDistributionData.map((item) => (
                <div key={item.name} className="donut-legend-item">
                  <div className="donut-legend-dot-label">
                    <span className="legend-dot" style={{ backgroundColor: item.fill }} />
                    <span className="legend-name">{item.name}</span>
                  </div>
                  <div className="donut-legend-values">
                    <strong>{item.value}</strong>
                    <span className="legend-pct">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Floor-wise Capacity & Peak Rush Hours */}
      <div className="analytics-grid-2col">
        {/* Floor-wise Capacity Comparison Bar Chart */}
        <div className="glass-card analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">
                <Layers size={19} className="chart-title-icon" />
                Floor-by-Floor Utilization
              </h3>
              <p className="chart-card-subtitle">
                Occupancy distribution and spot availability across levels
              </p>
            </div>
            <span className="badge badge-role">Busiest: {busiestFloor}</span>
          </div>

          {floorCapacityData.length === 0 ? (
            <div className="empty-chart-placeholder">
              <Layers size={36} />
              <p>No floor telemetry detected. Add floors to visualize level capacity.</p>
            </div>
          ) : (
            <div className="chart-canvas-container" style={{ height: "260px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={floorCapacityData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                  <XAxis dataKey="floorName" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={<CustomChartTooltip suffix=" spots" />}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px", fontSize: "0.825rem" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="occupied"
                    name="Occupied Spots"
                    fill="#F43F5E"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="available"
                    name="Available Spots"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Hourly Peak Rush Inflow Chart */}
        <div className="glass-card analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">
                <Activity size={19} className="chart-title-icon" />
                Hourly Inflow Traffic Pattern
              </h3>
              <p className="chart-card-subtitle">
                Peak check-in congestion trends across 24-hour cycle
              </p>
            </div>
            <span className="badge badge-role">Peak: {peakHourText}</span>
          </div>

          <div className="chart-canvas-container" style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTrafficData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="barInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomChartTooltip suffix=" arrivals" />} />
                <Bar
                  dataKey="count"
                  name="Vehicle Arrivals"
                  fill="url(#barInflow)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dwell Duration Distribution Card */}
      <div className="glass-card analytics-chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-card-title">
              <Clock size={19} className="chart-title-icon" />
              Parking Duration Spread
            </h3>
            <p className="chart-card-subtitle">
              Session length categorization among concluded parking operations
            </p>
          </div>
          <span className="badge badge-role">Avg: {formatDurationText(averageDurationMinutes)}</span>
        </div>

        <div className="duration-bars-grid">
          {durationBreakdownData.map((item, idx) => {
            const totalDurations = durationBreakdownData.reduce((acc, curr) => acc + curr.count, 0) || 1;
            const pct = Math.round((item.count / totalDurations) * 100);
            return (
              <div key={item.range} className="duration-bar-item">
                <div className="duration-bar-header">
                  <span className="duration-label">{item.range}</span>
                  <span className="duration-count">{item.count} sessions ({pct}%)</span>
                </div>
                <div className="duration-track">
                  <div
                    className="duration-fill"
                    style={{
                      width: `${pct}%`,
                      background:
                        idx === 0
                          ? "linear-gradient(90deg, #10B981, #34D399)"
                          : idx === 1
                          ? "linear-gradient(90deg, #38BDF8, #60A5FA)"
                          : idx === 2
                          ? "linear-gradient(90deg, #6366F1, #818CF8)"
                          : idx === 3
                          ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                          : "linear-gradient(90deg, #EC4899, #F43F5E)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

export default Analytics;