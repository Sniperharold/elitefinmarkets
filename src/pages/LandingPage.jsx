import Navbar from '../components/Navbar.jsx'
import HeroSection from '../components/HeroSection.jsx'
import StrategiesSection from '../components/StrategiesSection.jsx'
import WhyChooseUs from '../components/WhyChooseUs.jsx'
import BuiltForOwners from '../components/BuiltForOwners.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Testimonials from '../components/Testimonials.jsx'
import FAQSection from '../components/FAQSection.jsx'
import CTASection from '../components/CTASection.jsx'
import Footer from '../components/Footer.jsx'

const divider = {
  height: '1px',
  background: 'linear-gradient(90deg,transparent,#1E2A47 30%,#1E2A47 70%,transparent)',
  maxWidth: '72rem',
  margin: '0 auto',
}

function Divider() {
  return <div style={divider} />
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark font-inter">
      <Navbar />
      <HeroSection />
      <Divider />
      <StrategiesSection />
      <Divider />
      <WhyChooseUs />
      <Divider />
      <BuiltForOwners />
      <Divider />
      <HowItWorks />
      <Divider />
      <Testimonials />
      <Divider />
      <FAQSection />
      <Divider />
      <CTASection />
      <Footer />
    </div>
  )
}
