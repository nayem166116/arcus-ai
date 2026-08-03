(function () {
  "use strict";
  var openers = document.querySelectorAll("[data-modal-open]");
  var lastFocused = null;

  function openModal(id) {
    var backdrop = document.getElementById(id);
    if (!backdrop) return;
    lastFocused = document.activeElement;
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var focusable = backdrop.querySelector("button, a, input");
    if (focusable) focusable.focus();
  }
  function closeModal(backdrop) {
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach(function (opener) {
    opener.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(opener.getAttribute("data-modal-open"));
    });
  });
  document.querySelectorAll(".modal-backdrop").forEach(function (backdrop) {
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal(backdrop);
    });
    backdrop.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(backdrop); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.is-open").forEach(closeModal);
    }
  });
})();
