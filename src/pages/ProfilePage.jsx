import { useState, useRef } from "react";
import AppShell from "../components/AppShell.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { api } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Toast({ msg }) {
  if (!msg) return null;
  const isError = msg.startsWith("❌");
  return (
    <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 999, background: isError ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${isError ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`, borderRadius: "12px", padding: "12px 20px", color: isError ? "#F87171" : "#34D399", fontWeight: 600, fontSize: "13px", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      {msg}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", color: "#E2E8F0", fontFamily: "Inter, sans-serif", fontSize: "15px", outline: "none", boxSizing: "border-box",
};

const cardStyle = {
  background: "linear-gradient(135deg,#0F1629,#111827)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "22px", marginBottom: "16px",
};

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3200); };

  // Photo
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Name
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [nameLoading, setNameLoading] = useState(false);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  // PIN
  const [pinPassword, setPinPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [showPin, setShowPin] = useState({ pw: false, pin: false, confirm: false });

  const avatarUrl = photoPreview || (user?.photoUrl ? `${API_BASE}${user.photoUrl}` : null);
  const initials = (user?.fullName || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setPhotoLoading(true);
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      const res = await api.uploadPhoto(fd);
      updateUser({ photoUrl: res.photoUrl });
      showToast("✅ Photo updated.");
      setPhotoFile(null);
    } catch (err) {
      showToast("❌ " + (err.message || "Upload failed."));
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!fullName.trim()) { showToast("❌ Name cannot be empty."); return; }
    if (fullName.trim() === user?.fullName) { showToast("❌ That's already your name."); return; }
    setNameLoading(true);
    try {
      await api.updateProfile({ fullName: fullName.trim() });
      updateUser({ fullName: fullName.trim() });
      showToast("✅ Name updated.");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed."));
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) { showToast("❌ Fill in all password fields."); return; }
    if (newPassword.length < 8) { showToast("❌ Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { showToast("❌ Passwords do not match."); return; }
    setPwLoading(true);
    try {
      await api.updatePassword({ oldPassword, newPassword });
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      showToast("✅ Password updated.");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed."));
    } finally {
      setPwLoading(false);
    }
  };

  const handleUpdatePin = async () => {
    if (!pinPassword || !newPin || !confirmPin) { showToast("❌ Fill in all PIN fields."); return; }
    if (!/^\d{4,6}$/.test(newPin)) { showToast("❌ PIN must be 4–6 digits."); return; }
    if (newPin !== confirmPin) { showToast("❌ PINs do not match."); return; }
    setPinLoading(true);
    try {
      await api.updatePin({ password: pinPassword, pin: newPin });
      setPinPassword(""); setNewPin(""); setConfirmPin("");
      showToast("✅ Transaction PIN updated.");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed."));
    } finally {
      setPinLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate("/signin"); };

  const SectionHeader = ({ icon, color, title }) => (
    <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{icon}</span>
      {title}
    </div>
  );

  const PasswordField = ({ label, value, onChange, show, onToggle }) => (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "6px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={show ? "text" : "password"} value={value} onChange={onChange} style={{ ...inputStyle, paddingRight: "44px" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.1)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
        />
        <button type="button" onClick={onToggle} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)" }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            {show
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
            }
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <AppShell>
      <Toast msg={toast} />

      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", marginBottom: "2px" }}>My Account</div>
        <h1 className="font-black text-white" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>Profile</h1>
      </div>

      {/* Identity card */}
      <div style={{ ...cardStyle, background: "linear-gradient(160deg,#0F1E40,#0D1830)", border: "1px solid rgba(26,86,219,0.2)", display: "flex", alignItems: "center", gap: "16px", position: "relative", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(26,86,219,0.1)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#1A56DB,#1247C0)", border: "2px solid rgba(26,86,219,0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 4px 20px rgba(26,86,219,0.4)" }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "22px", fontWeight: 900, color: "white" }}>{initials}</span>
            )}
          </div>
          <button onClick={() => fileInputRef.current?.click()}
            style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "22px", height: "22px", borderRadius: "50%", background: "#1A56DB", border: "2px solid #060B18", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="11" height="11" fill="white" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth="2" fill="none" /></svg>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "white", letterSpacing: "-0.01em", marginBottom: "2px" }}>{user?.fullName || "—"}</div>
          <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)" }}>{user?.email}</div>
          {user?.accountNumber && (
            <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)", marginTop: "2px", fontFamily: "monospace" }}>
              •••• {user.accountNumber.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {/* Photo upload banner (shown after photo selected) */}
      {photoFile && (
        <div style={{ background: "rgba(26,86,219,0.1)", border: "1px solid rgba(26,86,219,0.25)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, fontSize: "13px", color: "#60A5FA" }}>{photoFile.name} ready to upload</div>
          <button onClick={handleUploadPhoto} disabled={photoLoading}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "12px", fontWeight: 700, cursor: photoLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}>
            {photoLoading ? "Uploading…" : "Upload"}
          </button>
          <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
            style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.1)", color: "#F87171", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
            ✕
          </button>
        </div>
      )}

      {/* Account info */}
      <div style={cardStyle}>
        <SectionHeader icon="🪪" color="rgba(26,86,219,1)" title="Account Details" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Account Type", value: user?.accountType },
            { label: "Currency", value: user?.currency },
            { label: "Country", value: user?.country },
            { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—" },
          ].map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(148,163,184,0.45)", marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0", textTransform: "capitalize" }}>{item.value || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Name */}
      <div style={cardStyle}>
        <SectionHeader icon="✏️" color="rgba(26,86,219,1)" title="Update Name" />
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "6px" }}>Full Name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name"
          style={{ ...inputStyle, marginBottom: "14px" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.1)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
        />
        <button onClick={handleUpdateName} disabled={nameLoading}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: nameLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 16px rgba(26,86,219,0.35)", opacity: nameLoading ? 0.7 : 1 }}>
          {nameLoading ? "Saving…" : "Save Name"}
        </button>
      </div>

      {/* Change Password */}
      <div style={cardStyle}>
        <SectionHeader icon="🔒" color="rgba(52,211,153,1)" title="Change Password" />
        <PasswordField label="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} show={showPw.old} onToggle={() => setShowPw((s) => ({ ...s, old: !s.old }))} />
        <PasswordField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} show={showPw.new} onToggle={() => setShowPw((s) => ({ ...s, new: !s.new }))} />
        {newPassword.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", padding: "8px 12px", borderRadius: "8px", background: newPassword.length >= 12 ? "rgba(52,211,153,0.06)" : newPassword.length >= 8 ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${newPassword.length >= 12 ? "rgba(52,211,153,0.15)" : newPassword.length >= 8 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)"}` }}>
            <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "2px", width: newPassword.length >= 12 ? "100%" : newPassword.length >= 8 ? "60%" : "30%", background: newPassword.length >= 12 ? "#34D399" : newPassword.length >= 8 ? "#FCD34D" : "#F87171", transition: "width 0.3s, background 0.3s" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: newPassword.length >= 12 ? "#34D399" : newPassword.length >= 8 ? "#FCD34D" : "#F87171" }}>
              {newPassword.length >= 12 ? "Strong" : newPassword.length >= 8 ? "Good" : "Weak"}
            </span>
          </div>
        )}
        <PasswordField label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} show={showPw.confirm} onToggle={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))} />
        <button onClick={handleUpdatePassword} disabled={pwLoading}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,rgba(52,211,153,0.85),rgba(16,185,129,0.9))", color: "white", fontSize: "15px", fontWeight: 700, cursor: pwLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: pwLoading ? 0.7 : 1 }}>
          {pwLoading ? "Updating…" : "Update Password"}
        </button>
      </div>

      {/* Transaction PIN */}
      <div style={cardStyle}>
        <SectionHeader icon="🔢" color="rgba(245,158,11,1)" title="Transaction PIN" />
        <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.6)", lineHeight: 1.6, marginBottom: "16px" }}>
          Your 4–6 digit PIN is required for transactions. Enter your password to confirm the change.
        </p>
        <PasswordField label="Current Password" value={pinPassword} onChange={(e) => setPinPassword(e.target.value)} show={showPin.pw} onToggle={() => setShowPin((s) => ({ ...s, pw: !s.pw }))} />
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "6px" }}>New PIN</label>
          <input type={showPin.pin ? "text" : "password"} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").substring(0, 6))} placeholder="4–6 digits" inputMode="numeric" maxLength={6}
            style={{ ...inputStyle }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "6px" }}>Confirm PIN</label>
          <input type={showPin.confirm ? "text" : "password"} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").substring(0, 6))} placeholder="Repeat PIN" inputMode="numeric" maxLength={6}
            style={{ ...inputStyle }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <button onClick={handleUpdatePin} disabled={pinLoading}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,rgba(245,158,11,0.9),rgba(217,119,6,0.95))", color: "white", fontSize: "15px", fontWeight: 700, cursor: pinLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: pinLoading ? 0.7 : 1 }}>
          {pinLoading ? "Updating…" : "Update PIN"}
        </button>
      </div>

      {/* Sign Out */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <SectionHeader icon="🚪" color="rgba(239,68,68,1)" title="Sign Out" />
        <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.5)", marginBottom: "16px", lineHeight: 1.5 }}>
          You'll be signed out on this device. Your account remains secure.
        </p>
        <button onClick={handleLogout}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.08)", color: "#F87171", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}>
          Sign Out
        </button>
      </div>
    </AppShell>
  );
}
