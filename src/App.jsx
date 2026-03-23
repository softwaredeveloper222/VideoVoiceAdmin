import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, VIDEOS_BUCKET } from "./supabase";

function VideoThumbnail({ src, onClick }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "metadata";
    video.src = src;

    const handleSeeked = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setReady(true);
      video.removeEventListener("seeked", handleSeeked);
      video.src = "";
    };

    video.addEventListener("loadeddata", () => {
      video.currentTime = 0.1;
    });
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("seeked", handleSeeked);
      video.src = "";
    };
  }, [src]);

  return (
    <div style={d.videoPlaceholder} onClick={onClick}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "cover", display: ready ? "block" : "none" }} />
      <div style={{ ...d.playBtn, position: "absolute" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="none">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      </div>
    </div>
  );
}

const CREDENTIALS = { username: "admin", password: "admin123" };

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      sessionStorage.setItem("vv_auth", "1");
      onLogin();
    } else {
      setError("Invalid username or password");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div style={login.wrapper}>
      <div style={login.glow} />
      <form
        onSubmit={handleSubmit}
        style={{
          ...login.card,
          animation: shaking ? "shake 0.5s ease-in-out" : "fadeIn 0.5s ease",
        }}
      >
        <div style={login.logoWrap}>
          <div style={login.logo}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h1 style={login.title}>VideoVoice</h1>
          <p style={login.subtitle}>Admin Panel</p>
        </div>

        {error && <div style={login.error}>{error}</div>}

        <div style={login.field}>
          <label style={login.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            style={login.input}
            placeholder="Enter username"
            autoFocus
          />
        </div>

        <div style={login.field}>
          <label style={login.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            style={login.input}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" style={login.btn}>
          Sign In
        </button>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

const login = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "url(/img/Blue-AR-space@2x.png)",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.25)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: 380,
    padding: "40px 32px 36px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 16,
    backdropFilter: "blur(24px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  logoWrap: { textAlign: "center", marginBottom: 28 },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "rgba(255,255,255,0.15)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  error: {
    background: "rgba(239,68,68,0.2)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#fecaca",
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    textAlign: "center",
  },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "13px 0",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #818cf8, #6366f1)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
    letterSpacing: "0.02em",
    boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
    transition: "opacity 0.2s",
  },
};

