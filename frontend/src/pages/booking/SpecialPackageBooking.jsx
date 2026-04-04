import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Shirt,
  Drum,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  User,
  Users,
  Crown,
  Phone,
  Info,
  AlertCircle,
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
  .bk-root{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh}
  .bk-hero{background:linear-gradient(135deg,#1a0505 0%,#3b0a0a 45%,#1a0a02 100%);
    padding:56px 24px 72px;text-align:center;position:relative;overflow:hidden}
  .bk-hero::before{content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse 70% 60% at 20% 30%,rgba(201,168,76,.13) 0%,transparent 60%),
               radial-gradient(ellipse 50% 40% at 80% 70%,rgba(139,26,26,.28) 0%,transparent 60%);pointer-events:none}
  .bk-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 15px;border-radius:40px;
    border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.07);
    color:var(--gold-l);font-size:.70rem;font-weight:500;letter-spacing:.20em;text-transform:uppercase;
    margin-bottom:18px;position:relative;z-index:1}
  .bk-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.4rem);
    font-weight:700;color:#FDF8F0;position:relative;z-index:1;margin-bottom:10px}
  .bk-hero-title em{font-style:italic;color:var(--gold-l)}
  .bk-hero-sub{font-size:.90rem;color:rgba(253,248,240,.58);max-width:480px;
    margin:0 auto;line-height:1.7;position:relative;z-index:1}
  .bk-stepper{background:var(--surface);border-bottom:1px solid var(--border);
    padding:24px;position:sticky;top:0;z-index:20}
  .bk-stepper-inner{max-width:800px;margin:0 auto;display:flex;align-items:center;gap:0}
  .bk-step{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;position:relative}
  .bk-step:not(:last-child)::after{content:'';position:absolute;top:18px;left:calc(50% + 22px);
    right:calc(-50% + 22px);height:1px;background:var(--border)}
  .bk-step.done:not(:last-child)::after{background:var(--gold)}
  .bk-step-circle{width:36px;height:36px;border-radius:50%;border:2px solid var(--border);
    display:flex;align-items:center;justify-content:center;
    font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:700;
    color:var(--subtle);background:var(--bg);transition:all .3s;position:relative;z-index:1}
  .bk-step.active .bk-step-circle{border-color:var(--crimson);background:var(--crimson);color:#fff;
    box-shadow:0 0 0 4px var(--crimson-glow)}
  .bk-step.done .bk-step-circle{border-color:var(--gold);background:var(--gold);color:#fff}
  .bk-step-label{font-size:.62rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;
    color:var(--subtle);text-align:center;white-space:nowrap}
  .bk-step.active .bk-step-label{color:var(--crimson)}
  .bk-step.done .bk-step-label{color:var(--gold)}
  .bk-body{max-width:860px;margin:0 auto;padding:48px 24px 96px}
  .bk-section-title{font-family:'Cormorant Garamond',serif;
    font-size:1.9rem;font-weight:700;color:var(--text);margin-bottom:6px}
  .bk-section-sub{font-size:.85rem;color:var(--muted);font-weight:300;margin-bottom:32px;line-height:1.6}
  .bk-pkg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
  .bk-pkg-card{border:2px solid var(--border);border-radius:12px;padding:22px;cursor:pointer;
    background:var(--surface);position:relative;overflow:hidden;
    transition:all .25s cubic-bezier(.4,0,.2,1)}
  .bk-pkg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--crimson),var(--gold));opacity:0;transition:opacity .25s}
  .bk-pkg-card:hover{border-color:rgba(201,168,76,.45);transform:translateY(-2px);
    box-shadow:0 8px 28px rgba(139,26,26,.08)}
  .bk-pkg-card:hover::before,.bk-pkg-card.selected::before{opacity:1}
  .bk-pkg-card.selected{border-color:var(--crimson);
    box-shadow:0 0 0 3px var(--crimson-glow),0 8px 28px rgba(139,26,26,.10)}
  .bk-pkg-name{font-family:'Cormorant Garamond',serif;font-size:1.30rem;font-weight:700;
    color:var(--text);margin-bottom:8px}
  .bk-pkg-price{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;
    color:var(--crimson);margin-bottom:10px}
  .bk-pkg-price span{font-size:.85rem;font-weight:400;color:var(--muted)}
  .bk-pkg-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
  .bk-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:40px;
    font-size:.65rem;font-weight:500;letter-spacing:.05em}
  .bk-badge.coord{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.28);color:#8B6914}
  .bk-badge.pack{background:rgba(139,26,26,.07);border:1px solid rgba(139,26,26,.18);color:var(--crimson)}
  .bk-badge.dance{background:var(--indigo-glow);border:1px solid rgba(55,48,163,.18);color:var(--indigo)}
  .bk-badge.disc{background:rgba(22,163,74,.08);border:1px solid rgba(22,163,74,.22);color:#15803D}
  .bk-pkg-select-ring{position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;
    border:2px solid var(--border);display:flex;align-items:center;justify-content:center;
    transition:all .25s;background:var(--bg)}
  .bk-pkg-card.selected .bk-pkg-select-ring{background:var(--crimson);border-color:var(--crimson)}
  .bk-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  @media(max-width:640px){.bk-form-grid{grid-template-columns:1fr}}
  .bk-field{display:flex;flex-direction:column;gap:6px}
  .bk-field.full{grid-column:1/-1}
  .bk-label{font-size:.75rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;
    color:var(--muted);display:flex;align-items:center;gap:5px}
  .bk-label .req{color:var(--crimson)}
  .bk-input{padding:11px 14px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    background:var(--surface);font-family:'DM Sans',sans-serif;font-size:.90rem;color:var(--text);
    outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
  .bk-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-glow)}
  .bk-input::placeholder{color:var(--subtle)}
  .bk-textarea{resize:vertical;min-height:90px}
  .bk-err{font-size:.75rem;color:var(--crimson);margin-top:2px}
  .bk-hint{font-size:.72rem;color:var(--subtle);margin-top:3px;display:flex;align-items:center;gap:4px}
  .bk-role-section{margin-bottom:32px}
  .bk-role-head{display:flex;align-items:center;justify-content:space-between;
    margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border)}
  .bk-role-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;
    color:var(--text);display:flex;align-items:center;gap:8px}
  .bk-role-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;
    justify-content:center;font-size:.75rem}
  .bk-role-icon.groom{background:rgba(139,26,26,.08);color:var(--crimson)}
  .bk-role-icon.bman{background:var(--indigo-glow);color:var(--indigo)}
  .bk-role-icon.pboy{background:rgba(201,168,76,.10);color:#8B6914}
  .bk-add-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:6px;
    border:1px dashed rgba(201,168,76,.40);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:500;
    color:var(--muted);cursor:pointer;transition:all .2s}
  .bk-add-btn:hover{border-color:var(--gold);color:var(--text);background:var(--gold-glow)}
  .bk-dress-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
  .bk-dress-select{flex:1;padding:10px 12px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    background:var(--surface);font-family:'DM Sans',sans-serif;font-size:.85rem;color:var(--text);
    outline:none;transition:border-color .2s,box-shadow .2s}
  .bk-dress-select:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-glow)}
  .bk-remove-btn{padding:10px;border:1px solid rgba(139,26,26,.20);border-radius:7px;
    background:rgba(139,26,26,.05);color:var(--crimson);cursor:pointer;
    transition:all .2s;flex-shrink:0;display:flex;align-items:center}
  .bk-remove-btn:hover{background:rgba(139,26,26,.12)}
  .bk-role-disabled{background:rgba(201,168,76,.04);border:1px dashed rgba(201,168,76,.22);
    border-radius:10px;padding:16px 20px;margin-bottom:32px;
    display:flex;align-items:center;gap:10px;color:var(--subtle);font-size:.82rem}
  .bk-dress-price-hint{font-size:.75rem;color:var(--crimson);font-weight:600;
    margin-top:4px;margin-bottom:8px;display:flex;align-items:center;gap:4px}
  .bk-dp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:28px}
  .bk-dp-card{border:2px solid var(--border);border-radius:10px;padding:18px;cursor:pointer;
    background:var(--surface);transition:all .25s;position:relative;overflow:hidden}
  .bk-dp-card:hover{border-color:rgba(55,48,163,.35);transform:translateY(-2px)}
  .bk-dp-card.selected{border-color:var(--indigo);
    box-shadow:0 0 0 3px var(--indigo-glow),0 8px 24px rgba(55,48,163,.09)}
  .bk-dp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--indigo),var(--gold));opacity:0;transition:.25s}
  .bk-dp-card.selected::before{opacity:1}
  .bk-dp-name{font-family:'Cormorant Garamond',serif;font-size:1.10rem;font-weight:700;
    color:var(--text);margin-bottom:4px}
  .bk-dp-desc{font-size:.75rem;color:var(--muted);line-height:1.5;margin-bottom:8px;
    display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .bk-dp-price{font-size:.82rem;color:var(--crimson);font-weight:600;margin-bottom:10px}
  .bk-dp-price-adj{font-size:.75rem;font-weight:600;margin-left:6px;padding:2px 7px;border-radius:4px}
  .bk-dp-price-adj.extra{background:rgba(139,26,26,.08);color:var(--crimson)}
  .bk-dp-price-adj.saving{background:rgba(21,128,61,.08);color:#15803D}
  .bk-dp-price-adj.same{background:rgba(201,168,76,.10);color:#8B6914}
  .bk-performer-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
    border-radius:5px;background:var(--indigo-glow);border:1px solid rgba(55,48,163,.14);
    font-size:.72rem;color:var(--indigo);margin:2px}
  .bk-performer-count{display:inline-flex;align-items:center;justify-content:center;
    width:18px;height:18px;border-radius:3px;
    background:linear-gradient(135deg,var(--crimson),#9B2335);
    color:#fff;font-size:.62rem;font-weight:700}
  .bk-extra-section{background:rgba(55,48,163,.03);border:1px solid rgba(55,48,163,.12);
    border-radius:10px;padding:20px;margin-top:8px}
  .bk-extra-title{font-size:.75rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;
    color:var(--indigo);margin-bottom:14px;display:flex;align-items:center;gap:6px}
  .bk-extra-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
  .bk-qty-ctrl{display:flex;align-items:center;gap:6px}
  .bk-qty-btn{width:28px;height:28px;border-radius:5px;border:1px solid var(--border);
    background:var(--surface);color:var(--text);font-size:1rem;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s;flex-shrink:0}
  .bk-qty-btn:hover{border-color:var(--crimson);color:var(--crimson)}
  .bk-qty-val{width:32px;text-align:center;font-family:'Cormorant Garamond',serif;
    font-size:1.1rem;font-weight:700;color:var(--text)}
  .bk-extra-price{font-size:.72rem;color:var(--muted)}
  .bk-price-strip{background:linear-gradient(135deg,rgba(139,26,26,.04),rgba(201,168,76,.06));
    border:1px solid rgba(201,168,76,.22);border-radius:10px;
    padding:16px 20px;margin-top:24px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
  .bk-price-strip-item{display:flex;flex-direction:column;gap:2px;flex:1;min-width:120px}
  .bk-price-strip-label{font-size:.62rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--subtle)}
  .bk-price-strip-val{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:var(--text)}
  .bk-price-strip-val.total{color:var(--crimson);font-size:1.35rem}
  .bk-price-divider{width:1px;background:var(--border);align-self:stretch}
  .bk-review-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;
    overflow:hidden;margin-bottom:18px}
  .bk-review-head{padding:14px 20px;background:linear-gradient(135deg,rgba(139,26,26,.04),rgba(201,168,76,.04));
    border-bottom:1px solid var(--border);display:flex;align-items:center;gap:9px;
    font-size:.72rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .bk-review-body{padding:18px 20px}
  .bk-review-row{display:flex;align-items:flex-start;justify-content:space-between;
    padding:7px 0;border-bottom:1px solid rgba(201,168,76,.08);gap:16px}
  .bk-review-row:last-child{border-bottom:none}
  .bk-review-key{font-size:.78rem;color:var(--muted);font-weight:400;white-space:nowrap}
  .bk-review-val{font-size:.85rem;color:var(--text);font-weight:500;text-align:right}
  .bk-dress-review-item{display:flex;align-items:center;gap:8px;
    padding:6px 0;border-bottom:1px solid rgba(201,168,76,.07)}
  .bk-dress-review-item:last-child{border-bottom:none}
  .bk-dp-review-desc{font-size:.75rem;color:var(--muted);line-height:1.55;margin-top:6px;
    padding:10px 12px;background:rgba(55,48,163,.03);border-radius:6px;
    border:1px solid rgba(55,48,163,.10);white-space:pre-line}
  .bk-review-total-row{display:flex;justify-content:space-between;align-items:center;
    padding:12px 0;border-top:2px solid rgba(201,168,76,.22);margin-top:8px}
  .bk-review-total-label{font-size:.80rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .bk-review-total-val{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--crimson)}
  .bk-nav{display:flex;justify-content:space-between;align-items:center;
    margin-top:40px;padding-top:28px;border-top:1px solid var(--border)}
  .bk-back-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;
    border-radius:7px;border:1px solid var(--border);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.80rem;font-weight:500;
    letter-spacing:.07em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
  .bk-back-btn:hover{border-color:var(--text);color:var(--text)}
  
  .bk-next-btn {
  display:inline-flex; align-items:center; gap:8px; padding:12px 28px;
  border-radius:7px; border:none;
  background: linear-gradient(135deg, #c45000, #e07b00);
  color:#fff;
  font-family:'DM Sans',sans-serif; font-size:.80rem; font-weight:500;
  letter-spacing:.09em; text-transform:uppercase; cursor:pointer;
  position:relative; overflow:hidden; transition:box-shadow .22s,transform .18s;
}
.bk-next-btn::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(135deg,rgba(201,168,76,.22),transparent);
  opacity:0; transition:.22s;
}
.bk-next-btn:hover { box-shadow:0 4px 20px rgba(100,30,0,.45); transform:translateY(-1px); }
.bk-next-btn:hover::after { opacity:1; }
.bk-next-btn:disabled { opacity:.50; cursor:not-allowed; transform:none; }
  
  
  .bk-spinner{width:44px;height:44px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--gold);animation:bkSpin .85s linear infinite;margin:60px auto;display:block}
  @keyframes bkSpin{to{transform:rotate(360deg)}}
  .bk-info{padding:14px 18px;border-radius:8px;background:rgba(201,168,76,.07);
    border:1px solid rgba(201,168,76,.22);font-size:.82rem;color:var(--muted);
    line-height:1.6;margin-bottom:24px;display:flex;gap:10px;align-items:flex-start}
  .bk-preselect-banner{padding:14px 18px;border-radius:8px;
    background:rgba(139,26,26,.05);border:1px solid rgba(139,26,26,.18);
    font-size:.82rem;color:var(--crimson);line-height:1.6;margin-bottom:28px;
    display:flex;gap:10px;align-items:center}
  @media(max-width:600px){
    .bk-stepper-inner{gap:0}.bk-step-label{display:none}
    .bk-pkg-grid,.bk-dp-cards{grid-template-columns:1fr}
  }
`;

const fmt = (n) => new Intl.NumberFormat("en-LK").format(n || 0);
const STEPS = ["Package", "Event", "Dress", "Dancing", "Review"];

const pkgHasBestMen = (pkg) => {
  if (!pkg?.items) return false;
  return pkg.items.some((item) => {
    const n = (item.specialItemTypeName || "").toLowerCase();
    return (
      n.includes("best man") ||
      n.includes("bestman") ||
      n.includes("bestmen") ||
      n.includes("groomsman") ||
      n.includes("groomsmen")
    );
  });
};
const pkgHasPageBoys = (pkg) => {
  if (!pkg?.items) return false;
  return pkg.items.some((item) => {
    const n = (item.specialItemTypeName || "").toLowerCase();
    return n.includes("page boy") || n.includes("pageboy");
  });
};

const SpecialPackageBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* ── Inject CSS once on mount, clean up on unmount (fixes flash on navigation) ── */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-page", "special-package-booking");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => {
      if (document.head.contains(tag)) document.head.removeChild(tag);
    };
  }, []);

  /* ── Remote data ── */
  const [packages, setPackages] = useState([]);
  const [dressItems, setDressItems] = useState([]);
  const [dancingPkgs, setDancingPkgs] = useState([]);
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

  /* Dress */
  const [groomDress, setGroomDress] = useState("");
  const [bestMen, setBestMen] = useState([""]);
  const [pageBoys, setPageBoys] = useState([""]);

  /* Dancing */
  const [defaultDancingPkg, setDefaultDancingPkg] = useState(null);
  const [selectedDancingPkg, setSelectedDancingPkg] = useState(null);

  /* Extra performers */
  const [extraPerformers, setExtraPerformers] = useState([]);

  /* ── Fetch all data on mount ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [pkgsRes, dressRes, dpRes, ptRes, profileRes] = await Promise.all(
          [
            api.get("/api/public/special-packages"),
            api.get("/api/public/dress-items"),
            api.get("/api/public/dancing-packages"),
            api.get("/api/public/performer-types"),
            api.get("/api/profile"),
          ],
        );

        const pkgList = pkgsRes.data || [];
        const dpList = dpRes.data || [];

        setPackages(pkgList);
        setDressItems(dressRes.data || []);
        setDancingPkgs(dpList);
        setPerformerTypes(ptRes.data || []);

        const phone = profileRes.data?.phone || "";
        if (phone) {
          setEventForm((p) => ({ ...p, contactNo: phone }));
          setPhonePrefilled(true);
        }

        const preselectedId = location.state?.preselectedPackageId;
        if (preselectedId) {
          const found = pkgList.find((p) => p.id === preselectedId);
          if (found) {
            const linked = found.linkedDancingPackageId
              ? dpList.find((d) => d.id === found.linkedDancingPackageId) ||
                null
              : null;
            setSelectedPkg(found);
            setDefaultDancingPkg(linked);
            setSelectedDancingPkg(linked);
            if (!pkgHasBestMen(found)) setBestMen([]);
            if (!pkgHasPageBoys(found)) setPageBoys([]);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── When package selected manually (Step 0) ─── */
  const handleSelectPkg = (pkg) => {
    setSelectedPkg(pkg);
    const linked = pkg.linkedDancingPackageId
      ? dancingPkgs.find((d) => d.id === pkg.linkedDancingPackageId) || null
      : null;
    setDefaultDancingPkg(linked);
    setSelectedDancingPkg(linked);
    setGroomDress("");
    setExtraPerformers([]);
    if (!pkgHasBestMen(pkg)) setBestMen([]);
    else setBestMen([""]);
    if (!pkgHasPageBoys(pkg)) setPageBoys([]);
    else setPageBoys([""]);
  };

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

  /* ─── Dress helpers ─── */
  const addBestMan = () => setBestMen((p) => [...p, ""]);
  const removeBestMan = (i) =>
    setBestMen((p) => p.filter((_, idx) => idx !== i));
  const updateBestMan = (i, v) =>
    setBestMen((p) => p.map((x, idx) => (idx === i ? v : x)));
  const addPageBoy = () => setPageBoys((p) => [...p, ""]);
  const removePageBoy = (i) =>
    setPageBoys((p) => p.filter((_, idx) => idx !== i));
  const updatePageBoy = (i, v) =>
    setPageBoys((p) => p.map((x, idx) => (idx === i ? v : x)));

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

  /* -------------------------- Price calculations -------------------------
   *
   *  Mirrors the backend SpecialPackageBookingService.createBooking() formula:
   *
   *  estimatedTotal = basePackagePrice
   *                 + dancingPriceAdjustment     (if different dancing pkg chosen)
   *                 + extraPerformersTotal
   *                 + dressPriceAdjustment        ← NEW: category-based pricing
   *
   *  dressPriceAdjustment = Σ (categoryRolePrice − baseRolePrice)
   *  where baseRolePrice comes from the special package's own items list
   *  (special_item_type "Groom Dressing" = 25000, "Bestmen Dressing" = 15000, etc.)
   * ---------------------------------------------------------------------------- */
  const defaultDancingPrice = defaultDancingPkg?.totalPrice || 0;
  const selectedDancingPrice = selectedDancingPkg?.totalPrice || 0;
  const dancingPriceAdjustment = selectedDancingPrice - defaultDancingPrice;

  const extraPerformersTotal = extraPerformers.reduce((sum, ep) => {
    const pt = performerTypes.find((x) => x.id === ep.performerTypeId);
    return sum + (pt?.pricePerUnit || 0) * ep.quantity;
  }, 0);

  const basePackagePrice = selectedPkg?.finalPrice || 0;

  // Extract base role prices baked into the special package
  const baseGroomPrice =
    selectedPkg?.items?.find((i) =>
      i.specialItemTypeName?.toLowerCase().includes("groom"),
    )?.pricePerUnit ?? 0;

  const baseBestmanPrice =
    selectedPkg?.items?.find((i) => {
      const n = i.specialItemTypeName?.toLowerCase() || "";
      return (
        n.includes("bestmen") || // ← "Bestmen Dressing" in DB
        n.includes("bestman") ||
        n.includes("best man")
      );
    })?.pricePerUnit ?? 0;

  const basePageboyPrice =
    selectedPkg?.items?.find((i) => {
      const n = i.specialItemTypeName?.toLowerCase() || "";
      return n.includes("pageboy") || n.includes("page boy");
    })?.pricePerUnit ?? 0;

  // Calculate dress category price adjustment
  let dressPriceAdjustment = 0;

  if (groomDress && baseGroomPrice > 0) {
    const item = dressItems.find((d) => d.dressItemId === groomDress);
    if (item?.categoryGroomDressPrice) {
      dressPriceAdjustment += item.categoryGroomDressPrice - baseGroomPrice;
    }
  }
  bestMen.filter(Boolean).forEach((id) => {
    if (baseBestmanPrice > 0) {
      const item = dressItems.find((d) => d.dressItemId === id);
      if (item?.categoryBestmanDressPrice) {
        dressPriceAdjustment +=
          item.categoryBestmanDressPrice - baseBestmanPrice;
      }
    }
  });
  pageBoys.filter(Boolean).forEach((id) => {
    if (basePageboyPrice > 0) {
      const item = dressItems.find((d) => d.dressItemId === id);
      if (item?.categoryPageBoyDressPrice) {
        dressPriceAdjustment +=
          item.categoryPageBoyDressPrice - basePageboyPrice;
      }
    }
  });

  const estimatedTotal =
    basePackagePrice +
    dancingPriceAdjustment +
    extraPerformersTotal +
    dressPriceAdjustment;

  /* ─── Helper: get price hint for a dress selection ─── */
  const getDressPriceHint = (dressId, role) => {
    if (!dressId) return null;
    const item = dressItems.find((d) => d.dressItemId === dressId);
    if (!item) return null;
    if (role === "GROOM" && item.categoryGroomDressPrice) {
      const adj = item.categoryGroomDressPrice - baseGroomPrice;
      if (adj === 0)
        return `Rs. ${fmt(item.categoryGroomDressPrice)} (standard)`;
      return `Rs. ${fmt(item.categoryGroomDressPrice)} ${adj > 0 ? `(+Rs. ${fmt(adj)})` : `(−Rs. ${fmt(Math.abs(adj))})`}`;
    }
    if (role === "BEST_MAN" && item.categoryBestmanDressPrice) {
      const adj = item.categoryBestmanDressPrice - baseBestmanPrice;
      if (adj === 0)
        return `Rs. ${fmt(item.categoryBestmanDressPrice)} (standard)`;
      return `Rs. ${fmt(item.categoryBestmanDressPrice)} ${adj > 0 ? `(+Rs. ${fmt(adj)})` : `(−Rs. ${fmt(Math.abs(adj))})`}`;
    }
    if (role === "PAGE_BOY" && item.categoryPageBoyDressPrice) {
      const adj = item.categoryPageBoyDressPrice - basePageboyPrice;
      if (adj === 0)
        return `Rs. ${fmt(item.categoryPageBoyDressPrice)} (standard)`;
      return `Rs. ${fmt(item.categoryPageBoyDressPrice)} ${adj > 0 ? `(+Rs. ${fmt(adj)})` : `(−Rs. ${fmt(Math.abs(adj))})`}`;
    }
    return null;
  };

  /* ─── Navigation ─── */
  const canNext = () => {
    if (step === 0) return !!selectedPkg;
    if (step === 2) return !!groomDress;
    if (step === 3)
      return !!selectedDancingPkg || !selectedPkg?.linkedDancingPackageId;
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateEvent()) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const dressSelections = [];
      if (groomDress)
        dressSelections.push({ role: "GROOM", dressItemId: groomDress });
      bestMen.forEach((id) => {
        if (id) dressSelections.push({ role: "BEST_MAN", dressItemId: id });
      });
      pageBoys.forEach((id) => {
        if (id) dressSelections.push({ role: "PAGE_BOY", dressItemId: id });
      });

      const payload = {
        specialPackageId: selectedPkg.id,
        hotelName: eventForm.hotelName,
        nearestCity: eventForm.nearestCity,
        eventDate: eventForm.eventDate,
        contactNo: eventForm.contactNo,
        groomArrivalTime: eventForm.groomArrivalTime || null,
        poruwaStartTime: eventForm.poruwaStartTime || null,
        specialNotes: eventForm.specialNotes || null,
        dressSelections,
        overrideDancingPackageId:
          selectedDancingPkg?.id !== selectedPkg.linkedDancingPackageId
            ? selectedDancingPkg?.id
            : null,
        extraPerformers,
      };

      await api.post("/api/bookings/special-packages", payload);
      toastSuccess("Booking submitted successfully! ");
      navigate("/my-bookings");
    } catch (err) {
      toastError(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Label helpers ── */
  const dressLabel = (id) =>
    dressItems.find((d) => d.dressItemId === id)?.dressItemName || id;

  const dancingPriceTag = (dp) => {
    if (!selectedPkg?.linkedDancingPackageId) return null;
    if (dp.id === selectedPkg.linkedDancingPackageId)
      return <span className="bk-dp-price-adj same">Included</span>;
    const diff = (dp.totalPrice || 0) - defaultDancingPrice;
    if (diff > 0)
      return <span className="bk-dp-price-adj extra">+ Rs. {fmt(diff)}</span>;
    if (diff < 0)
      return (
        <span className="bk-dp-price-adj saving">
          − Rs. {fmt(Math.abs(diff))}
        </span>
      );
    return <span className="bk-dp-price-adj same">Same Price</span>;
  };

  /* ── Loading ── */
  if (loadingData)
    return (
      <div className="bk-root">
        <div className="bk-spinner" />
      </div>
    );

  const showBestMen = pkgHasBestMen(selectedPkg);
  const showPageBoys = pkgHasPageBoys(selectedPkg);

  return (
    <div className="bk-root">
      {/* ── Hero ── */}
      <section className="bk-hero">
        <div className="bk-hero-badge">
          <Sparkles size={12} /> New Booking
        </div>
        <h1 className="bk-hero-title">
          Book a <em>Special Package</em>
        </h1>
        <p className="bk-hero-sub">
          Fill in each step carefully — your perfect day is being crafted.
        </p>
      </section>

      {/* ── Stepper ── */}
      <div className="bk-stepper">
        <div className="bk-stepper-inner">
          {STEPS.map((label, i) => (
            <div
              key={i}
              className={`bk-step ${i < step ? "done" : i === step ? "active" : ""}`}
            >
              <div className="bk-step-circle">
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className="bk-step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bk-body">
        {/* ════ STEP 0 — Choose Package ════ */}
        {step === 0 && (
          <>
            <h2 className="bk-section-title">Choose Your Package</h2>
            <p className="bk-section-sub">
              Select the special package that best suits your celebration.
            </p>
            {packages.length === 0 ? (
              <p
                style={{
                  color: "var(--muted)",
                  textAlign: "center",
                  padding: "48px 0",
                }}
              >
                No packages available at the moment.
              </p>
            ) : (
              <div className="bk-pkg-grid">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`bk-pkg-card${selectedPkg?.id === pkg.id ? " selected" : ""}`}
                    onClick={() => handleSelectPkg(pkg)}
                  >
                    <div className="bk-pkg-select-ring">
                      {selectedPkg?.id === pkg.id && (
                        <Check size={12} color="#fff" />
                      )}
                    </div>
                    <div className="bk-pkg-name">{pkg.name}</div>
                    <div className="bk-pkg-price">
                      Rs. {fmt(pkg.finalPrice)}
                      {pkg.discountPercent > 0 && (
                        <span>&nbsp;· {pkg.discountPercent}% OFF</span>
                      )}
                    </div>
                    <div className="bk-pkg-badges">
                      {pkg.weddingCoordinationIncluded && (
                        <span className="bk-badge coord">
                          <Crown size={9} /> Coordination
                        </span>
                      )}
                      {pkg.weddingPackagingIncluded && (
                        <span className="bk-badge pack">
                          <Sparkles size={9} /> Packaging
                        </span>
                      )}
                      {pkg.linkedDancingPackageName && (
                        <span className="bk-badge dance">
                          <Drum size={9} /> {pkg.linkedDancingPackageName}
                        </span>
                      )}
                      {pkg.discountPercent > 0 && (
                        <span className="bk-badge disc">
                          ✦ {pkg.discountPercent}% Discount
                        </span>
                      )}
                    </div>
                    {pkg.freeItems?.length > 0 && (
                      <div
                        style={{
                          fontSize: ".72rem",
                          color: "var(--muted)",
                          marginTop: "4px",
                        }}
                      >
                        + {pkg.freeItems.length} free inclusion
                        {pkg.freeItems.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/*  STEP 1 — Event Details  */}
        {step === 1 && (
          <>
            <h2 className="bk-section-title">Event Details</h2>
            <p className="bk-section-sub">
              Tell us about your venue, date and timing.
            </p>
            {selectedPkg && (
              <div className="bk-preselect-banner">
                <Sparkles size={14} style={{ flexShrink: 0 }} />
                <span>
                  Selected package: <strong>{selectedPkg.name}</strong> — Rs.{" "}
                  {fmt(selectedPkg.finalPrice)}
                </span>
              </div>
            )}
            <div className="bk-form-grid">
              <div className="bk-field">
                <label className="bk-label">
                  <MapPin size={12} /> Hotel Name <span className="req">*</span>
                </label>
                <input
                  name="hotelName"
                  className="bk-input"
                  placeholder="e.g. Hill Side Hotel"
                  value={eventForm.hotelName}
                  onChange={handleEventChange}
                />
                {eventErrors.hotelName && (
                  <p className="bk-err">{eventErrors.hotelName}</p>
                )}
              </div>
              <div className="bk-field">
                <label className="bk-label">
                  <MapPin size={12} /> Nearest City{" "}
                  <span className="req">*</span>
                </label>
                <input
                  name="nearestCity"
                  className="bk-input"
                  placeholder="e.g. Badulla"
                  value={eventForm.nearestCity}
                  onChange={handleEventChange}
                />
                {eventErrors.nearestCity && (
                  <p className="bk-err">{eventErrors.nearestCity}</p>
                )}
              </div>
              <div className="bk-field">
                <label className="bk-label">
                  <Calendar size={12} /> Event Date{" "}
                  <span className="req">*</span>
                </label>
                <input
                  name="eventDate"
                  type="date"
                  className="bk-input"
                  min={new Date().toISOString().split("T")[0]}
                  value={eventForm.eventDate}
                  onChange={handleEventChange}
                />
                {eventErrors.eventDate && (
                  <p className="bk-err">{eventErrors.eventDate}</p>
                )}
              </div>
              <div className="bk-field">
                <label className="bk-label">
                  <Phone size={12} /> Contact Number{" "}
                  <span className="req">*</span>
                </label>
                <input
                  name="contactNo"
                  className="bk-input"
                  placeholder="e.g. 0771234567"
                  value={eventForm.contactNo}
                  onChange={handleEventChange}
                />
                {phonePrefilled && (
                  <p className="bk-hint">
                    <Info size={11} /> Auto-filled from your profile.
                  </p>
                )}
                {eventErrors.contactNo && (
                  <p className="bk-err">{eventErrors.contactNo}</p>
                )}
              </div>
              <div className="bk-field">
                <label className="bk-label">
                  <Clock size={12} /> Groom Arrival Time
                </label>
                <input
                  name="groomArrivalTime"
                  type="time"
                  className="bk-input"
                  value={eventForm.groomArrivalTime}
                  onChange={handleEventChange}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">
                  <Clock size={12} /> Poruwa Start Time
                </label>
                <input
                  name="poruwaStartTime"
                  type="time"
                  className="bk-input"
                  value={eventForm.poruwaStartTime}
                  onChange={handleEventChange}
                />
              </div>
              <div className="bk-field full">
                <label className="bk-label">
                  <FileText size={12} /> Special Notes
                </label>
                <textarea
                  name="specialNotes"
                  className="bk-input bk-textarea"
                  placeholder="If you are going to go with Mul Adum, mention Kawani Clothes (Below Part of Mul Adum) color (White / Black / Maroon / Gray / Blue ) "
                  value={eventForm.specialNotes}
                  onChange={handleEventChange}
                />
              </div>
            </div>
          </>
        )}

        {/*  STEP 2 — Dress Selections  */}
        {step === 2 && (
          <>
            <h2 className="bk-section-title">Dress Selections</h2>
            <p className="bk-section-sub">
              Choose traditional attire for each role. Prices vary by category —
              you'll see the price after selecting.
            </p>

            {/* GROOM */}
            <div className="bk-role-section">
              <div className="bk-role-head">
                <div className="bk-role-title">
                  <div className="bk-role-icon groom">
                    <Crown size={14} />
                  </div>
                  Groom{" "}
                  <span style={{ color: "var(--crimson)", fontSize: ".75rem" }}>
                    *
                  </span>
                </div>
              </div>
              <div className="bk-dress-row">
                <select
                  className="bk-dress-select"
                  value={groomDress}
                  onChange={(e) => setGroomDress(e.target.value)}
                >
                  <option value="">— Select a dress item —</option>
                  {dressItems.map((d) => (
                    <option key={d.dressItemId} value={d.dressItemId}>
                      {d.dressItemName} ({d.categoryName})
                    </option>
                  ))}
                </select>
              </div>
              {/*  Price hint  */}
              {groomDress && getDressPriceHint(groomDress, "GROOM") && (
                <p className="bk-dress-price-hint">
                  <Shirt size={12} /> Groom dressing:{" "}
                  {getDressPriceHint(groomDress, "GROOM")}
                </p>
              )}
              {!groomDress && (
                <p className="bk-err">Please select a dress for the Groom</p>
              )}
            </div>

            {/* BEST MEN */}
            {showBestMen ? (
              <div className="bk-role-section">
                <div className="bk-role-head">
                  <div className="bk-role-title">
                    <div className="bk-role-icon bman">
                      <Users size={14} />
                    </div>
                    Best Man / Groomsmen
                    <span
                      style={{
                        fontSize: ".72rem",
                        color: "var(--muted)",
                        fontWeight: 400,
                      }}
                    >
                      &nbsp;(optional)
                    </span>
                  </div>
                  <button className="bk-add-btn" onClick={addBestMan}>
                    <Plus size={12} /> Add Best Man
                  </button>
                </div>
                {bestMen.map((val, i) => (
                  <div key={i}>
                    <div className="bk-dress-row">
                      <select
                        className="bk-dress-select"
                        value={val}
                        onChange={(e) => updateBestMan(i, e.target.value)}
                      >
                        <option value="">— Select a dress item —</option>
                        {dressItems.map((d) => (
                          <option key={d.dressItemId} value={d.dressItemId}>
                            {d.dressItemName} ({d.categoryName})
                          </option>
                        ))}
                      </select>
                      <button
                        className="bk-remove-btn"
                        onClick={() => removeBestMan(i)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {val && getDressPriceHint(val, "BEST_MAN") && (
                      <p className="bk-dress-price-hint">
                        <Shirt size={12} /> Bestman dressing:{" "}
                        {getDressPriceHint(val, "BEST_MAN")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bk-role-disabled">
                <AlertCircle
                  size={15}
                  style={{ flexShrink: 0, color: "var(--subtle)" }}
                />
                <span>
                  <strong>Best Man / Groomsmen</strong> dress selection is not
                  available in your selected package.
                </span>
              </div>
            )}

            {/* PAGE BOYS */}
            {showPageBoys ? (
              <div className="bk-role-section">
                <div className="bk-role-head">
                  <div className="bk-role-title">
                    <div className="bk-role-icon pboy">
                      <User size={14} />
                    </div>
                    Page Boys
                    <span
                      style={{
                        fontSize: ".72rem",
                        color: "var(--muted)",
                        fontWeight: 400,
                      }}
                    >
                      &nbsp;(optional)
                    </span>
                  </div>
                  <button className="bk-add-btn" onClick={addPageBoy}>
                    <Plus size={12} /> Add Page Boy
                  </button>
                </div>
                {pageBoys.map((val, i) => (
                  <div key={i}>
                    <div className="bk-dress-row">
                      <select
                        className="bk-dress-select"
                        value={val}
                        onChange={(e) => updatePageBoy(i, e.target.value)}
                      >
                        <option value="">— Select a dress item —</option>
                        {dressItems.map((d) => (
                          <option key={d.dressItemId} value={d.dressItemId}>
                            {d.dressItemName} ({d.categoryName})
                          </option>
                        ))}
                      </select>
                      <button
                        className="bk-remove-btn"
                        onClick={() => removePageBoy(i)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {val && getDressPriceHint(val, "PAGE_BOY") && (
                      <p className="bk-dress-price-hint">
                        <Shirt size={12} /> Pageboy dressing:{" "}
                        {getDressPriceHint(val, "PAGE_BOY")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bk-role-disabled">
                <AlertCircle
                  size={15}
                  style={{ flexShrink: 0, color: "var(--subtle)" }}
                />
                <span>
                  <strong>Page Boys</strong> dress selection is not available in
                  your selected package.
                </span>
              </div>
            )}
          </>
        )}

        {/*  STEP 3 — Dancing Package  */}
        {step === 3 && (
          <>
            <h2 className="bk-section-title">Dancing Package</h2>
            <p className="bk-section-sub">
              Your selected package includes a default dancing group. You may
              keep it or choose a different one.
            </p>
            {selectedPkg?.linkedDancingPackageName && (
              <div className="bk-info">
                <Drum
                  size={14}
                  style={{
                    flexShrink: 0,
                    color: "var(--gold)",
                    marginTop: "2px",
                  }}
                />
                <span>
                  Your package already includes{" "}
                  <strong>{selectedPkg.linkedDancingPackageName}</strong> at no
                  extra cost.
                </span>
              </div>
            )}
            <div className="bk-dp-cards">
              {dancingPkgs.map((dp) => (
                <div
                  key={dp.id}
                  className={`bk-dp-card${selectedDancingPkg?.id === dp.id ? " selected" : ""}`}
                  onClick={() => setSelectedDancingPkg(dp)}
                >
                  {selectedPkg?.linkedDancingPackageId === dp.id && (
                    <div
                      style={{
                        fontSize: ".62rem",
                        color: "var(--gold)",
                        letterSpacing: ".10em",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Sparkles size={9} /> Included in package
                    </div>
                  )}
                  <div className="bk-dp-name">{dp.name}</div>
                  <div
                    className="bk-dp-price"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                  >
                    Rs. {fmt(dp.totalPrice)}
                    {dancingPriceTag(dp)}
                  </div>
                  {dp.description && (
                    <div className="bk-dp-desc">{dp.description}</div>
                  )}
                  {dp.includedPerformers?.map((p) => (
                    <span key={p.id} className="bk-performer-chip">
                      <span className="bk-performer-count">{p.quantity}</span>
                      {p.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Extra performers */}
            {performerTypes.length > 0 && (
              <div className="bk-extra-section">
                <div className="bk-extra-title">
                  <Plus size={12} /> Add Extra Performers
                  <span
                    style={{
                      fontWeight: 300,
                      letterSpacing: ".04em",
                      textTransform: "none",
                      color: "var(--muted)",
                      fontSize: ".72rem",
                    }}
                  >
                    &nbsp;— beyond the dancing package
                  </span>
                </div>
                {performerTypes.map((pt) => {
                  const existing = extraPerformers.find(
                    (x) => x.performerTypeId === pt.id,
                  );
                  return (
                    <div key={pt.id} className="bk-extra-row">
                      <span
                        style={{
                          flex: 1,
                          fontSize: ".85rem",
                          color: "var(--text)",
                        }}
                      >
                        {pt.name}
                      </span>
                      <span className="bk-extra-price">
                        Rs. {fmt(pt.pricePerUnit)} / each
                      </span>
                      <div className="bk-qty-ctrl">
                        <button
                          className="bk-qty-btn"
                          onClick={() =>
                            existing ? updateExtraQty(pt.id, -1) : null
                          }
                        >
                          −
                        </button>
                        <span className="bk-qty-val">
                          {existing?.quantity || 0}
                        </span>
                        <button
                          className="bk-qty-btn"
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
            <div className="bk-price-strip">
              <div className="bk-price-strip-item">
                <span className="bk-price-strip-label">Package Price</span>
                <span className="bk-price-strip-val">
                  Rs. {fmt(basePackagePrice)}
                </span>
              </div>
              <div className="bk-price-divider" />
              {dressPriceAdjustment !== 0 && (
                <>
                  <div className="bk-price-strip-item">
                    <span className="bk-price-strip-label">
                      Dress Category Adj.
                    </span>
                    <span
                      className="bk-price-strip-val"
                      style={{
                        color:
                          dressPriceAdjustment > 0
                            ? "var(--crimson)"
                            : "#15803D",
                      }}
                    >
                      {dressPriceAdjustment > 0 ? "+" : "−"} Rs.{" "}
                      {fmt(Math.abs(dressPriceAdjustment))}
                    </span>
                  </div>
                  <div className="bk-price-divider" />
                </>
              )}
              {dancingPriceAdjustment !== 0 && (
                <>
                  <div className="bk-price-strip-item">
                    <span className="bk-price-strip-label">
                      Dancing Adjustment
                    </span>
                    <span
                      className="bk-price-strip-val"
                      style={{
                        color:
                          dancingPriceAdjustment > 0
                            ? "var(--crimson)"
                            : "#15803D",
                      }}
                    >
                      {dancingPriceAdjustment > 0 ? "+" : "−"} Rs.{" "}
                      {fmt(Math.abs(dancingPriceAdjustment))}
                    </span>
                  </div>
                  <div className="bk-price-divider" />
                </>
              )}
              {extraPerformersTotal > 0 && (
                <>
                  <div className="bk-price-strip-item">
                    <span className="bk-price-strip-label">
                      Extra Performers
                    </span>
                    <span
                      className="bk-price-strip-val"
                      style={{ color: "var(--crimson)" }}
                    >
                      + Rs. {fmt(extraPerformersTotal)}
                    </span>
                  </div>
                  <div className="bk-price-divider" />
                </>
              )}
              <div className="bk-price-strip-item">
                <span className="bk-price-strip-label">Estimated Total</span>
                <span className="bk-price-strip-val total">
                  Rs. {fmt(estimatedTotal)}
                </span>
              </div>
            </div>
          </>
        )}

        {/*  STEP 4 — Review & Submit  */}
        {step === 4 && (
          <>
            <h2 className="bk-section-title">Review & Submit</h2>
            <p className="bk-section-sub">
              Please review all your details before submitting the booking
              request.
            </p>

            {/* Package */}
            <div className="bk-review-card">
              <div className="bk-review-head">
                <Sparkles size={12} /> Selected Package
              </div>
              <div className="bk-review-body">
                <div className="bk-review-row">
                  <span className="bk-review-key">Package</span>
                  <span className="bk-review-val">{selectedPkg?.name}</span>
                </div>
                <div className="bk-review-row">
                  <span className="bk-review-key">Base Price</span>
                  <span
                    className="bk-review-val"
                    style={{ color: "var(--crimson)" }}
                  >
                    Rs. {fmt(selectedPkg?.finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Event */}
            <div className="bk-review-card">
              <div className="bk-review-head">
                <MapPin size={12} /> Event Details
              </div>
              <div className="bk-review-body">
                {[
                  ["Hotel", eventForm.hotelName],
                  ["City", eventForm.nearestCity],
                  ["Date", eventForm.eventDate],
                  ["Contact", eventForm.contactNo],
                  ["Groom Arrival", eventForm.groomArrivalTime || "—"],
                  ["Poruwa Start", eventForm.poruwaStartTime || "—"],
                  ["Notes", eventForm.specialNotes || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="bk-review-row">
                    <span className="bk-review-key">{k}</span>
                    <span className="bk-review-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dress */}
            <div className="bk-review-card">
              <div className="bk-review-head">
                <Shirt size={12} /> Dress Selections
              </div>
              <div className="bk-review-body">
                {groomDress && (
                  <div className="bk-dress-review-item">
                    <span className="bk-badge coord" style={{ flexShrink: 0 }}>
                      Groom
                    </span>
                    <span style={{ fontSize: ".85rem", flex: 1 }}>
                      {dressLabel(groomDress)}
                    </span>
                    {getDressPriceHint(groomDress, "GROOM") && (
                      <span
                        style={{
                          fontSize: ".75rem",
                          color: "var(--crimson)",
                          fontWeight: 600,
                        }}
                      >
                        {getDressPriceHint(groomDress, "GROOM")}
                      </span>
                    )}
                  </div>
                )}
                {bestMen.filter(Boolean).map((id, i) => (
                  <div key={i} className="bk-dress-review-item">
                    <span className="bk-badge dance" style={{ flexShrink: 0 }}>
                      Best Man {i + 1}
                    </span>
                    <span style={{ fontSize: ".85rem", flex: 1 }}>
                      {dressLabel(id)}
                    </span>
                    {getDressPriceHint(id, "BEST_MAN") && (
                      <span
                        style={{
                          fontSize: ".75rem",
                          color: "var(--crimson)",
                          fontWeight: 600,
                        }}
                      >
                        {getDressPriceHint(id, "BEST_MAN")}
                      </span>
                    )}
                  </div>
                ))}
                {pageBoys.filter(Boolean).map((id, i) => (
                  <div key={i} className="bk-dress-review-item">
                    <span className="bk-badge pack" style={{ flexShrink: 0 }}>
                      Page Boy {i + 1}
                    </span>
                    <span style={{ fontSize: ".85rem", flex: 1 }}>
                      {dressLabel(id)}
                    </span>
                    {getDressPriceHint(id, "PAGE_BOY") && (
                      <span
                        style={{
                          fontSize: ".75rem",
                          color: "var(--crimson)",
                          fontWeight: 600,
                        }}
                      >
                        {getDressPriceHint(id, "PAGE_BOY")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dancing */}
            <div className="bk-review-card">
              <div className="bk-review-head">
                <Drum size={12} /> Dancing Package
              </div>
              <div className="bk-review-body">
                {selectedDancingPkg ? (
                  <>
                    <div className="bk-review-row">
                      <span className="bk-review-key">Package</span>
                      <span className="bk-review-val">
                        {selectedDancingPkg.name}
                      </span>
                    </div>
                    <div className="bk-review-row">
                      <span className="bk-review-key">Package Price</span>
                      <span className="bk-review-val">
                        Rs. {fmt(selectedDancingPkg.totalPrice)}
                      </span>
                    </div>
                    {dancingPriceAdjustment !== 0 && (
                      <div className="bk-review-row">
                        <span className="bk-review-key">
                          {dancingPriceAdjustment > 0
                            ? "Additional Cost"
                            : "Saving"}
                        </span>
                        <span
                          className="bk-review-val"
                          style={{
                            color:
                              dancingPriceAdjustment > 0
                                ? "var(--crimson)"
                                : "#15803D",
                          }}
                        >
                          {dancingPriceAdjustment > 0 ? "+" : "−"} Rs.{" "}
                          {fmt(Math.abs(dancingPriceAdjustment))}
                        </span>
                      </div>
                    )}
                    {selectedDancingPkg.description && (
                      <div style={{ marginTop: "10px" }}>
                        <div
                          style={{
                            fontSize: ".63rem",
                            fontWeight: 600,
                            letterSpacing: ".12em",
                            textTransform: "uppercase",
                            color: "var(--subtle)",
                            marginBottom: "6px",
                          }}
                        >
                          What's included
                        </div>
                        <div className="bk-dp-review-desc">
                          {selectedDancingPkg.description}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: "var(--subtle)", fontSize: ".82rem" }}>
                    No dancing package selected.
                  </p>
                )}
                {extraPerformers.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <div
                      style={{
                        fontSize: ".63rem",
                        fontWeight: 600,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: "var(--subtle)",
                        marginBottom: "8px",
                      }}
                    >
                      Extra Performers
                    </div>
                    {extraPerformers.map((ep) => {
                      const pt = performerTypes.find(
                        (x) => x.id === ep.performerTypeId,
                      );
                      return (
                        <div key={ep.performerTypeId} className="bk-review-row">
                          <span className="bk-review-key">
                            {ep.quantity} × {pt?.name}
                          </span>
                          <span
                            className="bk-review-val"
                            style={{ color: "var(--crimson)" }}
                          >
                            + Rs. {fmt((pt?.pricePerUnit || 0) * ep.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/*  Pricing Summary  */}
            <div className="bk-review-card">
              <div className="bk-review-head">💰 Pricing Summary</div>
              <div className="bk-review-body">
                <div className="bk-review-row">
                  <span className="bk-review-key">Package Base Price</span>
                  <span className="bk-review-val">
                    Rs. {fmt(basePackagePrice)}
                  </span>
                </div>
                {/*  NEW: Dress category adjustment  */}
                {dressPriceAdjustment !== 0 && (
                  <div className="bk-review-row">
                    <span className="bk-review-key">
                      Dress Category Adjustment
                    </span>
                    <span
                      className="bk-review-val"
                      style={{
                        color:
                          dressPriceAdjustment > 0
                            ? "var(--crimson)"
                            : "#15803D",
                      }}
                    >
                      {dressPriceAdjustment > 0 ? "+" : "−"} Rs.{" "}
                      {fmt(Math.abs(dressPriceAdjustment))}
                    </span>
                  </div>
                )}
                {dancingPriceAdjustment !== 0 && (
                  <div className="bk-review-row">
                    <span className="bk-review-key">
                      Dancing Package Adjustment
                    </span>
                    <span
                      className="bk-review-val"
                      style={{
                        color:
                          dancingPriceAdjustment > 0
                            ? "var(--crimson)"
                            : "#15803D",
                      }}
                    >
                      {dancingPriceAdjustment > 0 ? "+" : "−"} Rs.{" "}
                      {fmt(Math.abs(dancingPriceAdjustment))}
                    </span>
                  </div>
                )}
                {extraPerformersTotal > 0 && (
                  <div className="bk-review-row">
                    <span className="bk-review-key">
                      Extra Performers Total
                    </span>
                    <span
                      className="bk-review-val"
                      style={{ color: "var(--crimson)" }}
                    >
                      + Rs. {fmt(extraPerformersTotal)}
                    </span>
                  </div>
                )}
                <div className="bk-review-total-row">
                  <span className="bk-review-total-label">Estimated Total</span>
                  <span className="bk-review-total-val">
                    Rs. {fmt(estimatedTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bk-info">
              ℹ️ &nbsp;After submission, our team will review your request and
              add the transport price. You will then be able to accept or cancel
              the booking.
            </div>
          </>
        )}

        {/*  Navigation  */}
        <div className="bk-nav">
          <button
            className="bk-back-btn"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            style={{ visibility: step === 0 ? "hidden" : "visible" }}
          >
            <ChevronLeft size={15} /> Back
          </button>
          {step < 4 ? (
            <button
              className="bk-next-btn"
              onClick={handleNext}
              disabled={!canNext()}
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              className="bk-next-btn"
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
  );
};

export default SpecialPackageBooking;
