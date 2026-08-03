(function () {
  "use strict";

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.querySelectorAll(".js-auth-password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".auth-password-wrap");
      var input = wrap.querySelector("input");
      var icon = btn.querySelector("i");
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      icon.className = showing ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  var form = document.querySelector(".js-auth-form");
  if (!form) return;
  var mode = form.getAttribute("data-mode"); // "login" | "register"

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll(".js-field[data-required]").forEach(function (field) {
      var input = field.querySelector(".input");
      if (!input) return;
      var value = input.value.trim();
      var type = field.getAttribute("data-type");
      field.classList.remove("has-error");
      if (!value) {
        field.classList.add("has-error");
        valid = false;
      } else if (type === "email" && !isValidEmail(value)) {
        field.classList.add("has-error");
        valid = false;
      } else if (type === "password" && value.length < 8) {
        field.classList.add("has-error");
        valid = false;
      }
    });

    if (mode === "register") {
      var terms = form.querySelector("#agree-terms");
      if (terms && !terms.checked) {
        window.ArcusToast && window.ArcusToast("Please accept the Terms to continue.", "error");
        valid = false;
      }
    }

    if (!valid) return;

    var submitBtn = form.querySelector("[type=submit]");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      var label = submitBtn.querySelector(".js-btn-label");
      if (label) label.textContent = mode === "register" ? "Creating account…" : "Signing in…";
      submitBtn.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-spinner js-btn-spinner" aria-hidden="true"></i>');
    }

    // Mock success: after a short delay, redirect to the blank stuck-loading page.
    window.setTimeout(function () {
      window.location.href = "app-loading.html";
    }, 1200);
  });
})();
