import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Drum,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Plus,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Phone,
  Info,
  Users,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --crimson:#8B1A1A; --crimson-l:#B22222; --crimson-glow:rgba(139,26,26,.08);
    --gold:#C9A84C; --gold-l:#E2C56A; --gold-glow:rgba(201,168,76,.13);
    --indigo:#3730A3; --indigo-glow:rgba(55,48,163,.07);
    --bg:#FAF7F4; --bg2:#F2EDE6; --surface:#fff;
    --border:rgba(201,168,76,.22); --text:#1C1008; --muted:#7A6555; --subtle:#C4B5A8;
  }
  .dpbk-root{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh}

  /* ── Hero ── */
  .dpbk-hero{background:linear-gradient(135deg,#0a0318 0%,#1a0a2e 45%,#0e0510 100%);
    padding:56px 24px 72px;text-align:center;position:relative;overflow:hidden}
  .dpbk-hero::before{content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse 60% 50% at 20% 30%,rgba(55,48,163,.20) 0%,transparent 55%),
               radial-gradient(ellipse 50% 40% at 80% 70%,rgba(201,168,76,.10) 0%,transparent 55%);pointer-events:none}
  .dpbk-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 15px;border-radius:40px;
    border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.07);
    color:var(--gold-l);font-size:.70rem;font-weight:500;letter-spacing:.20em;text-transform:uppercase;
    margin-bottom:18px;position:relative;z-index:1}
  .dpbk-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.4rem);
    font-weight:700;color:#FDF8F0;position:relative;z-index:1;margin-bottom:10px}
  .dpbk-hero-title em{font-style:italic;color:var(--gold-l)}
  .dpbk-hero-sub{font-size:.90rem;color:rgba(253,248,240,.58);max-width:480px;
    margin:0 auto;line-height:1.7;position:relative;z-index:1}

  /* ── Stepper ── */
  .dpbk-stepper{background:var(--surface);border-bottom:1px solid var(--border);
    padding:24px;position:sticky;top:0;z-index:20}
  .dpbk-stepper-inner{max-width:700px;margin:0 auto;display:flex;align-items:center}
  .dpbk-step{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;position:relative}
  .dpbk-step:not(:last-child)::after{content:'';position:absolute;top:18px;left:calc(50% + 22px);
    right:calc(-50% + 22px);height:1px;background:var(--border)}
  .dpbk-step.done:not(:last-child)::after{background:var(--gold)}
  .dpbk-step-circle{width:36px;height:36px;border-radius:50%;border:2px solid var(--border);
    display:flex;align-items:center;justify-content:center;
    font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:700;
    color:var(--subtle);background:var(--bg);transition:all .3s;position:relative;z-index:1}
  .dpbk-step.active .dpbk-step-circle{border-color:var(--indigo);background:var(--indigo);color:#fff;
    box-shadow:0 0 0 4px var(--indigo-glow)}
  .dpbk-step.done .dpbk-step-circle{border-color:var(--gold);background:var(--gold);color:#fff}
  .dpbk-step-label{font-size:.62rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;
    color:var(--subtle);text-align:center;white-space:nowrap}
  .dpbk-step.active .dpbk-step-label{color:var(--indigo)}
  .dpbk-step.done .dpbk-step-label{color:var(--gold)}

  /* ── Body ── */
  .dpbk-body{max-width:860px;margin:0 auto;padding:48px 24px 96px}
  .dpbk-section-title{font-family:'Cormorant Garamond',serif;
    font-size:1.9rem;font-weight:700;color:var(--text);margin-bottom:6px}
  .dpbk-section-sub{font-size:.85rem;color:var(--muted);font-weight:300;margin-bottom:32px;line-height:1.6}

  /* ── Package Cards (Step 0) ── */
  .dpbk-pkg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
  .dpbk-pkg-card{border:2px solid var(--border);border-radius:12px;padding:22px;cursor:pointer;
    background:var(--surface);position:relative;overflow:hidden;transition:all .25s}
  .dpbk-pkg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--indigo),var(--gold));opacity:0;transition:opacity .25s}
  .dpbk-pkg-card:hover{border-color:rgba(55,48,163,.35);transform:translateY(-2px);
    box-shadow:0 8px 28px rgba(55,48,163,.08)}
  .dpbk-pkg-card:hover::before,.dpbk-pkg-card.selected::before{opacity:1}
  .dpbk-pkg-card.selected{border-color:var(--indigo);
    box-shadow:0 0 0 3px var(--indigo-glow),0 8px 28px rgba(55,48,163,.10)}
  .dpbk-pkg-name{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:700;
    color:var(--text);margin-bottom:8px}
  .dpbk-pkg-price{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;
    color:var(--indigo);margin-bottom:10px}
  .dpbk-pkg-select-ring{position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;
    border:2px solid var(--border);display:flex;align-items:center;justify-content:center;
    transition:all .25s;background:var(--bg)}
  .dpbk-pkg-card.selected .dpbk-pkg-select-ring{background:var(--indigo);border-color:var(--indigo)}
  .dpbk-performer-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
    border-radius:5px;background:var(--indigo-glow);border:1px solid rgba(55,48,163,.14);
    font-size:.72rem;color:var(--indigo);margin:2px}
  .dpbk-performer-count{display:inline-flex;align-items:center;justify-content:center;
    width:18px;height:18px;border-radius:3px;
    background:linear-gradient(135deg,var(--crimson),#9B2335);
    color:#fff;font-size:.62rem;font-weight:700}

  /* ── Form Fields (Step 1) ── */
  .dpbk-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  @media(max-width:640px){.dpbk-form-grid{grid-template-columns:1fr}}
  .dpbk-field{display:flex;flex-direction:column;gap:6px}
  .dpbk-field.full{grid-column:1/-1}
  .dpbk-label{font-size:.75rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;
    color:var(--muted);display:flex;align-items:center;gap:5px}
  .dpbk-label .req{color:var(--crimson)}
  .dpbk-input{padding:11px 14px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    background:var(--surface);font-family:'DM Sans',sans-serif;font-size:.90rem;color:var(--text);
    outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
  .dpbk-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-glow)}
  .dpbk-input::placeholder{color:var(--subtle)}
  .dpbk-textarea{resize:vertical;min-height:90px}
  .dpbk-err{font-size:.75rem;color:var(--crimson);margin-top:2px}
  .dpbk-hint{font-size:.72rem;color:var(--subtle);margin-top:3px;display:flex;align-items:center;gap:4px}

  /* ── Extra Performers (Step 2) ── */
  .dpbk-extra-section{background:rgba(55,48,163,.03);border:1px solid rgba(55,48,163,.12);
    border-radius:10px;padding:20px;margin-bottom:20px}
  .dpbk-extra-title{font-size:.75rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;
    color:var(--indigo);margin-bottom:16px;display:flex;align-items:center;gap:6px}
  .dpbk-extra-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}
  .dpbk-qty-ctrl{display:flex;align-items:center;gap:6px}
  .dpbk-qty-btn{width:28px;height:28px;border-radius:5px;border:1px solid var(--border);
    background:var(--surface);color:var(--text);font-size:1rem;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s}
  .dpbk-qty-btn:hover{border-color:var(--indigo);color:var(--indigo)}
  .dpbk-qty-val{width:32px;text-align:center;font-family:'Cormorant Garamond',serif;
    font-size:1.1rem;font-weight:700;color:var(--text)}
  .dpbk-extra-name{flex:1;font-size:.85rem;color:var(--text)}
  .dpbk-extra-price{font-size:.72rem;color:var(--muted)}

  /* ── Price summary strip ── */
  .dpbk-price-strip{background:linear-gradient(135deg,rgba(55,48,163,.04),rgba(201,168,76,.06));
    border:1px solid rgba(201,168,76,.22);border-radius:10px;
    padding:16px 20px;margin-top:24px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
  .dpbk-price-strip-item{display:flex;flex-direction:column;gap:2px;flex:1;min-width:120px}
  .dpbk-price-strip-label{font-size:.62rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--subtle)}
  .dpbk-price-strip-val{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:var(--text)}
  .dpbk-price-strip-val.total{color:var(--indigo);font-size:1.35rem}
  .dpbk-price-divider{width:1px;background:var(--border);align-self:stretch}

  /* ── Review (Step 3) ── */
  .dpbk-review-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;
    overflow:hidden;margin-bottom:18px}
  .dpbk-review-head{padding:14px 20px;background:linear-gradient(135deg,rgba(55,48,163,.04),rgba(201,168,76,.04));
    border-bottom:1px solid var(--border);display:flex;align-items:center;gap:9px;
    font-size:.72rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .dpbk-review-body{padding:18px 20px}
  .dpbk-review-row{display:flex;align-items:flex-start;justify-content:space-between;
    padding:7px 0;border-bottom:1px solid rgba(201,168,76,.08);gap:16px}
  .dpbk-review-row:last-child{border-bottom:none}
  .dpbk-review-key{font-size:.78rem;color:var(--muted);font-weight:400;white-space:nowrap}
  .dpbk-review-val{font-size:.85rem;color:var(--text);font-weight:500;text-align:right}
  .dpbk-review-total-row{display:flex;justify-content:space-between;align-items:center;
    padding:12px 0;border-top:2px solid rgba(201,168,76,.22);margin-top:8px}
  .dpbk-review-total-label{font-size:.80rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .dpbk-review-total-val{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--indigo)}

  /* ── Nav Buttons ── */
  .dpbk-nav{display:flex;justify-content:space-between;align-items:center;
    margin-top:40px;padding-top:28px;border-top:1px solid var(--border)}
  .dpbk-back-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;
    border-radius:7px;border:1px solid var(--border);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.80rem;font-weight:500;
    letter-spacing:.07em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
  .dpbk-back-btn:hover{border-color:var(--text);color:var(--text)}
  .dpbk-next-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;
    border-radius:7px;border:none;
    background:linear-gradient(135deg,var(--indigo),#4338CA);color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.80rem;font-weight:500;
    letter-spacing:.09em;text-transform:uppercase;cursor:pointer;
    transition:box-shadow .22s,transform .18s}
  .dpbk-next-btn:hover{box-shadow:0 4px 20px rgba(55,48,163,.32);transform:translateY(-1px)}
  .dpbk-next-btn:disabled{opacity:.50;cursor:not-allowed;transform:none}
  .dpbk-spinner{width:44px;height:44px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--gold);animation:dpbkSpin .85s linear infinite;margin:60px auto;display:block}
  @keyframes dpbkSpin{to{transform:rotate(360deg)}}
  .dpbk-info{padding:14px 18px;border-radius:8px;background:rgba(201,168,76,.07);
    border:1px solid rgba(201,168,76,.22);font-size:.82rem;color:var(--muted);
    line-height:1.6;margin-bottom:24px;display:flex;gap:10px;align-items:flex-start}
  .dpbk-preselect-banner{padding:14px 18px;border-radius:8px;
    background:rgba(55,48,163,.05);border:1px solid rgba(55,48,163,.18);
    font-size:.82rem;color:var(--indigo);line-height:1.6;margin-bottom:28px;
    display:flex;gap:10px;align-items:center}
