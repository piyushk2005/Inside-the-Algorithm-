import React, { useEffect, useRef, useState } from "react";

/**
 * Inside the Algorithm — Landing Page
 * Dark, "data/algorithm" aesthetic. Signature element: a living neural-net
 * canvas behind the hero, where node activations pulse and edges brighten
 * to visually foreshadow "watching ML happen."
 */

// ---------- Signature element: animated network canvas ----------
function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height;

    const layers = [4, 6, 6, 3];
    let nodes = [];

    function layout() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      nodes = layers.map((count, li) => {
        const x = (width / (layers.length - 1)) * li;
        return Array.from({ length: count }, (_, ni) => {
          const y = (height / (count + 1)) * (ni + 1);
          return { x, y, phase: Math.random() * Math.PI * 2 };
        });
      });
    }

    layout();
    window.addEventListener("resize", layout);

    let t = 0;
    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);

      // edges
      for (let li = 0; li < nodes.length - 1; li++) {
        for (const a of nodes[li]) {
          for (const b of nodes[li + 1]) {
            const w = (Math.sin(a.phase + b.phase + t * 2) + 1) / 2;
            ctx.strokeStyle = `rgba(61, 217, 196, ${0.04 + w * 0.16})`;
            ctx.lineWidth = 0.6 + w * 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((layer) => {
        layer.forEach((n) => {
          const pulse = (Math.sin(n.phase + t * 2.4) + 1) / 2;
          const r = 3 + pulse * 2.4;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(61, 217, 196, ${0.25 + pulse * 0.55})`;
          ctx.fill();
        });
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.75,
      }}
    />
  );
}

// ---------- Small building blocks ----------
function Badge({ children }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: 0.3,
        color: "#8FE3D3",
        background: "rgba(61,217,196,0.08)",
        border: "1px solid rgba(61,217,196,0.25)",
        borderRadius: 999,
        padding: "5px 12px",
      }}
    >
      {children}
    </span>
  );
}

function DifficultyTag({ level }) {
  const isBeginner = level === "Beginner";
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        color: isBeginner ? "#8FE3D3" : "#E3B15F",
        border: `1px solid ${isBeginner ? "rgba(61,217,196,0.35)" : "rgba(227,177,95,0.35)"}`,
        borderRadius: 4,
        padding: "3px 8px",
      }}
    >
      {level}
    </span>
  );
}

function NodeIcon({ variant }) {
  // small hand-built SVG glyphs echoing the network motif, one per module
  const stroke = "#3ED9C4";
  const common = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none" };

  if (variant === "descent") {
    return (
      <svg {...common}>
        <path d="M3 6 Q10 6 14 16 Q18 26 25 22" stroke={stroke} strokeWidth="1.6" fill="none" />
        <circle cx="14" cy="16" r="2.4" fill={stroke} />
        <circle cx="6" cy="8" r="1.6" fill={stroke} opacity="0.6" />
      </svg>
    );
  }
  if (variant === "boundary") {
    return (
      <svg {...common}>
        <path d="M2 20 Q14 4 26 14" stroke={stroke} strokeWidth="1.6" fill="none" />
        <circle cx="7" cy="10" r="1.8" fill={stroke} />
        <circle cx="11" cy="7" r="1.8" fill={stroke} />
        <circle cx="18" cy="20" r="1.8" fill="#E3B15F" />
        <circle cx="22" cy="16" r="1.8" fill="#E3B15F" />
      </svg>
    );
  }
  if (variant === "overfit") {
    return (
      <svg {...common}>
        <path d="M2 22 C 8 6, 12 24, 16 10 C 20 24, 22 8, 26 20" stroke={stroke} strokeWidth="1.6" fill="none" />
        <path d="M2 18 Q14 10 26 15" stroke="#E3B15F" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
    );
  }
  // neural network
  return (
    <svg {...common}>
      {[6, 14, 22].map((y) => (
        <circle key={"a" + y} cx="5" cy={y} r="1.8" fill={stroke} />
      ))}
      {[4, 14, 24].map((y) => (
        <circle key={"b" + y} cx="14" cy={y} r="1.8" fill={stroke} />
      ))}
      <circle cx="23" cy="14" r="2.2" fill="#E3B15F" />
      {[6, 14, 22].flatMap((y1) =>
        [4, 14, 24].map((y2) => (
          <line key={`${y1}-${y2}`} x1="5" y1={y1} x2="14" y2={y2} stroke={stroke} strokeWidth="0.5" opacity="0.35" />
        ))
      )}
      {[4, 14, 24].map((y1) => (
        <line key={"o" + y1} x1="14" y1={y1} x2="23" y2="14" stroke="#E3B15F" strokeWidth="0.5" opacity="0.35" />
      ))}
    </svg>
  );
}

function ModuleCard({ variant, title, description, difficulty }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#11151C",
        border: `1px solid ${hover ? "rgba(61,217,196,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12,
        padding: "22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "border-color 0.25s ease, transform 0.25s ease",
        transform: hover ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgba(61,217,196,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NodeIcon variant={variant} />
        </div>
        <DifficultyTag level={difficulty} />
      </div>

      <div>
        <h3 style={{ margin: "0 0 6px 0", fontSize: 17, fontWeight: 600, color: "#F1F4F3" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#9BA3AC" }}>{description}</p>
      </div>

      <button
        style={{
          marginTop: 4,
          alignSelf: "flex-start",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12.5,
          letterSpacing: 0.3,
          color: hover ? "#0B0E14" : "#3ED9C4",
          background: hover ? "#3ED9C4" : "transparent",
          border: "1px solid #3ED9C4",
          borderRadius: 6,
          padding: "8px 16px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        Launch →
      </button>
    </div>
  );
}

function ModeToggle() {
  const [guided, setGuided] = useState(true);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#11151C",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 999,
        padding: 4,
        gap: 4,
      }}
    >
      {["Guided Walkthrough", "Free Explore"].map((label, i) => {
        const active = (i === 0) === guided;
        return (
          <button
            key={label}
            onClick={() => setGuided(i === 0)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              color: active ? "#0B0E14" : "#9BA3AC",
              background: active ? "#3ED9C4" : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            {label} {i === 0 ? "mode" : "mode"}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Page ----------
export default function InsideTheAlgorithmLanding() {
  const modules = [
    {
      variant: "descent",
      title: "Gradient descent",
      description: "Watch a ball roll down a loss surface. Push the learning rate too far and see it diverge.",
      difficulty: "Beginner",
    },
    {
      variant: "boundary",
      title: "Decision boundaries",
      description: "Drop points on a plane and watch a classifier carve the space between them, live.",
      difficulty: "Beginner",
    },
    {
      variant: "overfit",
      title: "Overfitting",
      description: "Train and validation curves split apart in real time as a model memorizes noise.",
      difficulty: "Intermediate",
    },
    {
      variant: "network",
      title: "Neural network basics",
      description: "See weights brighten and dim across layers as a small network learns a pattern.",
      difficulty: "Intermediate",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0E14",
        color: "#F1F4F3",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: "linear-gradient(135deg, #3ED9C4, #1D9E75)",
            }}
          />
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: 0.2 }}>Inside the Algorithm</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 13.5, color: "#9BA3AC" }}>
          <a href="#modules" style={{ color: "inherit", textDecoration: "none" }}>Modules</a>
          <a href="#architecture" style={{ color: "inherit", textDecoration: "none" }}>Architecture</a>
        </nav>
      </header>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "88px 48px 96px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <NetworkCanvas />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 22 }}>
            <Badge>SDG 4 · Quality Education</Badge>
          </div>
          <h1
            style={{
              margin: "0 0 18px 0",
              fontSize: "clamp(34px, 5vw, 54px)",
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -0.5,
            }}
          >
            Watch machine learning
            <br />
            <span style={{ color: "#3ED9C4" }}>happen</span> — no code, no setup.
          </h1>
          <p style={{ margin: "0 auto 34px", maxWidth: 520, fontSize: 16.5, lineHeight: 1.6, color: "#9BA3AC" }}>
            Four interactive simulations that turn abstract ML math into something you can drag,
            nudge, and break — right in your browser.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            {["No install", "Runs in browser", "Learn by doing"].map((t, i) => (
              <React.Fragment key={t}>
                {i > 0 && <span style={{ color: "#3A4149", alignSelf: "center" }}>•</span>}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#8FE3D3" }}>
                  {t}
                </span>
              </React.Fragment>
            ))}
          </div>

          <ModeToggle />
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" style={{ padding: "72px 48px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12.5,
              color: "#3ED9C4",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Choose a module
          </p>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600 }}>Four ideas, one at a time</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 18,
          }}
        >
          {modules.map((m) => (
            <ModuleCard key={m.title} {...m} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="architecture"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 13,
          color: "#6B7280",
        }}
      >
        <span>© Inside the Algorithm — built for learners, not for slides.</span>
        <a href="#" style={{ color: "#3ED9C4", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace" }}>
          View architecture diagram →
        </a>
      </footer>
    </div>
  );
}
