const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const body = document.body;

function openSideMenu() {
  sideMenu.classList.add("active");
  overlay.classList.add("active");
  body.classList.add("menu-open");
}

function closeSideMenu() {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
  body.classList.remove("menu-open");
}

openMenu.addEventListener("click", openSideMenu);
closeMenu.addEventListener("click", closeSideMenu);
overlay.addEventListener("click", closeSideMenu);

document.querySelectorAll(".side-menu a").forEach((link) => {
  link.addEventListener("click", closeSideMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSideMenu();
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const topbar = document.querySelector(".topbar");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  topbar.style.background =
    scrollY > 40 ? "rgba(2, 8, 19, 0.78)" : "rgba(2, 8, 19, 0.42)";
});

// Subtle interactive tilt for selected cards.
const tiltCards = document.querySelectorAll(".portrait-card, .research-card, .publication-card, .teaching-panel");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    const rotateY = ((x / rect.width) - 0.5) * 5;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Canvas starfield background.
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let width = 0;
let height = 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createStars();
}

function createStars() {
  const count = Math.min(Math.floor((width * height) / 10500), 150);

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.25 + 0.25,
    vx: (Math.random() - 0.5) * 0.12,
    vy: Math.random() * 0.08 + 0.015,
    alpha: Math.random() * 0.55 + 0.2,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 220, 255, ${star.alpha})`;
    ctx.fill();

    if (!prefersReducedMotion) {
      star.x += star.vx;
      star.y += star.vy;

      if (star.y > height + 5) {
        star.y = -5;
        star.x = Math.random() * width;
      }

      if (star.x < -5) star.x = width + 5;
      if (star.x > width + 5) star.x = -5;
    }
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();
