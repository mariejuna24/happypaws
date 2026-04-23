import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    id: "01",
    emoji: "👋",
    title: "Introduction",
    color: "#ff914d",
    content: [
      {
        type: "intro",
        value: "Welcome to HappyPaws — your trusted online pet grooming booking platform. This manual covers everything you need to get started and make the most out of our services."
      },
      { type: "subtitle", value: "What You Can Do" },
      { type: "bullets", value: [
        "Browse available grooming services",
        "Create an account and log in securely",
        "Book grooming appointments for your pets",
        "Add multiple pets to a single booking",
        "Choose add-on services for extra care",
        "View and track your booking status",
        "Rate and review completed services"
      ]},
      { type: "subtitle", value: "System Requirements" },
      { type: "table", value: [
        ["Browser", "Chrome, Firefox, Safari, or Edge (latest)"],
        ["Internet", "Active internet connection required"],
        ["Device", "Desktop, laptop, tablet, or mobile"],
        ["Account", "Valid email address to register"]
      ]}
    ]
  },
  {
    id: "02",
    emoji: "🚀",
    title: "Getting Started",
    color: "#e67e3a",
    content: [
      { type: "subtitle", value: "Creating an Account" },
      { type: "steps", value: [
        "Go to HappyPaws and click the Login button on the navigation bar.",
        "Click 'Sign up here' at the bottom of the login form.",
        "Fill in your Full Name, Email Address, and Password.",
        "Click 'Sign Up' — you'll be redirected to the homepage automatically."
      ]},
      { type: "note", value: "Your password must be at least 6 characters long." },
      { type: "subtitle", value: "Logging In" },
      { type: "steps", value: [
        "Click the Login button on the navigation bar.",
        "Enter your registered Email and Password.",
        "Click 'Login' to access your account."
      ]},
      { type: "subtitle", value: "Logging Out" },
      { type: "text", value: "Click the user icon or menu on the navigation bar and select 'Logout' to safely sign out of your account." }
    ]
  },
  {
    id: "03",
    emoji: "✂️",
    title: "Our Services",
    color: "#d4691e",
    content: [
      { type: "text", value: "HappyPaws offers three grooming packages carefully designed for your pet's needs:" },
      { type: "service-cards", value: [
        { name: "Basic Hygiene Grooming", price: "₱300", desc: "Nail trimming, ear cleaning, and sanitary area care." },
        { name: "Basic Full Grooming", price: "₱450", desc: "Bath, blow dry, full haircut, nail trimming, and ear cleaning." },
        { name: "Custom Haircut Full Grooming", price: "₱520", desc: "Premium grooming with a customized haircut tailored to your pet." }
      ]},
      { type: "note", value: "Go to the Services page and click any service card to see its full description and inclusions." }
    ]
  },
  {
    id: "04",
    emoji: "📅",
    title: "Booking an Appointment",
    color: "#ff914d",
    content: [
      { type: "subtitle", value: "Step 1 — Select Add-ons (Optional)" },
      { type: "table", value: [
        ["Anal Sac Gland Expression", "₱350"],
        ["Ear Cleaning / Plucking", "₱350"],
        ["PAWdicure (Nail Clip & File)", "₱350"],
        ["Teeth Cleaning", "₱350"]
      ]},
      { type: "subtitle", value: "Step 2 — Choose Date & Time" },
      { type: "bullets", value: [
        "Date must be today or a future date.",
        "Time must be between 8:00 AM and 6:00 PM.",
        "You cannot have two bookings on the same date."
      ]},
      { type: "subtitle", value: "Step 3 — Fill In Your Details" },
      { type: "table", value: [
        ["Full Name", "Your complete name for the appointment"],
        ["Phone", "Format: 09XXXXXXXXX or +639XXXXXXXXX"],
        ["Email", "Your valid email address"],
        ["Pet Name", "e.g., Bruno"],
        ["Species / Breed", "e.g., Shih Tzu, Persian Cat"]
      ]},
      { type: "note", value: "You can add up to 5 pets per booking. Each pet is charged the base service price separately." },
      { type: "subtitle", value: "Confirming Your Booking" },
      { type: "text", value: "Click 'Confirm & Schedule' to finalize. A popup will show your booking summary with a unique Reference Number — keep this for your records." }
    ]
  },
  {
    id: "05",
    emoji: "📋",
    title: "Managing Bookings",
    color: "#e67e3a",
    content: [
      { type: "text", value: "Access all your bookings anytime via 'My Bookings' in the navigation bar." },
      { type: "subtitle", value: "Booking Tabs" },
      { type: "table", value: [
        ["Current", "Bookings with Pending or Confirmed status"],
        ["History", "Bookings with Success or Cancelled status"]
      ]},
      { type: "subtitle", value: "Booking Statuses" },
      { type: "status-list", value: [
        { status: "Pending", color: "#f59e0b", desc: "Submitted and awaiting admin confirmation." },
        { status: "Confirmed", color: "#3b82f6", desc: "Appointment confirmed by the admin." },
        { status: "Success", color: "#22c55e", desc: "Grooming session completed." },
        { status: "Cancelled", color: "#ef4444", desc: "Booking has been cancelled." }
      ]},
      { type: "note", value: "Cancellations within 8 hours of your appointment will incur a fee equal to the service rate. No-shows are charged the full rate." }
    ]
  },
  {
    id: "06",
    emoji: "⭐",
    title: "Ratings & Reviews",
    color: "#d4691e",
    content: [
      { type: "text", value: "After your appointment is marked as 'Success', you can leave a rating and feedback to help us improve." },
      { type: "steps", value: [
        "Go to My Bookings → click the 'History' tab.",
        "Find your completed booking and scroll to the rating section.",
        "Click on the stars (1–5) to choose your rating.",
        "Optionally type a comment (max 300 characters).",
        "Click 'Submit Review' to save your feedback."
      ]},
      { type: "note", value: "You can only rate a booking once. Ratings cannot be changed after submission." }
    ]
  },
  {
    id: "07",
    emoji: "💰",
    title: "Pricing",
    color: "#ff914d",
    content: [
      { type: "table", value: [
        ["Basic Hygiene Grooming", "₱300"],
        ["Basic Full Grooming", "₱450"],
        ["Custom Haircut Full Grooming", "₱520"],
        ["Each Add-on", "₱350"]
      ]},
      { type: "note", value: "All prices include 12% VAT. Multiple pets are charged per pet at the base rate. Prices may change without prior notice." },
      { type: "subtitle", value: "Example Calculation" },
      { type: "calculation", value: {
        label: "Basic Hygiene Grooming × 2 pets + Teeth Cleaning",
        rows: [
          ["Base (₱300 × 2)", "₱600"],
          ["Add-on", "₱350"],
          ["Total", "₱950"]
        ]
      }}
    ]
  },
  {
    id: "08",
    emoji: "🔧",
    title: "Troubleshooting",
    color: "#e67e3a",
    content: [
      { type: "subtitle", value: "Cannot Log In" },
      { type: "bullets", value: [
        "Make sure you're using the correct email and password.",
        "Check that Caps Lock is not turned on.",
        "Contact HappyPaws support if you've forgotten your password."
      ]},
      { type: "subtitle", value: "Booking Not Showing" },
      { type: "bullets", value: [
        "Refresh the My Bookings page.",
        "Ensure you're logged into the correct account.",
        "Check both the Current and History tabs."
      ]},
      { type: "subtitle", value: "Cannot Select a Date" },
      { type: "bullets", value: [
        "Past dates are disabled — choose today or a future date.",
        "If you already have a booking that day, choose a different date."
      ]}
    ]
  },
  {
    id: "09",
    emoji: "📞",
    title: "Contact & Support",
    color: "#d4691e",
    content: [
      { type: "text", value: "Our team is happy to help! Reach out through any of the following:" },
      { type: "contact-cards", value: [
        { icon: "📧", label: "Email", value: "support@happypaws.com" },
        { icon: "🕐", label: "Hours", value: "Mon–Sat, 8:00 AM – 6:00 PM" },
        { icon: "📘", label: "Facebook", value: "fb.com/happypawsgrooming" }
      ]}
    ]
  }
];

