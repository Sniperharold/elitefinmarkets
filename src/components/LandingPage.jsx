import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import RatesSection from "../components/RatesSection.jsx";
import BankingServicesSection from "../components/BankingServicesSection.jsx";
import AccountCTASection from "../components/AccountCTASection.jsx";
import AboutBankSection from "../components/AboutBankSection.jsx";
import Testimonials from "../components/Testimonials.jsx";
import ContactInfoSection from "../components/ContactInfoSection.jsx";
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Navbar />
      <HeroSection />
      <RatesSection />
      <BankingServicesSection />
      <AccountCTASection />
      <AboutBankSection />
      <Testimonials />
      <ContactInfoSection />
      <Footer />
    </div>
  );
}
