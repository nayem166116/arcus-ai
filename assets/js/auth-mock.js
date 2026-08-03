(function () {
  "use strict";

  var USERS_KEY = "arcusMockUsers";

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function getUsers() {
    try {
      return JSON.parse(window.localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUser(email) {
    var users = getUsers();
    var normalized = email.trim().toLowerCase();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === normalized) return users[i];
    }
    return null;
  }

  function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
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

  function validateField(field) {
    var input = field.querySelector(".input");
    if (!input) return true;
    var value = input.value.trim();
    var type = field.getAttribute("data-type");
    field.classList.remove("has-error");
    if (!value) {
      field.classList.add("has-error");
      return false;
    }
    if (type === "email" && !isValidEmail(value)) {
      field.classList.add("has-error");
      return false;
    }
    if (type === "password" && value.length < 8) {
      field.classList.add("has-error");
      return false;
    }
    return true;
  }

  function setButtonLoading(submitBtn, loadingText) {
    if (!submitBtn) return;
    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    var label = submitBtn.querySelector(".js-btn-label");
    if (label) label.textContent = loadingText;
    submitBtn.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-spinner js-btn-spinner" aria-hidden="true"></i>');
  }

  function resetButton(submitBtn, text) {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
    var spinner = submitBtn.querySelector(".js-btn-spinner");
    if (spinner) spinner.remove();
    var label = submitBtn.querySelector(".js-btn-label");
    if (label) label.textContent = text;
  }

  var authForm = document.querySelector(".js-auth-form");

  // ---- Login-page alert handling (registered=1 query param + inline errors) ----
  var loginAlert = document.getElementById("login-alert");
  function showLoginAlert(message, type) {
    if (!loginAlert) {
      window.ArcusToast && window.ArcusToast(message, type === "success" ? "success" : "error");
      return;
    }
    loginAlert.className = "auth-alert js-login-alert auth-alert--" + (type || "error");
    var textEl = loginAlert.querySelector(".js-login-alert-text");
    if (textEl) textEl.textContent = message;
    loginAlert.style.display = "flex";
  }

  if (authForm && authForm.getAttribute("data-mode") === "login") {
    var params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") {
      showLoginAlert("Account created. Log in with the password you just set to continue.", "success");
      window.ArcusToast && window.ArcusToast("Account created — please log in.", "success");
    }
  }

  if (authForm) {
    var mode = authForm.getAttribute("data-mode"); // "login" | "register"

    authForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      authForm.querySelectorAll(".js-field[data-required]").forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (mode === "register") {
        var terms = authForm.querySelector("#agree-terms");
        if (terms && !terms.checked) {
          window.ArcusToast && window.ArcusToast("Please accept the Terms to continue.", "error");
          valid = false;
        }
      }

      if (!valid) return;

      var submitBtn = authForm.querySelector("[type=submit]");

      if (mode === "register") {
        var email = authForm.querySelector("#reg-email").value.trim().toLowerCase();
        var name = authForm.querySelector("#reg-name").value.trim();
        var password = authForm.querySelector("#reg-password").value;

        if (findUser(email)) {
          window.ArcusToast && window.ArcusToast("An account with this email already exists. Please log in instead.", "error");
          return;
        }

        setButtonLoading(submitBtn, "Sending code…");

        window.setTimeout(function () {
          resetButton(submitBtn, "Create account");
          window.__arcusPendingSignup = { name: name, email: email, password: password };
          showVerifyStep(email);
        }, 900);
        return;
      }

      // login mode
      var loginEmail = authForm.querySelector("#login-email").value.trim().toLowerCase();
      var loginPassword = authForm.querySelector("#login-password").value;
      var user = findUser(loginEmail);

      if (loginAlert) { loginAlert.style.display = "none"; }

      if (!user) {
        showLoginAlert("No account found with this email. Please sign up first.", "error");
        return;
      }
      if (user.password !== loginPassword) {
        showLoginAlert("Incorrect password. Please try again.", "error");
        return;
      }

      setButtonLoading(submitBtn, "Signing in…");
      window.setTimeout(function () {
        window.location.href = "app-loading.html";
      }, 1200);
    });
  }

  // ---- Registration: verification step ----
  var stepRegister = document.getElementById("auth-step-register");
  var stepVerify = document.getElementById("auth-step-verify");
  var verifyForm = document.querySelector(".js-verify-form");

  function showVerifyStep(email) {
    if (!stepVerify) return;
    if (stepRegister) stepRegister.style.display = "none";
    stepVerify.style.display = "block";
    var emailTarget = stepVerify.querySelector(".js-verify-email-target");
    if (emailTarget) emailTarget.textContent = email;
    window.ArcusToast && window.ArcusToast("A verification code has been sent to your email.", "success");
  }

  if (verifyForm) {
    verifyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var field = verifyForm.querySelector(".js-field");
      var input = document.getElementById("verify-code");
      var pending = window.__arcusPendingSignup;
      field.classList.remove("has-error");

      if (!pending) {
        window.ArcusToast && window.ArcusToast("Something went wrong. Please sign up again.", "error");
        return;
      }
      var entered = input.value.trim();
      if (!/^\d{6}$/.test(entered)) {
        field.classList.add("has-error");
        window.ArcusToast && window.ArcusToast("Enter the 6-digit code we sent you.", "error");
        return;
      }

      var submitBtn = verifyForm.querySelector("[type=submit]");
      setButtonLoading(submitBtn, "Creating account…");

      window.setTimeout(function () {
        var users = getUsers();
        users.push({ name: pending.name, email: pending.email, password: pending.password });
        saveUsers(users);
        window.__arcusPendingSignup = null;
        window.location.href = "login.html?registered=1";
      }, 700);
    });

    var resendLink = document.querySelector(".js-resend-code");
    if (resendLink) {
      resendLink.addEventListener("click", function (e) {
        e.preventDefault();
        var pending = window.__arcusPendingSignup;
        if (!pending) return;
        window.ArcusToast && window.ArcusToast("We've sent a new code to your email.", "success");
      });
    }
  }
})();
