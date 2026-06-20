import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useAuth } from "../lib/AuthContext.jsx";
import { api } from "../lib/api.js";

const BG = `radial-gradient(ellipse 70% 55% at 60% 10%, rgba(26,86,219,0.35) 0%, transparent 65%), linear-gradient(180deg,#060B18 0%,#050910 100%)`;
const inputBase = {
  width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px", padding: "15px 18px", color: "#E2E8F0", fontFamily: "Inter, sans-serif",
  fontSize: "15px", outline: "none", transition: "all 0.2s", WebkitAppearance: "none", boxSizing: "border-box",
};
const selectBase = { ...inputBase, cursor: "pointer" };

const STEPS = ["Personal", "Contact", "Account", "Security"];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
  "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "UAE", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
];

const CURRENCIES = [
  { value: "USD", label: "USD – US Dollar" },
  { value: "EUR", label: "EUR – Euro" },
  { value: "GBP", label: "GBP – British Pound" },
  { value: "JPY", label: "JPY – Japanese Yen" },
  { value: "CHF", label: "CHF – Swiss Franc" },
  { value: "CAD", label: "CAD – Canadian Dollar" },
  { value: "AUD", label: "AUD – Australian Dollar" },
  { value: "NZD", label: "NZD – New Zealand Dollar" },
  { value: "CNY", label: "CNY – Chinese Yuan" },
  { value: "HKD", label: "HKD – Hong Kong Dollar" },
  { value: "SGD", label: "SGD – Singapore Dollar" },
  { value: "SEK", label: "SEK – Swedish Krona" },
  { value: "NOK", label: "NOK – Norwegian Krone" },
  { value: "DKK", label: "DKK – Danish Krone" },
  { value: "MXN", label: "MXN – Mexican Peso" },
  { value: "BRL", label: "BRL – Brazilian Real" },
  { value: "INR", label: "INR – Indian Rupee" },
  { value: "KRW", label: "KRW – South Korean Won" },
  { value: "RUB", label: "RUB – Russian Ruble" },
  { value: "TRY", label: "TRY – Turkish Lira" },
  { value: "ZAR", label: "ZAR – South African Rand" },
  { value: "NGN", label: "NGN – Nigerian Naira" },
  { value: "GHS", label: "GHS – Ghanaian Cedi" },
  { value: "KES", label: "KES – Kenyan Shilling" },
  { value: "EGP", label: "EGP – Egyptian Pound" },
  { value: "MAD", label: "MAD – Moroccan Dirham" },
  { value: "AED", label: "AED – UAE Dirham" },
  { value: "SAR", label: "SAR – Saudi Riyal" },
  { value: "QAR", label: "QAR – Qatari Riyal" },
  { value: "KWD", label: "KWD – Kuwaiti Dinar" },
  { value: "BHD", label: "BHD – Bahraini Dinar" },
  { value: "OMR", label: "OMR – Omani Rial" },
  { value: "ILS", label: "ILS – Israeli Shekel" },
  { value: "PKR", label: "PKR – Pakistani Rupee" },
  { value: "BDT", label: "BDT – Bangladeshi Taka" },
  { value: "MYR", label: "MYR – Malaysian Ringgit" },
  { value: "THB", label: "THB – Thai Baht" },
  { value: "IDR", label: "IDR – Indonesian Rupiah" },
  { value: "PHP", label: "PHP – Philippine Peso" },
  { value: "VND", label: "VND – Vietnamese Dong" },
  { value: "UAH", label: "UAH – Ukrainian Hryvnia" },
  { value: "PLN", label: "PLN – Polish Zloty" },
  { value: "CZK", label: "CZK – Czech Koruna" },
  { value: "HUF", label: "HUF – Hungarian Forint" },
  { value: "RON", label: "RON – Romanian Leu" },
  { value: "BGN", label: "BGN – Bulgarian Lev" },
  { value: "ISK", label: "ISK – Icelandic Krona" },
  { value: "CLP", label: "CLP – Chilean Peso" },
  { value: "COP", label: "COP – Colombian Peso" },
  { value: "PEN", label: "PEN – Peruvian Sol" },
  { value: "ARS", label: "ARS – Argentine Peso" },
  { value: "UYU", label: "UYU – Uruguayan Peso" },
  { value: "JMD", label: "JMD – Jamaican Dollar" },
  { value: "TTD", label: "TTD – Trinidad Dollar" },
  { value: "XOF", label: "XOF – West African CFA Franc" },
  { value: "XAF", label: "XAF – Central African CFA Franc" },
  { value: "TZS", label: "TZS – Tanzanian Shilling" },
  { value: "UGX", label: "UGX – Ugandan Shilling" },
  { value: "ETB", label: "ETB – Ethiopian Birr" },
  { value: "DZD", label: "DZD – Algerian Dinar" },
  { value: "TND", label: "TND – Tunisian Dinar" },
  { value: "GEL", label: "GEL – Georgian Lari" },
  { value: "AMD", label: "AMD – Armenian Dram" },
  { value: "AZN", label: "AZN – Azerbaijani Manat" },
  { value: "KZT", label: "KZT – Kazakhstani Tenge" },
  { value: "UZS", label: "UZS – Uzbekistani Som" },
  { value: "LKR", label: "LKR – Sri Lankan Rupee" },
  { value: "NPR", label: "NPR – Nepalese Rupee" },
  { value: "MMK", label: "MMK – Myanmar Kyat" },
];
const ACCOUNT_TYPES = [
  { value: "savings", label: "Savings Account" },
  { value: "checking", label: "Checking Account" },
  { value: "current", label: "Current Account" },
];

