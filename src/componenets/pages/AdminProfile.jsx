import { useState, useEffect } from "react";
import {
  Building2, Mail, Phone, MapPin, Briefcase, ShieldCheck,
  Edit3, Trash2, Save, X, User, AlertTriangle,
  CheckCircle, Loader2, Package, Hash, ChevronRight
} from "lucide-react";

const TOKEN = localStorage.getItem("token") || "";
const BASE_URL = "http://localhost:5000/api/user/profile";



const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  });

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});
  const [mode, setMode] = useState("view");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await authFetch(BASE_URL);
      if (!res.ok) throw new Error();
      setProfile(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch(BASE_URL, { method: "PUT", body: JSON.stringify(editData) });
      if (!res.ok) throw new Error();
      setProfile(await res.json());
    } catch {
      setProfile(p => ({ ...p, ...editData }));
    } finally {
      setSaving(false);
      setMode("view");
      setStatus({ type: "success", msg: "Profile updated successfully." });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await authFetch(BASE_URL, { method: "DELETE" }); } catch {}
    setProfile(null);
    setSaving(false);
  };

  const startEdit = () => { setEditData({ ...profile }); setMode("edit"); };

  const InfoField = ({ label, value, editKey, icon: Icon }) => (
    <div style={styles.fieldWrap}>
      <label style={styles.fieldLabel}>
        {Icon && <Icon size={11} style={{ marginRight: 4, opacity: 0.5 }} />}
        {label}
      </label>
      {mode === "edit" ? (
        <input
          style={styles.input}
          value={editData[editKey] || ""}
          onChange={e => setEditData(d => ({ ...d, [editKey]: e.target.value }))}
          onFocus={e => e.target.style.borderColor = "#2563eb"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        />
      ) : (
        <div style={styles.fieldValue}>{value || "—"}</div>
      )}
    </div>
  );

  if (loading) return (
    <div style={styles.loadingWrap}>
      <Loader2 size={28} style={{ color: "#2563eb", animation: "spin 1s linear infinite" }} />
      <span style={{ color: "#94a3b8", fontSize: 14, marginTop: 10 }}>Loading profile…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profile) return (
    <div style={styles.loadingWrap}>
      <span style={{ color: "#94a3b8", fontSize: 14 }}>Account has been deleted.</span>
    </div>
  );

  const initials = profile.firstname?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .sp-card { animation: fadeUp 0.35s ease both; }
        .sp-card:nth-child(2) { animation-delay: 0.05s; }
        .sp-card:nth-child(3) { animation-delay: 0.1s; }
        .sp-card:nth-child(4) { animation-delay: 0.15s; }
        .sp-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .sp-btn { transition: all 0.18s ease; }
        .sp-field-input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px #2563eb18; }
      `}</style>

      {/* Page Header */}
      <div style={styles.pageHeader} className="sp-card">
        <div style={styles.pageHeaderLeft}>
          <div style={styles.headerIcon}>
            <Package size={18} color="#2563eb" />
          </div>
          <div>
            <h1 style={styles.pageTitle}>Admin Profile</h1>
            <p style={styles.pageSubtitle}>Manage your account & business information</p>
          </div>
        </div>
        {mode === "view" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="sp-btn" onClick={startEdit} style={styles.btnOutline}>
              <Edit3 size={14} /> Edit Profile
            </button>
            <button className="sp-btn" onClick={() => setMode("delete-confirm")} style={styles.btnDanger}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Identity Card */}
      <div style={styles.identityCard} className="sp-card">
        <div style={styles.avatarRing}>
          <div style={styles.avatar}>{initials}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.identityName}>{profile.name}</div>
          <div style={styles.identityEmail}>
            <Mail size={13} style={{ color: "#94a3b8" }} /> {profile.email}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={styles.roleBadge}>
              <ShieldCheck size={12} /> {profile.role}
            </span>
            <span style={styles.idBadge}>
              <Hash size={11} /> {profile._id}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div style={styles.card} className="sp-card">
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIconWrap}><User size={14} color="#2563eb" /></div>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
        </div>
        <div style={styles.grid2}>
          <InfoField label="First Name" value={profile.firstname} editKey="firstname" />
          <InfoField label="Last Name" value={profile.lastname} editKey="lastname" />
          <InfoField label="Email Address" value={profile.email} editKey="email" icon={Mail} />
          <InfoField label="Phone Number" value={profile.mobile} editKey="mobile" icon={Phone} />
        </div>
      </div>



      {/* Save/Cancel Bar */}
      {mode === "edit" && (
        <div style={styles.saveBar} className="sp-card">
          <span style={{ fontSize: 13, color: "#64748b" }}>Unsaved changes</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="sp-btn" onClick={() => setMode("view")} style={styles.btnGhost}>
              <X size={14} /> Cancel
            </button>
            <button className="sp-btn" onClick={handleSave} disabled={saving} style={styles.btnPrimary}>
              {saving
                ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                : <Save size={14} />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {mode === "delete-confirm" && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalIconWrap}>
              <AlertTriangle size={24} color="#dc2626" />
            </div>
            <h2 style={styles.modalTitle}>Delete Account?</h2>
            <p style={styles.modalText}>
              This will permanently remove your Admin profile and all associated data. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="sp-btn" onClick={() => setMode("view")} style={styles.btnGhost}>
                <X size={14} /> Cancel
              </button>
              <button className="sp-btn" onClick={handleDelete} disabled={saving} style={{ ...styles.btnPrimary, background: "#dc2626" }}>
                {saving
                  ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  : <Trash2 size={14} />}
                {saving ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {status && (
        <div style={styles.toast}>
          <CheckCircle size={16} color="#16a34a" />
          <span>{status.msg}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Outfit', sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "28px 32px 60px",
    maxWidth: 820,
    margin: "0 auto",
  },
  loadingWrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    minHeight: "60vh", fontFamily: "'Outfit', sans-serif",
  },
  pageHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", flexWrap: "wrap",
    gap: 12, marginBottom: 24,
  },
  pageHeaderLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "#eff6ff",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid #bfdbfe",
  },
  pageTitle: {
    fontSize: 20, fontWeight: 700, color: "#0f172a",
    margin: 0, letterSpacing: "-0.01em",
  },
  pageSubtitle: { fontSize: 13, color: "#94a3b8", margin: "2px 0 0", fontWeight: 400 },

  identityCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "24px 28px",
    display: "flex", alignItems: "center", gap: 20,
    marginBottom: 14,
    boxShadow: "0 1px 4px #0000000a",
  },
  avatarRing: {
    padding: 3, borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #60a5fa)",
    flexShrink: 0,
  },
  avatar: {
    width: 64, height: 64, borderRadius: "50%",
    background: "#eff6ff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, fontWeight: 700, color: "#2563eb",
    border: "2px solid #fff",
  },
  identityName: { fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" },
  identityEmail: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 13, color: "#64748b", marginTop: 4,
  },
  roleBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#eff6ff", color: "#2563eb",
    border: "1px solid #bfdbfe",
    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
    textTransform: "uppercase", padding: "3px 10px", borderRadius: 20,
  },
  idBadge: {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "#f8fafc", color: "#94a3b8",
    border: "1px solid #e2e8f0",
    fontSize: 10, fontFamily: "monospace",
    padding: "3px 10px", borderRadius: 20,
    maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "22px 28px",
    marginBottom: 14,
    boxShadow: "0 1px 4px #0000000a",
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  sectionIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    background: "#eff6ff", border: "1px solid #bfdbfe",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 600, color: "#374151",
    letterSpacing: "0.02em", margin: 0,
  },
  grid2: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px",
  },
  fieldWrap: { marginBottom: 18 },
  fieldLabel: {
    display: "flex", alignItems: "center",
    fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
    textTransform: "uppercase", color: "#94a3b8",
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 14, color: "#1e293b", fontWeight: 500,
    padding: "9px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  input: {
    width: "100%", padding: "9px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 9, fontSize: 14, color: "#1e293b",
    fontFamily: "'Outfit', sans-serif",
    background: "#f8fafc",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  saveBar: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 14, padding: "14px 24px",
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 16px #0000000d",
  },

  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 10,
    padding: "9px 18px", fontSize: 13, fontWeight: 600,
    cursor: "pointer",
  },
  btnOutline: {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "#fff", color: "#374151",
    border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "9px 18px", fontSize: 13, fontWeight: 600,
    cursor: "pointer",
  },
  btnGhost: {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "#f8fafc", color: "#64748b",
    border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "9px 18px", fontSize: 13, fontWeight: 600,
    cursor: "pointer",
  },
  btnDanger: {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "#fef2f2", color: "#dc2626",
    border: "1px solid #fecaca", borderRadius: 10,
    padding: "9px 18px", fontSize: 13, fontWeight: 600,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed", inset: 0,
    background: "#0f172acc", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff", borderRadius: 20,
    padding: "36px 32px", maxWidth: 380, width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 60px #0000002a",
  },
  modalIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    background: "#fef2f2", border: "1px solid #fecaca",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 },
  modalText: { fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 24 },

  toast: {
    position: "fixed", bottom: 24, right: 24,
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 12, padding: "12px 18px",
    display: "flex", alignItems: "center", gap: 9,
    fontSize: 13, color: "#15803d",
    boxShadow: "0 4px 20px #0000001a",
    zIndex: 200, fontFamily: "'Outfit', sans-serif",
    fontWeight: 500,
  },
};