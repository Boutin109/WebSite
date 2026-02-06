/*  
  Features:
  - Mobile menu toggle with accessibility
  - Smooth scrolling navigation
  - Active section highlighting
  - Scroll reveal animations
  - Animated number counters
  - Contact form handling
  - 3D cube interaction
*/

// DOM Elements
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const nav = document.getElementById("nav");
const sections = document.querySelectorAll(".section");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// =====================
// Mobile Menu Toggle
// =====================
if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    const isActive = mobileMenuBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    mobileMenuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
    navMenu.setAttribute("aria-hidden", isActive ? "false" : "true");

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? "hidden" : "";
  });

  // Close menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("active");
      navMenu.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      navMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      mobileMenuBtn.classList.remove("active");
      navMenu.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      navMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      mobileMenuBtn.focus();
    }
  });
}

// =====================
// Smooth Scroll Navigation
// =====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// =====================
// Active Navigation State
// =====================
function updateActiveNav() {
  const scrollPosition =
    window.pageYOffset + (nav ? nav.offsetHeight : 0) + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// =====================
// Nav Background on Scroll
// =====================
function updateNavBackground() {
  if (!nav) return;

  if (window.pageYOffset > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

// =====================
// Scroll Reveal Animations
// =====================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".service-card, .info-card, .skill-chip, .highlight-card, .about-content p, .pricing-banner",
  );

  revealElements.forEach((el) => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

// =====================
// Animated Number Counters
// =====================
function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-count"));
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

// =====================
// 3D Cube Interaction
// =====================
function initCubeInteraction() {
  const cube = document.querySelector(".rubiks-cube-3d");
  if (!cube) return;

  let isHovered = false;

  cube.addEventListener("mouseenter", () => {
    isHovered = true;
    cube.style.animationPlayState = "paused";
  });

  cube.addEventListener("mouseleave", () => {
    isHovered = false;
    cube.style.animationPlayState = "running";
  });

  // Optional: Make cube follow mouse on hover
  cube.addEventListener("mousemove", (e) => {
    if (!isHovered) return;

    const rect = cube.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (e.clientX - centerX) / 10;

    cube.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  });
}

// =====================
// Contact Form Handling (Web3Forms)
// =====================
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Basic validation
    if (!name || !email || !message) {
      showFormStatus("Please complete all required fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus("Please enter a valid email address.", "error");
      return;
    }

    const formData = new FormData(contactForm);
    formData.append("access_key", "cd3a30fc-fc19-4a67-8152-3c602c3e4d46");

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showFormStatus("Success! Your message has been sent.", "success");
        contactForm.reset();
      } else {
        showFormStatus(
          `Error: ${data.message || "Unable to send message."}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      showFormStatus("Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormStatus(message, type) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 6000);
  }
}

// =====================
// Parallax Effect for Background Cubes
// =====================
function initParallax() {
  const cubes = document.querySelectorAll(".floating-cube");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    cubes.forEach((cube, index) => {
      const speed = 0.1 + index * 0.05;
      cube.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
    });
  });
}

// =====================
// Intersection Observer for Section Animations
// =====================
function initSectionAnimations() {
  const sectionHeaders = document.querySelectorAll(
    ".section-header, .section-tag",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.2 },
  );

  sectionHeaders.forEach((header) => {
    header.style.opacity = "0";
    header.style.transform = "translateY(20px)";
    header.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(header);
  });
}

// =====================
// Initialize Everything
// =====================
function init() {
  // Event listeners
  window.addEventListener("scroll", () => {
    updateActiveNav();
    updateNavBackground();
  });

  window.addEventListener("resize", updateActiveNav);

  // Initialize features
  initScrollReveal();
  animateCounters();
  initCubeInteraction();
  initParallax();
  initSectionAnimations();

  // Initial calls
  updateActiveNav();
  updateNavBackground();
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Add interactive cursor to clickable elements
document.querySelectorAll("a, button, .service-card").forEach((el) => {
  el.style.cursor = "pointer";
});