function AdminDashboard({ onLogout }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await supabase
      .from("testimonials")
      .select("*")
      .order(sortBy, { ascending: sortDir === "asc" });

    if (fetchErr) {
      setError(fetchErr.message);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  }, [sortBy, sortDir]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete testimonial from "${item.email}"?\nThis will also delete the video file.`)) return;

    setDeleting(item.id);
    try {
      // Delete from database first
      const { error: delErr } = await supabase.from("testimonials").delete().eq("id", item.id);
      if (delErr) throw delErr;

      // Delete from storage bucket
      if (item.filename) {
        const { error: storageErr } = await supabase.storage.from(VIDEOS_BUCKET).remove([item.filename]);
        if (storageErr) console.warn("Storage delete failed:", storageErr.message);
      }

      setTestimonials((prev) => prev.filter((t) => t.id !== item.id));
      if (playingId === item.id) setPlayingId(null);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
    setDeleting(null);
  };

  const handleDownload = async (item) => {
    try {
      const { data, error: dlErr } = await supabase.storage
        .from(VIDEOS_BUCKET)
        .download(item.filename);
      if (dlErr) throw dlErr;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  const filtered = testimonials.filter(
    (t) =>
      !search ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.filename?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => {
    if (!d) return "\u2014";
    return new Date(d).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={d.app}>
      {/* Sidebar */}
      <aside style={d.sidebar}>
        <div style={d.sidebarTop}>
          <div style={d.sidebarLogo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <span style={d.sidebarBrand}>VideoVoice</span>
          </div>
          <nav style={d.nav}>
            <div style={d.navItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </div>
          </nav>
        </div>
        <button onClick={onLogout} style={d.logoutBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={d.main}>
        <header style={d.header}>
          <div>
            <h1 style={d.title}>Testimonials</h1>
            <p style={d.subtitle}>Manage video testimonials from your customers</p>
          </div>
          <div style={d.statsRow}>
            <div style={d.stat}>
              <span style={d.statNum}>{testimonials.length}</span>
              <span style={d.statLabel}>Total</span>
            </div>
            <div style={d.stat}>
              <span style={{ ...d.statNum, color: "#34d399" }}>{filtered.length}</span>
              <span style={d.statLabel}>Showing</span>
            </div>
          </div>
        </header>

        <div style={d.toolbar}>
          <div style={d.searchWrap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by email or filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={d.searchInput}
            />
          </div>
          <div style={d.sortGroup}>
            <div ref={sortRef} style={{ position: "relative" }}>
              <button onClick={() => setSortOpen((o) => !o)} style={d.select}>
                {sortBy === "created_at" ? "Sort by Date" : "Sort by Email"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, transition: "transform 0.3s", transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {sortOpen && (
                <div style={d.dropdown}>
                  {[{ value: "created_at", label: "Sort by Date" }, { value: "email", label: "Sort by Email" }].map((opt, i) => (
                    <div
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      style={{
                        ...d.dropdownItem,
                        background: sortBy === opt.value ? "rgba(99,102,241,0.25)" : "transparent",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))} style={d.iconBtn} title={sortDir === "asc" ? "Ascending" : "Descending"}>
              {sortDir === "asc" ? "\u2191" : "\u2193"}
            </button>
            <button onClick={fetchTestimonials} style={d.iconBtn} title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>
        </div>

        {error && <div style={d.error}>Error: {error}</div>}

        {loading ? (
          <div style={d.center}>
            <div style={d.spinner} />
            <p style={{ marginTop: 16, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Loading testimonials...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={d.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
              {search ? "No testimonials match your search" : "No testimonials yet"}
            </p>
          </div>
        ) : (
          <div style={d.grid}>
            {filtered.map((item) => (
              <div key={item.id} style={d.card}>
                <div style={d.videoWrap}>
                  {playingId === item.id ? (
                    <video src={item.video_url} controls autoPlay style={d.video} onEnded={() => setPlayingId(null)} />
                  ) : (
                    <VideoThumbnail src={item.video_url} onClick={() => setPlayingId(item.id)} />
                  )}
                </div>

                <div style={d.cardBody}>
                  <div style={d.cardRow}>
                    <div style={d.avatar}>{(item.email?.[0] || "?").toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={d.email}>{item.email}</div>
                      <div style={d.meta}>{formatDate(item.created_at)}</div>
                    </div>
                  </div>
                  <div style={d.filename} title={item.filename}>{item.filename}</div>
                </div>

                <div style={d.cardActions}>
                  <button onClick={() => handleDownload(item)} style={d.downloadBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                    style={{ ...d.deleteBtn, opacity: deleting === item.id ? 0.5 : 1 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    {deleting === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover, a:hover { filter: brightness(1.15); }
        input:focus { border-color: rgba(99,102,241,0.5) !important; }
        input::placeholder { color: rgba(255,255,255,0.4); }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dropItemIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

const d = {
  app: {
    display: "flex",
    minHeight: "100vh",
    backgroundImage: "url(/img/Blue-AR-space@2x.png)",
    backgroundSize: "100% 100%",
    backgroundAttachment: "fixed",
  },
  sidebar: {
    width: 220,
    background: "rgba(0,0,0,0.3)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    padding: "20px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  sidebarTop: {},
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "4px 8px 24px",
  },
  sidebarBrand: { fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", textShadow: "0 1px 4px rgba(0,0,0,0.3)" },
  nav: {},
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.15)",
    color: "#c7d2fe",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
  },
  main: {
    flex: 1,
    padding: "28px 32px 48px",
    minWidth: 0,
    animation: "fadeUp 0.4s ease",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 16,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em", textShadow: "0 1px 4px rgba(0,0,0,0.3)" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  statsRow: { display: "flex", gap: 20 },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 20px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    minWidth: 80,
    backdropFilter: "blur(8px)",
  },
  statNum: { fontSize: 22, fontWeight: 700, color: "#c7d2fe", textShadow: "0 1px 8px rgba(99,102,241,0.4)" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  searchWrap: { flex: 1, minWidth: 240, position: "relative" },
  searchInput: {
    width: "100%",
    padding: "11px 14px 11px 40px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.2s",
  },
  sortGroup: { display: "flex", alignItems: "center", gap: 8 },
  select: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.2s, background 0.2s",
    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    minWidth: "100%",
    background: "rgba(15,10,40,0.92)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "6px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 50,
    animation: "dropIn 0.25s ease",
  },
  dropdownItem: {
    padding: "9px 14px",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background 0.15s",
    animation: "dropItemIn 0.25s ease both",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s",
  },
  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(99,102,241,0.2)",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "border-color 0.2s, transform 0.2s",
    backdropFilter: "blur(16px)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  },
  videoWrap: {
    aspectRatio: "16/9",
    background: "rgba(0,0,0,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  video: { width: "100%", height: "100%", objectFit: "contain" },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundImage: "url(/img/LWYW_card_2.png)",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    transition: "opacity 0.3s",
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    border: "2px solid rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    paddingLeft: 3,
  },
  cardBody: { padding: "16px 18px 10px" },
  cardRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  email: { fontSize: 14, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textShadow: "0 1px 2px rgba(0,0,0,0.2)" },
  meta: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500, marginTop: 2 },
  filename: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "6px 0 2px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  cardActions: { display: "flex", gap: 8, padding: "8px 18px 16px" },
  downloadBtn: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 0",
    borderRadius: 8,
    background: "rgba(99,102,241,0.25)",
    color: "#e0e7ff",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid rgba(99,102,241,0.3)",
    boxShadow: "0 2px 8px rgba(99,102,241,0.2)",
  },
  deleteBtn: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 0",
    borderRadius: 8,
    background: "rgba(239,68,68,0.2)",
    color: "#fecaca",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid rgba(239,68,68,0.25)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("vv_auth") === "1");

  const handleLogout = () => {
    sessionStorage.removeItem("vv_auth");
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
