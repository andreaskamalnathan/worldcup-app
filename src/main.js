const RAW_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// ─── Tab System ───────────────────────────────────────────
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels  = document.querySelectorAll(".tab-panel");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      panels.forEach(p => {
        p.classList.remove("active");
        p.hidden = true;
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const panel = document.getElementById(`panel-${target}`);
      panel.classList.add("active");
      panel.hidden = false;
    });
  });
}

// ─── Data Fetching ────────────────────────────────────────
async function initApp() {
  initTabs();

  try {
    const response = await fetch(RAW_URL);
    if (!response.ok) throw new Error("Network request failed");

    const data    = await response.json();
    const matches = data.matches || [];

    renderMatches(matches);
    const standings = computeStandings(matches);
    renderStandings(standings);

  } catch (err) {
    document.getElementById("standings-tables").innerHTML =
      `<p class="skeleton-pulse">Could not load standings. Check your connection and try refreshing.</p>`;
    document.getElementById("matches-list").innerHTML =
      `<p class="skeleton-pulse">Could not load matches. Check your connection and try refreshing.</p>`;
    console.error(err);
  }
}

// ─── Render Matches ───────────────────────────────────────
function renderMatches(matches) {
  const container   = document.getElementById("matches-list");
  const filterWrap  = document.getElementById("matches-filter");
  const groupSelect = document.getElementById("group-filter");

  container.innerHTML = "";

  // Collect unique groups for filter
  const groups = [...new Set(matches.map(m => m.group).filter(Boolean))];
  groups.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    groupSelect.appendChild(opt);
  });

  filterWrap.style.display = "flex";

  const buildList = (filter) => {
    container.innerHTML = "";
    const filtered = filter === "all" ? matches : matches.filter(m => m.group === filter);

    if (filtered.length === 0) {
      container.innerHTML = `<p class="skeleton-pulse">No matches found for this group.</p>`;
      return;
    }

    const timeline = document.createElement("div");
    timeline.className = "matches-timeline";

    let lastGroup = null;

    filtered.forEach(match => {
      const groupLabel = match.group || "Knockout Stage";

      if (groupLabel !== lastGroup) {
        const divider = document.createElement("div");
        divider.className = "match-group-label";
        divider.textContent = groupLabel;
        timeline.appendChild(divider);
        lastGroup = groupLabel;
      }

      const played     = match.score && match.score.ft;
      const scoreHome  = played ? match.score.ft[0] : "–";
      const scoreAway  = played ? match.score.ft[1] : "–";

      const card = document.createElement("div");
      card.className = "match-card";
      card.innerHTML = `
        <div class="match-meta-row">
          <span class="match-group-tag">${match.group || "Knockout"}</span>
          <span class="match-venue">${match.ground || ""}</span>
        </div>
        <div class="scoreboard">
          <div class="team-block home">
            <span class="team-name">${match.team1}</span>
            <span class="team-label">Home</span>
          </div>
          <div class="score-block">
            <div class="score-box ${played ? "" : "unplayed"}">${scoreHome}</div>
            <span class="score-divider">:</span>
            <div class="score-box ${played ? "" : "unplayed"}">${scoreAway}</div>
          </div>
          <div class="team-block away">
            <span class="team-name">${match.team2}</span>
            <span class="team-label">Away</span>
          </div>
        </div>
      `;
      timeline.appendChild(card);
    });

    container.appendChild(timeline);
  };

  buildList("all");

  groupSelect.addEventListener("change", () => buildList(groupSelect.value));
}

// ─── Compute Standings ────────────────────────────────────
function computeStandings(matches) {
  const groups = {};

  matches.forEach(match => {
    const gName = match.group;
    if (!gName) return;

    if (!groups[gName]) groups[gName] = {};

    [match.team1, match.team2].forEach(team => {
      if (!groups[gName][team]) {
        groups[gName][team] = { name: team, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
      }
    });

    if (match.score && match.score.ft) {
      const s1 = match.score.ft[0];
      const s2 = match.score.ft[1];
      const t1 = groups[gName][match.team1];
      const t2 = groups[gName][match.team2];

      t1.P += 1; t2.P += 1;
      t1.GF += s1; t1.GA += s2; t1.GD += (s1 - s2);
      t2.GF += s2; t2.GA += s1; t2.GD += (s2 - s1);

      if (s1 > s2)      { t1.W += 1; t2.L += 1; t1.Pts += 3; }
      else if (s2 > s1) { t2.W += 1; t1.L += 1; t2.Pts += 3; }
      else              { t1.D += 1; t2.D += 1; t1.Pts += 1; t2.Pts += 1; }
    }
  });

  for (let g in groups) {
    groups[g] = Object.values(groups[g]).sort((a, b) => b.Pts - a.Pts || b.GD - a.GD);
  }
  return groups;
}

// ─── Render Standings ─────────────────────────────────────
function renderStandings(groups) {
  const container = document.getElementById("standings-tables");
  container.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "standings-grid";

  for (let gName in groups) {
    const card = document.createElement("div");
    card.className = "group-card";

    let rows = "";
    groups[gName].forEach((team, i) => {
      const rankClass = i < 2 ? "qualify" : i === 2 ? "borderline" : "";
      const gdClass   = team.GD > 0 ? "gd-positive" : team.GD < 0 ? "gd-negative" : "gd-zero";
      const gdStr     = team.GD > 0 ? `+${team.GD}` : `${team.GD}`;

      rows += `
        <tr>
          <td>
            <div class="team-cell">
              <span class="team-rank ${rankClass}">${i + 1}</span>
              ${team.name}
            </div>
          </td>
          <td>${team.P}</td>
          <td>${team.W}</td>
          <td>${team.D}</td>
          <td>${team.L}</td>
          <td class="${gdClass}">${gdStr}</td>
          <td class="pts">${team.Pts}</td>
        </tr>
      `;
    });

    card.innerHTML = `
      <div class="group-card-header">
        <h3>${gName}</h3>
        <span class="group-badge">${groups[gName].length} teams</span>
      </div>
      <table class="group-table">
        <thead>
          <tr>
            <th>Team</th>
            <th title="Played">P</th>
            <th title="Won">W</th>
            <th title="Drawn">D</th>
            <th title="Lost">L</th>
            <th title="Goal Difference">GD</th>
            <th title="Points">Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    grid.appendChild(card);
  }

  container.appendChild(grid);
}

initApp();