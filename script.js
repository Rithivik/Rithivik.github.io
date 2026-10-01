/* =========================================
   1. FOOTER YEAR (updates automatically)
   ========================================= */
document.getElementById("year").textContent = new Date().getFullYear();


/* =========================================
   2. NAVBAR BACKGROUND ON SCROLL
   ========================================= */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});


/* =========================================
   3. MOBILE MENU (☰ button)
   ========================================= */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.innerHTML = isOpen ? "&#10005;" : "&#9776;"; // ✕ or ☰
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the menu after tapping a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.innerHTML = "&#9776;";
  });
});


/* =========================================
   4. HIGHLIGHT THE CURRENT SECTION IN THE MENU
   ========================================= */
const sections = document.querySelectorAll("main section");
const menuLinks = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        menuLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));


/* =========================================
   5. FADE-IN ANIMATION ON SCROLL
   ========================================= */
const revealItems = document.querySelectorAll(
  ".section h2, .about-grid, .project-card, .skill-group, .timeline li, .contact-form"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  revealObserver.observe(item);
});


/* =========================================
   6. ANIMATED NEURAL NETWORK (hero graphic)
   ========================================= */
const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let nodes = [];
let mouse = { x: null, y: null };
let width, height;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createNodes() {
  const count = width < 400 ? 34 : 50;
  nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1.5,
    });
  }
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);
  const linkDistance = width * 0.28;

  // lines between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkDistance) {
        ctx.strokeStyle = `rgba(124, 156, 255, ${1 - dist / linkDistance})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // lines to the mouse
  if (mouse.x !== null) {
    nodes.forEach((n) => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkDistance * 1.2) {
        ctx.strokeStyle = `rgba(79, 209, 197, ${1 - dist / (linkDistance * 1.2)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);