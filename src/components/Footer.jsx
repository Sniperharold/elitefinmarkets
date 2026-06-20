import { Link } from "react-router-dom";
import { Icon } from "./Icon";

const divider = {
  height: "1px",
  background:
    "linear-gradient(90deg,transparent,#1E2A47 30%,#1E2A47 70%,transparent)",
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg,#060B16,#030711)",
        borderTop: "1px solid #1E2A47",
      }}
      className="pt-12 pb-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Icon.Logo />
            <p className="text-brand-text text-xs leading-relaxed">
              Your trusted digital banking partner for secure, global financial services.
            </p>
          </div>

          {/* Links */}
          {[
            {
              heading: "Banking",
              links: ["Personal Accounts", "Deposits", "Transfers"],
            },
            {
              heading: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Careers"],
            },
            { heading: "Support", links: ["Contact", "FAQs", "Help Center"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-brand-text text-xs hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={divider} className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-xs text-center sm:text-left">
            © 2025 Elitefinmarkets. All rights reserved. Regulated financial services. Member FDIC.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
            <span className="text-brand-muted text-xs">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
