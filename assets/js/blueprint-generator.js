(function () {
  "use strict";
  var form = document.querySelector(".js-blueprint-form");
  if (!form) return;

  var textarea = form.querySelector(".js-blueprint-input");
  var charCount = document.querySelector(".js-blueprint-charcount");
  var submitBtn = form.querySelector(".js-blueprint-submit");
  var teamSelect = form.querySelector(".js-blueprint-team");
  var toolChips = form.querySelectorAll(".js-blueprint-tool-chip");
  var volumeSelect = form.querySelector(".js-blueprint-volume");
  var presetChips = document.querySelectorAll(".js-blueprint-preset");
  var resetBtn = document.querySelector(".js-blueprint-reset");

  var stateEmpty = document.querySelector(".js-blueprint-state-empty");
  var stateLoading = document.querySelector(".js-blueprint-state-loading");
  var stateResult = document.querySelector(".js-blueprint-state-result");
  var stateError = document.querySelector(".js-blueprint-state-error");
  var loadingLabel = document.querySelector(".js-blueprint-loading-label");
  var loadingBar = document.querySelector(".js-blueprint-loading-bar");

  var MAX_LEN = 600;
  var MIN_LEN = 24;

  var PRESETS = {
    support: "When a customer submits a support ticket tagged urgent, triage severity, search our help center and past tickets for a matching answer, draft a reply in our tone of voice, and escalate to the on-call engineer if no confident answer is found.",
    sales: "When a new lead fills out our demo request form, enrich the company and contact details, score the lead against our ideal customer profile, and if it qualifies, book a call on the AE's calendar and notify them in Slack.",
    it: "When an employee requests software access through our internal form, check their role and manager, verify budget approval for paid tools, and provision the account automatically or route to IT for manual review."
  };

  var TOOL_LIBRARY = [
    { id: "helpdesk", name: "Helpdesk", icon: "fa-headset" },
    { id: "crm", name: "CRM", icon: "fa-address-card" },
    { id: "slack", name: "Slack", icon: "fa-slack" },
    { id: "email", name: "Email", icon: "fa-envelope" },
    { id: "calendar", name: "Calendar", icon: "fa-calendar" },
    { id: "docs", name: "Docs / Wiki", icon: "fa-file-lines" },
    { id: "database", name: "Database", icon: "fa-database" },
    { id: "ticketing", name: "Ticketing", icon: "fa-ticket" }
  ];

  function selectedTools() {
    return Array.from(toolChips)
      .filter(function (c) { return c.classList.contains("is-selected"); })
      .map(function (c) { return c.getAttribute("data-tool"); });
  }

  toolChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chip.classList.toggle("is-selected");
    });
  });

  presetChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.getAttribute("data-preset");
      textarea.value = PRESETS[key] || "";
      updateCharCount();
      textarea.focus();
    });
  });

  function updateCharCount() {
    if (!charCount) return;
    var len = textarea.value.length;
    charCount.textContent = len + " / " + MAX_LEN;
    charCount.classList.toggle("is-warn", len > MAX_LEN);
  }
  if (textarea) {
    textarea.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  function showState(state) {
    [stateEmpty, stateLoading, stateResult, stateError].forEach(function (el) {
      if (el) el.classList.add("u-hidden");
    });
    if (state) state.classList.remove("u-hidden");
  }

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function buildMockBlueprint(description, team, tools, volume) {
    var seed = hashString(description + team + volume) || 1;
    var toolMeta = tools.length
      ? tools.map(function (id) {
          return TOOL_LIBRARY.filter(function (t) { return t.id === id; })[0] || { id: id, name: id, icon: "fa-plug" };
        })
      : [TOOL_LIBRARY[0], TOOL_LIBRARY[1], TOOL_LIBRARY[2]];

    var teamLabelMap = { support: "Support", sales: "Sales Ops", it: "IT", success: "Customer Success", ops: "Operations" };
    var teamLabel = teamLabelMap[team] || "Operations";

    var agentNamesByTeam = {
      support: "Ticket Triage Agent",
      sales: "Lead Qualification Agent",
      it: "Access Request Agent",
      success: "Renewal Risk Agent",
      ops: "Workflow Router Agent"
    };
    var agentName = agentNamesByTeam[team] || "Operations Agent";

    var stepLibrary = [
      { title: "Watch for trigger event", desc: "Listens for a new record matching the described condition.", tool: toolMeta[0], gate: false, duration: 0.4 },
      { title: "Gather context", desc: "Pulls related history, prior records, and linked fields needed to make a decision.", tool: toolMeta[1] || toolMeta[0], gate: false, duration: 1.8 },
      { title: "Classify and score", desc: "Applies the workspace's classification rules to determine severity, priority, or fit.", tool: toolMeta[1] || toolMeta[0], gate: false, duration: 2.1 },
      { title: "Draft the response or update", desc: "Generates a draft aligned to house tone and existing templates for a person to review.", tool: toolMeta[2] || toolMeta[0], gate: false, duration: 3.4 },
      { title: "Confidence check", desc: "Compares draft confidence against the workspace threshold before proceeding automatically.", tool: toolMeta[0], gate: true, duration: 0.6 },
      { title: "Notify or hand off", desc: "Sends a summary to the right channel or person, or escalates when confidence is low.", tool: toolMeta[2] || toolMeta[0], gate: false, duration: 0.9 },
      { title: "Log outcome", desc: "Records the run, decision, and any human edits back to the source system for audit.", tool: toolMeta[1] || toolMeta[0], gate: false, duration: 0.5 }
    ];

    var stepCount = 5 + Math.floor(seededRandom(seed) * 3); // 5-7
    var steps = stepLibrary.slice(0, stepCount);

    var volumeMap = { low: 40, medium: 220, high: 900 };
    var runsPerWeek = volumeMap[volume] || 220;
    var minutesPerRunManual = 6 + Math.round(seededRandom(seed + 1) * 9); // 6-15
    var minutesPerRunAgent = 1 + Math.round(seededRandom(seed + 2) * 2); // 1-3
    var minutesSavedPerWeek = runsPerWeek * (minutesPerRunManual - minutesPerRunAgent);
    var hoursSavedPerWeek = Math.round((minutesSavedPerWeek / 60) * 10) / 10;
    var confidence = 82 + Math.round(seededRandom(seed + 3) * 13); // 82-95

    var totalDuration = steps.reduce(function (sum, s) { return sum + s.duration; }, 0);

    return {
      agentName: agentName,
      team: teamLabel,
      generatedAt: new Date(),
      inputSummary: description,
      steps: steps,
      guardrails: [
        "Runs only during business hours unless marked urgent",
        "Never sends an external message without a confidence score above " + confidence + "%",
        "Escalates to a human reviewer when required fields are missing",
        "All actions are logged with a full audit trail for compliance review"
      ],
      riskNotes: confidence < 90
        ? "Moderate-confidence workflow. We recommend human review for the first 2 weeks before enabling full autonomy."
        : "High-confidence workflow. Safe to enable autonomous mode after a 1-week supervised trial.",
      metrics: {
        runsPerWeek: runsPerWeek,
        estimatedRunTime: totalDuration.toFixed(1) + "s",
        hoursSavedPerWeek: hoursSavedPerWeek,
        confidence: confidence
      }
    };
  }

  function renderResult(bp) {
    var root = stateResult;
    if (!root) return;

    root.querySelector(".js-bp-name").textContent = bp.agentName;
    root.querySelector(".js-bp-team").textContent = bp.team + " workflow";
    root.querySelector(".js-bp-timestamp").textContent =
      "Generated " + bp.generatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    root.querySelector(".js-bp-stat-runs").textContent = bp.metrics.runsPerWeek.toLocaleString();
    root.querySelector(".js-bp-stat-hours").textContent = bp.metrics.hoursSavedPerWeek + " hrs";
    root.querySelector(".js-bp-stat-confidence").textContent = bp.metrics.confidence + "%";

    var timeline = root.querySelector(".js-bp-timeline");
    timeline.innerHTML = "";
    bp.steps.forEach(function (step, idx) {
      var row = document.createElement("div");
      row.className = "step-row";
      row.innerHTML =
        '<div class="step-row__marker"><span class="step-badge">' + (idx + 1) + "/" + bp.steps.length + "</span></div>" +
        '<div>' +
        '<div class="step-row__title"><i class="fa-solid ' + step.tool.icon + '" aria-hidden="true" style="margin-right:6px;color:var(--color-primary);font-size:12px;"></i>' + step.title + "</div>" +
        '<div class="step-row__desc">' + step.desc + "</div>" +
        '<div class="step-row__meta">' +
        '<span class="badge badge--mono">' + step.tool.name + "</span>" +
        (step.gate ? '<span class="badge badge--warning"><i class="fa-solid fa-shield-halved"></i>&nbsp;Approval gate</span>' : "") +
        '<span class="step-row__duration">~' + step.duration.toFixed(1) + "s</span>" +
        "</div></div>";
      timeline.appendChild(row);
    });

    var guardrailList = root.querySelector(".js-bp-guardrails");
    guardrailList.innerHTML = bp.guardrails
      .map(function (g) {
        return '<li><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span>' + g + "</span></li>";
      })
      .join("");

    root.querySelector(".js-bp-risk").textContent = bp.riskNotes;

    root.querySelector(".js-bp-data").textContent = JSON.stringify(
      {
        agent_name: bp.agentName,
        team: bp.team,
        step_count: bp.steps.length,
        runs_per_week_estimate: bp.metrics.runsPerWeek,
        hours_saved_per_week_estimate: bp.metrics.hoursSavedPerWeek,
        confidence_score: bp.metrics.confidence + "%",
        guardrail_count: bp.guardrails.length
      },
      null,
      2
    );
  }

  function runGeneration() {
    var description = textarea.value.trim();

    if (description.length < MIN_LEN) {
      showState(stateError);
      var errMsg = stateError.querySelector(".js-bp-error-message");
      if (errMsg) errMsg.textContent = "Add a bit more detail (at least " + MIN_LEN + " characters) so we can map out accurate steps.";
      return;
    }

    showState(stateLoading);
    submitBtn.disabled = true;

    var stages = [
      "Reading your workflow description…",
      "Matching tools and systems…",
      "Mapping decision points and guardrails…",
      "Estimating time saved…",
      "Finalizing blueprint…"
    ];
    var stageIndex = 0;
    if (loadingLabel) loadingLabel.textContent = stages[0];
    if (loadingBar) loadingBar.style.width = "6%";

    var stageTimer = window.setInterval(function () {
      stageIndex++;
      if (stageIndex < stages.length) {
        if (loadingLabel) loadingLabel.textContent = stages[stageIndex];
        if (loadingBar) loadingBar.style.width = Math.round(((stageIndex + 1) / stages.length) * 92) + "%";
      }
    }, 1900);

    window.setTimeout(function () {
      window.clearInterval(stageTimer);
      if (loadingBar) loadingBar.style.width = "100%";

      var team = teamSelect ? teamSelect.value : "ops";
      var volume = volumeSelect ? volumeSelect.value : "medium";
      var tools = selectedTools();

      window.setTimeout(function () {
        var bp = buildMockBlueprint(description, team, tools, volume);
        renderResult(bp);
        showState(stateResult);
        submitBtn.disabled = false;
      }, 300);
    }, 9800);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    runGeneration();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      textarea.value = "";
      updateCharCount();
      toolChips.forEach(function (c) { c.classList.remove("is-selected"); });
      showState(stateEmpty);
      textarea.focus();
    });
  }

  document.querySelectorAll(".js-bp-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var data = document.querySelector(".js-bp-data");
      if (!data) return;
      var text = document.querySelector(".js-bp-name").textContent + " — blueprint summary\n" + data.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          window.ArcusToast && window.ArcusToast("Blueprint copied to clipboard.", "success");
        });
      }
    });
  });

  document.querySelectorAll(".js-bp-email").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.ArcusToast && window.ArcusToast("We’ve emailed a copy of this blueprint to you (demo only).", "success");
    });
  });

  document.querySelectorAll(".js-bp-retry").forEach(function (btn) {
    btn.addEventListener("click", function () {
      runGeneration();
    });
  });
})();
