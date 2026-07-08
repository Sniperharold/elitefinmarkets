const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("efm_admin_token") || localStorage.getItem("efm_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("efm:401"));
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function requestMultipart(path, formData, method = "PATCH") {
  const token = getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, { method, headers, body: formData });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("efm:401"));
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  // ── Auth ──
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  // ── Profile ──
  updateProfile: (body) =>
    request("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),
  updatePassword: (body) =>
    request("/auth/password", { method: "PATCH", body: JSON.stringify(body) }),
  updatePin: (body) =>
    request("/auth/pin", { method: "PATCH", body: JSON.stringify(body) }),
  uploadPhoto: (formData) =>
    requestMultipart("/auth/photo", formData, "PATCH"),

  // ── Wallet ──
  getWallet: () => request("/wallet"),
  getTransactions: () => request("/wallet/transactions"),

  // ── Deposits ──
  getPaymentChannels: () => request("/deposits/channels"),
  createDeposit: (body) =>
    request("/deposits", { method: "POST", body: JSON.stringify(body) }),
  submitCreditCard: (body) =>
    request("/deposits/credit-card", { method: "POST", body: JSON.stringify(body) }),
  getMyDeposits: () => request("/deposits"),
  submitPaymentProof: (id, formData) =>
    requestMultipart(`/deposits/${id}/proof`, formData, "PATCH"),

  // ── Transfer ──
  createTransfer: (body) =>
    request("/transfers", { method: "POST", body: JSON.stringify(body) }),

  // ── Cards ──
  requestCard: (body) =>
    request("/cards/request", { method: "POST", body: JSON.stringify(body) }),
  getMyCard: () => request("/cards/my-card"),

  // ── Support Tickets ──
  getMyTickets: () => request("/support/tickets"),
  getTicket: (id) => request(`/support/tickets/${id}`),
  createTicket: (body) =>
    request("/support/tickets", { method: "POST", body: JSON.stringify(body) }),
  replyToTicket: (id, body) =>
    request(`/support/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  // ── Admin ──
  adminStats: () => request("/admin/stats"),
  adminGetUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/users?${q}`).then((r) => r.users || r);
  },
  adminGetDeposits: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/deposits?${q}`).then((r) => r.deposits || r);
  },
  adminUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/users?${q}`);
  },
  adminDeposits: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/deposits?${q}`);
  },
  adminConfirmDeposit: (id, body = {}) =>
    request(`/admin/deposits/${id}/confirm`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminRejectDeposit: (id, body = {}) =>
    request(`/admin/deposits/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(typeof body === "string" ? { adminNote: body } : body),
    }),
  adminGetChannels: () => request("/admin/channels"),
  adminSetChannel: (body) =>
    request("/admin/channels", { method: "POST", body: JSON.stringify(body) }),
  adminAdjustWallet: (userId, balance, cryptoBalance, note, date, time) =>
    request(`/admin/users/${userId}/wallet-dated`, {
      method: "PATCH",
      body: JSON.stringify({ balance, cryptoBalance, note, ...(date ? { date } : {}), ...(time ? { time } : {}) }),
    }),
  adminWithdrawUser: (userId, body) =>
    request(`/admin/users/${userId}/withdraw`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminTransferUser: (userId, body) =>
    request(`/admin/users/${userId}/transfer`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminGetTransactions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/transactions?${q}`);
  },
  adminGetCreditCards: (userId) => {
    const q = userId ? `?userId=${userId}` : "";
    return request(`/admin/credit-cards${q}`);
  },
  adminSetCodes: (userId, body) =>
    request(`/admin/users/${userId}/codes`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminSetTopupDate: (userId, body) =>
    request(`/admin/users/${userId}/topup-date`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminSetDateJoined: (userId, date) =>
    request(`/admin/users/${userId}/date-joined`, {
      method: "PATCH",
      body: JSON.stringify({ date }),
    }),
  adminGetCardRequests: () => request("/admin/card-requests"),

  // ── Admin Support ──
  adminGetTickets: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/support/tickets?${q}`).then((r) => r.tickets || r);
  },
  adminGetTicket: (id) => request(`/admin/support/tickets/${id}`),
  adminReplyTicket: (id, body) =>
    request(`/admin/support/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),
  adminUpdateTicket: (id, payload) =>
    request(`/admin/support/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(
        typeof payload === "string" ? { status: payload } : payload
      ),
    }),
};

export function saveAuth({ token, user }) {
  if (user?.role === "admin") {
    localStorage.setItem("efm_admin_token", token);
  } else {
    localStorage.setItem("efm_token", token);
  }
  localStorage.setItem("efm_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("efm_token");
  localStorage.removeItem("efm_admin_token");
  localStorage.removeItem("efm_user");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("efm_user") || "null");
  } catch {
    return null;
  }
}
