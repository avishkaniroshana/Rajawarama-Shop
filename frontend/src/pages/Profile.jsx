import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { clearAuth } from "../utils/auth";
import { toastError, toastSuccess } from "../utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit2,
  Lock,
  Trash2,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

/* ----------------------------------------- Validation schemas  */
const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+94|0)\d{9}$/, "Invalid phone format"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* --------------------- Styles  */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --crimson:         #8B1A1A;
    --crimson-light:   #B22222;
    --crimson-glow:    rgba(139,26,26,0.08);
    --crimson-border:  rgba(139,26,26,0.18);
    --gold:            #C9A84C;
    --gold-light:      #E2C56A;
    --gold-glow:       rgba(201,168,76,0.14);
    --gold-border:     rgba(201,168,76,0.30);

    --pg-bg:           #FAF7F4;
    --pg-bg2:          #F4EFE9;
    --pg-surface:      #FFFFFF;
    --pg-border:       rgba(201,168,76,0.22);
    --pg-border-soft:  rgba(0,0,0,0.07);
    --pg-text:         #1C1008;
    --pg-muted:        #8A7060;
    --pg-subtle:       #C4B5A8;
  }

  /* ── Root ───────────────────────────────────────────────── */
  .pg-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--pg-bg);
    position: relative;
    overflow-x: hidden;
  }

  /* Warm texture overlay */
  .pg-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 10% 0%,   rgba(139,26,26,0.05)  0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 100%,  rgba(201,168,76,0.07) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .pg-wrap {
    position: relative; z-index: 1;
    max-width: 1060px; margin: 0 auto;
    padding: 52px 24px 80px;
  }

  /* ── Page heading ───────────────────────────────────────── */
  .pg-heading { margin-bottom: 36px; }
  .pg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem; font-weight: 700;
    color: var(--pg-text); letter-spacing: 0.01em; line-height: 1;
  }
  .pg-title span {
    color: var(--crimson);
  }
  .pg-subtitle {
    font-size: 0.875rem; color: var(--pg-muted);
    margin-top: 7px; letter-spacing: 0.01em;
    font-weight: 300;
  }
  /* Thin gold rule under heading */
  .pg-heading-rule {
    width: 56px; height: 2px; margin-top: 14px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    border-radius: 2px;
  }

  /* ══════════════════════════════════════════
     HERO CARD
  ══════════════════════════════════════════ */
  .pg-hero {
    background: var(--pg-surface);
    border: 1px solid var(--pg-border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
      0 2px 0 rgba(201,168,76,0.20),
      0 16px 56px rgba(139,26,26,0.07),
      0 4px 16px rgba(0,0,0,0.05);
  }

  /* Cover banner — warm parchment tones */
  .pg-cover {
    height: 152px;
    position: relative;
    background: linear-gradient(
      125deg,
      #F5E8DC 0%,
      #EDD8C4 30%,
      #E8D0B8 60%,
      #F0E4D4 100%
    );
    overflow: hidden;
  }
  /* Diagonal line texture */
  .pg-cover::before {
    content: '';
    position: absolute; inset: 0;
    background:
      repeating-linear-gradient(
        55deg,
        transparent,
        transparent 30px,
        rgba(139,26,26,0.035) 30px,
        rgba(139,26,26,0.035) 31px
      );
  }
  /* Bottom gold accent */
  .pg-cover::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--gold) 25%,
      var(--gold-light) 50%, var(--gold) 75%, transparent 100%
    );
    opacity: 0.75;
  }
  /* Decorative rings on cover */
  .pg-cover-ring1 {
    position: absolute; top: -70px; right: -70px;
    width: 240px; height: 240px; border-radius: 50%;
    border: 1px solid rgba(139,26,26,0.10);
  }
  .pg-cover-ring2 {
    position: absolute; top: 20px; right: 80px;
    width: 110px; height: 110px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.15);
  }
  .pg-cover-ring3 {
    position: absolute; bottom: -40px; left: 200px;
    width: 160px; height: 160px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.08);
  }

  /* Avatar */
  .pg-avatar-wrap {
    position: absolute; bottom: 25px; left: 36px;
  }
  .pg-avatar {
    width: 100px; height: 100px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--crimson) 0%, #5A0E0E 100%);
    border: 3px solid var(--pg-surface);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem; font-weight: 700;
    color: var(--gold-light);
    box-shadow:
      0 8px 28px rgba(139,26,26,0.30),
      inset 0 1px 0 rgba(255,255,255,0.08);
    position: relative;
  }
  /* Gradient border around avatar */
  .pg-avatar::before {
    content: '';
    position: absolute; inset: -4px; border-radius: 12px;
    background: linear-gradient(135deg, var(--gold), #E8E8E8, var(--gold), #B0B0B0) border-box;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    border: 2.5px solid transparent;
    pointer-events: none;
  }

  /* Hero body */
  .pg-hero-body {
    padding: 62px 36px 32px;
  }
  .pg-hero-top {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap; gap: 20px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--pg-border-soft);
    margin-bottom: 28px;
  }
  .pg-hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.85rem; font-weight: 700;
    color: var(--pg-text); letter-spacing: 0.02em;
  }
  .pg-hero-email {
    font-size: 0.875rem; color: var(--pg-muted);
    margin-top: 3px; font-weight: 300;
  }
  .pg-role-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 11px; border-radius: 20px; margin-top: 8px;
    background: linear-gradient(135deg, rgba(139,26,26,0.07), rgba(201,168,76,0.08));
    border: 1px solid var(--gold-border);
    font-size: 0.64rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--crimson);
  }

  /* ── Action buttons ─────────────────────────────────────── */
  .pg-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }

  .pg-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 20px; border-radius: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; transition: all 0.22s;
    white-space: nowrap;
  }
  .pg-btn-edit {
    background: transparent;
    border: 1px solid var(--gold-border);
    color: var(--crimson);
  }
  

  .pg-btn-edit:hover {
    background: linear-gradient(135deg, #B8942A, var(--silver-glow), var(--silver-light));
    border-color: var(--silver-light);
    color: #3A2500;
    box-shadow: 0 2px 0 rgba(160,120,20,0.30), 0 6px 20px rgba(201,168,76,0.28);
    transform: translateY(-1px);
  }

  // .pg-btn-pass {
  //   background: linear-gradient(135deg, #B8942A, var(--gold), var(--gold-light), var(--gold));
  //   background-size: 200% 200%;
  //   background-position: 0% 50%;
  //   border: 1px solid rgba(201,168,76,0.40);
  //   color: #3A2500;
  //   font-weight: 600;
  //   position: relative; overflow: hidden;
  //   box-shadow: 0 2px 0 rgba(180,140,30,0.30), 0 4px 14px rgba(201,168,76,0.20);
  //   transition: all 0.30s ease;
  // }
  // .pg-btn-pass:hover {
  //   background-position: 100% 50%;
  //   box-shadow: 0 2px 0 rgba(180,140,30,0.40), 0 6px 22px rgba(201,168,76,0.35);
  //   border-color: var(--gold-light);
  //   transform: translateY(-1px);
  // }

  .pg-btn-pass {
    background: transparent;
    border: 1px solid var(--gold-border);
    color: var(--crimson);
  }

  .pg-btn-pass:hover {
    background: linear-gradient(135deg, #B8942A, var(--silver-glow), var(--silver-light));
    border-color: var(--silver-light);
    color: #3A2500;
    box-shadow: 0 2px 0 rgba(160,120,20,0.30), 0 6px 20px rgba(201,168,76,0.28);
    transform: translateY(-1px);
  }


  /* ══════════════════════════════════════════
     INFO GRID
  ══════════════════════════════════════════ */
  .pg-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 640px) { .pg-grid { grid-template-columns: 1fr; } }

  .pg-info-card {
    background: var(--pg-bg);
    border: 1px solid var(--pg-border-soft);
    border-radius: 8px;
    padding: 22px 24px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .pg-info-card:hover {
    border-color: var(--gold-border);
    box-shadow: 0 4px 20px rgba(201,168,76,0.10);
  }

  .pg-info-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 18px; padding-bottom: 14px;
    border-bottom: 1px solid var(--pg-border-soft);
  }
  .pg-info-icon {
    width: 32px; height: 32px; border-radius: 7px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(139,26,26,0.10), rgba(201,168,76,0.08));
    border: 1px solid var(--gold-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--crimson);
  }
  .pg-info-title {
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--pg-muted);
  }

  .pg-field { margin-bottom: 14px; }
  .pg-field:last-child { margin-bottom: 0; }
  .pg-field-label {
    font-size: 0.62rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--pg-subtle); margin-bottom: 5px;
    display: flex; align-items: center; gap: 5px;
  }
  .pg-field-value {
    font-size: 0.90rem; font-weight: 400; color: var(--pg-text);
    padding: 8px 12px;
    background: var(--pg-surface);
    border: 1px solid var(--pg-border-soft);
    border-radius: 5px;
    letter-spacing: 0.01em;
  }
  .pg-field-value.muted {
    color: var(--pg-subtle); font-style: italic;
  }

  /* ══════════════════════════════════════════
     DANGER ZONE
  ══════════════════════════════════════════ */
  .pg-danger {
    margin-top: 20px;
    padding: 20px 24px;
    background: rgba(139,26,26,0.03);
    border: 1px solid rgba(139,26,26,0.14);
    border-radius: 8px;
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
    transition: border-color 0.25s;
  }
  .pg-danger:hover { border-color: rgba(139,26,26,0.28); }
  .pg-danger-title {
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--crimson-light); margin-bottom: 4px;
    display: flex; align-items: center; gap: 7px;
  }
  .pg-danger-desc {
    font-size: 0.82rem; color: var(--pg-muted);
    line-height: 1.55; max-width: 420px; font-weight: 300;
  }
  .pg-btn-delete {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 22px; border-radius: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 600;
    letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap;
    background: linear-gradient(135deg, #8B1A1A, #C0392B);
    border: 1px solid rgba(192,57,43,0.35);
    color: #fff;
    box-shadow: 0 2px 0 rgba(100,10,10,0.30), 0 4px 14px rgba(139,26,26,0.22);
    transition: all 0.22s;
  }
  .pg-btn-delete:hover {
    background: linear-gradient(135deg, #A01E1E, #D44);
    box-shadow: 0 2px 0 rgba(100,10,10,0.40), 0 6px 22px rgba(139,26,26,0.38);
    border-color: rgba(220,80,80,0.45);
    transform: translateY(-1px);
  }

  /* ══════════════════════════════════════════
     MODAL BACKDROP
  ══════════════════════════════════════════ */
  .pg-backdrop {
    position: fixed; inset: 0;
    background: rgba(28,16,8,0.45);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: pgFadeIn 0.18s ease;
  }
  @keyframes pgFadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ── Modal panel ─────────────────────────────────────────── */
  .pg-modal {
    background: var(--pg-surface);
    border: 1px solid var(--pg-border);
    border-radius: 10px;
    width: 100%; max-width: 460px;
    max-height: 90vh; overflow-y: auto;
    box-shadow:
      0 2px 0 rgba(201,168,76,0.25),
      0 32px 80px rgba(139,26,26,0.15),
      0 8px 24px rgba(0,0,0,0.10);
    animation: pgDropIn 0.22s cubic-bezier(.4,0,.2,1);
    transform-origin: top center;
  }
  @keyframes pgDropIn {
    from { opacity: 0; transform: scale(0.96) translateY(-10px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  /* Crimson→gold top accent */
  .pg-modal::before {
    content: '';
    display: block; height: 2.5px;
    background: linear-gradient(90deg, var(--crimson), var(--gold), var(--crimson));
    border-radius: 10px 10px 0 0;
  }

  .pg-modal-head {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--pg-border-soft);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0;
    background: var(--pg-surface); z-index: 2;
  }
  .pg-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 700;
    color: var(--pg-text);
    display: flex; align-items: center; gap: 10px;
  }
  .pg-modal-title svg { color: var(--crimson); }

  .pg-modal-close {
    width: 30px; height: 30px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid var(--pg-border-soft);
    color: var(--pg-muted); cursor: pointer;
    transition: all 0.2s;
  }
  .pg-modal-close:hover {
    border-color: var(--crimson-border);
    color: var(--crimson);
    background: var(--crimson-glow);
  }

  .pg-modal-body { padding: 24px; }

  .pg-form-group { margin-bottom: 18px; }
  .pg-form-label {
    display: block; font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--pg-muted); margin-bottom: 6px;
  }
  .pg-form-input {
    width: 100%; padding: 10px 14px;
    background: var(--pg-bg);
    border: 1px solid rgba(0,0,0,0.10);
    border-radius: 5px;
    color: var(--pg-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 400;
    outline: none;
    transition: border-color 0.22s, box-shadow 0.22s;
    box-sizing: border-box;
  }
  .pg-form-input::placeholder { color: var(--pg-subtle); }
  .pg-form-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
    background: var(--pg-surface);
  }
  .pg-form-error {
    font-size: 0.74rem; color: var(--crimson-light); margin-top: 5px;
    display: flex; align-items: center; gap: 4px;
  }

  .pg-modal-foot {
    padding: 16px 24px;
    border-top: 1px solid var(--pg-border-soft);
    display: flex; justify-content: flex-end; gap: 10px;
  }
  .pg-foot-cancel {
    padding: 9px 20px; border-radius: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
    background: transparent;
    border: 1px solid var(--pg-border-soft);
    color: var(--pg-muted); cursor: pointer;
    transition: all 0.2s;
  }
  .pg-foot-cancel:hover {
    border-color: rgba(0,0,0,0.18);
    color: var(--pg-text);
    background: var(--pg-bg);
  }
  .pg-foot-submit {
    padding: 9px 24px; border-radius: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    border: 1px solid transparent;
    color: #fff; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    position: relative; overflow: hidden;
    transition: box-shadow 0.22s, transform 0.18s;
  }
  .pg-foot-submit::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.25), transparent);
    opacity: 0; transition: opacity 0.22s;
  }
  .pg-foot-submit:hover:not(:disabled) {
    box-shadow: 0 4px 20px rgba(139,26,26,0.35);
    transform: translateY(-1px);
  }
  .pg-foot-submit:hover:not(:disabled)::after { opacity: 1; }
  .pg-foot-submit:disabled { opacity: 0.50; cursor: not-allowed; }

  /* ── Delete confirm modal ────────────────────────────────── */
  .pg-delete-modal {
    background: var(--pg-surface);
    border: 1px solid rgba(139,26,26,0.20);
    border-radius: 10px;
    width: 100%; max-width: 410px;
    box-shadow:
      0 2px 0 rgba(139,26,26,0.20),
      0 32px 80px rgba(139,26,26,0.14),
      0 8px 24px rgba(0,0,0,0.10);
    animation: pgDropIn 0.22s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
  }
  .pg-delete-modal::before {
    content: '';
    display: block; height: 2.5px;
    background: linear-gradient(90deg, var(--crimson), #E05252);
    border-radius: 10px 10px 0 0;
  }
  .pg-delete-body { padding: 28px 28px 20px; }
  .pg-delete-icon {
    width: 46px; height: 46px; border-radius: 10px; margin-bottom: 16px;
    background: rgba(139,26,26,0.07);
    border: 1px solid rgba(139,26,26,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--crimson);
  }
  .pg-delete-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 700;
    color: var(--pg-text); margin-bottom: 10px;
  }
  .pg-delete-desc {
    font-size: 0.875rem; color: var(--pg-muted);
    line-height: 1.65; font-weight: 300;
  }
  .pg-delete-desc strong { color: var(--crimson); font-weight: 600; }
  .pg-delete-foot {
    padding: 16px 28px;
    border-top: 1px solid rgba(139,26,26,0.08);
    display: flex; justify-content: flex-end; gap: 10px;
  }
  .pg-del-confirm {
    padding: 9px 20px; border-radius: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
    background: linear-gradient(135deg, var(--crimson), #C0392B);
    border: none; color: #fff; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    transition: box-shadow 0.22s, transform 0.18s;
  }
  .pg-del-confirm:hover {
    box-shadow: 0 4px 18px rgba(139,26,26,0.35);
    transform: translateY(-1px);
  }

  /* ── Loading / error states ──────────────────────────────── */
  .pg-state {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--pg-bg); font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  .pg-state::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 15% 10%, rgba(139,26,26,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 85% 90%, rgba(201,168,76,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .pg-state-inner { text-align: center; position: relative; z-index: 1; }
  .pg-state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--pg-text); margin-bottom: 8px;
  }
  .pg-state-text {
    font-size: 0.875rem; color: var(--pg-muted); margin-bottom: 24px; font-weight: 300;
  }
  .pg-state-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 24px; border-radius: 5px;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; transition: box-shadow 0.22s, transform 0.18s;
  }
  .pg-state-btn:hover {
    box-shadow: 0 4px 18px rgba(139,26,26,0.35);
    transform: translateY(-1px);
  }
  /* Gold-rimmed spinner */
  .pg-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    margin: 0 auto 16px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: var(--gold);
    animation: pgSpin 0.85s linear infinite;
  }
  @keyframes pgSpin { to { transform: rotate(360deg); } }

  /* ── Responsive ──────────────────────────────────────────── */
  @media (max-width: 700px) {
    .pg-wrap           { padding: 32px 16px 60px; }
    .pg-hero-body      { padding: 62px 20px 24px; }
    .pg-avatar-wrap    { left: 20px; }
    .pg-hero-top       { flex-direction: column; }
    .pg-danger         { flex-direction: column; }
    .pg-title          { font-size: 2rem; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const {
    register: regP,
    handleSubmit: submitP,
    reset: resetP,
    formState: { errors: errP, isSubmitting: subP },
  } = useForm({ resolver: zodResolver(profileSchema) });

  const {
    register: regW,
    handleSubmit: submitW,
    reset: resetW,
    formState: { errors: errW, isSubmitting: subW },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/profile");
        setUser(res.data);
        resetP(res.data);
      } catch {
        setError("Failed to load profile. Please sign in again.");
        toastError("Session may have expired. Please sign in again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdateProfile = async (data) => {
    try {
      await api.put("/api/profile", data);
      toastSuccess("Profile updated successfully");
      setProfileModal(false);
      setUser((p) => ({ ...p, ...data }));
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (data) => {
    try {
      await api.put("/api/profile/password", data);
      toastSuccess("Password changed successfully");
      resetW();
      setPasswordModal(false);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to change password!");
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      await api.delete("/api/profile");
      toastSuccess("Account deleted successfully");
      clearAuth();
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to delete account");
    }
  };

  /* ── State screens ── */
  if (loading)
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="pg-state">
          <div className="pg-state-inner">
            <div className="pg-spinner" />
            <p className="pg-state-text">Loading your profile…</p>
          </div>
        </div>
      </>
    );

  if (error || !user)
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="pg-state">
          <div className="pg-state-inner">
            <p className="pg-state-title">
              {error ? "Something went wrong" : "No profile found"}
            </p>
            <p className="pg-state-text">
              {error || "Please sign in to view your profile."}
            </p>
            <button
              className="pg-state-btn"
              onClick={() =>
                error
                  ? window.location.reload()
                  : (window.location.href = "/signin")
              }
            >
              {error ? "Try Again" : "Sign In"} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </>
    );

  const initial = user.fullName?.[0]?.toUpperCase() ?? "?";
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const isAdmin = user.role === "ADMIN";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="pg-root">
        <div className="pg-wrap">
          {/* ── Heading ── */}
          <div className="pg-heading">
            <h1 className="pg-title">
              My Profile
            </h1>
            <p className="pg-subtitle">
              Manage your personal information and account security
            </p>
            <div className="pg-heading-rule" />
          </div>

          {/* ══════════ HERO CARD ══════════ */}
          <div className="pg-hero">
            {/* Cover */}
            <div className="pg-cover">
              <div className="pg-cover-ring1" />
              <div className="pg-cover-ring2" />
              <div className="pg-cover-ring3" />
              <div className="pg-avatar-wrap">
                <div className="pg-avatar">{initial}</div>
              </div>
            </div>

            {/* Body */}
            <div className="pg-hero-body">
              <div className="pg-hero-top">
                <div>
                  <h2 className="pg-hero-name">{user.fullName}</h2>
                  <p className="pg-hero-email">{user.email}</p>
                  <span className="pg-role-badge">
                    <Shield size={9} />
                    {isAdmin ? "Administrator" : "CUSTOMER"}
                  </span>
                </div>
                <div className="pg-actions">
                  <button
                    className="pg-btn pg-btn-edit"
                    onClick={() => setProfileModal(true)}
                  >
                    <Edit2 size={13} /> Edit Profile
                  </button>
                  <button
                    className="pg-btn pg-btn-pass"
                    onClick={() => setPasswordModal(true)}
                  >
                    <Lock size={13} /> Change Password
                  </button>
                </div>
              </div>

              {/* Info cards */}
              <div className="pg-grid">
                <div className="pg-info-card">
                  <div className="pg-info-head">
                    <span className="pg-info-icon">
                      <User size={14} />
                    </span>
                    <span className="pg-info-title">Personal Details</span>
                  </div>
                  <div className="pg-field">
                    <div className="pg-field-label">
                      <User size={10} /> Full Name
                    </div>
                    <div className="pg-field-value">{user.fullName}</div>
                  </div>
                  <div className="pg-field">
                    <div className="pg-field-label">
                      <Phone size={10} /> Phone Number
                    </div>
                    <div
                      className={`pg-field-value${!user.phone ? " muted" : ""}`}
                    >
                      {user.phone || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="pg-info-card">
                  <div className="pg-info-head">
                    <span className="pg-info-icon">
                      <Mail size={14} />
                    </span>
                    <span className="pg-info-title">Account Information</span>
                  </div>
                  <div className="pg-field">
                    <div className="pg-field-label">
                      <Mail size={10} /> Email Address
                    </div>
                    <div className="pg-field-value">{user.email}</div>
                  </div>
                  <div className="pg-field">
                    <div className="pg-field-label">
                      <Calendar size={10} /> Member Since
                    </div>
                    <div className="pg-field-value">{joinDate}</div>
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div className="pg-danger">
                <div>
                  <div className="pg-danger-title">
                    <AlertTriangle size={12} /> DELETE ACCOUNT
                  </div>
                  <p className="pg-danger-desc">
                    Permanently delete your account and all associated data.
                    This action <strong>cannot be undone.</strong>
                  </p>
                </div>
                <button
                  className="pg-btn-delete"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash2 size={13} /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ EDIT PROFILE MODAL ══════════ */}
      {profileModal && (
        <div className="pg-backdrop" onClick={() => setProfileModal(false)}>
          <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pg-modal-head">
              <span className="pg-modal-title">
                <Edit2 size={16} /> Edit Profile
              </span>
              <button
                className="pg-modal-close"
                onClick={() => setProfileModal(false)}
              >
                <X size={14} />
              </button>
            </div>
            <form onSubmit={submitP(handleUpdateProfile)}>
              <div className="pg-modal-body">
                <div className="pg-form-group">
                  <label className="pg-form-label">Full Name</label>
                  <input
                    {...regP("fullName")}
                    className="pg-form-input"
                    placeholder="Your full name"
                  />
                  {errP.fullName && (
                    <p className="pg-form-error">
                      <AlertTriangle size={11} />
                      {errP.fullName.message}
                    </p>
                  )}
                </div>
                <div className="pg-form-group">
                  <label className="pg-form-label">Phone Number</label>
                  <input
                    {...regP("phone")}
                    className="pg-form-input"
                    placeholder="+94 7X XXX XXXX"
                  />
                  {errP.phone && (
                    <p className="pg-form-error">
                      <AlertTriangle size={11} />
                      {errP.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="pg-modal-foot">
                <button
                  type="button"
                  className="pg-foot-cancel"
                  onClick={() => setProfileModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pg-foot-submit"
                  disabled={subP}
                >
                  {subP ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ CHANGE PASSWORD MODAL ══════════ */}
      {passwordModal && (
        <div className="pg-backdrop" onClick={() => setPasswordModal(false)}>
          <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pg-modal-head">
              <span className="pg-modal-title">
                <Lock size={16} /> Change Password
              </span>
              <button
                className="pg-modal-close"
                onClick={() => setPasswordModal(false)}
              >
                <X size={14} />
              </button>
            </div>
            <form onSubmit={submitW(handleChangePassword)}>
              <div className="pg-modal-body">
                {[
                  { field: "currentPassword", label: "Current Password" },
                  { field: "newPassword", label: "New Password" },
                  { field: "confirmPassword", label: "Confirm New Password" },
                ].map(({ field, label }) => (
                  <div className="pg-form-group" key={field}>
                    <label className="pg-form-label">{label}</label>
                    <input
                      type="password"
                      {...regW(field)}
                      className="pg-form-input"
                      placeholder="••••••••"
                    />
                    {errW[field] && (
                      <p className="pg-form-error">
                        <AlertTriangle size={11} />
                        {errW[field].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="pg-modal-foot">
                <button
                  type="button"
                  className="pg-foot-cancel"
                  onClick={() => setPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pg-foot-submit"
                  disabled={subW}
                >
                  {subW ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Updating…
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ DELETE CONFIRM MODAL ══════════ */}
      {deleteConfirm && (
        <div className="pg-backdrop" onClick={() => setDeleteConfirm(false)}>
          <div className="pg-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pg-delete-body">
              <div className="pg-delete-icon">
                <AlertTriangle size={20} />
              </div>
              <h2 className="pg-delete-title">Delete Account</h2>
              <p className="pg-delete-desc">
                Are you sure you want to permanently delete your account? All
                your data will be removed and{" "}
                <strong>this action cannot be undone.</strong>
              </p>
            </div>
            <div className="pg-delete-foot">
              <button
                className="pg-foot-cancel"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="pg-del-confirm"
                onClick={() => {
                  setDeleteConfirm(false);
                  confirmDeleteAccount();
                }}
              >
                <Trash2 size={13} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
