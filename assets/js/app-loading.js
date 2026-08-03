(function () {
  "use strict";
  var caption = document.querySelector(".js-loading-caption");
  var backLink = document.querySelector(".js-loading-back");
  if (!caption) return;

  var stages = [
    { at: 0, text: "Loading your workspace…" },
    { at: 4000, text: "Still working on it…" },
    { at: 12000, text: "This is taking longer than expected…" }
  ];

  stages.forEach(function (stage) {
    window.setTimeout(function () {
      caption.textContent = stage.text;
    }, stage.at);
  });

  window.setTimeout(function () {
    if (backLink) backLink.classList.add("is-visible");
  }, 25000);
})();
