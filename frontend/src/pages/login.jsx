import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ParkingSquare,
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Car,
  Layers,
  BarChart3
} from "lucide-react";
import "../styles/Login.css";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");

  // Autofill Demo Account
  const handleAutofillDemo = () => {
    if (isRegister) {
      setName("John Doe");
      setEmail("demo.user@parkflow.io");
      setPassword("123456");
      setRole("CUSTOMER");
    } else {
      setEmail("admin@gmail.com");
      setPassword("123456");
    }
    toast.info("Demo credentials loaded!");
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/users/login", null, {
        params: {
          email: email.trim(),
          password: password,
        },
      });

      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "ADMIN");
      localStorage.setItem("userName", data.name || "Admin");
      localStorage.setItem("userEmail", data.email || email);
      localStorage.setItem("userId", data.id || "1");

      toast.success(`Welcome back, ${data.name || "Admin"}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message || "Invalid credentials. Please try again."
        );
      } else {
        toast.error("Cannot connect to backend server. Make sure it's running.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/users/register", {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: role,
      });

      toast.success("Account registered successfully! You can now log in.");
      setIsRegister(false);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message || "Registration failed. Email may already exist."
        );
      } else {
        toast.error("Cannot connect to backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Left Hero Pane */}
      <div className="login-hero-pane">
        <div className="hero-brand">
          <div className="hero-brand-icon">
            <ParkingSquare size={26} />
          </div>
          <div className="hero-brand-title">ParkFlow</div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Next-Gen Parking Infrastructure</span>
          </div>

          <h1 className="hero-title">
            Smart Management for <br />
            <span className="hero-title-gradient">Modern Mobility</span>
          </h1>

          <p className="hero-description">
            Streamline parking operations with real-time slot telemetry, 
            instant automated ticketing, floor management, and analytics.
          </p>

          <div className="hero-feature-pills">
            <div className="feature-pill">
              <Car size={16} style={{ color: "#38BDF8" }} />
              <span>Telemetry & Plate Tracking</span>
            </div>
            <div className="feature-pill">
              <Layers size={16} style={{ color: "#818CF8" }} />
              <span>Multi-Floor Capacity</span>
            </div>
            <div className="feature-pill">
              <BarChart3 size={16} style={{ color: "#34D399" }} />
              <span>Live Revenue Intelligence</span>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          © {new Date().getFullYear()} ParkFlow Inc. Enterprise Parking System.
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="login-form-pane">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${!isRegister ? "active" : ""}`}
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isRegister ? "active" : ""}`}
              onClick={() => setIsRegister(true)}
            >
              Create Account
            </button>
          </div>

          <div className="auth-card-header">
            <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p>
              {isRegister
                ? "Register a new user or administrator profile"
                : "Sign in to access your parking management dashboard"}
            </p>
          </div>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon-left" />
                  <input
                    type="text"
                    className="form-input has-left-icon"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon-left" />
                <input
                  type="email"
                  className="form-input has-left-icon"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input has-left-icon has-right-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="ADMIN">ADMIN (Full Access)</option>
                  <option value="CUSTOMER">CUSTOMER (Standard)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "12px", padding: "12px" }}
              disabled={loading}
            >
              {loading ? (
                "Authenticating..."
              ) : isRegister ? (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            className="demo-autofill-btn"
            onClick={handleAutofillDemo}
          >
            <Sparkles size={14} />
            <span>Auto-fill Demo Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;