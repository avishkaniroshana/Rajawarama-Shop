import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Download, RefreshCw, Users, Calendar, TrendingUp, FileText } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{--cr:#8B1A1A;--cr-g:rgba(139,26,26,.07);--go:#C9A84C;--go-l:#E2C56A;
    --go-g:rgba(201,168,76,.12);--in:#3730A3;--in-g:rgba(55,48,163,.07);
    --gn:#15803D;--gn-g:rgba(21,128,61,.07);--pu:#7C3AED;
    --bg:#FAF7F4;--surf:#fff;--bdr:rgba(201,168,76,.22);
    --tx:#1C1008;--mu:#7A6555;--su:#C4B5A8;}
  .rp-root{font-family:'DM Sans',sans-serif;min-height:100vh;background:var(--bg);padding:28px 28px 80px}
  .rp-head{margin-bottom:24px}
  .rp-title{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--tx);margin:0 0 4px}
  .rp-title span{color:var(--cr)}
  .rp-sub{font-size:.82rem;color:var(--mu);font-weight:300}
  .rp-section-title{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:var(--tx);
    margin:0 0 16px;display:flex;align-items:center;gap:8px}
  .rp-section-title span{color:var(--cr)}

  /* Stat cards */
  .rp-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:28px}
  .rp-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;
    box-shadow:0 2px 0 rgba(201,168,76,.08),0 4px 12px rgba(28,16,8,.03)}
  .rp-stat-num{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:700;line-height:1}
  .rp-stat-label{font-size:.62rem;color:var(--mu);margin-top:3px;letter-spacing:.10em;text-transform:uppercase}

  /* Filter bar */
  .rp-filter-bar{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;
    padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;flex-wrap:wrap;gap:12px}
  .rp-filter-label{font-size:.75rem;font-weight:600;color:var(--mu);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
  .rp-select{padding:7px 12px;border:1px solid var(--bdr);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.82rem;color:var(--tx);
    outline:none;cursor:pointer}
  .rp-select:focus{border-color:var(--go)}
  .rp-date-input{padding:7px 12px;border:1px solid var(--bdr);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.82rem;color:var(--tx);
    outline:none}
  .rp-date-input:focus{border-color:var(--go)}
  .rp-refresh-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;
    border:1px solid var(--bdr);border-radius:7px;background:var(--surf);
    cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.78rem;color:var(--mu);
    transition:all .2s;margin-left:auto}
  .rp-refresh-btn:hover{border-color:var(--go);color:var(--tx)}

  /* Chart grid */
  .rp-chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
  @media(max-width:900px){.rp-chart-grid{grid-template-columns:1fr}}
  .rp-chart-card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:20px;
    box-shadow:0 2px 0 rgba(201,168,76,.08),0 4px 14px rgba(28,16,8,.03)}
  .rp-chart-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;
    color:var(--tx);margin:0 0 16px;display:flex;align-items:center;gap:7px}
  .rp-chart-full{grid-column:1/-1}

  /* CSV downloads */
  .rp-csv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin-bottom:28px}
  .rp-csv-card{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:16px 18px;
    box-shadow:0 2px 0 rgba(201,168,76,.08),0 4px 12px rgba(28,16,8,.03)}
  .rp-csv-name{font-size:.88rem;font-weight:600;color:var(--tx);margin-bottom:4px}
  .rp-csv-desc{font-size:.75rem;color:var(--mu);margin-bottom:12px;line-height:1.5}
  .rp-csv-btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;
    padding:9px 16px;border:none;border-radius:7px;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;
    letter-spacing:.06em;text-transform:uppercase;transition:all .2s}
  .rp-csv-btn.red{background:var(--cr);color:#fff;box-shadow:0 2px 8px rgba(139,26,26,.20)}
  .rp-csv-btn.red:hover{box-shadow:0 4px 16px rgba(139,26,26,.32);transform:translateY(-1px)}
  .rp-csv-btn.indigo{background:var(--in);color:#fff;box-shadow:0 2px 8px rgba(55,48,163,.20)}
  .rp-csv-btn.indigo:hover{box-shadow:0 4px 16px rgba(55,48,163,.32);transform:translateY(-1px)}
  .rp-csv-btn.gold{background:var(--go);color:var(--tx);box-shadow:0 2px 8px rgba(201,168,76,.25)}
  .rp-csv-btn.gold:hover{box-shadow:0 4px 16px rgba(201,168,76,.40);transform:translateY(-1px)}
  .rp-csv-btn.green{background:var(--gn);color:#fff;box-shadow:0 2px 8px rgba(21,128,61,.20)}
  .rp-csv-btn.green:hover{box-shadow:0 4px 16px rgba(21,128,61,.32);transform:translateY(-1px)}
  .rp-csv-btn.purple{background:var(--pu);color:#fff;box-shadow:0 2px 8px rgba(124,58,237,.20)}
  .rp-csv-btn.purple:hover{box-shadow:0 4px 16px rgba(124,58,237,.32);transform:translateY(-1px)}
  .rp-csv-btn:disabled{opacity:.55;cursor:not-allowed;transform:none!important;box-shadow:none!important}

  /* User login table */
  .rp-table-wrap{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;margin-bottom:28px;
    box-shadow:0 2px 0 rgba(201,168,76,.08),0 4px 14px rgba(28,16,8,.03)}
  .rp-table-head{padding:16px 18px;border-bottom:1px solid var(--bdr);
    display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
  .rp-table{width:100%;border-collapse:collapse;font-size:.78rem}
  .rp-table th{padding:9px 12px;text-align:left;font-size:.68rem;font-weight:700;color:var(--mu);
    letter-spacing:.10em;text-transform:uppercase;
    background:linear-gradient(90deg,rgba(201,168,76,.10),rgba(201,168,76,.05));
    border-bottom:1px solid var(--bdr)}
  .rp-table td{padding:8px 12px;border-bottom:1px solid rgba(201,168,76,.08);color:var(--tx)}
  .rp-table tr:last-child td{border-bottom:none}
  .rp-table tr:hover td{background:rgba(201,168,76,.05)}
  .rp-role-badge{display:inline-block;padding:2px 8px;border-radius:40px;font-size:.63rem;font-weight:600}
  .rp-role-badge.ADMIN{background:rgba(55,48,163,.10);color:var(--in);border:1px solid rgba(55,48,163,.22)}
  .rp-role-badge.CUSTOMER{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}

  .rp-spinner{width:40px;height:40px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--go);animation:rpSpin .85s linear infinite;margin:40px auto;display:block}
  @keyframes rpSpin{to{transform:rotate(360deg)}}
`;

const COLORS = {
  PENDING:"#D97706", PRICE_SET:"#3730A3", ACCEPTED_WITH_PRICE:"#15803D",
  APPROVED:"#16A34A", COMPLETED:"#7C3AED", REJECTED:"#8B1A1A", CANCELLED:"#64748B",
};
const STATUS_LABELS = {
  PENDING:"Pending", PRICE_SET:"Price Set", ACCEPTED_WITH_PRICE:"Accepted",
  APPROVED:"Approved", COMPLETED:"Completed", REJECTED:"Rejected", CANCELLED:"Cancelled",
};

const fmt = (n) => n != null ? new Intl.NumberFormat("en-LK").format(n) : "0";
const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})
  : "—";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{ background:"#fff",border:"1px solid rgba(201,168,76,.22)",borderRadius:8,
      padding:"8px 14px",boxShadow:"0 4px 16px rgba(28,16,8,.10)",fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:".78rem",fontWeight:600,color:"#1C1008",margin:0 }}>{name}</p>
      <p style={{ fontSize:".82rem",color:"#8B1A1A",fontFamily:"'Cormorant Garamond',serif",
        fontWeight:700,margin:"2px 0 0" }}>{value} bookings</p>
    </div>
  );
};

/* 
   MAIN COMPONENT
 */
const AdminReportsPage = () => {
  const [period,    setPeriod]    = useState("monthly");
  const [dateFrom,  setDateFrom]  = useState("");
  const [dateTo,    setDateTo]    = useState("");
  const [stats,     setStats]     = useState(null);
  const [logins,    setLogins]    = useState([]);
  const [loginPage, setLoginPage] = useState(1);
  const [loadingStats,  setLoadingStats]  = useState(true);
  const [loadingLogins, setLoadingLogins] = useState(true);
  const [downloading,   setDownloading]   = useState({});
  const loginsPerPage = 10;

  /*  CSS injection  */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-component","admin-reports");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => { if (document.head.contains(tag)) document.head.removeChild(tag); };
  }, []);

  /*  Fetch stats  */
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const params = new URLSearchParams({ period });
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo)   params.append("to",   dateTo);
      const res = await api.get(`/api/admin/reports/stats?${params}`);
      setStats(res.data);
    } catch { toastError("Failed to load report statistics"); }
    finally   { setLoadingStats(false); }
  }, [period, dateFrom, dateTo]);

  /*  Fetch login logs  */
  const fetchLogins = useCallback(async () => {
    setLoadingLogins(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo)   params.append("to",   dateTo);
      const res = await api.get(`/api/admin/reports/logins?${params}`);
      setLogins(res.data || []);
    } catch { toastError("Failed to load login logs"); }
    finally   { setLoadingLogins(false); }
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchLogins(); }, [fetchLogins]);

  /*  CSV download  */
  const downloadCSV = async (type, label) => {
    setDownloading(p => ({ ...p, [type]: true }));
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo)   params.append("to",   dateTo);
      const res = await api.get(
        `/api/admin/reports/${type}/csv?${params}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type:"text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `${type}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toastSuccess(`${label} downloaded!`);
    } catch { toastError(`Failed to download ${label}`); }
    finally { setDownloading(p => ({ ...p, [type]: false })); }
  };

  /*  Derived chart data from stats  */
  const bookingStatusData = stats ? [
    { name:"Special Pkgs",  ...Object.fromEntries(Object.entries(stats.specialByStatus  ||{}).map(([k,v])=>[STATUS_LABELS[k]||k,v])) },
    { name:"Dancing Pkgs",  ...Object.fromEntries(Object.entries(stats.dancingByStatus  ||{}).map(([k,v])=>[STATUS_LABELS[k]||k,v])) },
    { name:"Dress Only",    ...Object.fromEntries(Object.entries(stats.dressOnlyByStatus||{}).map(([k,v])=>[STATUS_LABELS[k]||k,v])) },
  ] : [];

  const specialPieData  = stats ? Object.entries(stats.specialByStatus ||{}).map(([k,v])=>({ name:STATUS_LABELS[k]||k, value:v, color:COLORS[k]||"#999" })).filter(d=>d.value>0) : [];
  const dancingPieData  = stats ? Object.entries(stats.dancingByStatus ||{}).map(([k,v])=>({ name:STATUS_LABELS[k]||k, value:v, color:COLORS[k]||"#999" })).filter(d=>d.value>0) : [];
  const dressOnlyPieData= stats ? Object.entries(stats.dressOnlyByStatus||{}).map(([k,v])=>({ name:STATUS_LABELS[k]||k, value:v, color:COLORS[k]||"#999" })).filter(d=>d.value>0) : [];

  const revenueData = stats?.revenueByPeriod
    ? Object.entries(stats.revenueByPeriod).map(([label,value])=>({ label, value }))
    : [];

  const totalBookings = (stats?.totalSpecial||0) + (stats?.totalDancing||0) + (stats?.totalDressOnly||0);
  const totalRevenue  = (stats?.totalRevenue||0);

  /*  Paginated logins  */
  const loginStart = (loginPage - 1) * loginsPerPage;
  const loginEnd   = loginStart + loginsPerPage;
  const pagedLogins = logins.slice(loginStart, loginEnd);
  const totalLoginPages = Math.ceil(logins.length / loginsPerPage);

  /*  STATUS badge colours for stacked bar  */
  const BAR_KEYS = ["Pending","Price Set","Accepted","Approved","Completed","Rejected","Cancelled"];
  const BAR_COLORS = ["#D97706","#3730A3","#15803D","#16A34A","#7C3AED","#8B1A1A","#64748B"];

  return (
    <div className="rp-root">
      <div className="rp-head">
        <h1 className="rp-title">Reports & <span>Analytics</span></h1>
        <p className="rp-sub">Booking summaries, user activity and CSV exports</p>
      </div>

      {/* Filter bar  */}
      <div className="rp-filter-bar">
        <span className="rp-filter-label">Period:</span>
        <select className="rp-select" value={period} onChange={e=>setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <span className="rp-filter-label" style={{ marginLeft:8 }}>Date Range:</span>
        <input type="date" className="rp-date-input" value={dateFrom}
          onChange={e=>setDateFrom(e.target.value)}/>
        <span style={{ color:"var(--mu)",fontSize:".82rem" }}>to</span>
        <input type="date" className="rp-date-input" value={dateTo}
          onChange={e=>setDateTo(e.target.value)}/>
        {(dateFrom||dateTo) && (
          <button onClick={()=>{ setDateFrom(""); setDateTo(""); }}
            style={{ padding:"6px 12px",border:"1px solid rgba(139,26,26,.22)",borderRadius:7,
              background:"var(--cr-g)",color:"var(--cr)",cursor:"pointer",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif" }}>
            Clear
          </button>
        )}
        <button className="rp-refresh-btn" onClick={()=>{ fetchStats(); fetchLogins(); }}>
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/*  Stat cards  */}
      {loadingStats ? <div className="rp-spinner"/> : stats && (
        <div className="rp-stats">
          {[
            { label:"Total Bookings",   value:totalBookings,          color:"var(--tx)" },
            { label:"Special Packages", value:stats.totalSpecial||0,  color:"var(--cr)" },
            { label:"Dancing Packages", value:stats.totalDancing||0,  color:"var(--in)" },
            { label:"Dress Only",       value:stats.totalDressOnly||0,color:"var(--go)" },
            { label:"Completed",        value:stats.totalCompleted||0,color:"var(--gn)" },
            { label:"Total Revenue",    value:`Rs.${fmt(totalRevenue)}`,color:"var(--cr)" },
            { label:"Total Users",      value:stats.totalUsers||0,    color:"var(--in)" },
            { label:"Active Users",     value:stats.activeUsers||0,   color:"var(--gn)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rp-stat">
              <div className="rp-stat-num" style={{ color }}>{value}</div>
              <div className="rp-stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/*  Charts  */}
      {!loadingStats && stats && (
        <>
          <h2 className="rp-section-title"><TrendingUp size={18} color="var(--go)"/> Booking <span>Status Breakdown</span></h2>

          <div className="rp-chart-grid">
            {/* Special packages pie */}
            <div className="rp-chart-card">
              <p className="rp-chart-title"> Special Packages</p>
              {specialPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={specialPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {specialPieData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend iconType="circle" iconSize={10}
                      formatter={v=><span style={{ fontSize:".72rem",color:"var(--mu)" }}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign:"center",color:"var(--su)",fontSize:".82rem",padding:"40px 0" }}>No data yet</p>}
            </div>

            {/* Dancing packages pie */}
            <div className="rp-chart-card">
              <p className="rp-chart-title"> Dancing Packages</p>
              {dancingPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={dancingPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {dancingPieData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend iconType="circle" iconSize={10}
                      formatter={v=><span style={{ fontSize:".72rem",color:"var(--mu)" }}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign:"center",color:"var(--su)",fontSize:".82rem",padding:"40px 0" }}>No data yet</p>}
            </div>

            {/* Dress-only pie */}
            <div className="rp-chart-card">
              <p className="rp-chart-title"> Dress-Only Bookings</p>
              {dressOnlyPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={dressOnlyPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {dressOnlyPieData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend iconType="circle" iconSize={10}
                      formatter={v=><span style={{ fontSize:".72rem",color:"var(--mu)" }}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign:"center",color:"var(--su)",fontSize:".82rem",padding:"40px 0" }}>No data yet</p>}
            </div>

            {/* Stacked bar — all types comparison */}
            <div className="rp-chart-card">
              <p className="rp-chart-title"> All Types Comparison</p>
              {bookingStatusData.some(d => Object.values(d).some(v=>typeof v==="number"&&v>0)) ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={bookingStatusData} margin={{ left:0,right:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.15)"/>
                    <XAxis dataKey="name" tick={{ fontSize:11, fill:"var(--mu)" }}/>
                    <YAxis tick={{ fontSize:11, fill:"var(--mu)" }} allowDecimals={false}/>
                    <Tooltip/>
                    <Legend iconType="circle" iconSize={9}
                      formatter={v=><span style={{ fontSize:".70rem",color:"var(--mu)" }}>{v}</span>}/>
                    {BAR_KEYS.map((key,i) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={BAR_COLORS[i]} radius={i===BAR_KEYS.length-1?[4,4,0,0]:[0,0,0,0]}/>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign:"center",color:"var(--su)",fontSize:".82rem",padding:"40px 0" }}>No data yet</p>}
            </div>

            {/* Revenue bar chart */}
            {revenueData.length > 0 && (
              <div className="rp-chart-card rp-chart-full">
                <p className="rp-chart-title"> Revenue by {period.charAt(0).toUpperCase()+period.slice(1)} Period</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData} margin={{ left:10,right:10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.15)"/>
                    <XAxis dataKey="label" tick={{ fontSize:11, fill:"var(--mu)" }}/>
                    <YAxis tickFormatter={v=>`Rs.${fmt(v)}`} tick={{ fontSize:11, fill:"var(--mu)" }}/>
                    <Tooltip formatter={v=>[`Rs.${fmt(v)}`,"Revenue"]}/>
                    <Bar dataKey="value" name="Revenue" fill="var(--cr)" radius={[5,5,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}

      {/*  CSV Downloads  */}
      <h2 className="rp-section-title"><Download size={18} color="var(--go)"/> Export <span>CSV Reports</span></h2>
      <div className="rp-csv-grid">
        {[
          { type:"users",                label:"Users Report",             desc:"All registered users with their details, roles and account status.",        cls:"red" },
          { type:"special-bookings",     label:"Special Package Bookings", desc:"All special package booking requests with pricing and status.",             cls:"red" },
          { type:"dancing-bookings",     label:"Dancing Package Bookings", desc:"All dancing package booking requests with pricing and status.",             cls:"indigo" },
          { type:"dress-only-bookings",  label:"Dress-Only Bookings",      desc:"All dress-only booking requests with dress selections and pricing.",        cls:"gold" },
          { type:"logins",              label:"User Login History",        desc:"Login activity log from refresh tokens — email, role and login time.",      cls:"green" },
        ].map(({ type, label, desc, cls }) => (
          <div key={type} className="rp-csv-card">
            <div className="rp-csv-name">{label}</div>
            <div className="rp-csv-desc">{desc}</div>
            <button
              className={`rp-csv-btn ${cls}`}
              disabled={downloading[type]}
              onClick={() => downloadCSV(type, label)}>
              {downloading[type]
                ? "Downloading…"
                : <><Download size={13}/> Download CSV</>}
            </button>
          </div>
        ))}
      </div>

      {/*  Login Logs Table  */}
      <h2 className="rp-section-title"><Users size={18} color="var(--go)"/> User <span>Login History</span></h2>
      <div className="rp-table-wrap">
        <div className="rp-table-head">
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontWeight:700,color:"var(--tx)" }}>
            Recent Logins — {logins.length} records
          </span>
          <button
            style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",
              border:"1px solid var(--bdr)",borderRadius:7,background:"var(--cr)",
              color:"#fff",cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif" }}
            disabled={downloading["logins"]}
            onClick={() => downloadCSV("logins","User Login History")}>
            <Download size={12}/> Export CSV
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          {loadingLogins ? (
            <div className="rp-spinner"/>
          ) : logins.length === 0 ? (
            <p style={{ textAlign:"center",padding:"32px",color:"var(--su)",fontSize:".85rem" }}>No login records found for selected range.</p>
          ) : (
            <table className="rp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Login Time</th>
                  <th>Token Expires</th>
                </tr>
              </thead>
              <tbody>
                {pagedLogins.map((log, i) => (
                  <tr key={i}>
                    <td style={{ color:"var(--su)",fontSize:".72rem" }}>{loginStart + i + 1}</td>
                    <td style={{ fontWeight:500 }}>{log.userFullName}</td>
                    <td style={{ color:"var(--mu)" }}>{log.userEmail}</td>
                    <td>
                      <span className={`rp-role-badge ${log.role}`}>{log.role}</span>
                    </td>
                    <td style={{ color:"var(--mu)",fontSize:".75rem" }}>{fmtDate(log.loginAt)}</td>
                    <td style={{ color:"var(--mu)",fontSize:".75rem" }}>{fmtDate(log.tokenExpiry)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Login table pagination */}
        {logins.length > loginsPerPage && (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"10px 18px",borderTop:"1px solid var(--bdr)",
            background:"rgba(250,247,244,.70)",flexWrap:"wrap",gap:8 }}>
            <span style={{ fontSize:".75rem",color:"var(--mu)" }}>
              Showing <strong>{loginStart+1}–{Math.min(loginEnd,logins.length)}</strong> of <strong>{logins.length}</strong>
            </span>
            <div style={{ display:"flex",gap:6 }}>
              <PagBtn disabled={loginPage===1} onClick={()=>setLoginPage(p=>p-1)}>‹ Prev</PagBtn>
              {Array.from({length:totalLoginPages},(_,i)=>i+1)
                .filter(n=>n===1||n===totalLoginPages||Math.abs(n-loginPage)<=1)
                .reduce((acc,n,i,arr)=>{
                  if(i>0&&n-arr[i-1]>1) acc.push(<span key={`g${n}`} style={{ color:"var(--su)",fontSize:".78rem" }}>…</span>);
                  acc.push(<PagBtn key={n} active={n===loginPage} onClick={()=>setLoginPage(n)}>{n}</PagBtn>);
                  return acc;
                },[])}
              <PagBtn disabled={loginPage===totalLoginPages} onClick={()=>setLoginPage(p=>p+1)}>Next ›</PagBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PagBtn = ({ children, onClick, disabled, active }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ padding:"4px 9px",borderRadius:6,fontSize:".73rem",fontWeight:active?700:400,
        border:"1px solid",cursor:disabled?"not-allowed":"pointer",transition:"all .15s",
        borderColor:active?"#8B1A1A":"rgba(201,168,76,0.25)",
        background:active?"#8B1A1A":h&&!disabled?"rgba(201,168,76,0.12)":"#fff",
        color:active?"#fff":disabled?"#C4B5A8":"#1C1008" }}>
      {children}
    </button>
  );
};

export default AdminReportsPage;
