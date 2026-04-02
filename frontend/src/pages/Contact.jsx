import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ChevronRight,
  Facebook,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --cr:#8B1A1A;--cr-l:#B22222;--cr-g:rgba(139,26,26,.08);
    --go:#C9A84C;--go-l:#E2C56A;--go-g:rgba(201,168,76,.13);
    --bg:#FAF7F4;--bg2:#F2EDE6;--surf:#fff;
    --bdr:rgba(201,168,76,.22);--tx:#1C1008;--mu:#7A6555;--su:#C4B5A8;
  }
  .ct-root{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;overflow-x:hidden}

  /* ── Hero ── */
  .ct-hero{
    position:relative;overflow:hidden;
    background:linear-gradient(135deg,#1a0505 0%,#3b0a0a 40%,#1a0a02 100%);
    padding:96px 24px 120px;text-align:center;
  }
  .ct-hero::before{content:'';position:absolute;inset:0;
    background:
      radial-gradient(ellipse 70% 60% at 15% 30%,rgba(201,168,76,.12) 0%,transparent 55%),
      radial-gradient(ellipse 50% 50% at 85% 70%,rgba(139,26,26,.25) 0%,transparent 55%);
    pointer-events:none}
  .ct-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 16px;border-radius:40px;
    border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.07);
    color:var(--go-l);font-size:.70rem;font-weight:500;letter-spacing:.20em;text-transform:uppercase;
    margin-bottom:22px;position:relative;z-index:1}
  .ct-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,7vw,5rem);
    font-weight:700;line-height:1.05;color:#FDF8F0;position:relative;z-index:1;margin-bottom:16px}
  .ct-hero-title em{font-style:italic;color:var(--go-l)}
  .ct-hero-sub{font-size:1rem;font-weight:300;color:rgba(253,248,240,.62);
    max-width:480px;margin:0 auto;line-height:1.7;position:relative;z-index:1}
  .ct-hero-wave{position:absolute;bottom:0;left:0;right:0;pointer-events:none}

  /* ── Body ── */
  .ct-body{max-width:1100px;margin:0 auto;padding:80px 24px 96px}

  /* ── Info Card ── */
  .ct-info-card{background:var(--surf);border:1px solid var(--bdr);border-radius:14px;
    overflow:hidden;margin-bottom:30px;
    box-shadow:0 2px 0 rgba(201,168,76,.10),0 8px 28px rgba(139,26,26,.04)}
  .ct-info-head{padding:24px 28px;border-bottom:1px solid var(--bdr);
    background:linear-gradient(135deg,rgba(139,26,26,.03),rgba(201,168,76,.04))}
  .ct-info-head-title{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:700;color:var(--tx)}

  .ct-contact-item{display:flex;align-items:flex-start;gap:14px;padding:18px 28px;
    border-bottom:1px solid rgba(201,168,76,.09);transition:background .18s}
  .ct-contact-item:last-child{border-bottom:none}
  .ct-contact-item:hover{background:rgba(201,168,76,.04)}
  .ct-contact-icon{width:42px;height:42px;border-radius:10px;flex-shrink:0;
    background:linear-gradient(135deg,rgba(139,26,26,.10),rgba(201,168,76,.08));
    border:1px solid rgba(201,168,76,.20);
    display:flex;align-items:center;justify-content:center;color:var(--cr)}
  .ct-contact-label{font-size:.65rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase;
    color:var(--su);margin-bottom:4px}
  .ct-contact-value{font-size:.92rem;color:var(--tx);font-weight:400;text-decoration:none;
    transition:color .2s;display:block;line-height:1.5}
  a.ct-contact-value:hover{color:var(--cr)}
  .ct-address-block{font-size:.92rem;color:var(--tx);line-height:1.8;font-style:normal;
    border-left:3px solid rgba(201,168,76,.28);padding-left:14px;margin-top:4px}

  /* WhatsApp */
  .ct-wa-card{border-radius:14px;overflow:hidden;
    background:linear-gradient(135deg,#128C7E,#075E54);
    padding:32px 28px;text-align:center;
    box-shadow:0 4px 24px rgba(18,140,126,.28)}
  .ct-wa-icon{width:62px;height:62px;border-radius:50%;background:rgba(255,255,255,.15);
    display:flex;align-items:center;justify-content:center;margin:0 auto 16px;
    border:1px solid rgba(255,255,255,.25)}
  .ct-wa-title{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:700;
    color:#fff;margin-bottom:8px}
  .ct-wa-sub{font-size:.85rem;color:rgba(255,255,255,.75);margin-bottom:22px;line-height:1.6}
  .ct-wa-btn{display:inline-flex;align-items:center;gap:9px;padding:12px 28px;
    border-radius:8px;background:#fff;color:#128C7E;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;
    text-decoration:none;transition:all .22s;letter-spacing:.05em}
  .ct-wa-btn:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(0,0,0,.2)}

  /* Social */
  .ct-social-row{display:flex;gap:12px;padding:20px 28px;border-top:1px solid var(--bdr)}
  .ct-social-btn{width:42px;height:42px;border-radius:10px;border:1px solid var(--bdr);
    background:transparent;display:flex;align-items:center;justify-content:center;
    color:var(--mu);text-decoration:none;transition:all .22s}
  .ct-social-btn:hover{border-color:var(--go);color:var(--cr);background:var(--go-g);transform:translateY(-2px)}

  /* Map */
  .ct-map-section{margin-top:70px}
  .ct-map-label{text-align:center;margin-bottom:32px}
  .ct-map-label-title{font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:700;color:var(--tx);margin-bottom:8px}
  .ct-map-label-sub{font-size:.87rem;color:var(--mu);font-weight:300}
  .ct-map-wrap{border-radius:14px;overflow:hidden;border:1px solid var(--bdr);
    box-shadow:0 2px 0 rgba(201,168,76,.12),0 12px 40px rgba(139,26,26,.06);height:460px}
  .ct-map-wrap iframe{width:100%;height:100%;display:block;border:none}

  @media(max-width:600px){
    .ct-body{padding:50px 16px 80px}
    .ct-info-head{padding:20px 24px}
    .ct-contact-item{padding:16px 24px}
  }
`;

const Contact = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ct-root">
        {/* ── Hero ── */}
        <section className="ct-hero">
          <div className="ct-hero-badge">
            <Mail size={12} /> Get In Touch
          </div>
          <h1 className="ct-hero-title">
            Let's <em>Connect</em>
          </h1>
          <p className="ct-hero-sub">
            Whether it's a question, a custom inquiry, or booking a date — our
            team is here to help you plan the perfect celebration.
          </p>
          <div className="ct-hero-wave">
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "80px" }}
            >
              <path
                d="M0,30 C480,80 960,0 1440,30 L1440,80 L0,80 Z"
                fill="#FAF7F4"
              />
            </svg>
          </div>
        </section>

        {/* ── Body ── */}
        <div className="ct-body">
          <div className="ct-info-card">
            <div className="ct-info-head">
              <div className="ct-info-head-title">Contact Information</div>
            </div>

            <div className="ct-contact-item">
              <span className="ct-contact-icon">
                <Phone size={18} />
              </span>
              <div>
                <div className="ct-contact-label">Call Us</div>
                <a href="tel:+94773583546" className="ct-contact-value">
                  +94 77 358 3546
                </a>
              </div>
            </div>

            <div className="ct-contact-item">
              <span className="ct-contact-icon">
                <Mail size={18} />
              </span>
              <div>
                <div className="ct-contact-label">Email Us</div>
                <a
                  href="mailto:isurudasanayaka98@gmail.com"
                  className="ct-contact-value"
                >
                  isurudasanayaka98@gmail.com
                </a>
              </div>
            </div>

            <div className="ct-contact-item">
              <span className="ct-contact-icon">
                <Clock size={18} />
              </span>
              <div>
                <div className="ct-contact-label">Business Hours</div>
                <span className="ct-contact-value">
                  Monday – Saturday: 09:00 AM – 06:00 PM
                  <br />
                  (Sunday Closed)
                </span>
              </div>
            </div>

            <div className="ct-contact-item">
              <span className="ct-contact-icon">
                <MapPin size={18} />
              </span>
              <div>
                <div className="ct-contact-label">Our Location</div>
                <address className="ct-address-block">
                  Badulla Road,
                  <br />
                  Bindunuwewa,
                  <br />
                  Bandarawela, Sri Lanka.
                </address>
              </div>
            </div>

            {/* Social Links */}
            <div className="ct-social-row">
              <a
                href="https://www.facebook.com/share/1CcU186Vtn/"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-social-btn"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="ct-wa-card">
            <div className="ct-wa-icon">
              <MessageSquare size={28} color="#fff" />
            </div>
            <div className="ct-wa-title">Chat on WhatsApp</div>
            <div className="ct-wa-sub">
              Get instant replies for bookings, inquiries, and custom requests.
            </div>
            <a
              href="https://wa.me/94773583546"
              target="_blank"
              rel="noopener noreferrer"
              className="ct-wa-btn"
            >
              <MessageSquare size={17} /> Start Chat <ChevronRight size={16} />
            </a>
          </div>

          {/* Google Map */}
          <div className="ct-map-section">
            <div className="ct-map-label">
              <h2 className="ct-map-label-title">Find Us</h2>
              <p className="ct-map-label-sub">
                Visit our shop in Bindunuwewa, Bandarawela
              </p>
            </div>
            <div className="ct-map-wrap">
              <iframe
                title="Rajawarama Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.8!2d81.00088965479054!3d6.836682528141427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTAnMTIuMSJOIDgxwrAwMCcxMC4zIkU!5e0!3m2!1sen!2slk!4v1711800000000"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
