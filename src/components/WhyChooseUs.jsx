import SectionLabel from "./SectionLabel.jsx";

const features = [
  {
    icon: "🔒",
    title: "Bank-Grade Security",
    desc: "256-bit SSL encryption, 2FA, and real-time fraud monitoring keep your funds safe around the clock.",
    iconColor: "#34D399",
  },
  {
    icon: "🌍",
    title: "Global Transfers",
    desc: "Send and receive money in 180+ countries via SWIFT, SEPA, ACH, or crypto — with zero hidden fees.",
    iconColor: "#60A5FA",
  },
  {
    icon: "💳",
    title: "Multi-Currency Accounts",
    desc: "Hold balances in USD, GBP, EUR, CAD and more. Switch currencies instantly.",
    iconColor: "#FBBF24",
  },
  {
    icon: "⚡",
    title: "Instant Deposits",
    desc: "Fund your account via bank transfer, USDT, Bitcoin, or PayPal — confirmed within minutes.",
    iconColor: "#C084FC",
  },
  {
    icon: "🎧",
    title: "24/7 Support",
    desc: "Our dedicated support team is available any time to help with your account, transfers, or deposits.",
    iconColor: "#34D399",
  },
  {
    icon: "📱",
    title: "Mobile-First Banking",
    desc: "Open your account, check balances, and make transfers from any device — no branch visit needed.",
    iconColor: "#60A5FA",
  },
];

const cardStyle = {
  background: "linear-gradient(135deg,rgba(15,22,41,0.9),rgba(21,28,52,0.8))",
  border: "1px solid rgba(30,42,71,0.8)",
  boxShadow:
    "0 0 40px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
};

export default function WhyChooseUs() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel>Why Choose Us</SectionLabel>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-10">
          Why Customers Choose Elitefinmarkets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-5 flex items-start gap-4"
              style={cardStyle}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(37,99,235,0.15),rgba(124,58,237,0.1))",
                  border: "1px solid rgba(37,99,235,0.2)",
                }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-brand-text text-xs sm:text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