function renderContent(content) {
  return content.map((item, i) => {
    if (item.type === "intro") return (
      <p key={i} style={{ fontSize: "15px", color: "#555", lineHeight: "1.8", marginBottom: "20px", borderLeft: "3px solid #ff914d", paddingLeft: "14px" }}>
        {item.value}
      </p>
    );

    if (item.type === "text") return (
      <p key={i} style={{ fontSize: "14px", color: "#555", lineHeight: "1.75", marginBottom: "14px" }}>
        {item.value}
      </p>
    );

    if (item.type === "subtitle") return (
      <p key={i} style={{ fontSize: "13px", fontWeight: "700", color: "#ff914d", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "20px", marginBottom: "8px" }}>
        {item.value}
      </p>
    );

    if (item.type === "note") return (
      <div key={i} style={{
        background: "linear-gradient(135deg, #fff8f4, #fff3ec)",
        border: "1px solid #ffd4b3",
        borderLeft: "4px solid #ff914d",
        borderRadius: "10px",
        padding: "12px 16px",
        margin: "14px 0",
        fontSize: "13px",
        color: "#7a4419",
        display: "flex",
        gap: "8px"
      }}>
        <span>📌</span>
        <span>{item.value}</span>
      </div>
    );

    if (item.type === "bullets") return (
      <ul key={i} style={{ paddingLeft: "0", listStyle: "none", margin: "8px 0 14px" }}>
        {item.value.map((b, j) => (
          <li key={j} style={{ display: "flex", gap: "10px", marginBottom: "6px", alignItems: "flex-start" }}>
            <span style={{ color: "#ff914d", marginTop: "2px", fontSize: "12px" }}>🐾</span>
            <span style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>{b}</span>
          </li>
        ))}
      </ul>
    );

    if (item.type === "steps") return (
      <div key={i} style={{ margin: "8px 0 14px" }}>
        {item.value.map((s, j) => (
          <div key={j} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
            <div style={{
              minWidth: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ff914d, #e67e3a)",
              color: "white", fontSize: "12px", fontWeight: "800",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(255,145,77,0.3)"
            }}>{j + 1}</div>
            <span style={{ fontSize: "14px", color: "#444", lineHeight: "1.7", paddingTop: "4px" }}>{s}</span>
          </div>
        ))}
      </div>
    );

    if (item.type === "table") return (
      <div key={i} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #ffe5d0", margin: "8px 0 14px" }}>
        {item.value.map((row, j) => (
          <div key={j} style={{
            display: "grid", gridTemplateColumns: "1fr 2fr",
            backgroundColor: j % 2 === 0 ? "#fff8f4" : "#ffffff",
            borderBottom: j < item.value.length - 1 ? "1px solid #ffe5d0" : "none"
          }}>
            <div style={{ padding: "10px 14px", fontSize: "13px", fontWeight: "600", color: "#7a4419", borderRight: "1px solid #ffe5d0" }}>{row[0]}</div>
            <div style={{ padding: "10px 14px", fontSize: "13px", color: "#555" }}>{row[1]}</div>
          </div>
        ))}
      </div>
    );

    if (item.type === "service-cards") return (
      <div key={i} style={{ display: "grid", gap: "10px", margin: "8px 0 14px" }}>
        {item.value.map((s, j) => (
          <div key={j} style={{
            background: "linear-gradient(135deg, #fff8f4, #ffffff)",
            border: "1px solid #ffe5d0",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start"
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#2d2d2d" }}>{s.name}</p>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>{s.desc}</p>
            </div>
            <span style={{
              background: "linear-gradient(135deg, #ff914d, #e67e3a)",
              color: "white", fontWeight: "800", fontSize: "13px",
              padding: "4px 12px", borderRadius: "20px", whiteSpace: "nowrap"
            }}>{s.price}</span>
          </div>
        ))}
      </div>
    );

    if (item.type === "status-list") return (
      <div key={i} style={{ display: "grid", gap: "8px", margin: "8px 0 14px" }}>
        {item.value.map((s, j) => (
          <div key={j} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
              backgroundColor: s.color + "20", color: s.color, minWidth: "90px", textAlign: "center"
            }}>{s.status}</span>
            <span style={{ fontSize: "13px", color: "#555" }}>{s.desc}</span>
          </div>
        ))}
      </div>
    );

    if (item.type === "calculation") return (
      <div key={i} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #ffe5d0", margin: "8px 0 14px" }}>
        <div style={{ background: "#ff914d", padding: "8px 14px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "white", fontWeight: "600" }}>{item.value.label}</p>
        </div>
        {item.value.rows.map((row, j) => (
          <div key={j} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            backgroundColor: j === item.value.rows.length - 1 ? "#fff3ec" : j % 2 === 0 ? "#fff8f4" : "#ffffff",
            borderBottom: j < item.value.rows.length - 1 ? "1px solid #ffe5d0" : "none",
            fontWeight: j === item.value.rows.length - 1 ? "700" : "400"
          }}>
            <div style={{ padding: "10px 14px", fontSize: "13px", color: "#7a4419", borderRight: "1px solid #ffe5d0" }}>{row[0]}</div>
            <div style={{ padding: "10px 14px", fontSize: "13px", color: "#2d2d2d" }}>{row[1]}</div>
          </div>
        ))}
      </div>
    );

    if (item.type === "contact-cards") return (
      <div key={i} style={{ display: "grid", gap: "10px", margin: "8px 0 14px" }}>
        {item.value.map((c, j) => (
          <div key={j} style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "linear-gradient(135deg, #fff8f4, #ffffff)",
            border: "1px solid #ffe5d0", borderRadius: "12px", padding: "14px 16px"
          }}>
            <span style={{ fontSize: "24px" }}>{c.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: "700", color: "#ff914d", textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#2d2d2d", fontWeight: "600" }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    );

    return null;
  });
}

export default function UserManual() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("01");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const current = sections.find(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fdf2e9 0%, #fff8f4 50%, #ffe5d0 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.4s ease"
    }}>

      {/* ── Top Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #ff914d, #e67e3a)",
        padding: "0",
        boxShadow: "0 4px 20px rgba(255,145,77,0.3)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "rgba(255,255,255,0.2)", border: "none",
                borderRadius: "50%", width: "36px", height: "36px",
                cursor: "pointer", color: "white", fontSize: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)"
              }}
            >←</button>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.1em" }}>HappyPaws</p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "white" }}>🐾 User Manual</p>
            </div>
          </div>
          <a href="/HappyPaws_User_Manual.docx" download style={{ textDecoration: "none" }}>
            <button style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "20px", padding: "8px 16px", color: "white",
              fontSize: "12px", fontWeight: "600", cursor: "pointer",
              backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: "6px"
            }}>
              ⬇ Download PDF
            </button>
          </a>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px" }}>

        {/* ── Sidebar Navigation ── */}
        <div style={{ position: "sticky", top: "24px", alignSelf: "start" }}>
          <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(255,145,77,0.1)",
            border: "1px solid #ffe5d0", overflow: "hidden"
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #ffe5d0" }}>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: "700", color: "#ff914d", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contents</p>
            </div>
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    width: "100%", border: "none", textAlign: "left",
                    padding: "11px 16px", cursor: "pointer",
                    background: isActive ? "linear-gradient(135deg, #fff3ec, #fff8f4)" : "transparent",
                    borderLeft: isActive ? "3px solid #ff914d" : "3px solid transparent",
                    display: "flex", alignItems: "center", gap: "10px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{section.emoji}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "10px", color: isActive ? "#ff914d" : "#bbb", fontWeight: "700" }}>{section.id}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: isActive ? "#2d2d2d" : "#666", fontWeight: isActive ? "700" : "400" }}>{section.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div key={activeSection} style={{
          background: "white", borderRadius: "20px",
          boxShadow: "0 4px 32px rgba(255,145,77,0.1)",
          border: "1px solid #ffe5d0", overflow: "hidden",
          animation: "fadeIn 0.3s ease"
        }}>
          {/* Section Header */}
          <div style={{
            background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
            padding: "28px 32px",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", right: "-20px", top: "-20px",
              fontSize: "120px", opacity: "0.12", lineHeight: 1
            }}>{current.emoji}</div>
            <p style={{ margin: "0 0 4px", fontSize: "12px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Section {current.id}
            </p>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white", lineHeight: 1.2 }}>
              {current.emoji} {current.title}
            </h1>
          </div>

          {/* Section Body */}
          <div style={{ padding: "28px 32px" }}>
            {renderContent(current.content)}
          </div>

          {/* Navigation Footer */}
          <div style={{
            padding: "16px 32px", borderTop: "1px solid #fff3ec",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#fffaf7"
          }}>
            {(() => {
              const idx = sections.findIndex(s => s.id === activeSection);
              const prev = sections[idx - 1];
              const next = sections[idx + 1];
              return (
                <>
                  {prev ? (
                    <button onClick={() => setActiveSection(prev.id)} style={{
                      background: "none", border: "1px solid #ffe5d0", borderRadius: "10px",
                      padding: "8px 14px", cursor: "pointer", fontSize: "13px", color: "#ff914d",
                      fontWeight: "600", display: "flex", alignItems: "center", gap: "6px"
                    }}>← {prev.emoji} {prev.title}</button>
                  ) : <div />}
                  {next ? (
                    <button onClick={() => setActiveSection(next.id)} style={{
                      background: "linear-gradient(135deg, #ff914d, #e67e3a)",
                      border: "none", borderRadius: "10px",
                      padding: "8px 14px", cursor: "pointer", fontSize: "13px", color: "white",
                      fontWeight: "600", display: "flex", alignItems: "center", gap: "6px",
                      boxShadow: "0 2px 8px rgba(255,145,77,0.3)"
                    }}>{next.emoji} {next.title} →</button>
                  ) : (
                    <div style={{ fontSize: "13px", color: "#ff914d", fontWeight: "600" }}>🐾 End of Manual</div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}