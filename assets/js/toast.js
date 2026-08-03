(function () {
  "use strict";
  var region = document.querySelector(".js-toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region js-toast-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }

  window.ArcusToast = function (message, type) {
    type = type || "success";
    var icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
    var toast = document.createElement("div");
    toast.className = "toast toast--" + type;
    toast.innerHTML =
      '<i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + message + "</span>";
    region.appendChild(toast);
    window.setTimeout(function () {
      toast.style.transition = "opacity 180ms ease";
      toast.style.opacity = "0";
      window.setTimeout(function () { toast.remove(); }, 200);
    }, 3200);
  };
})();
