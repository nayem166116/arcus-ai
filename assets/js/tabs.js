(function () {
  "use strict";
  var groups = document.querySelectorAll(".js-tabs");
  groups.forEach(function (group) {
    var tabs = group.querySelectorAll(".js-tab");
    var panelWrap = document.querySelector(group.getAttribute("data-panels"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var target = tab.getAttribute("data-target");
        if (panelWrap) {
          panelWrap.querySelectorAll(".js-tab-panel").forEach(function (p) {
            p.classList.toggle("u-hidden", p.getAttribute("data-panel") !== target);
          });
        }
      });
    });
  });

  // Segmented / pill toggle groups sharing the same behavior (e.g. plan interval)
  var segmented = document.querySelectorAll(".js-segmented");
  segmented.forEach(function (group) {
    var options = group.querySelectorAll(".js-segmented-option");
    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        options.forEach(function (o) { o.classList.remove("is-active"); });
        opt.classList.add("is-active");
        group.dispatchEvent(new CustomEvent("segmented:change", { detail: { value: opt.getAttribute("data-value") } }));
      });
    });
  });
})();
