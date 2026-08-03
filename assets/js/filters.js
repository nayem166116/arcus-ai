(function () {
  "use strict";

  // Generic pill filter: filters .js-filterable-item by data-category, plus optional search input
  var filterGroups = document.querySelectorAll(".js-filter-group");
  filterGroups.forEach(function (group) {
    var scope = document.querySelector(group.getAttribute("data-scope"));
    if (!scope) return;
    var pills = group.querySelectorAll(".js-filter-pill");
    var searchInput = document.querySelector(group.getAttribute("data-search") || "");
    var emptyState = document.querySelector(group.getAttribute("data-empty") || "");
    var activeCategory = "all";

    function applyFilters() {
      var items = scope.querySelectorAll(".js-filterable-item");
      var query = (searchInput && searchInput.value || "").trim().toLowerCase();
      var visibleCount = 0;
      items.forEach(function (item) {
        var category = item.getAttribute("data-category") || "";
        var text = (item.getAttribute("data-search-text") || item.textContent || "").toLowerCase();
        var matchesCategory = activeCategory === "all" || category.split(" ").indexOf(activeCategory) > -1;
        var matchesQuery = !query || text.indexOf(query) > -1;
        var visible = matchesCategory && matchesQuery;
        item.classList.toggle("u-hidden", !visible);
        if (visible) visibleCount++;
      });
      if (emptyState) emptyState.classList.toggle("u-hidden", visibleCount !== 0);
    }

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        activeCategory = pill.getAttribute("data-value") || "all";
        applyFilters();
      });
    });
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    applyFilters();
  });
})();
