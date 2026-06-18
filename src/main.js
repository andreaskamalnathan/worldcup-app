const TEAM_FLAGS = {
  "United States": "🇺🇸", "USA": "🇺🇸",
  "Mexico": "🇲🇽", "MEX": "🇲🇽",
  "Canada": "🇨🇦", "CAN": "🇨🇦",
  "Panama": "🇵🇦", "PAN": "🇵🇦",
  "Costa Rica": "🇨🇷", "CRC": "🇨🇷",
  "Jamaica": "🇯🇲", "JAM": "🇯🇲",
  "Honduras": "🇭🇳", "HON": "🇭🇳",

  "Argentina": "🇦🇷", "ARG": "🇦🇷",
  "Brazil": "🇧🇷", "BRA": "🇧🇷",
  "Uruguay": "🇺🇾", "URU": "🇺🇾",
  "Colombia": "🇨🇴", "COL": "🇨🇴",
  "Ecuador": "🇪🇨", "ECU": "🇪🇨",
  "Chile": "🇨🇱", "CHI": "🇨🇱",

  "Haiti": "🇭🇹", "HAI": "🇺🇸",
  "Paraguay": "🇵🇾", "PAR": "🇵🇾",
  "Curaçao": "🇨🇼", "CUW": "🇨🇼",

  "France": "🇫🇷", "FRA": "🇫🇷",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Spain": "🇪🇸", "ESP": "🇪🇸",
  "Germany": "🇩🇪", "GER": "🇩🇪",
  "Italy": "🇮🇹", "ITA": "🇮🇹",
  "Portugal": "🇵🇹", "POR": "🇵🇹",
  "Netherlands": "🇳🇱", "NED": "🇳🇱",
  "Belgium": "🇧🇪", "BEL": "🇧🇪",
  "Croatia": "🇭🇷", "CRO": "🇭🇷",
  "Czech Republic": "🇨🇿", "CZE": "🇨🇿",
  "Bosnia & Herzegovina": "🇧🇦", "BIH": "🇧🇦",
  "Switzerland": "🇨🇭", "SUI": "🇨🇭",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "SCO": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Turkey": "🇹🇷", "TUR": "🇹🇷",
  "Sweden": "🇸🇪", "SWE": "🇸🇪",
  "Norway": "🇳🇴", "NOR": "🇳🇴",
  "Austria": "🇦🇹", "AUT": "🇦🇹",

  "Morocco": "🇲🇦", "MAR": "🇲🇦",
  "Senegal": "🇸🇳", "SEN": "🇸🇳",
  "Tunisia": "🇹🇳", "TUN": "🇹🇳",
  "Cameroon": "🇨🇲", "CMR": "🇨🇲",
  "Ghana": "🇬🇭", "GHA": "🇬🇭",
  "Algeria": "🇩🇿", "ALG": "🇩🇿",
  "South Africa": "🇿🇦", "RSA": "🇿🇦",
  "Ivory Coast": "🇨🇮", "CIV": "🇨🇮",
  "Egypt": "🇪🇬", "EGY": "🇪🇬",
  "Cape Verde": "🇨🇻", "CPV": "🇨🇻",
  "DR Congo": "🇨🇩", "COD": "🇨🇩",

  "Japan": "🇯🇵", "JPN": "🇯🇵",
  "South Korea": "🇰🇷", "KOR": "🇰🇷",
  "Australia": "🇦🇺", "AUS": "🇦🇺",
  "Saudi Arabia": "🇸🇦", "KSA": "🇸🇦",
  "Iran": "🇮🇷", "IRN": "🇮🇷",
  "New Zealand": "🇳🇿", "NZL": "🇳🇿",
  "Qatar": "🇶🇦", "QAT": "🇶🇦",
  "Iraq": "🇮🇶", "IRQ": "🇮🇶",
  "Jordan": "🇯🇴", "JOR": "🇯🇴",
  "Uzbekistan": "🇺🇿", "UZB": "🇺🇿"
};

const RAW_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

document.addEventListener("DOMContentLoaded", () => {
  const apkButtonContainer = document.getElementById("apk-download-container");
  if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
    if (apkButtonContainer) {
      apkButtonContainer.style.display = "none";
    }
  }
});

