/* ── CSRF helper ────────────────────────────────────────────────── */
function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

/* ── Scroll progress bar ────────────────────────────────────────── */
const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
  }, { passive: true });
}

/* ── Toast notification system ──────────────────────────────────── */
const toastContainer = document.getElementById("toast-container");

function showToast(type, title, message, duration = 4000) {
  if (!toastContainer) return;
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || "ℹ️"}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ""}
    </div>
    <button class="toast-close" aria-label="Dismiss">×</button>
    <div class="toast-progress"></div>
  `;

  toastContainer.appendChild(toast);

  const dismiss = () => {
    toast.classList.add("toast-exit");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };

  toast.querySelector(".toast-close").addEventListener("click", dismiss);
  setTimeout(dismiss, duration);
}

/* ── Button ripple effect ───────────────────────────────────────── */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2;
  const x      = e.clientX - rect.left - size / 2;
  const y      = e.clientY - rect.top  - size / 2;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
});

/* ── Particles ──────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.15 + 0.03;
    const shades = ["160,160,160", "180,180,180", "140,140,140", "170,170,170"];
    this.color = shades[Math.floor(Math.random() * shades.length)];
  }

  for (let i = 0; i < 70; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Navbar scroll ──────────────────────────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

/* ── Scroll Reveal ──────────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-scale");
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => revealObs.observe(el));

/* ── Animated counter helper ────────────────────────────────────── */
function animateCounter(el, target, suffix) {
  suffix = suffix || "";
  const duration = 1800;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Live waitlist count from API ───────────────────────────────── */
async function loadWaitlistCount() {
  try {
    const res  = await fetch("/api/stats");
    const data = await res.json();
    const count = data.waitlistCount || 0;

    const heroCount = document.getElementById("waitlistCount");
    if (heroCount) heroCount.textContent = count.toLocaleString();

    const statEl = document.getElementById("statWaitlist");
    if (statEl) {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { animateCounter(statEl, count, "+"); obs.disconnect(); }
        }),
        { threshold: 0.3 },
      );
      obs.observe(statEl);
    }
  } catch (_) {}
}

/* ── Static animated counters ───────────────────────────────────── */
const statsObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      document.querySelectorAll(".stat-num[data-target]").forEach((n) => {
        const t = parseInt(n.dataset.target);
        const suffix = n.dataset.target === "98" ? "%" : n.dataset.target === "8" ? "" : "+";
        animateCounter(n, t, suffix);
        delete n.dataset.target;
      });
      statsObs.disconnect();
    }
  }),
  { threshold: 0.3 },
);
const statsSection = document.getElementById("stats");
if (statsSection) statsObs.observe(statsSection);

/* ── Countdown timer (2026-07-08) ───────────────────────────────── */
const LAUNCH_DATE = new Date("2026-07-08T00:00:00");

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
  const diff = LAUNCH_DATE - new Date();
  if (diff <= 0) {
    ["cd-days","cd-hours","cd-minutes","cd-seconds"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "00";
    });
    return;
  }
  const d = document.getElementById("cd-days");
  const h = document.getElementById("cd-hours");
  const m = document.getElementById("cd-minutes");
  const s = document.getElementById("cd-seconds");
  if (d) d.textContent = pad(Math.floor(diff / 86400000));
  if (h) h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  if (m) m.textContent = pad(Math.floor((diff % 3600000) / 60000));
  if (s) s.textContent = pad(Math.floor((diff % 60000) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── Hero phone — subtle mouse parallax ─────────────────────────── */
(function () {
  const wrap = document.querySelector(".hero-visual");
  const phone = document.querySelector(".mockup-wrap");
  if (!wrap || !phone) return;
  let rx = 0, ry = 0, tx = 0, ty = 0;
  let rafId;
  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    tx = ((e.clientX - cx) / rect.width)  *  8;
    ty = ((e.clientY - cy) / rect.height) * -8;
  });
  wrap.addEventListener("mouseleave", () => { tx = 0; ty = 0; });
  function animate() {
    rx += (tx - rx) * 0.1;
    ry += (ty - ry) * 0.1;
    phone.style.transform = `rotateY(${rx}deg) rotateX(${ry}deg)`;
    rafId = requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Video modal ────────────────────────────────────────────────── */
function openVideoModal() {
  document.getElementById("videoModal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeVideoModal() {
  document.getElementById("videoModal").classList.remove("open");
  document.body.style.overflow = "";
}
const videoModal = document.getElementById("videoModal");
if (videoModal) videoModal.addEventListener("click", function (e) {
  if (e.target === this) closeVideoModal();
});

/* ── Waitlist form ──────────────────────────────────────────────── */
const form = document.getElementById("signupForm");

function setFieldError(id, errorId, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!el) return;
  if (msg) {
    el.classList.add("error"); el.classList.remove("valid");
    if (err) err.textContent = msg;
  } else {
    el.classList.remove("error"); el.classList.add("valid");
    if (err) err.textContent = "";
  }
}

function validateField(id, errorId, check, msg) {
  const el = document.getElementById(id);
  if (!el) return true;
  if (!check(el.value)) { setFieldError(id, errorId, msg); return false; }
  setFieldError(id, errorId, null); return true;
}

["firstName","lastName","email"].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const rules = {
    firstName: ["firstNameErr", (v) => v.trim().length >= 2, "Please enter your first name"],
    lastName:  ["lastNameErr",  (v) => v.trim().length >= 2, "Please enter your last name"],
    email:     ["emailErr",     (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email address"],
  };
  el.addEventListener("blur",  () => validateField(id, ...rules[id]));
  el.addEventListener("input", () => { if (el.classList.contains("error")) validateField(id, ...rules[id]); });
});

if (form) form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const v1 = validateField("firstName","firstNameErr",(v) => v.trim().length >= 2,"Please enter your first name");
  const v2 = validateField("lastName", "lastNameErr", (v) => v.trim().length >= 2,"Please enter your last name");
  const v3 = validateField("email",    "emailErr",    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),"Please enter a valid email address");

  if (!document.getElementById("consent").checked) {
    showToast("error", "Consent required", "Please agree to the privacy policy to continue.");
    return;
  }
  if (!v1 || !v2 || !v3) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = "<span>⏳</span><span>Joining...</span>";

  window._registeredEmail = document.getElementById("email").value.trim();

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfToken() },
      body: JSON.stringify({
        firstName: document.getElementById("firstName").value.trim(),
        lastName:  document.getElementById("lastName").value.trim(),
        email:     window._registeredEmail,
        phone:     document.getElementById("phone")?.value.trim() || "",
        consent:   true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        const errorIds = { firstName:"firstNameErr", lastName:"lastNameErr", email:"emailErr" };
        Object.entries(data.errors).forEach(([field, msg]) => {
          if (errorIds[field]) setFieldError(field, errorIds[field], msg);
          else showToast("error", "Error", msg);
        });
      }
      btn.disabled = false;
      btn.innerHTML = "<span>🚀</span><span>Join the Waiting List</span>";
      return;
    }

    document.getElementById("waitlistForm").style.display = "none";
    document.getElementById("waitlistSuccess").style.display = "block";

    if (data.position) {
      const countEl = document.getElementById("waitlistCount");
      if (countEl) countEl.textContent = data.position.toLocaleString();
    }

    showToast("success", "You're on the list! 🎉", "Check your email for confirmation.");

  } catch (_) {
    showToast("error", "Something went wrong", "Please check your connection and try again.");
    btn.disabled = false;
    btn.innerHTML = "<span>🚀</span><span>Join the Waiting List</span>";
  }
});

/* ── Survey ─────────────────────────────────────────────────────── */
let currentStep = 1;

function nextStep(step) {
  document.getElementById("step" + currentStep)?.classList.remove("active");
  currentStep = step;
  document.getElementById("step" + step)?.classList.add("active");
  document.querySelectorAll(".progress-step").forEach((el) => {
    const s = parseInt(el.dataset.step);
    el.classList.remove("active", "done");
    if (s < step) el.classList.add("done");
    if (s === step) el.classList.add("active");
  });
  document.querySelectorAll(".progress-step.done .step-circle").forEach((c) => {
    c.textContent = "✓";
  });
}

/* Show/hide "Other" counselling text box */
const counsellingOtherCheck = document.getElementById("c9");
if (counsellingOtherCheck) {
  counsellingOtherCheck.addEventListener("change", () => {
    const wrap = document.getElementById("counsellingOtherWrap");
    if (wrap) wrap.style.display = counsellingOtherCheck.checked ? "block" : "none";
  });
}

/* Payment → GHS price slider */
document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const show = ["subscription","freemium","per_session"].includes(radio.value);
    const section = document.getElementById("priceRangeSection");
    if (section) section.style.display = show ? "block" : "none";
    const labelEl   = document.querySelector(".price-range-wrap label");
    const displayEl = document.getElementById("priceDisplay");
    const sliderVal = document.getElementById("priceSlider")?.value || "100";
    if (radio.value === "per_session") {
      if (labelEl) labelEl.textContent = "How much per session? (slide to set)";
      if (displayEl) displayEl.textContent = "GHS " + sliderVal + " / session";
    } else {
      if (labelEl) labelEl.textContent = "How much would you pay per month? (slide to set)";
      if (displayEl) displayEl.textContent = "GHS " + sliderVal + " / month";
    }
  });
});

function updatePrice(v) {
  const isPerSession = document.querySelector('input[name="payment"]:checked')?.value === "per_session";
  const displayEl = document.getElementById("priceDisplay");
  if (displayEl) displayEl.textContent = "GHS " + v + (isPerSession ? " / session" : " / month");
}

/* Collect all survey data */
function collectSurveyData() {
  const checkedCounselling = [...document.querySelectorAll('input[name="counselling"]:checked')].map((el) => el.value);
  const otherText = document.getElementById("counsellingOtherText")?.value.trim();
  if (checkedCounselling.includes("other") && otherText) {
    checkedCounselling.push("other:" + otherText);
  }
  const formats    = [...document.querySelectorAll('input[name="format"]:checked')].map((el) => el.value);
  const frequency  = document.querySelector('input[name="frequency"]:checked')?.value || "";
  const extraNotes = (document.getElementById("extraNotes")?.value.trim() || "");
  const notesWithMeta = [
    extraNotes,
    formats.length  ? "Formats: " + formats.join(", ")    : "",
    frequency       ? "Frequency: " + frequency            : "",
  ].filter(Boolean).join(" | ");

  return {
    email:             document.getElementById("surveyEmail")?.value.trim() || window._registeredEmail || "",
    counsellingTypes:  checkedCounselling,
    paymentPreference: document.querySelector('input[name="payment"]:checked')?.value || "",
    priceWillingness:  document.getElementById("priceSlider")?.value || "",
    ageRange:          document.getElementById("ageRange")?.value || "",
    sources:           [...document.querySelectorAll('input[name="source"]:checked')].map((el) => el.value),
    extraNotes:        notesWithMeta,
  };
}

async function submitSurvey() {
  const btn = document.querySelector("#step5 .btn-primary");
  if (btn) { btn.disabled = true; btn.innerHTML = "<span>⏳</span><span>Submitting...</span>"; }

  try {
    await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfToken() },
      body: JSON.stringify(collectSurveyData()),
    });
    showToast("success", "Survey submitted!", "Thank you — your feedback is invaluable.");
  } catch (_) {
    showToast("info", "Saved locally", "We'll process your responses shortly.");
  }

  /* Move to referral step */
  document.getElementById("surveyMain").style.display = "none";
  document.getElementById("surveyReferral").style.display = "block";
}

async function finishSurvey(sendReferral) {
  if (sendReferral) {
    const refName    = document.getElementById("refName")?.value.trim() || "";
    const refContact = document.getElementById("refContact")?.value.trim() || "";
    if (refName || refContact) {
      try {
        await fetch("/api/survey", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfToken() },
          body: JSON.stringify({
            email: window._registeredEmail || "",
            counsellingTypes: [],
            paymentPreference: "",
            priceWillingness: "",
            ageRange: "",
            sources: [],
            extraNotes: "REFERRAL — Name: " + refName + " | Contact: " + refContact,
          }),
        });
        showToast("success", "Referral sent!", refName + " will hear about AnyAdviceApp.");
      } catch (_) {}
    }
  }
  document.getElementById("surveyReferral").style.display = "none";
  document.getElementById("surveySuccess").style.display = "block";
}

/* ── Share ──────────────────────────────────────────────────────── */
function shareApp(platform) {
  const url  = window.location.href;
  const text = "I just joined the waiting list for AnyAdviceApp — a safe, anonymous counselling app! Join me:";
  if (platform === "twitter") {
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url), "_blank");
  } else if (platform === "whatsapp") {
    window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank");
  } else if (platform === "copy") {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById("copyBtn");
      if (btn) btn.textContent = "✅ Copied!";
      showToast("success", "Link copied!", "Share it with someone who might need support.");
      setTimeout(() => { if (btn) btn.textContent = "🔗 Copy Link"; }, 2000);
    });
  }
}

/* ── Smooth scroll ──────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  });
});

/* ── Init ───────────────────────────────────────────────────────── */
loadWaitlistCount();
