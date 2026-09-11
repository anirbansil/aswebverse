(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Desktop mega menu ---------- */
  var menuItems = document.querySelectorAll(".nav-item-menu");
  var closeTimer = null;

  function closeAllMenus() {
    menuItems.forEach(function (item) {
      item.classList.remove("is-open");
      var trigger = item.querySelector(".nav-link-menu");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  menuItems.forEach(function (item) {
    var trigger = item.querySelector(".nav-link-menu");

    item.addEventListener("mouseenter", function () {
      if (window.innerWidth <= 991) return;
      clearTimeout(closeTimer);
      closeAllMenus();
      item.classList.add("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    });

    item.addEventListener("mouseleave", function () {
      if (window.innerWidth <= 991) return;
      closeTimer = setTimeout(function () {
        item.classList.remove("is-open");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }, 220);
    });

    if (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = item.classList.contains("is-open");
        closeAllMenus();
        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    }
  });

  document.addEventListener("click", function (e) {
    var withinMenu = e.target.closest(".nav-item-menu");
    if (!withinMenu) closeAllMenus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllMenus();
  });

  /* ---------- Mobile drawer ---------- */
  var mobileToggle = document.querySelector(".mobile-menu-button");
  var drawer = document.querySelector(".mobile-drawer");
  var overlay = document.querySelector(".drawer-overlay");
  var drawerClose = document.querySelector(".mobile-drawer-close");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("drawer-open");
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
  }
  if (mobileToggle) mobileToggle.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------- Mobile accordion ---------- */
  document.querySelectorAll(".mobile-accordion-toggle").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var isOpen = btn.classList.contains("is-open");
      document.querySelectorAll(".mobile-accordion-toggle").forEach(function (b) {
        b.classList.remove("is-open");
        var p = document.getElementById(b.getAttribute("aria-controls"));
        if (p) p.style.maxHeight = null;
      });
      if (!isOpen) {
        btn.classList.add("is-open");
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay") || 0;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, parseInt(delay, 10));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-counter]");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (el.getAttribute("data-counter").split(".")[1] || "").length;
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (reducedMotion) {
              var t = entry.target;
              t.textContent = parseFloat(t.getAttribute("data-counter")) + (t.getAttribute("data-suffix") || "");
            } else {
              animateCounter(entry.target);
            }
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      counterIO.observe(el);
    });
  }

  /* ---------- Testimonial slider ---------- */
  var testimonialCards = document.querySelectorAll(".testimonial-card");
  var testimonialDots = document.querySelectorAll(".testimonial-dot");
  var activeIndex = 0;
  var testimonialTimer = null;

  function showTestimonial(index) {
    testimonialCards.forEach(function (card, i) {
      card.classList.toggle("is-active", i === index);
    });
    testimonialDots.forEach(function (dot, i) {
      dot.classList.toggle("dot-active", i === index);
    });
    activeIndex = index;
  }

  function nextTestimonial() {
    var next = (activeIndex + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  function startTestimonialLoop() {
    if (testimonialCards.length < 2 || reducedMotion) return;
    testimonialTimer = setInterval(nextTestimonial, 6000);
  }

  if (testimonialCards.length) {
    testimonialDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        clearInterval(testimonialTimer);
        showTestimonial(i);
        startTestimonialLoop();
      });
    });
    startTestimonialLoop();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    var item = btn.closest(".faq-item");
    var answer = item.querySelector(".faq-answer");

    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach(function (otherItem) {
        otherItem.classList.remove("is-open");
        var otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
  var firstOpenFaq = document.querySelector(".faq-item.is-open .faq-answer");
  if (firstOpenFaq) firstOpenFaq.style.maxHeight = firstOpenFaq.scrollHeight + "px";

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var successBox = document.getElementById("contactSuccess");
      contactForm.reset();
      contactForm.hidden = true;
      if (successBox) successBox.hidden = false;
    });
  }

  /* ---------- Subtle hero / cta parallax ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reducedMotion) {
    var ticking = false;
    function updateParallax() {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          var offset = (scrollY - (el.dataset.startY || 0)) * speed;
          el.style.transform = "translate3d(0," + Math.min(Math.max(offset * 0.1, -40), 40) + "px,0) scale(1.08)";
        }
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateParallax();
  }
})();
