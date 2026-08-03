(function () {
  "use strict";
  var toggle = document.querySelector(".js-pricing-interval");
  if (!toggle) return;
  var prices = document.querySelectorAll(".js-price-value");
  var lines = document.querySelectorAll(".js-price-line");

  toggle.addEventListener("segmented:change", function (e) {
    var interval = e.detail.value; // "monthly" | "annual"
    prices.forEach(function (el) {
      var value = el.getAttribute("data-" + interval);
      if (value != null) el.textContent = value;
    });
    lines.forEach(function (el) {
      var value = el.getAttribute("data-" + interval + "-line");
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll(".js-annual-badge").forEach(function (el) {
      el.classList.toggle("u-hidden", interval !== "annual");
    });
  });
})();
