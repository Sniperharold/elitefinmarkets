import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import DepositPage from "./pages/DepositPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CardsPage from "./pages/CardsPage.jsx";
import RequestCardPage from "./pages/RequestCardPage.jsx";
import TrackCardPage from "./pages/TrackCardPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/request-card" element={<RequestCardPage />} />
        <Route path="/track-card" element={<TrackCardPage />} />
        <Route path="/transfer" element={<TransferPage />} />
      </Routes>
    </AuthProvider>
  );
}
