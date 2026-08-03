(function () {
  "use strict";
  var accordions = document.querySelectorAll(".js-accordion");
  accordions.forEach(function (accordion) {
    var singleOpen = accordion.getAttribute("data-single-open") === "true";
    var items = accordion.querySelectorAll(".js-accordion-item");
    items.forEach(function (item) {
      var trigger = item.querySelector(".js-accordion-trigger");
      var panel = item.querySelector(".accordion__panel");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        if (singleOpen) {
          items.forEach(function (i) {
            i.classList.remove("is-open");
            var t = i.querySelector(".js-accordion-trigger");
            if (t) t.setAttribute("aria-expanded", "false");
          });
        }
        item.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", (!isOpen).toString());
      });
      if (panel && !panel.id) {
        panel.id = "panel-" + Math.random().toString(36).slice(2, 9);
        trigger.setAttribute("aria-controls", panel.id);
      }
    });
  });
})();