function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const strengthColors = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#10B981"];
const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

function FieldInput({ label, id, type = "text", placeholder, value, onChange, error, required, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: "3px" }}>*</span>}
      </label>
      {children || (
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ ...inputBase, borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.12)"; }}
          onBlur={(e) => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
        />
      )}
      {error && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}

function SelectField({ label, id, value, onChange, options, error, required }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: "3px" }}>*</span>}
      </label>
      <select id={id} value={value} onChange={onChange}
        style={{ ...selectBase, borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)" }}
        onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.12)"; }}
        onBlur={(e) => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
      >
        {options.map((opt) => (
          <option key={typeof opt === "string" ? opt : opt.value} value={typeof opt === "string" ? opt : opt.value} style={{ background: "#0A1628" }}>
            {typeof opt === "string" ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const photoInputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "", dateOfBirth: "",
    phone: "", address: "", city: "", country: "United States", zipCode: "",
    currency: "USD", accountType: "savings",
    email: "", password: "", transactionPin: "", confirmPin: "",
  });

  const set = (k) => (e) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }));
    setErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (form.fullName.trim().length < 2) e.fullName = "Enter your full name.";
    }
    if (s === 1) {
      if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number.";
    }
    if (s === 3) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
      if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
      if (form.transactionPin && !/^\d{4,6}$/.test(form.transactionPin)) e.transactionPin = "PIN must be 4–6 digits.";
      if (form.transactionPin && form.transactionPin !== form.confirmPin) e.confirmPin = "PINs do not match.";
    }
    return e;
  }

  const nextStep = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const prevStep = () => { setErrors({}); setStep((s) => s - 1); };

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validateStep(3);
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        country: form.country,
        zipCode: form.zipCode || undefined,
        currency: form.currency,
        accountType: form.accountType,
        transactionPin: form.transactionPin || undefined,
      };

      const response = await register(payload);

      // Upload photo if selected
      if (photoFile && response?.user?.id) {
        try {
          const fd = new FormData();
          fd.append("photo", photoFile);
          await api.uploadPhoto(fd);
        } catch {}
      }

      if (response?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setApiError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  const pwScore = form.password ? strengthScore(form.password) : 0;

  const card = {
    background: "linear-gradient(135deg,#0D1F3C,#0A1628)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "24px",
  };

  return (
    <div className="min-h-screen font-inter" style={{ background: BG, color: "#E2E8F0" }}>
      <div className="max-w-lg mx-auto px-5 sm:px-8 pt-8 pb-16">
        <Icon.Logo />

        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium" style={{ color: "rgba(148,163,184,0.8)", textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        <div className="mb-8">
          <h1 className="font-black text-white leading-tight tracking-tight mb-1" style={{ fontSize: "clamp(1.8rem,7vw,2.5rem)" }}>
            Open Your Account
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "14px" }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i <= step ? "#1A56DB" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
          ))}
        </div>

        {apiError && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#F87171", fontSize: "13px" }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Step 0: Personal ── */}
          {step === 0 && (
            <div style={card}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "20px" }}>
                Personal Information
              </div>

              {/* Photo upload */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  style={{ width: "80px", height: "80px", borderRadius: "50%", flexShrink: 0, background: photoPreview ? "transparent" : "rgba(26,86,219,0.15)", border: "2px dashed rgba(26,86,219,0.4)", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg width="28" height="28" fill="none" stroke="rgba(26,86,219,0.7)" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                <div>
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    style={{ fontSize: "13px", fontWeight: 600, color: "#60A5FA", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "4px" }}>
                    Upload Photo
                  </button>
                  <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)" }}>Optional · Max 5MB</div>
                </div>
              </div>

              <FieldInput label="Full Name" id="fullName" placeholder="Your full name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} required />
              <FieldInput label="Date of Birth" id="dob" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
            </div>
          )}

          {/* ── Step 1: Contact ── */}
          {step === 1 && (
            <div style={card}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "20px" }}>Contact Details</div>
              <FieldInput label="Phone Number" id="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} error={errors.phone} required />
              <FieldInput label="Street Address" id="address" placeholder="123 Main Street" value={form.address} onChange={set("address")} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FieldInput label="City" id="city" placeholder="New York" value={form.city} onChange={set("city")} />
                <FieldInput label="Zip / Postal" id="zip" placeholder="10001" value={form.zipCode} onChange={set("zipCode")} />
              </div>
              <SelectField label="Country" id="country" value={form.country} onChange={set("country")} options={COUNTRIES} required />
            </div>
          )}

          {/* ── Step 2: Account ── */}
          {step === 2 && (
            <div style={card}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "20px" }}>Account Preferences</div>
              <SelectField label="Account Type" id="accountType" value={form.accountType} onChange={set("accountType")} options={ACCOUNT_TYPES} required />
              <SelectField label="Account Currency" id="currency" value={form.currency} onChange={set("currency")} options={CURRENCIES} required />

              <div style={{ background: "rgba(26,86,219,0.08)", border: "1px solid rgba(26,86,219,0.2)", borderRadius: "12px", padding: "16px", marginTop: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#60A5FA", marginBottom: "6px" }}>Account Types Explained</div>
                <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                  <strong style={{ color: "#E2E8F0" }}>Savings</strong> — Earn interest on your balance.<br />
                  <strong style={{ color: "#E2E8F0" }}>Checking</strong> — Everyday spending with debit access.<br />
                  <strong style={{ color: "#E2E8F0" }}>Current</strong> — Business-ready with higher limits.
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Security ── */}
          {step === 3 && (
            <div style={card}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "20px" }}>Security Setup</div>

              <FieldInput label="Email Address" id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} required />

              {/* Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>
                  Password <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={set("password")}
                    style={{ ...inputBase, paddingRight: "48px", borderColor: errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)" }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      {showPw
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(pwScore / 5) * 100}%`, background: strengthColors[pwScore - 1] || "#EF4444", borderRadius: "2px", transition: "width 0.3s" }} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: strengthColors[pwScore - 1] || "#EF4444", flexShrink: 0 }}>
                      {strengthLabels[pwScore - 1] || "Too Short"}
                    </span>
                  </div>
                )}
                {errors.password && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "5px" }}>{errors.password}</p>}
              </div>

              {/* Transaction PIN */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginTop: "4px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#C9A227", marginBottom: "12px" }}>
                  Transaction PIN (Optional)
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>
                    Set 4–6 Digit PIN
                  </label>
                  <div style={{ position: "relative" }}>
                    <input type={showPin ? "text" : "password"} inputMode="numeric" pattern="[0-9]*" placeholder="••••" value={form.transactionPin} onChange={set("transactionPin")}
                      style={{ ...inputBase, paddingRight: "48px", letterSpacing: "0.3em", borderColor: errors.transactionPin ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(201,162,39,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(201,162,39,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = errors.transactionPin ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                    />
                    <button type="button" onClick={() => setShowPin(!showPin)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)" }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        {showPin
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                  {errors.transactionPin && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "5px" }}>{errors.transactionPin}</p>}
                </div>
                {form.transactionPin && (
                  <FieldInput label="Confirm PIN" id="confirmPin" type="password" placeholder="Repeat PIN"
                    value={form.confirmPin} onChange={set("confirmPin")} error={errors.confirmPin} />
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            {step > 0 && (
              <button type="button" onClick={prevStep}
                style={{ flex: 1, padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep}
                style={{ flex: 2, padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 24px rgba(26,86,219,0.4)" }}>
                Continue →
              </button>
            ) : (
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: "16px", borderRadius: "14px", border: "none", background: loading ? "rgba(26,86,219,0.6)" : "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 24px rgba(26,86,219,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? (
                  <><svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" /><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating account…</>
                ) : "Open Account"}
              </button>
            )}
          </div>

          {step === 0 && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                <span style={{ color: "rgba(148,163,184,0.5)", fontSize: "13px", whiteSpace: "nowrap" }}>already have an account?</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              </div>
              <Link to="/signin" className="w-full flex items-center justify-center font-semibold"
                style={{ padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,18,40,0.7)", color: "#E2E8F0", textDecoration: "none", fontSize: "15px" }}>
                Sign In
              </Link>
            </>
          )}

          <p className="text-center mt-6" style={{ color: "rgba(148,163,184,0.5)", fontSize: "12px", lineHeight: 1.6 }}>
            By opening an account, you agree to our{" "}
            <a href="#" style={{ color: "#60A5FA", textDecoration: "none" }}>Terms of Service</a> &amp;{" "}
            <a href="#" style={{ color: "#60A5FA", textDecoration: "none" }}>Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
}