function initTabs() {
  const buttons    = document.querySelectorAll(".tab-btn");
  const panels     = document.querySelectorAll(".tab-panel");
  const menuBtn    = document.getElementById("menu-toggle-btn");
  const slidingNav = document.getElementById("sliding-nav-menu");

  if (menuBtn && slidingNav) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);
      slidingNav.classList.toggle("open-drawer");
      menuBtn.classList.toggle("menu-active");
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      panels.forEach(p => { p.classList.remove("active"); p.hidden = true; });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add("active");
        panel.hidden = false;
      }
      if (slidingNav && slidingNav.classList.contains("open-drawer")) {
        slidingNav.classList.remove("open-drawer");
        menuBtn.classList.remove("menu-active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  const activeTab = document.querySelector(".tab-btn.active");
  if (activeTab) {
    const defaultTarget = activeTab.dataset.tab;
    panels.forEach(p => {
      if (p.id === `panel-${defaultTarget}`) {
        p.classList.add("active");
        p.hidden = false;
      } else {
        p.classList.remove("active");
        p.hidden = true;
      }
    });
  }
}

function getFlag(teamName) {
  if (!teamName || teamName === "TBD") return "🏳️";
  return TEAM_FLAGS[teamName] || "🏳️";
}

async function initApp() {
  initTabs();

  try {
    const response = await fetch(RAW_URL);
    if (!response.ok) throw new Error("Network request failed");

    const data    = await response.json();
    const matches = data.matches || [];

    renderMatches(matches);
    renderTodayAndTomorrow(matches);
    const standings = computeStandings(matches);
    renderStandings(standings);
    renderKnockout(matches);

  } catch (err) {
    document.getElementById("standings-tables").innerHTML =
      `<p class="skeleton-pulse">Could not load standings. Check your connection.</p>`;
    document.getElementById("matches-list").innerHTML =
      `<p class="skeleton-pulse">Could not load matches. Check your connection.</p>`;
    document.getElementById("knockout-bracket").innerHTML =
      `<p class="skeleton-pulse">Could not load bracket. Check your connection.</p>`;
    console.error(err);
  }
}

function renderMatches(matches) {
  const container   = document.getElementById("matches-list");
  const filterWrap  = document.getElementById("matches-filter");
  const groupSelect = document.getElementById("group-filter");

  container.innerHTML = "";

  const groups = [...new Set(matches.map(m => m.group).filter(Boolean))];
  groupSelect.innerHTML = '<option value="all">All matches</option>';
  
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
      container.innerHTML = `<p class="skeleton-pulse">No matches found for this selection.</p>`;
      return;
    }

    const timeline = document.createElement("div");
    timeline.className = "matches-timeline";

    let lastGroup = null;

    filtered.forEach(match => {
      const groupLabel = match.group || match.round || "Knockout Stage";

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
      
      const rawDateTimeStr = `${match.date} ${match.time || ""}`.trim();
      let indonesiaTimeStr = "Time TBD";

      if (match.date && match.time) {
        try {
          const normalizedIso = rawDateTimeStr.replace("UTC", "GMT");
          const matchDateObj = new Date(normalizedIso);

          if (!isNaN(matchDateObj.getTime())) {
            // Format specifically to Indonesia (UTC+7 / WIB)
            indonesiaTimeStr = matchDateObj.toLocaleString('en-US', {
              timeZone: 'Asia/Jakarta',
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) + " WIB";
          }
        } catch (e) {
          console.error("Time conversion bypassed for match: ", rawDateTimeStr);
        }
      }

      const card = document.createElement("div");
      card.className = "match-card";
      card.innerHTML = `
        <div class="match-meta-row">
          <span class="match-group-tag">${match.group || "Knockout"}</span>
          <span class="match-venue">${match.ground || ""}</span>
        </div>
        <div class="scoreboard">
          <div class="team-block home">
            <span class="team-name">${getFlag(match.team1)} ${match.team1 || "TBD"}</span>
            <span class="team-label">Home</span>
          </div>
          <div class="score-center-wrapper">
            <div class="score-block">
              <div class="score-box ${played ? "" : "unplayed"}">${scoreHome}</div>
              <span class="score-divider">:</span>
              <div class="score-box ${played ? "" : "unplayed"}">${scoreAway}</div>
            </div>
            <div class="match-time-sub">${rawDateTimeStr}</div>
            <div class="match-time-indonesia">🇮🇩 ${indonesiaTimeStr}</div>
          </div>
          <div class="team-block away">
            <span class="team-name">${getFlag(match.team2)} ${match.team2 || "TBD"}</span>
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

function renderTodayAndTomorrow(matches) {
  const container = document.getElementById("today-matches-list");
  container.innerHTML = "";

  const todayObj = new Date();
  const tomorrowObj = new Date();
  tomorrowObj.setDate(todayObj.getDate() + 1);

  const formatDateString = (dateObj) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = formatDateString(todayObj);
  const tomorrowStr = formatDateString(tomorrowObj);

  const activeFixtures = matches.filter(m => m.date === todayStr || m.date === tomorrowStr);

  if (activeFixtures.length === 0) {
    container.innerHTML = `<p class="skeleton-pulse" style="text-align:center; padding: 3rem 0;"> No matches scheduled for today or tomorrow.</p>`;
    return;
  }

  activeFixtures.sort((a, b) => a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || ""));

  let currentHeadingDate = null;

  activeFixtures.forEach(match => {
    let dayLabel = match.date === todayStr ? "Today's Fixtures" : "Tomorrow's Fixtures";
    
    if (dayLabel !== currentHeadingDate) {
      const divider = document.createElement("div");
      divider.className = "match-group-label";
      divider.textContent = `${dayLabel} (${match.date})`;
      container.appendChild(divider);
      currentHeadingDate = dayLabel;
    }

    const played = match.score && match.score.ft;
    const scoreHome = played ? match.score.ft[0] : "–";
    const scoreAway = played ? match.score.ft[1] : "–";
    const rawDateTimeStr = `${match.date} ${match.time || ""}`.trim();
    
    let indonesiaTimeStr = "Time TBD";
    if (match.date && match.time) {
      try {
        const normalizedIso = rawDateTimeStr.replace("UTC", "GMT");
        const matchDateObj = new Date(normalizedIso);
        if (!isNaN(matchDateObj.getTime())) {
          indonesiaTimeStr = matchDateObj.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
            weekday: 'short', day: 'numeric', month: 'short',
            hour: '2-digit', minute: '2-digit', hour12: false
          }) + " WIB";
        }
      } catch (e) {}
    }

    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <div class="match-meta-row">
        <span class="match-group-tag">${match.group || match.round || "Knockout"}</span>
        <span class="match-venue">${match.ground || ""}</span>
      </div>
      <div class="scoreboard">
        <div class="team-block home">
          <span class="team-name">${getFlag(match.team1)} ${match.team1 || "TBD"}</span>
          <span class="team-label">Home</span>
        </div>
        <div class="score-center-wrapper">
          <div class="score-block">
            <div class="score-box ${played ? "" : "unplayed"}">${scoreHome}</div>
            <span class="score-divider">:</span>
            <div class="score-box ${played ? "" : "unplayed"}">${scoreAway}</div>
          </div>
          <div class="match-time-sub">${rawDateTimeStr}</div>
          <div class="match-time-indonesia">🇮🇩 ${indonesiaTimeStr}</div>
        </div>
        <div class="team-block away">
          <span class="team-name">${getFlag(match.team2)} ${match.team2 || "TBD"}</span>
          <span class="team-label">Away</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function computeStandings(matches) {
  const groups = {};

  matches.forEach(match => {
    const gName = match.group;
    if (!gName) return;

    if (!groups[gName]) groups[gName] = {};

    [match.team1, match.team2].forEach(team => {
      if (team && !groups[gName][team]) {
        groups[gName][team] = { name: team, P: 0, W: 0, d: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
      }
    });

    if (match.score && match.score.ft && match.team1 && match.team2) {
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
              <span style="margin-right:6px;">${getFlag(team.name)}</span> ${team.name}
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
            <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    grid.appendChild(card);
  }
  container.appendChild(grid);
}

function renderKnockout(matches) {
  const container = document.getElementById("knockout-bracket");
  container.innerHTML = "";

  const roundsMapping = {
    "Round of 32": [],
    "Round of 16": [],
    "Quarter-finals": [],
    "Semi-finals": [],
    "Final": []
  };

  matches.forEach(m => {
    if (!m.group && m.round) {
      let rName = m.round;
      if (rName === "Final" || rName === "Match for third place") {
        roundsMapping["Final"].push(m);
      } else if (roundsMapping[rName] !== undefined) {
        roundsMapping[rName].push(m);
      }
    }
  });

  const bracketWrapper = document.createElement("div");
  bracketWrapper.className = "bracket-scroller-view";

  for (let roundName in roundsMapping) {
    const column = document.createElement("div");
    column.className = "bracket-column";
    
    column.innerHTML = `<div class="bracket-column-title">${roundName}</div>`;

    const roundMatches = roundsMapping[roundName];
    if (roundMatches.length === 0) {
      let placeholdersCount = roundName === "Round of 32" ? 16 : roundName === "Round of 16" ? 8 : roundName === "Quarter-finals" ? 4 : roundName === "Semi-finals" ? 2 : 1;
      for (let k = 0; k < placeholdersCount; k++) {
        column.appendChild(createBracketBox("TBD", "TBD", "Scheduled", ""));
      }
    } else {
      roundMatches.forEach(match => {
        const played = match.score && match.score.ft;
        const scoreStr = played ? `Score: ${match.score.ft[0]} - ${match.score.ft[1]}` : "";
        const dateStr = `${match.date} ${match.time || ""}`;
        column.appendChild(createBracketBox(match.team1 || "TBD", match.team2 || "TBD", dateStr, scoreStr));
      });
    }

    bracketWrapper.appendChild(column);
  }

  container.appendChild(bracketWrapper);
}

function getCountryInitial(teamName) {
  if (!teamName || teamName === "TBD") return "TBD";
  
  if (teamName.length <= 5) return teamName;

  const initialMap = {
    "United States": "USA", "Mexico": "MEX", "Canada": "CAN", "Panama": "PAN",
    "Costa Rica": "CRC", "Jamaica": "JAM", "Honduras": "HON", "Argentina": "ARG",
    "Brazil": "BRA", "Uruguay": "URU", "Colombia": "COL", "Ecuador": "ECU",
    "Chile": "CHI", "France": "FRA", "England": "ENG", "Spain": "ESP",
    "Germany": "GER", "Italy": "ITALY", "Portugal": "POR", "Netherlands": "NED",
    "Belgium": "BEL", "Croatia": "CRO", "Morocco": "MAR", "Senegal": "SEN",
    "Japan": "JPN", "South Korea": "KOR", "Australia": "AUS", "Saudi Arabia": "KSA",
    "South Africa": "RSA", "Czech Republic": "CZE", "Bosnia & Herzegovina": "BIH",
    "Switzerland": "SUI", "Scotland": "SCO", "Haiti": "HAI", "Paraguay": "PAR",
    "Turkey": "TUR", "Curaçao": "CUW", "Ivory Coast": "CIV", "Sweden": "SWE",
    "Egypt": "EGY", "Cape Verde": "CPV", "DR Congo": "COD", "Uzbekistan": "UZB"
  };

  return initialMap[teamName] || teamName.slice(0, 3).toUpperCase();
}

function createBracketBox(t1, t2, date, score) {
  const box = document.createElement("div");
  box.className = "bracket-match-node";
  box.innerHTML = `
    <div class="bracket-node-meta">${date}</div>
    <div class="bracket-node-teams">
      <div class="bracket-node-team-row">
        <span class="bracket-shield">${getFlag(t1)}</span>
        <span class="bracket-team-txt Regel">${getCountryInitial(t1)}</span>
      </div>
      <div class="bracket-node-team-row">
        <span class="bracket-shield">${getFlag(t2)}</span>
        <span class="bracket-team-txt">${getCountryInitial(t2)}</span>
      </div>
    </div>
    ${score ? `<div class="bracket-node-score">${score}</div>` : ""}
  `;
  return box;
}

initApp();