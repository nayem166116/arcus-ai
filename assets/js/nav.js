(function () {
  "use strict";

  var nav = document.querySelector(".js-nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 4) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Desktop dropdown menus (nav__item.is-open)
  var navItems = document.querySelectorAll(".js-nav-item");
  navItems.forEach(function (item) {
    var trigger = item.querySelector(".js-nav-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var wasOpen = item.classList.contains("is-open");
      navItems.forEach(function (i) { i.classList.remove("is-open"); });
      if (!wasOpen) item.classList.add("is-open");
    });
  });
  document.addEventListener("click", function (e) {
    navItems.forEach(function (item) {
      if (!item.contains(e.target)) item.classList.remove("is-open");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      navItems.forEach(function (item) { item.classList.remove("is-open"); });
    }
  });

  // Mobile drawer
  var toggle = document.querySelector(".js-nav-toggle");
  var drawer = document.querySelector(".js-nav-drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var isOpen = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
      toggle.querySelector("i").className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });
  }
  var drawerItems = document.querySelectorAll(".js-drawer-item");
  drawerItems.forEach(function (item) {
    var trigger = item.querySelector(".js-drawer-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      item.classList.toggle("is-open");
    });
  });

  // Announcement bar dismiss (persists for session)
  var announce = document.querySelector(".js-nav-announce");
  if (announce) {
    if (sessionStorage.getItem("arcus-announce-dismissed") === "1") {
      announce.remove();
    } else {
      var close = announce.querySelector(".js-announce-close");
      if (close) {
        close.addEventListener("click", function () {
          announce.remove();
          sessionStorage.setItem("arcus-announce-dismissed", "1");
        });
      }
    }
  }
})();
