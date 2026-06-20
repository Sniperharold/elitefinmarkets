import { Link } from "react-router-dom";
import { Icon } from "./Icon";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(6,11,22,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(30,42,71,0.5)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo placeholder */}
          <Link className="mt-4" to="/">
            <Icon.Logo />
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["Strategies", "Pricing", "About", "FAQs"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-brand-text hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="hidden sm:block text-sm text-brand-text hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white px-5 py-2 rounded-lg"
              style={{
                background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                boxShadow:
                  "0 4px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Registration
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