`;

const STEPS = ["Package", "Event", "Extras", "Review"];
const fmt = (n) => new Intl.NumberFormat("en-LK").format(n || 0);

const DancingPackageBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* ── Remote data ── */
  const [packages, setPackages] = useState([]);
  const [performerTypes, setPerformerTypes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  /* ── Form state ── */
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [eventForm, setEventForm] = useState({
    hotelName: "",
    nearestCity: "",
    eventDate: "",
    contactNo: "",
    groomArrivalTime: "",
    poruwaStartTime: "",
    specialNotes: "",
  });
  const [eventErrors, setEventErrors] = useState({});
  const [phonePrefilled, setPhonePrefilled] = useState(false);
  const [extraPerformers, setExtraPerformers] = useState([]);

  /* ── Fetch all data on mount ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [dpRes, ptRes, profileRes] = await Promise.all([
          api.get("/api/public/dancing-packages"),
          api.get("/api/public/performer-types"),
          api.get("/api/profile"),
        ]);

        const pkgList = dpRes.data || [];
        setPackages(pkgList);
        setPerformerTypes(ptRes.data || []);

        const phone = profileRes.data?.phone || "";
        if (phone) {
          setEventForm((p) => ({ ...p, contactNo: phone }));
          setPhonePrefilled(true);
        }

        // Auto-select from navigation state
        const preselectedId = location.state?.preselectedPackageId;
        if (preselectedId) {
          const found = pkgList.find((p) => p.id === preselectedId);
          if (found) {
            setSelectedPkg(found);
            setStep(1);
          }
        }
      } catch {
        toastError("Failed to load data. Please refresh.");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []); // eslint-disable-line

  /* ─── Event form ─── */
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm((p) => ({ ...p, [name]: value }));
    if (eventErrors[name]) setEventErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateEvent = () => {
    const errs = {};
    if (!eventForm.hotelName.trim()) errs.hotelName = "Hotel name is required";
    if (!eventForm.nearestCity.trim()) errs.nearestCity = "City is required";
    if (!eventForm.eventDate) errs.eventDate = "Event date is required";
    else if (new Date(eventForm.eventDate) <= new Date())
      errs.eventDate = "Date must be in the future";
    if (!eventForm.contactNo.trim())
      errs.contactNo = "Contact number is required";
    setEventErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ─── Extra performers ─── */
  const addExtraPerformer = (ptId) => {
    setExtraPerformers((p) => {
      const exists = p.find((x) => x.performerTypeId === ptId);
      if (exists)
        return p.map((x) =>
          x.performerTypeId === ptId ? { ...x, quantity: x.quantity + 1 } : x,
        );
      return [...p, { performerTypeId: ptId, quantity: 1 }];
    });
  };
  const updateExtraQty = (ptId, delta) => {
    setExtraPerformers((p) =>
      p
        .map((x) =>
          x.performerTypeId === ptId
            ? { ...x, quantity: Math.max(0, x.quantity + delta) }
            : x,
        )
        .filter((x) => x.quantity > 0),
    );
  };

  /* ─── Price calculations ─── */
  const basePackagePrice = selectedPkg?.totalPrice || 0;
  const extraPerformersTotal = extraPerformers.reduce((sum, ep) => {
    const pt = performerTypes.find((x) => x.id === ep.performerTypeId);
    return sum + (pt?.pricePerUnit || 0) * ep.quantity;
  }, 0);
  const estimatedTotal = basePackagePrice + extraPerformersTotal;

  /* ─── Navigation ─── */
  const canNext = () => {
    if (step === 0) return !!selectedPkg;
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateEvent()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        dancingPackageId: selectedPkg.id,
        hotelName: eventForm.hotelName,
        nearestCity: eventForm.nearestCity,
        eventDate: eventForm.eventDate,
        contactNo: eventForm.contactNo,
        groomArrivalTime: eventForm.groomArrivalTime || null,
        poruwaStartTime: eventForm.poruwaStartTime || null,
        specialNotes: eventForm.specialNotes || null,
        extraPerformers,
      };

      await api.post("/api/bookings/dancing-packages", payload);
      toastSuccess("Dancing package booking submitted! 🎉");
      navigate("/my-bookings");
    } catch (err) {
      toastError(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData)
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="dpbk-root">
          <div className="dpbk-spinner" />
        </div>
      </>
    );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="dpbk-root">
        {/* ── Hero ── */}
        <section className="dpbk-hero">
          <div className="dpbk-hero-badge">
            <Drum size={12} /> New Booking
          </div>
          <h1 className="dpbk-hero-title">
            Book a <em>Dancing Package</em>
          </h1>
          <p className="dpbk-hero-sub">
            Select your preferred dancing group and fill in event details.
          </p>
        </section>

        {/* ── Stepper ── */}
        <div className="dpbk-stepper">
          <div className="dpbk-stepper-inner">
            {STEPS.map((label, i) => (
              <div
                key={i}
                className={`dpbk-step ${i < step ? "done" : i === step ? "active" : ""}`}
              >
                <div className="dpbk-step-circle">
                  {i < step ? <Check size={15} /> : i + 1}
                </div>
                <span className="dpbk-step-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="dpbk-body">
          {/* ════ STEP 0 — Choose Package ════ */}
          {step === 0 && (
            <>
              <h2 className="dpbk-section-title">
                Choose Your Dancing Package
              </h2>
              <p className="dpbk-section-sub">
                Select the dancing group package that best fits your event.
              </p>
              {packages.length === 0 ? (
                <p
                  style={{
                    color: "var(--muted)",
                    textAlign: "center",
                    padding: "48px 0",
                  }}
                >
                  No dancing packages available at the moment.
                </p>
              ) : (
                <div className="dpbk-pkg-grid">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`dpbk-pkg-card${selectedPkg?.id === pkg.id ? " selected" : ""}`}
                      onClick={() => setSelectedPkg(pkg)}
                    >
                      <div className="dpbk-pkg-select-ring">
                        {selectedPkg?.id === pkg.id && (
                          <Check size={12} color="#fff" />
                        )}
                      </div>
                      <div className="dpbk-pkg-name">{pkg.name}</div>
                      <div className="dpbk-pkg-price">
                        Rs. {fmt(pkg.totalPrice)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                          marginTop: "8px",
                        }}
                      >
                        {pkg.includedPerformers?.map((p) => (
                          <span key={p.id} className="dpbk-performer-chip">
                            <span className="dpbk-performer-count">
                              {p.quantity}
                            </span>
                            {p.name}
                          </span>
                        ))}
                      </div>
                      {pkg.details && (
                        <p
                          style={{
                            fontSize: ".78rem",
                            color: "var(--muted)",
                            marginTop: "10px",
                            lineHeight: "1.5",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {pkg.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ════ STEP 1 — Event Details ════ */}
          {step === 1 && (
            <>
              <h2 className="dpbk-section-title">Event Details</h2>
              <p className="dpbk-section-sub">
                Provide your venue and timing details so we can plan the
                performance.
              </p>

              {selectedPkg && (
                <div className="dpbk-preselect-banner">
                  <Drum size={14} style={{ flexShrink: 0 }} />
                  <span>
                    Selected: <strong>{selectedPkg.name}</strong> — Rs.{" "}
                    {fmt(selectedPkg.totalPrice)}
                  </span>
                </div>
              )}

              <div className="dpbk-form-grid">
                <div className="dpbk-field">
                  <label className="dpbk-label">
                    <MapPin size={12} /> Hotel Name{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    name="hotelName"
                    className="dpbk-input"
                    placeholder="e.g. Cinnamon Grand Colombo"
                    value={eventForm.hotelName}
                    onChange={handleEventChange}
                  />
                  {eventErrors.hotelName && (
                    <p className="dpbk-err">{eventErrors.hotelName}</p>
                  )}
                </div>

                <div className="dpbk-field">
                  <label className="dpbk-label">
                    <MapPin size={12} /> Nearest City{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    name="nearestCity"
                    className="dpbk-input"
                    placeholder="e.g. Colombo"
                    value={eventForm.nearestCity}
                    onChange={handleEventChange}
                  />
                  {eventErrors.nearestCity && (
                    <p className="dpbk-err">{eventErrors.nearestCity}</p>
                  )}
                </div>

                <div className="dpbk-field">
                  <label className="dpbk-label">
                    <Calendar size={12} /> Event Date{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    name="eventDate"
                    type="date"
                    className="dpbk-input"
                    min={new Date().toISOString().split("T")[0]}
                    value={eventForm.eventDate}
                    onChange={handleEventChange}
                  />
                  {eventErrors.eventDate && (
                    <p className="dpbk-err">{eventErrors.eventDate}</p>
                  )}
                </div>

                <div className="dpbk-field">
                  <label className="dpbk-label">
                    <Phone size={12} /> Contact Number{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    name="contactNo"
                    className="dpbk-input"
                    placeholder="e.g. 0771234567"
                    value={eventForm.contactNo}
                    onChange={handleEventChange}
                  />
                  {phonePrefilled && (
                    <p className="dpbk-hint">
                      <Info size={11} /> Auto-filled from your profile.
                    </p>
                  )}
                  {eventErrors.contactNo && (
                    <p className="dpbk-err">{eventErrors.contactNo}</p>
                  )}
                </div>

                <div className="dpbk-field">
                  <label className="dpbk-label">
                    <Clock size={12} /> Groom Arrival Time
                  </label>
                  <input
                    name="groomArrivalTime"
                    type="time"
                    className="dpbk-input"
                    value={eventForm.groomArrivalTime}
                    onChange={handleEventChange}
                  />
                </div>

                <div className="dpbk-field">
                  <label className="dpbk-label">
                    <Clock size={12} /> Poruwa Start Time
                  </label>
                  <input
                    name="poruwaStartTime"
                    type="time"
                    className="dpbk-input"
                    value={eventForm.poruwaStartTime}
                    onChange={handleEventChange}
                  />
                </div>

                <div className="dpbk-field full">
                  <label className="dpbk-label">
                    <FileText size={12} /> Special Notes
                  </label>
                  <textarea
                    name="specialNotes"
                    className="dpbk-input dpbk-textarea"
                    placeholder="Any special requests or notes for the performers..."
                    value={eventForm.specialNotes}
                    onChange={handleEventChange}
                  />
                </div>
              </div>
            </>
          )}

          {/* ════ STEP 2 — Extra Performers ════ */}
          {step === 2 && (
            <>
              <h2 className="dpbk-section-title">Additional Performers</h2>
              <p className="dpbk-section-sub">
                Your chosen package already includes a set of performers. You
                can optionally add more below — these will be added to your
                total price.
              </p>

              {/* Included performers reminder */}
              {selectedPkg?.includedPerformers?.length > 0 && (
                <div className="dpbk-info">
                  <Users
                    size={14}
                    style={{
                      flexShrink: 0,
                      color: "var(--indigo)",
                      marginTop: "2px",
                    }}
                  />
                  <span>
                    <strong>{selectedPkg.name}</strong> already includes:{" "}
                    {selectedPkg.includedPerformers
                      .map((p) => `${p.quantity} × ${p.name}`)
                      .join(", ")}
                    . Add below only if you need more.
                  </span>
                </div>
              )}

              {performerTypes.length > 0 && (
                <div className="dpbk-extra-section">
                  <div className="dpbk-extra-title">
                    <Plus size={12} /> Add Extra Performers
                  </div>
                  {performerTypes.map((pt) => {
                    const existing = extraPerformers.find(
                      (x) => x.performerTypeId === pt.id,
                    );
                    return (
                      <div key={pt.id} className="dpbk-extra-row">
                        <span className="dpbk-extra-name">{pt.name}</span>
                        <span className="dpbk-extra-price">
                          Rs. {fmt(pt.pricePerUnit)} each
                        </span>
                        <div className="dpbk-qty-ctrl">
                          <button
                            className="dpbk-qty-btn"
                            onClick={() =>
                              existing ? updateExtraQty(pt.id, -1) : null
                            }
                          >
                            −
                          </button>
                          <span className="dpbk-qty-val">
                            {existing?.quantity || 0}
                          </span>
                          <button
                            className="dpbk-qty-btn"
                            onClick={() => addExtraPerformer(pt.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Live price strip */}
              <div className="dpbk-price-strip">
                <div className="dpbk-price-strip-item">
                  <span className="dpbk-price-strip-label">Package Price</span>
                  <span className="dpbk-price-strip-val">
                    Rs. {fmt(basePackagePrice)}
                  </span>
                </div>
                {extraPerformersTotal > 0 && (
                  <>
                    <div className="dpbk-price-divider" />
                    <div className="dpbk-price-strip-item">
                      <span className="dpbk-price-strip-label">
                        Extra Performers
                      </span>
                      <span
                        className="dpbk-price-strip-val"
                        style={{ color: "var(--crimson)" }}
                      >
                        + Rs. {fmt(extraPerformersTotal)}
                      </span>
                    </div>
                  </>
                )}
                <div className="dpbk-price-divider" />
                <div className="dpbk-price-strip-item">
                  <span className="dpbk-price-strip-label">
                    Estimated Total
                  </span>
                  <span className="dpbk-price-strip-val total">
                    Rs. {fmt(estimatedTotal)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ════ STEP 3 — Review & Submit ════ */}
          {step === 3 && (
            <>
              <h2 className="dpbk-section-title">Review & Submit</h2>
              <p className="dpbk-section-sub">
                Please review all your details before submitting the booking
                request.
              </p>

              {/* Package */}
              <div className="dpbk-review-card">
                <div className="dpbk-review-head">
                  <Drum size={12} /> Selected Dancing Package
                </div>
                <div className="dpbk-review-body">
                  <div className="dpbk-review-row">
                    <span className="dpbk-review-key">Package</span>
                    <span className="dpbk-review-val">{selectedPkg?.name}</span>
                  </div>
                  <div className="dpbk-review-row">
                    <span className="dpbk-review-key">Package Price</span>
                    <span
                      className="dpbk-review-val"
                      style={{ color: "var(--indigo)" }}
                    >
                      Rs. {fmt(selectedPkg?.totalPrice)}
                    </span>
                  </div>
                  {selectedPkg?.includedPerformers?.length > 0 && (
                    <div className="dpbk-review-row">
                      <span className="dpbk-review-key">
                        Included Performers
                      </span>
                      <span
                        className="dpbk-review-val"
                        style={{ maxWidth: "200px" }}
                      >
                        {selectedPkg.includedPerformers.map((p, index) => (
                          <div key={index}>
                            {p.quantity} × {p.name}
                            {index !==
                              selectedPkg.includedPerformers.length - 1 && ","}
                          </div>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event */}
              <div className="dpbk-review-card">
                <div className="dpbk-review-head">
                  <MapPin size={12} /> Event Details
                </div>
                <div className="dpbk-review-body">
                  {[
                    ["Hotel", eventForm.hotelName],
                    ["City", eventForm.nearestCity],
                    ["Date", eventForm.eventDate],
                    ["Contact", eventForm.contactNo],
                    ["Groom Arrival", eventForm.groomArrivalTime || "—"],
                    ["Poruwa Start", eventForm.poruwaStartTime || "—"],
                    ["Notes", eventForm.specialNotes || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="dpbk-review-row">
                      <span className="dpbk-review-key">{k}</span>
                      <span className="dpbk-review-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra performers */}
              {extraPerformers.length > 0 && (
                <div className="dpbk-review-card">
                  <div className="dpbk-review-head">
                    <Users size={12} /> Extra Performers
                  </div>
                  <div className="dpbk-review-body">
                    {extraPerformers.map((ep) => {
                      const pt = performerTypes.find(
                        (x) => x.id === ep.performerTypeId,
                      );
                      return (
                        <div
                          key={ep.performerTypeId}
                          className="dpbk-review-row"
                        >
                          <span className="dpbk-review-key">
                            {ep.quantity} × {pt?.name}
                          </span>
                          <span
                            className="dpbk-review-val"
                            style={{ color: "var(--crimson)" }}
                          >
                            + Rs. {fmt((pt?.pricePerUnit || 0) * ep.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="dpbk-review-card">
                <div className="dpbk-review-head">💰 Pricing Summary</div>
                <div className="dpbk-review-body">
                  <div className="dpbk-review-row">
                    <span className="dpbk-review-key">Package Price</span>
                    <span className="dpbk-review-val">
                      Rs. {fmt(basePackagePrice)}
                    </span>
                  </div>
                  {extraPerformersTotal > 0 && (
                    <div className="dpbk-review-row">
                      <span className="dpbk-review-key">Extra Performers</span>
                      <span
                        className="dpbk-review-val"
                        style={{ color: "var(--crimson)" }}
                      >
                        + Rs. {fmt(extraPerformersTotal)}
                      </span>
                    </div>
                  )}
                  <div className="dpbk-review-total-row">
                    <span className="dpbk-review-total-label">
                      Estimated Total
                    </span>
                    <span className="dpbk-review-total-val">
                      Rs. {fmt(estimatedTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="dpbk-info">
                ℹ️ &nbsp;After submission, our team will review your request and
                add a transport price. You will then be able to accept or cancel
                the booking.
              </div>
            </>
          )}

          {/* ── Navigation ── */}
          <div className="dpbk-nav">
            <button
              className="dpbk-back-btn"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              style={{ visibility: step === 0 ? "hidden" : "visible" }}
            >
              <ChevronLeft size={15} /> Back
            </button>

            {step < 3 ? (
              <button
                className="dpbk-next-btn"
                onClick={handleNext}
                disabled={!canNext()}
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                className="dpbk-next-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Check size={15} /> Submit Booking
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DancingPackageBooking;
