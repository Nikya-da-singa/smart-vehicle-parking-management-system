import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur || 5000),
    warning: (msg, dur) => addToast(msg, "warning", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-400" style={{ color: "#34D399", flexShrink: 0 }} />;
      case "error":
        return <XCircle size={18} className="text-rose-400" style={{ color: "#FB7185", flexShrink: 0 }} />;
      case "warning":
        return <AlertTriangle size={18} className="text-amber-400" style={{ color: "#FBBF24", flexShrink: 0 }} />;
      default:
        return <Info size={18} className="text-cyan-400" style={{ color: "#38BDF8", flexShrink: 0 }} />;
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={`toast-item ${item.type}`}>
            {getIcon(item.type)}
            <div style={{ flex: 1, wordBreak: "break-word" }}>{item.message}</div>
            <button
              onClick={() => removeToast(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
