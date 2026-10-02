/* =========================================
   1. MOBILE MENU (☰ button)
   ========================================= */
(function () {
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  function setMenu(open) {
    links.classList.toggle("open", open);
    toggle.innerHTML = open ? "&#10005;" : "&#9776;";
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.setAttribute("aria-expanded", open);
  }

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    setMenu(!links.classList.contains("open"));
  });

  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  document.addEventListener("click", function (e) {
    if (!links.contains(e.target) && e.target !== toggle) setMenu(false);
  });
})();


/* =========================================
   2. FOOTER YEAR
   ========================================= */
(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();


/* =========================================
   3. NAVBAR BACKGROUND ON SCROLL
   ========================================= */
(function () {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });
})();


/* =========================================
   4. HIGHLIGHT CURRENT SECTION IN MENU
   ========================================= */
(function () {
  const sections = document.querySelectorAll("main section");
  const menuLinks = document.querySelectorAll(".nav-links a");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        menuLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(function (s) { observer.observe(s); });
})();


/* =========================================
   5. FADE-IN ON SCROLL
   ========================================= */
(function () {
  const items = document.querySelectorAll(
    ".section h2, .about-grid, .project-card, .skill-group, .timeline li, .contact-form"
  );
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (item) {
    item.classList.add("reveal");
    observer.observe(item);
  });
})();


/* =========================================
   6. ANIMATED NEURAL NETWORK (hero graphic)
   ========================================= */
(function () {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let nodes = [];
  let mouse = { x: null, y: null };
  let width = 0, height = 0;

  function resize() {
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
        r: Math.random() * 2 + 1.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const linkDist = width * 0.28;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist) {
          ctx.strokeStyle = "rgba(124, 156, 255, " + (1 - d / linkDist) + ")";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    if (mouse.x !== null) {
      nodes.forEach(function (n) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist * 1.2) {
          ctx.strokeStyle = "rgba(79, 209, 197, " + (1 - d / (linkDist * 1.2)) + ")";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    nodes.forEach(function (n) {
      ctx.fillStyle = "#e8eaf0";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function move() {
    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });
  }

  function animate() {
    move();
    draw();
    requestAnimationFrame(animate);
  }

  canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });
  window.addEventListener("resize", function () {
    resize();
    createNodes();
    if (reduceMotion) draw();
  });

  resize();
  createNodes();
  if (reduceMotion) draw(); else animate();
})();


/* =========================================
   7. CONTACT FORM (Formspree)
   ========================================= */
(function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const status = document.createElement("p");
  status.className = "form-status";
  form.appendChild(status);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (form.action.indexOf("YOUR-FORM-ID") !== -1) {
      status.textContent = "The contact form isn't connected yet. Please use the email button above.";
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;
    status.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (response.ok) {
        status.textContent = "Thanks! Your message was sent. I'll reply soon.";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again or use the email button.";
      }
    } catch (err) {
      status.textContent = "No internet connection. Please try again later.";
    }

    button.disabled = false;
  });
})();