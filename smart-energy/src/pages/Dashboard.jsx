import { useEffect, useState, useRef } from "react";
import {
  FaBolt, FaChartLine, FaBrain, FaPlug, FaCloudSun, FaTrophy, FaBars,
  FaLeaf, FaStar, FaMedal, FaFire, FaSun, FaBatteryFull, FaThermometerHalf,
  FaTint, FaWind, FaRocket, FaCrown, FaShieldAlt
} from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

import "./Dashboard.css";

const SECTIONS = [
    { id: "metrics",         label: "Overview",      icon: <FaBolt /> },
    { id: "analytics",       label: "Analytics",     icon: <FaChartLine /> },
    { id: "recommendations", label: "AI Tips",       icon: <FaBrain /> },
    { id: "devices",         label: "Devices",       icon: <FaPlug /> },
    { id: "forecast",        label: "Forecast",      icon: <FaCloudSun /> },
    { id: "achievements",    label: "Achievements",  icon: <FaTrophy /> },
  ];

export default function Dashboard() {

  const sections = SECTIONS; // alias for scroll handler

  const RATE = 8; // ₹ per kWh

  const [usage,       setUsage]       = useState(3.2);
  const [carbon,      setCarbon]      = useState(18);
  const [active,      setActive]      = useState("metrics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [barsVisible, setBarsVisible] = useState(false);
  const analyticsRef = useRef(null);

  const weeklyData = [
    { day: "Mon", kwh: 18.2 },
    { day: "Tue", kwh: 22.5 },
    { day: "Wed", kwh: 19.8 },
    { day: "Thu", kwh: 25.1 },
    { day: "Fri", kwh: 21.3 },
    { day: "Sat", kwh: 16.7 },
    { day: "Sun", kwh: 14.9 },
  ];
  const maxKwh = Math.max(...weeklyData.map(d => d.kwh));

  const roomUsage = [
    { room: "Living Room", kwh: 6.2,  pct: 82, color: "#7dffb3" },
    { room: "Bedroom",     kwh: 2.8,  pct: 52, color: "#00c8ff" },
    { room: "Kitchen",     kwh: 4.5,  pct: 68, color: "#aa78ff" },
  ];

  const deviceRanking = [
    { name: "Air Conditioner",  kwh: 1.4, icon: "❄️"  },
    { name: "Induction Stove",  kwh: 1.3, icon: "🔥"  },
    { name: "Refrigerator",     kwh: 1.0, icon: "🧊"  },
    { name: "Heater",           kwh: 0.8, icon: "♨️"  },
    { name: "Microwave",        kwh: 0.8, icon: "📡"  },
    { name: "Smart TV",         kwh: 0.6, icon: "📺"  },
  ];

  const dailyKwh  = parseFloat(usage) * 8;
  const weeklyKwh = 138.5;
  const monthlyKwh = 103;

  const [rooms, setRooms] = useState([
    {
      room: "Living Room",
      icon: "🛋️",
      devices: [
        { id: 1,  name: "Smart TV",       power: "0.6 kWh", battery: 80,  timeUsed: "2h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/1048/1048947.png" },
        { id: 2,  name: "Air Conditioner",power: "1.4 kWh", battery: 100, timeUsed: "4h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png" },
        { id: 3,  name: "Sound System",   power: "0.3 kWh", battery: 95,  timeUsed: "1h",  status: false, img: "https://cdn-icons-png.flaticon.com/512/727/727269.png"   },
        { id: 4,  name: "LED Lights",     power: "0.1 kWh", battery: 100, timeUsed: "5h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png" },
        { id: 5,  name: "Smart Plug",     power: "0.05 kWh",battery: 100, timeUsed: "12h", status: true,  img: "https://cdn-icons-png.flaticon.com/512/1046/1046859.png" },
      ],
    },
    {
      room: "Bedroom",
      icon: "🛏️",
      devices: [
        { id: 6,  name: "Fan",            power: "0.2 kWh", battery: 100, timeUsed: "6h",  status: false, img: "https://cdn-icons-png.flaticon.com/512/2933/2933252.png" },
        { id: 7,  name: "Lamp",           power: "0.1 kWh", battery: 90,  timeUsed: "1h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/1048/1048949.png" },
        { id: 8,  name: "Laptop Charger", power: "0.25 kWh",battery: 75,  timeUsed: "3h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/888/888879.png"   },
        { id: 9,  name: "Air Purifier",   power: "0.35 kWh",battery: 100, timeUsed: "2h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/2965/2965300.png" },
        { id: 10, name: "Heater",         power: "0.8 kWh", battery: 100, timeUsed: "30m", status: false, img: "https://cdn-icons-png.flaticon.com/512/1684/1684375.png" },
      ],
    },
    {
      room: "Kitchen",
      icon: "🍳",
      devices: [
        { id: 11, name: "Refrigerator",   power: "1.0 kWh", battery: 100, timeUsed: "24h", status: true,  img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png" },
        { id: 12, name: "Microwave",      power: "0.8 kWh", battery: 100, timeUsed: "30m", status: false, img: "https://cdn-icons-png.flaticon.com/512/2933/2933248.png" },
        { id: 13, name: "Dishwasher",     power: "0.7 kWh", battery: 100, timeUsed: "1h",  status: true,  img: "https://cdn-icons-png.flaticon.com/512/2933/2933249.png" },
        { id: 14, name: "Coffee Maker",   power: "0.4 kWh", battery: 100, timeUsed: "20m", status: false, img: "https://cdn-icons-png.flaticon.com/512/2933/2933246.png" },
        { id: 15, name: "Induction Stove",power: "1.3 kWh", battery: 100, timeUsed: "45m", status: true,  img: "https://cdn-icons-png.flaticon.com/512/2933/2933247.png" },
      ],
    },
  ]);

  /* LIVE DATA */
  useEffect(() => {
    const interval = setInterval(() => {
      setUsage(u => Math.max(0.5, (parseFloat(u) + (Math.random() * 0.4 - 0.2))).toFixed(2));
      setCarbon(c => c + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* BAR CHART OBSERVER */
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBarsVisible(true);
    }, { threshold: 0.3 });
    if (analyticsRef.current) observer.observe(analyticsRef.current);
    return () => observer.disconnect();
  }, []);

  /* SCROLL DETECTION */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      SECTIONS.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight)
          setActive(sec.id);
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* DEVICE TOGGLE */
  const toggleDevice = (roomIndex, deviceIndex) => {
    setRooms(prev =>
      prev.map((room, rI) =>
        rI !== roomIndex ? room : {
          ...room,
          devices: room.devices.map((dev, dI) =>
            dI !== deviceIndex ? dev : { ...dev, status: !dev.status }
          ),
        }
      )
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const efficiencyScore = 87;
  const co2Saved = carbon;

  return (
    <div className="dashboard-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-top">
          <h2 className="logo">🌿<span>SmartEnergy</span></h2>
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><FaBars /></button>
        </div>
        <nav>
          {sections.map(item => (
            <a key={item.id} href={`#${item.id}`} className={active === item.id ? "active" : ""}>
              {item.icon}<span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="dashboard">

        {/* HEADER */}
        <header className="dash-header">
          <div>
            <h1>Energy Dashboard</h1>
            <p>Live overview of your smart energy system</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </header>

        {/* ══════════════════════════════
            SECTION 1 — METRICS
        ══════════════════════════════ */}
        <section id="metrics" className="metrics">
          {[
            { label: "⚡ Current Usage",      value: `${usage} kWh`, sub: "Real-time consumption",  glow: "glow-green"  },
            { label: "📅 Weekly Total",        value: "24.8 kWh",     sub: "↓ 6% vs last week",     glow: "glow-blue"   },
            { label: "📊 Monthly Usage",       value: "103 kWh",      sub: "Efficiency +9%",         glow: "glow-purple" },
            { label: "🌱 Carbon Saved",        value: `${carbon} kg`, sub: "CO₂ reduction",          glow: "glow-green"  },
            { label: "🔌 Connected Devices",   value: rooms.reduce((a, r) => a + r.devices.length, 0), sub: "Smart devices", glow: "glow-blue" },
            { label: "🏡 Smart Home Score",    value: "87%",          sub: "Top 18% of homes",      glow: "glow-purple" },
          ].map((c, i) => (
            <div key={i} className={`metric-card ${c.glow}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <h3>{c.label}</h3>
              <span>{c.value}</span>
              <p>{c.sub}</p>
            </div>
          ))}
        </section>

        {/* ══════════════════════════════
            SECTION 2 — ANALYTICS
        ══════════════════════════════ */}
        <section id="analytics" className="analytics" ref={analyticsRef}>
          <h2 className="section-title">📈 Energy Analytics</h2>

          <div className="analytics-grid">

            {/* Weekly bar chart */}
            <div className="panel span-2">
              <h4>📊 Weekly Energy Trend (kWh)</h4>
              <div className="bar-chart-v2">
                {weeklyData.map((d, i) => (
                  <div key={d.day} className="bar-col">
                    <span className="bar-label-top">{d.kwh}</span>
                    <div
                      className="bar"
                      style={{
                        height: barsVisible ? `${(d.kwh / maxKwh) * 100}%` : "0%",
                        transitionDelay: `${i * 0.08}s`,
                      }}
                    />
                    <span className="bar-day">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly comparison */}
            <div className="panel">
              <h4>📅 Monthly Comparison</h4>
              <div className="month-compare">
                <div className="month-row">
                  <span>This Month</span>
                  <div className="month-bar"><div className="month-fill this" style={{ width: "72%" }} /></div>
                  <b>103 kWh</b>
                </div>
                <div className="month-row">
                  <span>Last Month</span>
                  <div className="month-bar"><div className="month-fill last" style={{ width: "80%" }} /></div>
                  <b>113 kWh</b>
                </div>
              </div>
              <p className="badge-chip green">↓ 8.8% improvement</p>
            </div>

            {/* Room-wise usage */}
            <div className="panel">
              <h4>🏠 Room-wise Usage</h4>
              {roomUsage.map(r => (
                <div key={r.room} className="room-usage-row">
                  <div className="room-usage-label">
                    <span>{r.room}</span><b>{r.kwh} kWh</b>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Device ranking */}
            <div className="panel">
              <h4>⚡ Top Energy Consumers</h4>
              {deviceRanking.map((d, i) => (
                <div key={d.name} className="rank-row">
                  <span className="rank-num">#{i + 1}</span>
                  <span className="rank-icon">{d.icon}</span>
                  <span className="rank-name">{d.name}</span>
                  <span className="rank-kwh">{d.kwh} kWh</span>
                </div>
              ))}
            </div>

            {/* Energy Cost */}
            <div className="panel cost-panel">
              <h4>💰 Energy Cost (₹{RATE}/kWh)</h4>
              <div className="cost-grid">
                <div className="cost-box">
                  <span>Daily</span>
                  <b>₹{(dailyKwh * RATE).toFixed(0)}</b>
                </div>
                <div className="cost-box">
                  <span>Weekly</span>
                  <b>₹{(weeklyKwh * RATE).toFixed(0)}</b>
                </div>
                <div className="cost-box highlight">
                  <span>Monthly Est.</span>
                  <b>₹{(monthlyKwh * RATE).toFixed(0)}</b>
                </div>
              </div>
            </div>

            {/* Efficiency score */}
            <div className="panel score-panel">
              <h4>🏆 Energy Efficiency Score</h4>
              <div className="score-ring-wrap">
                <svg className="score-ring" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" className="ring-bg" />
                  <circle
                    cx="60" cy="60" r="50"
                    className="ring-fill"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - efficiencyScore / 100)}`}
                  />
                </svg>
                <div className="score-label">
                  <b>{efficiencyScore}%</b>
                  <span>Score</span>
                </div>
              </div>
              <p className="badge-chip green">Better than 82% of homes</p>
            </div>

            {/* Peak usage + Savings */}
            <div className="panel">
              <h4>🔴 Peak Usage Detection</h4>
              <p className="ai-text">
                AI detected peak consumption between <b>7 PM – 10 PM</b>.
                Shifting loads outside peak window could reduce bill by <b>₹180/month</b>.
              </p>
              <div className="ai-highlight">⚠️ Peak window active now</div>
            </div>

            <div className="panel saving-panel">
              <h4>💡 Energy Saving Potential</h4>
              <p className="ai-text">
                AI predicts you can reduce <b>12% energy</b> and save
                <b> ₹650/month</b> by optimising device schedules.
              </p>
              <div className="saving-bar-wrap">
                <div className="saving-bar" />
                <span>12% reduction target</span>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════
            SECTION 3 — AI RECOMMENDATIONS
        ══════════════════════════════ */}
        <section id="recommendations" className="recommendations">
          <h2 className="section-title">🧠 AI Energy Intelligence</h2>
          <div className="rec-grid">
            {[
              { icon: "🔋", title: "Battery Optimisation",   text: "Charge during 11 AM – 2 PM solar peak to increase efficiency by 14%." },
              { icon: "⚡", title: "Smart Load Balancing",   text: "Run heavy appliances during low-demand hours to cut costs." },
              { icon: "🌞", title: "Solar Utilisation",      text: "Tomorrow's solar output can power 82% of your home devices." },
              { icon: "💡", title: "Lighting Optimisation",  text: "Turning off unused lights saves 6 kWh weekly." },
              { icon: "📊", title: "Behavioural Insight",    text: "Your habits are more efficient than 82% of smart homes." },
              { icon: "🌍", title: "Sustainability Goal",    text: "Continuing this pattern cuts CO₂ by 180 kg/year." },
            ].map((r, i) => (
              <div key={i} className="rec-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="rec-icon">{r.icon}</div>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════
            SECTION 4 — DEVICES
        ══════════════════════════════ */}
        <section id="devices" className="devices-panel">
          <h2 className="section-title">🔌 Device Control</h2>
          {rooms.map((room, rIndex) => (
            <div key={rIndex} className="room-section">
              <h3 className="room-title">{room.icon} {room.room}</h3>
              <div className="device-grid">
                {room.devices.map((device, dIndex) => (
                  <div key={device.id} className={`device-card ${device.status ? "on" : "off"}`}>
                    <div className="device-card-inner">
                      <img src={device.img} alt={device.name} className="device-img" />
                      <div className="device-info">
                        <h4>{device.name}</h4>
                        <p>⚡ {device.power}</p>
                        <p>🕐 {device.timeUsed}</p>
                        <p>🔋 {device.battery}%</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={device.status} onChange={() => toggleDevice(rIndex, dIndex)} />
                      <span className="slider" />
                    </label>
                    <span className={`device-status-badge ${device.status ? "s-on" : "s-off"}`}>
                      {device.status ? "● ON" : "○ OFF"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ══════════════════════════════
            SECTION 5 — FORECAST
        ══════════════════════════════ */}
        <section id="forecast" className="forecast">
          <h2 className="section-title">🌦 Energy Forecast &amp; Scheduling</h2>
          <div className="forecast-grid">

            <div className="forecast-card float-card">
              <div className="fc-icon">☀️</div>
              <h4>Solar Generation</h4>
              <p className="fc-value green">+18%</p>
              <p className="fc-sub">Expected tomorrow</p>
            </div>

            <div className="forecast-card float-card" style={{ animationDelay: "0.1s" }}>
              <div className="fc-icon">🌤</div>
              <h4>Weather Impact</h4>
              <p className="fc-value blue">Partly Cloudy</p>
              <p className="fc-sub">Solar eff. ~74%</p>
            </div>

            <div className="forecast-card float-card" style={{ animationDelay: "0.2s" }}>
              <div className="fc-icon">📈</div>
              <h4>Energy Demand</h4>
              <p className="fc-value purple">22.4 kWh</p>
              <p className="fc-sub">Peak at 8 PM</p>
            </div>

            <div className="forecast-card float-card" style={{ animationDelay: "0.3s" }}>
              <div className="fc-icon">🔋</div>
              <h4>Battery Window</h4>
              <p className="fc-value green">11 AM – 2 PM</p>
              <p className="fc-sub">Best charging time</p>
            </div>

            <div className="forecast-card float-card" style={{ animationDelay: "0.4s" }}>
              <div className="fc-icon">💸</div>
              <h4>Cost Forecast</h4>
              <p className="fc-value">₹{(22.4 * RATE).toFixed(0)}</p>
              <p className="fc-sub">Estimated tomorrow</p>
            </div>

            <div className="forecast-card schedule-card float-card" style={{ animationDelay: "0.5s" }}>
              <h4>🗓 Smart Scheduling</h4>
              <div className="schedule-list">
                {[
                  { device: "Washing Machine", time: "1:00 PM", icon: "🫧" },
                  { device: "EV Charging",      time: "12:00 PM", icon: "🚗" },
                  { device: "Dishwasher",       time: "2:30 PM", icon: "🍽️" },
                  { device: "Water Heater",     time: "6:00 AM", icon: "🚿" },
                ].map(s => (
                  <div key={s.device} className="schedule-row">
                    <span>{s.icon} {s.device}</span>
                    <span className="schedule-time">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════
            SECTION 6 — ACHIEVEMENTS
        ══════════════════════════════ */}
        <section id="achievements" className="achievements">
          <h2 className="section-title">🏆 Achievements &amp; Gamification</h2>

          {/* Badges */}
          <h3 className="sub-title">Badges</h3>
          <div className="badge-row">
            {[
              { label: "🌱 Eco Saver",         glow: "g-green"  },
              { label: "⚡ Energy Optimizer",  glow: "g-blue"   },
              { label: "🔥 Peak Reducer",      glow: "g-orange" },
              { label: "🌞 Solar Champion",    glow: "g-yellow" },
              { label: "💡 Smart Lighting Pro",glow: "g-cyan"   },
              { label: "🔋 Battery Genius",    glow: "g-purple" },
              { label: "📊 Data Driven Home",  glow: "g-blue"   },
              { label: "🌍 Sustainability Hero",glow: "g-green"  },
            ].map((b, i) => (
              <span key={i} className={`badge ${b.glow}`}>{b.label}</span>
            ))}
          </div>

          {/* Milestone */}
          <h3 className="sub-title">Milestone Progress</h3>
          <div className="milestone-grid">
            {[
              { label: "Bronze Saver 🥉", target: 10,  color: "#cd7f32" },
              { label: "Silver Saver 🥈", target: 50,  color: "#c0c0c0" },
              { label: "Gold Saver 🥇",   target: 100, color: "#ffd700" },
            ].map(m => (
              <div key={m.label} className="milestone-card" style={{ "--mc": m.color }}>
                <h4>{m.label}</h4>
                <p>{Math.min(co2Saved, m.target)} / {m.target} kg CO₂</p>
                <div className="ms-track">
                  <div className="ms-fill" style={{ width: `${Math.min(100, (co2Saved / m.target) * 100)}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Sustainability impact */}
          <h3 className="sub-title">Sustainability Impact</h3>
          <div className="impact-row">
            <div className="impact-card">
              <span className="impact-big">🌳</span>
              <b>{Math.round(co2Saved / 1.5)} Trees</b>
              <p>equivalent planted</p>
            </div>
            <div className="impact-card">
              <span className="impact-big">🚗</span>
              <b>{co2Saved * 4} km</b>
              <p>less car emissions</p>
            </div>
            <div className="impact-card">
              <span className="impact-big">💧</span>
              <b>{co2Saved * 2} L</b>
              <p>water saved</p>
            </div>
            <div className="impact-card">
              <span className="impact-big">☀️</span>
              <b>{(co2Saved * 0.35).toFixed(1)} kWh</b>
              <p>solar offset</p>
            </div>
          </div>

          {/* Ranking + Challenge */}
          <div className="rank-challenge-row">
            <div className="panel rank-panel">
              <FaCrown className="crown-icon" />
              <h4>Home Ranking</h4>
              <p className="rank-pct">Top <b>18%</b></p>
              <p className="rank-sub">energy efficient homes</p>
            </div>
            <div className="panel challenge-panel">
              <FaRocket className="rocket-icon" />
              <h4>Monthly Challenge</h4>
              <p>Reduce energy usage by <b>10%</b> this month</p>
              <div className="prog-track" style={{ marginTop: "12px" }}>
                <div className="prog-fill" style={{ width: "64%", background: "#7dffb3" }} />
              </div>
              <span className="badge-chip green" style={{ marginTop: "10px", display: "inline-block" }}>64% complete</span>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
