(function () {
  "use strict";

  function setError(field, message) {
    field.classList.add("has-error");
    field.classList.remove("has-success");
    var err = field.querySelector(".form-field__error span");
    if (err && message) err.textContent = message;
  }
  function clearError(field) {
    field.classList.remove("has-error");
  }
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // Generic client-side mock validation for forms marked .js-mock-form
  document.querySelectorAll(".js-mock-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll(".js-field[data-required]").forEach(function (field) {
        var input = field.querySelector(".input, .textarea");
        if (!input) return;
        var value = input.value.trim();
        var type = field.getAttribute("data-type");
        if (!value) {
          setError(field, "This field is required.");
          valid = false;
        } else if (type === "email" && !isValidEmail(value)) {
          setError(field, "Enter a valid email address.");
          valid = false;
        } else {
          clearError(field);
        }
        input.addEventListener("input", function () { clearError(field); }, { once: true });
      });
      if (!valid) return;

      var submitBtn = form.querySelector("[type=submit]");
      var successBlock = document.querySelector(form.getAttribute("data-success-target") || "");
      if (submitBtn) {
        submitBtn.classList.add("is-loading");
        submitBtn.disabled = true;
        var label = submitBtn.querySelector(".js-btn-label");
        var original = label ? label.textContent : null;
        submitBtn.dataset.originalLabel = original || "";
        if (label) label.textContent = "Sending…";
        submitBtn.insertAdjacentHTML("afterbegin", '<i class="fa-solid fa-spinner js-btn-spinner" aria-hidden="true"></i>');
      }
      window.setTimeout(function () {
        if (successBlock) {
          form.classList.add("u-hidden");
          successBlock.classList.remove("u-hidden");
        } else if (window.ArcusToast) {
          window.ArcusToast("Message sent. We will reply within one business day.", "success");
          form.reset();
        }
        if (submitBtn) {
          submitBtn.classList.remove("is-loading");
          submitBtn.disabled = false;
          var spinner = submitBtn.querySelector(".js-btn-spinner");
          if (spinner) spinner.remove();
          var label = submitBtn.querySelector(".js-btn-label");
          if (label) label.textContent = submitBtn.dataset.originalLabel || label.textContent;
        }
      }, 900);
    });
  });
})();
