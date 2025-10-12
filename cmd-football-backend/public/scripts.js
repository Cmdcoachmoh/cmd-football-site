function updateScore(type, value) {
  const count = document.getElementById(`${type}-count`);
  let current = parseInt(count.textContent);
  current = Math.max(0, current + value);
  count.textContent = current;
}
document.getElementById('session-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = this.querySelector('input[type="text"]').value;
  const ageGroup = this.querySelector('select').value;
  const objectives = this.querySelector('textarea').value;

  const session = { title, ageGroup, objectives, date: new Date().toISOString() };

  let sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  sessions.push(session);
  localStorage.setItem('cmdSessions', JSON.stringify(sessions));

  alert('Session saved successfully!');
  this.reset();
});
const savedSessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
emailjs.init("YOUR_USER_ID");

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
    .then(() => {
      alert('Message sent successfully!');
      this.reset();
    }, (error) => {
      alert('Failed to send message: ' + error.text);
    });
});
document.getElementById('player-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = this.querySelector('input[type="text"]').value;
  const score = this.querySelector('input[type="number"]').value;

  let players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];
  players.push({ name, score });
  localStorage.setItem('cmdPlayers', JSON.stringify(players));

  renderPlayers();
  this.reset();
});

function renderPlayers() {
  const container = document.getElementById('player-list');
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  container.innerHTML = players.map(p => `<p>${p.name}: ${p.score}</p>`).join('');
}

renderPlayers();
function exportSessions() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  if (sessions.length === 0) return alert("No sessions to export.");

  let csv = "Title,Age Group,Objectives,Date\n";
  sessions.forEach(s => {
    csv += `"${s.title}","${s.ageGroup}","${s.objectives.replace(/"/g, '""')}","${s.date}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "cmd_sessions.csv";
  link.click();
}
function renderPlayers() {
  const container = document.getElementById('player-list');
  const query = document.getElementById('search-player')?.value?.toLowerCase() || "";
  const sortOrder = document.getElementById('sort-score')?.value || "desc";

  let players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  players = players.filter(p => p.name.toLowerCase().includes(query));
  players.sort((a, b) => sortOrder === "asc" ? a.score - b.score : b.score - a.score);

  container.innerHTML = players.map(p => `<p>${p.name}: ${p.score}</p>`).join('');
}

document.getElementById('search-player').addEventListener('input', renderPlayers);
document.getElementById('sort-score').addEventListener('change', renderPlayers);
function printCoachReport() {
  const container = document.getElementById('player-list');
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`<html><head><title>Coach Report</title></head><body>${container.innerHTML}</body></html>`);
  win.document.close();
  win.print();
}
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("Logged in!"))
    .catch(err => alert(err.message));
});

document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Registered!"))
    .catch(err => alert(err.message));
});
document.getElementById('composer-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = this.querySelector('input[type="text"]').value;
  const ageGroup = this.querySelector('select').value;
  const objectives = this.querySelector('textarea').value;
  const drills = Array.from(this.querySelectorAll('#drill-selector input:checked')).map(d => d.value);

  const session = { title, ageGroup, objectives, drills, date: new Date().toISOString() };
  let sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  sessions.push(session);
  localStorage.setItem('cmdSessions', JSON.stringify(sessions));

  alert('Session saved with drills!');
  this.reset();
});
const medal = document.querySelector('input[name="medal"]:checked')?.value || "None";
players.push({ name, score, medal });
container.innerHTML = players.map(p => `<p>${p.name}: ${p.score} (${p.medal})</p>`).join('');
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];

  sessions.forEach((s, i) => {
    doc.text(`Session ${i + 1}: ${s.title}`, 10, 10 + i * 10);
    doc.text(`Age Group: ${s.ageGroup}`, 10, 15 + i * 10);
    doc.text(`Drills: ${s.drills.join(', ')}`, 10, 20 + i * 10);
  });

  doc.save("cmd_sessions.pdf");
}
function renderSessions() {
  const query = document.getElementById('session-search').value.toLowerCase();
  const filter = document.getElementById('session-filter').value;
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(query) &&
    (filter === "" || s.ageGroup === filter)
  );

  document.getElementById('session-list').innerHTML = filtered.map(s => `
    <div class="session-card">
      <h3>${s.title}</h3>
      <p>Age Group: ${s.ageGroup}</p>
      <p>Drills: ${s.drills?.join(', ') || 'None'}</p>
      <p>${s.objectives}</p>
    </div>
  `).join('');
}

document.getElementById('session-search').addEventListener('input', renderSessions);
document.getElementById('session-filter').addEventListener('change', renderSessions);
renderSessions();
const notes = this.querySelector('textarea').value;
players.push({ name, score, notes });
container.innerHTML = players.map(p => `
  <div>
    <p><strong>${p.name}</strong>: ${p.score}</p>
    <p><em>Notes:</em> ${p.notes}</p>
  </div>
`).join('');
const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];
const select = document.getElementById('player-select');
select.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');

select.addEventListener('change', () => {
  const player = players.find(p => p.name === select.value);
  document.getElementById('profile-details').innerHTML = `
    <p><strong>Name:</strong> ${player.name}</p>
    <p><strong>Score:</strong> ${player.score}</p>
    <p><strong>Medal:</strong> ${player.medal || 'None'}</p>
    <p><strong>Notes:</strong> ${player.notes || '—'}</p>
  `;
});
const drills = [
  { id: "C0.1A5", tag: "Passing", image: "drills/C0.1A5.png" },
  { id: "C0.2B3", tag: "Defending", image: "drills/C0.2B3.png" },
  { id: "C0.3D1", tag: "Finishing", image: "drills/C0.3D1.png" }
];

function renderDrills() {
  const filter = document.getElementById('tag-filter').value;
  const filtered = filter ? drills.filter(d => d.tag === filter) : drills;

  document.getElementById('drill-list').innerHTML = filtered.map(d => `
    <div class="drill-card">
      <img src="${d.image}" alt="${d.id}">
      <p>${d.id} – ${d.tag}</p>
    </div>
  `).join('');
}

document.getElementById('tag-filter').addEventListener('change', renderDrills);
renderDrills();
const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];

sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

document.getElementById('calendar-list').innerHTML = sessions.map(s => `
  <div class="calendar-entry">
    <h3>${s.title}</h3>
    <p>${new Date(s.date).toLocaleDateString()}</p>
    <p>Age Group: ${s.ageGroup}</p>
    <p>Drills: ${s.drills?.join(', ') || 'None'}</p>
  </div>
`).join('');
function exportPlayerPDF(player) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text(`Player Profile: ${player.name}`, 10, 10);
  doc.text(`Score: ${player.score}`, 10, 20);
  doc.text(`Medal: ${player.medal || 'None'}`, 10, 30);
  doc.text(`Notes: ${player.notes || '—'}`, 10, 40);

  doc.save(`${player.name}_profile.pdf`);
}
function showTooltip(id, targetSelector) {
  const target = document.querySelector(targetSelector);
  const tooltip = document.getElementById(id);
  const rect = target.getBoundingClientRect();

  tooltip.style.top = `${rect.top + window.scrollY - 50}px`;
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.display = 'block';
}

window.onload = () => {
  showTooltip('tooltip-tools', '#tools');
  showTooltip('tooltip-coach', '#coach-space');
};
document.getElementById('feedback-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const rating = this.querySelector('select').value;
  const comment = this.querySelector('textarea').value;

  const feedback = { rating, comment, date: new Date().toISOString() };
  let feedbackList = JSON.parse(localStorage.getItem('cmdFeedback')) || [];
  feedbackList.push(feedback);
  localStorage.setItem('cmdFeedback', JSON.stringify(feedbackList));

  alert("Feedback submitted!");
  this.reset();
});
document.getElementById('roster-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input').value;
  const role = this.querySelector('select').value;

  let roster = JSON.parse(localStorage.getItem('cmdRoster')) || [];
  roster.push({ name, role });
  localStorage.setItem('cmdRoster', JSON.stringify(roster));

  renderRoster();
  this.reset();
});

function renderRoster() {
  const roster = JSON.parse(localStorage.getItem('cmdRoster')) || [];
  document.getElementById('roster-list').innerHTML = roster.map(p => `
    <p><strong>${p.name}</strong> – ${p.role}</p>
  `).join('');
}

renderRoster();
function printSessionSheet(session) {
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html><head><title>Session Sheet</title></head><body>
      <h2>${session.title}</h2>
      <p><strong>Age Group:</strong> ${session.ageGroup}</p>
      <p><strong>Objectives:</strong> ${session.objectives}</p>
      <p><strong>Drills:</strong> ${session.drills?.join(', ')}</p>
    </body></html>
  `);
  win.document.close();
  win.print();
}
function generateShareLink() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const latest = sessions[sessions.length - 1];
  const encoded = encodeURIComponent(JSON.stringify(latest));
  const link = `${location.origin}/?session=${encoded}`;

  document.getElementById('share-output').innerHTML = `
    <p>Share this session:</p>
    <input type="text" value="${link}" readonly>
    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${link}&size=150x150" alt="QR Code">
  `;
}
auth.onAuthStateChanged(user => {
  if (user) {
    const coachPrefs = {
      name: user.displayName || "Coach",
      theme: "dark",
      defaultAgeGroup: "U13"
    };
    localStorage.setItem('cmdCoachPrefs', JSON.stringify(coachPrefs));
  }
});
const prefs = JSON.parse(localStorage.getItem('cmdCoachPrefs')) || {};
document.body.className = prefs.theme;
const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');

// Draw field
ctx.fillStyle = "#4CAF50";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "#fff";
ctx.strokeRect(50, 50, 500, 300);

// Add player dots
canvas.addEventListener('click', e => {
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffd700";
  ctx.fill();
});

function saveDrill() {
  const image = canvas.toDataURL();
  localStorage.setItem('cmdCustomDrill', image);
  alert("Drill saved!");
}
function exportFederationPack() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];
  const feedback = JSON.parse(localStorage.getItem('cmdFeedback')) || [];

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("CMD Football – Federation Export", 10, 10);

  doc.text("Sessions:", 10, 20);
  sessions.forEach((s, i) => {
    doc.text(`${i + 1}. ${s.title} (${s.ageGroup})`, 10, 25 + i * 5);
  });

  doc.text("Players:", 10, 60);
  players.forEach((p, i) => {
    doc.text(`${p.name} – ${p.score} (${p.medal || 'None'})`, 10, 65 + i * 5);
  });

  doc.text("Feedback:", 10, 100);
  feedback.forEach((f, i) => {
    doc.text(`${i + 1}. ${f.rating} stars – ${f.comment}`, 10, 105 + i * 5);
  });

  doc.save("cmd_federation_pack.pdf");
}
document.getElementById('team-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelectorAll('input')[0].value;
  const season = this.querySelectorAll('input')[1].value;

  let teams = JSON.parse(localStorage.getItem('cmdTeams')) || [];
  teams.push({ name, season, created: new Date().toISOString() });
  localStorage.setItem('cmdTeams', JSON.stringify(teams));

  renderTeams();
  this.reset();
});

function renderTeams() {
  const teams = JSON.parse(localStorage.getItem('cmdTeams')) || [];
  document.getElementById('team-list').innerHTML = teams.map(t => `
    <p><strong>${t.name}</strong> – ${t.season}</p>
  `).join('');
}

renderTeams();
const milestones = [
  { title: "First Session Created", key: "sessionCount", threshold: 1, badge: "🟢 Rookie Coach" },
  { title: "10 Sessions", key: "sessionCount", threshold: 10, badge: "🔵 Tactical Builder" },
  { title: "50 Players Tracked", key: "playerCount", threshold: 50, badge: "🟣 Squad Strategist" }
];

function renderBadges() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const sessionCount = sessions.length;
  const playerCount = players.length;

  const earned = milestones.filter(m => {
    const value = m.key === "sessionCount" ? sessionCount : playerCount;
    return value >= m.threshold;
  });

  document.getElementById('badge-list').innerHTML = earned.map(b => `
    <li>${b.badge} – ${b.title}</li>
  `).join('');
}

renderBadges();
function renderClubAnalytics() {
  const teams = JSON.parse(localStorage.getItem('cmdTeams')) || [];
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const summary = `
    <p><strong>Total Teams:</strong> ${teams.length}</p>
    <p><strongTotal Sessions:</strong> ${sessions.length}</p>
    <p><strong>Total Players:</strong> ${players.length}</p>
  `;

  document.getElementById('club-summary').innerHTML = summary;
}

renderClubAnalytics();
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  ['playerA', 'playerB'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
      el.addEventListener('change', comparePlayers);
    }
  });

  function comparePlayers() {
    const aSelect = document.getElementById('playerA');
    const bSelect = document.getElementById('playerB');
    const resultBox = document.getElementById('comparison-result');

    if (!aSelect || !bSelect || !resultBox) return;

    const aName = aSelect.value;
    const bName = bSelect.value;

    const pa = players.find(p => p.name === aName);
    const pb = players.find(p => p.name === bName);

    if (!pa || !pb) {
      resultBox.innerHTML = "<p>Please select two valid players to compare.</p>";
      return;
    }

    resultBox.innerHTML = `
      <table border="1" cellpadding="8" style="border-collapse: collapse;">
        <tr><th>Metric</th><th>${pa.name}</th><th>${pb.name}</th></tr>
        <tr><td>Score</td><td>${pa.score}</td><td>${pb.score}</td></tr>
        <tr><td>Medal</td><td>${pa.medal || '—'}</td><td>${pb.medal || '—'}</td></tr>
        <tr><td>Notes</td><td>${pa.notes || '—'}</td><td>${pb.notes || '—'}</td></tr>
      </table>
    `;
  }
};
function rateDrill() {
  const drill = document.getElementById('drill-select').value;
  const level = document.getElementById('difficulty').value;

  let ratings = JSON.parse(localStorage.getItem('cmdDrillRatings')) || {};
  ratings[drill] = level;
  localStorage.setItem('cmdDrillRatings', JSON.stringify(ratings));

  alert(`Saved: ${drill} rated as ${level}`);
}
function saveJournal() {
  const entry = document.getElementById('journal-entry').value;
  const log = JSON.parse(localStorage.getItem('cmdJournal')) || [];
  log.push({ entry, date: new Date().toLocaleString() });
  localStorage.setItem('cmdJournal', JSON.stringify(log));
  renderJournal();
  document.getElementById('journal-entry').value = '';
}

function renderJournal() {
  const log = JSON.parse(localStorage.getItem('cmdJournal')) || [];
  document.getElementById('journal-log').innerHTML = log.map(j => `
    <p><strong>${j.date}</strong><br>${j.entry}</p>
  `).join('');
}

renderJournal();
document.getElementById('calendar-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const date = this.querySelector('input[type="date"]').value;
  const title = this.querySelector('input[type="text"]').value;
  const type = this.querySelector('select').value;

  const events = JSON.parse(localStorage.getItem('cmdCalendar')) || [];
  events.push({ date, title, type });
  localStorage.setItem('cmdCalendar', JSON.stringify(events));
  renderCalendar();
  this.reset();
});

function renderCalendar() {
  const events = JSON.parse(localStorage.getItem('cmdCalendar')) || [];
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  document.getElementById('calendar-events').innerHTML = events.map(e => `
    <p><strong>${e.date}</strong> – ${e.type}: ${e.title}</p>
  `).join('');
}

renderCalendar();
function exportTeamReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  doc.text("CMD Football – Team Report", 10, 10);
  players.forEach((p, i) => {
    doc.text(`${i + 1}. ${p.name} – Score: ${p.score}, Medal: ${p.medal || '—'}`, 10, 20 + i * 10);
    if (p.notes) doc.text(`Notes: ${p.notes}`, 10, 25 + i * 10);
  });

  doc.save("cmd_team_report.pdf");
}
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('dev-player');
  const devForm = document.getElementById('dev-form');
  const devLogContainer = document.getElementById('dev-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (devForm && devLogContainer) {
    devForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const skill = this.querySelector('input[type="text"]').value;
      const date = this.querySelector('input[type="date"]').value;

      const log = JSON.parse(localStorage.getItem('cmdDevLog')) || [];
      log.push({ name, skill, date });
      localStorage.setItem('cmdDevLog', JSON.stringify(log));
      renderDevLog();
      this.reset();
    });

    function renderDevLog() {
      const log = JSON.parse(localStorage.getItem('cmdDevLog')) || [];
      devLogContainer.innerHTML = log.map(l => `
        <p><strong>${l.name}</strong> – ${l.skill} on ${l.date}</p>
      `).join('');
    }

    renderDevLog();
  }
};
function saveSessionWithDrills(title, ageGroup, objectives, selectedDrills) {
  const session = {
    title,
    ageGroup,
    objectives,
    drills: selectedDrills,
    date: new Date().toISOString()
  };

  let sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  sessions.push(session);
  localStorage.setItem('cmdSessions', JSON.stringify(sessions));
}
function printMatchSheet(teamName, matchDate, lineup, notes) {
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html><head><title>Match Sheet</title></head><body>
      <h2>${teamName} – Match Day</h2>
      <p><strong>Date:</strong> ${matchDate}</p>
      <h3>Starting Lineup</h3>
      <ul>${lineup.map(p => `<li>${p}</li>`).join('')}</ul>
      <h3>Coach Notes</h3>
      <p>${notes}</p>
    </body></html>
  `);
  win.document.close();
  win.print();
}
function renderFederationDashboard() {
  const teams = JSON.parse(localStorage.getItem('cmdTeams')) || [];
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];
  const feedback = JSON.parse(localStorage.getItem('cmdFeedback')) || [];

  const summary = `
    <p><strong>Clubs:</strong> ${teams.length}</p>
    <p><strong>Sessions:</strong> ${sessions.length}</p>
    <p><strong>Players:</strong> ${players.length}</p>
    <p><strong>Feedback Entries:</strong> ${feedback.length}</p>
  `;

  document.getElementById('fed-summary').innerHTML = summary;
}

renderFederationDashboard();
const steps = [
  "Step 1: Set your name and preferred age group.",
  "Step 2: Choose your default drill categories.",
  "Step 3: Explore the Tactical Engine and Session Builder.",
  "Step 4: Learn how to track players and export reports."
];

let currentStep = 0;
function nextStep() {
  if (currentStep < steps.length) {
    document.getElementById('wizard-step').innerText = steps[currentStep];
    currentStep++;
  } else {
    document.getElementById('wizard-step').innerText = "You're ready to coach!";
  }
}
window.onload = function() {
  const canvas = document.getElementById('heatmapCanvas');
  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("2D context not available.");
    return;
  }

  // Draw field
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(50, 50, 500, 300);

  // Track positions
  canvas.addEventListener('click', e => {
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
  });
};
function renderDrillStats() {
  const drillId = document.getElementById('drill-select').value;
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const usage = sessions.filter(s => s.drills?.includes(drillId)).length;

  document.getElementById('drill-stats').innerHTML = `
    <p><strong>${drillId}</strong> used in ${usage} sessions</p>
  `;
}

document.getElementById('drill-select').addEventListener('change', renderDrillStats);
renderDrillStats();
document.getElementById('match-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const date = this.querySelector('input[type="date"]').value;
  const opponent = this.querySelector('input[type="text"]').value;
  const teamScore = this.querySelectorAll('input[type="number"]')[0].value;
  const oppScore = this.querySelectorAll('input[type="number"]')[1].value;
  const notes = this.querySelector('textarea').value;

  const report = { date, opponent, teamScore, oppScore, notes };
  const log = JSON.parse(localStorage.getItem('cmdMatchReports')) || [];
  log.push(report);
  localStorage.setItem('cmdMatchReports', JSON.stringify(log));
  renderMatchLog();
  this.reset();
});

function renderMatchLog() {
  const log = JSON.parse(localStorage.getItem('cmdMatchReports')) || [];
  document.getElementById('match-log').innerHTML = log.map(r => `
    <p><strong>${r.date}</strong> vs ${r.opponent} – ${r.teamScore}:${r.oppScore}<br>${r.notes}</p>
  `).join('');
}

renderMatchLog();
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('injured-player');
  const injuryForm = document.getElementById('injury-form');
  const injuryLogContainer = document.getElementById('injury-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (injuryForm && injuryLogContainer) {
    injuryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const type = this.querySelector('input[type="text"]').value;
      const date = this.querySelectorAll('input[type="date"]')[0].value;
      const recovery = this.querySelectorAll('input[type="date"]')[1].value;

      const injuries = JSON.parse(localStorage.getItem('cmdInjuries')) || [];
      injuries.push({ name, type, date, recovery });
      localStorage.setItem('cmdInjuries', JSON.stringify(injuries));
      renderInjuryLog();
      this.reset();
    });

    function renderInjuryLog() {
      const injuries = JSON.parse(localStorage.getItem('cmdInjuries')) || [];
      injuryLogContainer.innerHTML = injuries.map(i => `
        <p><strong>${i.name}</strong> – ${i.type} on ${i.date}, recovery by ${i.recovery}</p>
      `).join('');
    }

    renderInjuryLog();
  }
};
document.getElementById('cert-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const level = this.querySelector('select').value;
  const date = this.querySelector('input[type="date"]').value;

  const certs = JSON.parse(localStorage.getItem('cmdCerts')) || [];
  certs.push({ name, level, date });
  localStorage.setItem('cmdCerts', JSON.stringify(certs));
  renderCertLog();
  this.reset();
});

function renderCertLog() {
  const certs = JSON.parse(localStorage.getItem('cmdCerts')) || [];
  document.getElementById('cert-log').innerHTML = certs.map(c => `
    <p><strong>${c.name}</strong> – ${c.level} certified on ${c.date}</p>
  `).join('');
}

renderCertLog();
const translations = {
  en: { title: "Coach Dashboard", button: "Submit" },
  fr: { title: "Tableau de bord", button: "Soumettre" },
  es: { title: "Panel del entrenador", button: "Enviar" }
};

document.getElementById('language-switcher').addEventListener('change', function() {
  const lang = this.value;
  document.querySelector('h2').innerText = translations[lang].title;
  document.querySelector('button').innerText = translations[lang].button;
});
document.getElementById('scout-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const age = this.querySelector('input[type="number"]').value;
  const position = this.querySelectorAll('input[type="text"]')[1].value;
  const notes = this.querySelector('textarea').value;

  const prospects = JSON.parse(localStorage.getItem('cmdProspects')) || [];
  prospects.push({ name, age, position, notes });
  localStorage.setItem('cmdProspects', JSON.stringify(prospects));
  renderProspects();
  this.reset();
});

function renderProspects() {
  const prospects = JSON.parse(localStorage.getItem('cmdProspects')) || [];
  document.getElementById('scout-list').innerHTML = prospects.map(p => `
    <p><strong>${p.name}</strong> (${p.age}) – ${p.position}<br>${p.notes}</p>
  `).join('');
}

renderProspects();
document.getElementById('chemistry-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const a = this.querySelectorAll('input')[0].value;
  const b = this.querySelectorAll('input')[1].value;
  const level = this.querySelector('select').value;

  const synergy = JSON.parse(localStorage.getItem('cmdSynergy')) || [];
  synergy.push({ a, b, level });
  localStorage.setItem('cmdSynergy', JSON.stringify(synergy));
  renderSynergy();
  this.reset();
});

function renderSynergy() {
  const synergy = JSON.parse(localStorage.getItem('cmdSynergy')) || [];
  document.getElementById('chemistry-log').innerHTML = synergy.map(s => `
    <p><strong>${s.a} + ${s.b}</strong> – Synergy: ${s.level}</p>
  `).join('');
}

renderSynergy();
function renderClubDashboard() {
  const teams = JSON.parse(localStorage.getItem('cmdTeams')) || [];
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];
  const matches = JSON.parse(localStorage.getItem('cmdMatchReports')) || [];

  const summary = `
    <p><strong>Total Teams:</strong> ${teams.length}</p>
    <p><strongTotal Sessions:</strong> ${sessions.length}</p>
    <p><strongTotal Players:</strong> ${players.length}</p>
    <p><strongMatches Played:</strong> ${matches.length}</p>
  `;

  document.getElementById('club-summary').innerHTML = summary;
}

renderClubDashboard();
function printMatchKit() {
  const form = document.getElementById('kit-form');
  const team = form.querySelector('input[type="text"]').value;
  const date = form.querySelector('input[type="date"]').value;
  const lineup = form.querySelectorAll('textarea')[0].value;
  const notes = form.querySelectorAll('textarea')[1].value;

  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html><head><title>Match Kit</title></head><body>
      <h2>${team} – Match Day</h2>
      <p><strong>Date:</strong> ${date}</p>
      <h3>Starting Lineup</h3><p>${lineup.replace(/\n/g, '<br>')}</p>
      <h3>Coach Notes</h3><p>${notes.replace(/\n/g, '<br>')}</p>
    </body></html>
  `);
  win.document.close();
  win.print();
}
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('timeline-player');
  const timelineForm = document.getElementById('timeline-form');
  const timelineLogContainer = document.getElementById('timeline-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (timelineForm && timelineLogContainer) {
    timelineForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const date = this.querySelector('input[type="date"]').value;
      const milestone = this.querySelector('input[type="text"]').value;

      const timeline = JSON.parse(localStorage.getItem('cmdTimeline')) || [];
      timeline.push({ name, date, milestone });
      localStorage.setItem('cmdTimeline', JSON.stringify(timeline));
      renderTimeline();
      this.reset();
    });

    function renderTimeline() {
      const timeline = JSON.parse(localStorage.getItem('cmdTimeline')) || [];
      timelineLogContainer.innerHTML = timeline.map(t => `
        <p><strong>${t.name}</strong> – ${t.milestone} on ${t.date}</p>
      `).join('');
    }

    renderTimeline();
  }
};
function logDrillImpact() {
  const drill = document.getElementById('impact-drill').value;
  const score = document.querySelector('input[type="number"]').value;

  const impact = JSON.parse(localStorage.getItem('cmdDrillImpact')) || [];
  impact.push({ drill, score });
  localStorage.setItem('cmdDrillImpact', JSON.stringify(impact));
  renderImpactLog();
}

function renderImpactLog() {
  const impact = JSON.parse(localStorage.getItem('cmdDrillImpact')) || [];
  document.getElementById('impact-log').innerHTML = impact.map(i => `
    <p><strong>${i.drill}</strong> – Impact Score: ${i.score}</p>
  `).join('');
}

renderImpactLog();
function exportTacticalPDF(session) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text(`Tactical Session: ${session.title}`, 10, 10);
  doc.text(`Age Group: ${session.ageGroup}`, 10, 20);
  doc.text(`Objectives: ${session.objectives}`, 10, 30);
  doc.text(`Drills: ${session.drills?.join(', ')}`, 10, 40);

  doc.save(`${session.title}_tactical.pdf`);
}
function submitDrillFeedback() {
  const drill = document.getElementById('drill-select').value;
  const rating = document.getElementById('drill-rating').value;
  const comment = document.getElementById('drill-comment').value;

  const feedback = JSON.parse(localStorage.getItem('cmdDrillFeedback')) || [];
  feedback.push({ drill, rating, comment });
  localStorage.setItem('cmdDrillFeedback', JSON.stringify(feedback));
  renderDrillFeedback();
}

function renderDrillFeedback() {
  const feedback = JSON.parse(localStorage.getItem('cmdDrillFeedback')) || [];
  document.getElementById('drill-feedback-log').innerHTML = feedback.map(f => `
    <p><strong>${f.drill}</strong> – ${f.rating} stars<br>${f.comment}</p>
  `).join('');
}

renderDrillFeedback();
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('attendance-player');
  const attendanceForm = document.getElementById('attendance-form');
  const attendanceLogContainer = document.getElementById('attendance-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (attendanceForm && attendanceLogContainer) {
    attendanceForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const date = this.querySelector('input[type="date"]').value;
      const status = this.querySelector('select').value;

      const log = JSON.parse(localStorage.getItem('cmdAttendance')) || [];
      log.push({ name, date, status });
      localStorage.setItem('cmdAttendance', JSON.stringify(log));
      renderAttendance();
      this.reset();
    });

    function renderAttendance() {
      const log = JSON.parse(localStorage.getItem('cmdAttendance')) || [];
      attendanceLogContainer.innerHTML = log.map(a => `
        <p><strong>${a.name}</strong> – ${a.status} on ${a.date}</p>
      `).join('');
    }

    renderAttendance();
  }
};
document.getElementById('match-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const teamA = this.querySelectorAll('input')[0].value;
  const teamB = this.querySelectorAll('input')[1].value;
  const scoreA = this.querySelectorAll('input')[2].value;
  const scoreB = this.querySelectorAll('input')[3].value;

  const matches = JSON.parse(localStorage.getItem('cmdTournament')) || [];
  matches.push({ teamA, teamB, scoreA, scoreB });
  localStorage.setItem('cmdTournament', JSON.stringify(matches));
  renderMatches();
  this.reset();
});

function renderMatches() {
  const matches = JSON.parse(localStorage.getItem('cmdTournament')) || [];
  document.getElementById('match-log').innerHTML = matches.map(m => `
    <p><strong>${m.teamA}</strong> ${m.scoreA} – ${m.scoreB} <strong>${m.teamB}</strong></p>
  `).join('');
}

renderMatches();
document.querySelectorAll('.drill-block').forEach(block => {
  block.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.innerText);
  });
});

document.getElementById('session-dropzone').addEventListener('dragover', e => {
  e.preventDefault();
});

document.getElementById('session-dropzone').addEventListener('drop', e => {
  e.preventDefault();
  const drill = e.dataTransfer.getData('text/plain');
  const zone = document.getElementById('session-dropzone');
  zone.innerHTML += `<p>${drill}</p>`;
});
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('goal-player');
  const goalForm = document.getElementById('goal-form');
  const goalLogContainer = document.getElementById('goal-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (goalForm && goalLogContainer) {
    goalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const goal = this.querySelector('input[type="text"]').value;
      const target = this.querySelector('input[type="date"]').value;

      const goals = JSON.parse(localStorage.getItem('cmdGoals')) || [];
      goals.push({ name, goal, target });
      localStorage.setItem('cmdGoals', JSON.stringify(goals));
      renderGoals();
      this.reset();
    });

    function renderGoals() {
      const goals = JSON.parse(localStorage.getItem('cmdGoals')) || [];
      goalLogContainer.innerHTML = goals.map(g => `
        <p><strong>${g.name}</strong> – ${g.goal} by ${g.target}</p>
      `).join('');
    }

    renderGoals();
  }
};
document.getElementById('chat-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const message = this.querySelector('textarea').value;

  const chat = JSON.parse(localStorage.getItem('cmdCoachChat')) || [];
  chat.push({ name, message, time: new Date().toLocaleString() });
  localStorage.setItem('cmdCoachChat', JSON.stringify(chat));
  renderChat();
  this.reset();
});

function renderChat() {
  const chat = JSON.parse(localStorage.getItem('cmdCoachChat')) || [];
  document.getElementById('chat-log').innerHTML = chat.map(c => `
    <p><strong>${c.name}</strong> @ ${c.time}<br>${c.message}</p>
  `).join('');
}

renderChat();
document.getElementById('archive-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const season = this.querySelector('input[type="text"]').value;

  const archive = JSON.parse(localStorage.getItem('cmdArchive')) || [];
  const snapshot = {
    season,
    date: new Date().toISOString(),
    sessions: JSON.parse(localStorage.getItem('cmdSessions')) || [],
    players: JSON.parse(localStorage.getItem('cmdPlayers')) || [],
    matches: JSON.parse(localStorage.getItem('cmdMatchReports')) || []
  };

  archive.push(snapshot);
  localStorage.setItem('cmdArchive', JSON.stringify(archive));
  renderArchive();
  this.reset();
});

function renderArchive() {
  const archive = JSON.parse(localStorage.getItem('cmdArchive')) || [];
  document.getElementById('archive-log').innerHTML = archive.map(a => `
    <p><strong>${a.season}</strong> – Archived on ${new Date(a.date).toLocaleDateString()}</p>
  `).join('');
}

renderArchive();
document.getElementById('export-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const club = this.querySelectorAll('input')[0].value;
  const coach = this.querySelectorAll('input')[1].value;
  const style = this.querySelector('select').value;

  alert(`Exporting data for ${club} with ${style} branding. Coach: ${coach}`);
  // You can later plug this into a PDF generator or export module
});
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('highlight-player');
  const highlightForm = document.getElementById('highlight-form');
  const highlightLogContainer = document.getElementById('highlight-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (highlightForm && highlightLogContainer) {
    highlightForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const url = this.querySelectorAll('input')[0].value;
      const stat = this.querySelectorAll('input')[1].value;
      const desc = this.querySelector('textarea').value;

      const highlights = JSON.parse(localStorage.getItem('cmdHighlights')) || [];
      highlights.push({ name, url, stat, desc });
      localStorage.setItem('cmdHighlights', JSON.stringify(highlights));
      renderHighlights();
      this.reset();
    });

    function renderHighlights() {
      const highlights = JSON.parse(localStorage.getItem('cmdHighlights')) || [];
      highlightLogContainer.innerHTML = highlights.map(h => `
        <p><strong>${h.name}</strong> – ${h.stat}<br>${h.desc}<br><a href="${h.url}" target="_blank">Watch</a></p>
      `).join('');
    }

    renderHighlights();
  }
};
document.getElementById('eval-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const date = this.querySelector('input[type="date"]').value;
  const rating = this.querySelector('select').value;
  const notes = this.querySelector('textarea').value;

  const evals = JSON.parse(localStorage.getItem('cmdCoachEval')) || [];
  evals.push({ name, date, rating, notes });
  localStorage.setItem('cmdCoachEval', JSON.stringify(evals));
  renderCoachEval();
  this.reset();
});

function renderCoachEval() {
  const evals = JSON.parse(localStorage.getItem('cmdCoachEval')) || [];
  document.getElementById('eval-log').innerHTML = evals.map(e => `
    <p><strong>${e.name}</strong> – ${e.rating} on ${e.date}<br>${e.notes}</p>
  `).join('');
}

renderCoachEval();
function analyzeTactics() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const formations = {};
  const themes = {};

  sessions.forEach(s => {
    if (s.formation) formations[s.formation] = (formations[s.formation] || 0) + 1;
    if (s.objectives) themes[s.objectives] = (themes[s.objectives] || 0) + 1;
  });

  const summary = `
    <p><strong>Most Used Formation:</strong> ${Object.entries(formations).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}</p>
    <p><strongTop Tactical Theme:</strong> ${Object.entries(themes).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}</p>
  `;

  document.getElementById('tactical-summary').innerHTML = summary;
}
function launchMatchDashboard() {
  const opponent = document.querySelectorAll('#match-dashboard input')[0].value;
  const date = document.querySelectorAll('#match-dashboard input')[1].value;
  const lineup = document.querySelectorAll('#match-dashboard textarea')[0].value;
  const notes = document.querySelectorAll('#match-dashboard textarea')[1].value;

  const win = window.open('', '', 'width=400,height=600');
  win.document.write(`
    <html><head><title>Match Dashboard</title><style>
      body { font-family: sans-serif; padding: 20px; }
      h2 { color: #333; }
    </style></head><body>
      <h2>Match vs ${opponent}</h2>
      <p><strong>Date:</strong> ${date}</p>
      <h3>Lineup</h3><p>${lineup.replace(/\n/g, '<br>')}</p>
      <h3>Notes</h3><p>${notes.replace(/\n/g, '<br>')}</p>
    </body></html>
  `);
  win.document.close();
}
window.onload = function() {
  const canvas = document.getElementById('chemistryCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw field
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(50, 50, 500, 300);

  // Example chemistry links
  const links = [
    { from: [100, 150], to: [300, 200], strength: 0.8 },
    { from: [300, 200], to: [450, 250], strength: 0.6 }
  ];

  links.forEach(link => {
    ctx.strokeStyle = `rgba(255, 0, 0, ${link.strength})`;
    ctx.lineWidth = 5 * link.strength;
    ctx.beginPath();
    ctx.moveTo(...link.from);
    ctx.lineTo(...link.to);
    ctx.stroke();
  });
};
document.getElementById('impact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const session = this.querySelector('input[type="text"]').value;
  const impact = this.querySelector('input[type="number"]').value;

  const log = JSON.parse(localStorage.getItem('cmdSessionImpact')) || [];
  log.push({ session, impact });
  localStorage.setItem('cmdSessionImpact', JSON.stringify(log));
  renderImpactLog();
  this.reset();
});

function renderImpactLog() {
  const log = JSON.parse(localStorage.getItem('cmdSessionImpact')) || [];
  document.getElementById('impact-log').innerHTML = log.map(i => `
    <p><strong>${i.session}</strong> – Impact: ${i.impact}</p>
  `).join('');
}

renderImpactLog();
document.getElementById('branding-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const slogan = this.querySelector('input[type="text"]').value;
  const message = this.querySelector('textarea').value;

  const branding = { slogan, message };
  localStorage.setItem('cmdBranding', JSON.stringify(branding));
  renderBranding();
  this.reset();
});

function renderBranding() {
  const branding = JSON.parse(localStorage.getItem('cmdBranding')) || {};
  document.getElementById('branding-log').innerHTML = `
    <p><strong>Slogan:</strong> ${branding.slogan}</p>
    <p><strong>Message:</strong> ${branding.message}</p>
  `;
}

renderBranding();
function printTournamentKit() {
  const form = document.getElementById('kit-form');
  const title = form.querySelector('input[type="text"]').value;
  const fixtures = form.querySelectorAll('textarea')[0].value;
  const notes = form.querySelectorAll('textarea')[1].value;

  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html><head><title>${title}</title></head><body>
      <h2>${title}</h2>
      <h3>Fixtures</h3><p>${fixtures.replace(/\n/g, '<br>')}</p>
      <h3>Coach Notes</h3><p>${notes.replace(/\n/g, '<br>')}</p>
    </body></html>
  `);
  win.document.close();
  win.print();
}
window.onload = function() {
  const ctx = document.getElementById('radarChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Passing', 'Dribbling', 'Shooting', 'Defending', 'Speed', 'Vision'],
      datasets: [{
        label: 'Player A',
        data: [7, 8, 6, 5, 9, 7],
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: 'rgba(255, 215, 0, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });
};
document.getElementById('tag-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = this.querySelectorAll('input')[0].value;
  const tags = this.querySelectorAll('input')[1].value.split(',').map(t => t.trim());

  const drillTags = JSON.parse(localStorage.getItem('cmdDrillTags')) || [];
  drillTags.push({ id, tags });
  localStorage.setItem('cmdDrillTags', JSON.stringify(drillTags));
  renderTags();
  this.reset();
});

function renderTags() {
  const drillTags = JSON.parse(localStorage.getItem('cmdDrillTags')) || [];
  document.getElementById('tag-log').innerHTML = drillTags.map(d => `
    <p><strong>${d.id}</strong> – ${d.tags.join(', ')}</p>
  `).join('');
}

renderTags();
function renderTacticalIdentity() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const formations = {};
  const objectives = {};
  const drillTypes = {};

  sessions.forEach(s => {
    if (s.formation) formations[s.formation] = (formations[s.formation] || 0) + 1;
    if (s.objectives) objectives[s.objectives] = (objectives[s.objectives] || 0) + 1;
    if (s.drills) s.drills.forEach(d => {
      const type = d.split('.')[0]; // e.g. C0 from C0.1A5
      drillTypes[type] = (drillTypes[type] || 0) + 1;
    });
  });

  const topFormation = Object.entries(formations).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';
  const topObjective = Object.entries(objectives).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';
  const topDrillType = Object.entries(drillTypes).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';

  document.getElementById('tactical-identity-log').innerHTML = `
    <p><strong>Top Formation:</strong> ${topFormation}</p>
    <p><strong>Top Objective:</strong> ${topObjective}</p>
    <p><strong>Most Used Drill Type:</strong> ${topDrillType}</p>
  `;
}
document.getElementById('export-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const club = this.querySelectorAll('input')[0].value;
  const coach = this.querySelectorAll('input')[1].value;
  const style = this.querySelector('select').value;

  alert(`Exporting tactical report for ${club} with ${style} branding. Coach: ${coach}`);
  // You can later plug this into a PDF generator with tactical diagrams and player stats
});
function exportTacticalPDF(session) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Session: ${session.title}`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Age Group: ${session.ageGroup}`, 10, 20);
  doc.text(`Objectives: ${session.objectives}`, 10, 30);
  doc.text(`Drills: ${session.drills.join(', ')}`, 10, 40);

  // Optional: draw tactical overlay
  doc.setDrawColor(0);
  doc.setFillColor(255, 215, 0);
  doc.rect(10, 50, 180, 80, 'FD');

  doc.text("Overlay: Tactical Zones", 15, 60);
  doc.text("• Zone 1: Build-up", 15, 70);
  doc.text("• Zone 2: Midfield press", 15, 80);
  doc.text("• Zone 3: Final third", 15, 90);

  doc.save(`${session.title}_tactical.pdf`);
}
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('player-select');
  const performanceForm = document.getElementById('performance-form');
  const performanceLogContainer = document.getElementById('performance-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (performanceForm && performanceLogContainer) {
    performanceForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const drill = this.querySelectorAll('input')[0].value;
      const score = this.querySelectorAll('input')[1].value;

      const log = JSON.parse(localStorage.getItem('cmdDrillPerformance')) || [];
      log.push({ name, drill, score });
      localStorage.setItem('cmdDrillPerformance', JSON.stringify(log));
      renderDrillPerformance();
      this.reset();
    });

    function renderDrillPerformance() {
      const log = JSON.parse(localStorage.getItem('cmdDrillPerformance')) || [];
      performanceLogContainer.innerHTML = log.map(p => `
        <p><strong>${p.name}</strong> – ${p.drill}: ${p.score}/10</p>
      `).join('');
    }

    renderDrillPerformance();
  }
};
document.getElementById('compare-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const teamA = this.querySelectorAll('input')[0].value;
  const teamB = this.querySelectorAll('input')[1].value;

  const teams = JSON.parse(localStorage.getItem('cmdTeams')) || [];
  const a = teams.find(t => t.id === teamA);
  const b = teams.find(t => t.id === teamB);

  const compare = `
    <p><strong>${a.name}</strong> Formation: ${a.formation} | Style: ${a.style}</p>
    <p><strong>${b.name}</strong> Formation: ${b.formation} | Style: ${b.style}</p>
  `;

  document.getElementById('comparison-log').innerHTML = compare;
});
document.querySelectorAll('.drill-block').forEach(block => {
  block.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.innerText);
  });
});

document.getElementById('session-dropzone').addEventListener('dragover', e => {
  e.preventDefault();
});

document.getElementById('session-dropzone').addEventListener('drop', e => {
  e.preventDefault();
  const drill = e.dataTransfer.getData('text/plain');
  const zone = document.getElementById('session-dropzone');
  zone.innerHTML += `<p>${drill}</p>`;
});
function renderDrillStats() {
  const drillId = document.getElementById('drill-select').value;
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const usage = sessions.filter(s => s.drills?.includes(drillId)).length;
  const ratings = JSON.parse(localStorage.getItem('cmdDrillFeedback')) || [];
  const scores = ratings.filter(r => r.drill === drillId).map(r => parseInt(r.rating));
  const avg = scores.length ? (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1) : 'N/A';

  document.getElementById('drill-stats').innerHTML = `
    <p><strong>${drillId}</strong> used in ${usage} sessions</p>
    <p>Average Coach Rating: ${avg} / 5</p>
  `;
}

document.getElementById('drill-select').addEventListener('change', renderDrillStats);
renderDrillStats();
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('timeline-player');
  const timelineForm = document.getElementById('timeline-form');
  const timelineLogContainer = document.getElementById('timeline-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (timelineForm && timelineLogContainer) {
    timelineForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const date = this.querySelector('input[type="date"]').value;
      const milestone = this.querySelector('input[type="text"]').value;

      const timeline = JSON.parse(localStorage.getItem('cmdTimeline')) || [];
      timeline.push({ name, date, milestone });
      localStorage.setItem('cmdTimeline', JSON.stringify(timeline));
      renderTimeline();
      this.reset();
    });

    function renderTimeline() {
      const timeline = JSON.parse(localStorage.getItem('cmdTimeline')) || [];
      timelineLogContainer.innerHTML = timeline.map(t => `
        <p><strong>${t.name}</strong> – ${t.milestone} on ${t.date}</p>
      `).join('');
    }

    renderTimeline();
  }
};
function renderTacticalEvolution() {
  const sessions = JSON.parse(localStorage.getItem('cmdSessions')) || [];
  const timeline = {};

  sessions.forEach(s => {
    const year = new Date(s.date).getFullYear();
    if (!timeline[year]) timeline[year] = { formations: {}, objectives: {} };
    if (s.formation) timeline[year].formations[s.formation] = (timeline[year].formations[s.formation] || 0) + 1;
    if (s.objectives) timeline[year].objectives[s.objectives] = (timeline[year].objectives[s.objectives] || 0) + 1;
  });

  const output = Object.entries(timeline).map(([year, data]) => {
    const topFormation = Object.entries(data.formations).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';
    const topObjective = Object.entries(data.objectives).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';
    return `<p><strong>${year}</strong> – Formation: ${topFormation}, Objective: ${topObjective}</p>`;
  }).join('');

  document.getElementById('evolution-log').innerHTML = output;
}
document.getElementById('note-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const minute = this.querySelector('input').value;
  const note = this.querySelector('textarea').value;

  const notes = JSON.parse(localStorage.getItem('cmdMatchNotes')) || [];
  notes.push({ minute, note });
  localStorage.setItem('cmdMatchNotes', JSON.stringify(notes));
  renderMatchNotes();
  this.reset();
});

function renderMatchNotes() {
  const notes = JSON.parse(localStorage.getItem('cmdMatchNotes')) || [];
  document.getElementById('note-log').innerHTML = notes.map(n => `
    <p><strong>${n.minute}'</strong> – ${n.note}</p>
  `).join('');
}

renderMatchNotes();
function exportTacticalPDF(session) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Session: ${session.title}`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Age Group: ${session.ageGroup}`, 10, 20);
  doc.text(`Objectives: ${session.objectives}`, 10, 30);
  doc.text(`Drills: ${session.drills.join(', ')}`, 10, 40);

  // Optional: draw tactical overlay
  doc.setDrawColor(0);
  doc.setFillColor(255, 215, 0);
  doc.rect(10, 50, 180, 80, 'FD');

  doc.text("Overlay: Tactical Zones", 15, 60);
  doc.text("• Zone 1: Build-up", 15, 70);
  doc.text("• Zone 2: Midfield press", 15, 80);
  doc.text("• Zone 3: Final third", 15, 90);

  doc.save(`${session.title}_tactical.pdf`);
}
window.onload = function() {
  const players = JSON.parse(localStorage.getItem('cmdPlayers')) || [];

  const playerSelect = document.getElementById('impact-player');
  const impactForm = document.getElementById('impact-form');
  const impactLogContainer = document.getElementById('impact-log');

  if (playerSelect) {
    playerSelect.innerHTML = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

  if (impactForm && impactLogContainer) {
    impactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = playerSelect.value;
      const session = this.querySelectorAll('input')[0].value;
      const score = this.querySelectorAll('input')[1].value;

      const log = JSON.parse(localStorage.getItem('cmdSessionImpact')) || [];
      log.push({ name, session, score });
      localStorage.setItem('cmdSessionImpact', JSON.stringify(log));
      renderImpactLog();
      this.reset();
    });

    function renderImpactLog() {
      const log = JSON.parse(localStorage.getItem('cmdSessionImpact')) || [];
      impactLogContainer.innerHTML = log.map(i => `
        <p><strong>${i.name}</strong> – ${i.session}: ${i.score}/10</p>
      `).join('');
    }

    renderImpactLog();
  }
};
window.onload = function() {
  const canvas = document.getElementById('heatmapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw field
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(50, 50, 500, 300);

  // Example tactical zones with intensity
  const zones = [
    { x: 100, y: 150, intensity: 0.8 },
    { x: 300, y: 200, intensity: 0.6 },
    { x: 450, y: 250, intensity: 0.4 }
  ];

  zones.forEach(zone => {
    ctx.fillStyle = `rgba(255, 0, 0, ${zone.intensity})`;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, 30, 0, 2 * Math.PI);
    ctx.fill();
  });
};
function launchCoachDashboard() {
  const opponent = document.querySelectorAll('#coach-dashboard input')[0].value;
  const date = document.querySelectorAll('#coach-dashboard input')[1].value;
  const lineup = document.querySelectorAll('#coach-dashboard textarea')[0].value;
  const notes = document.querySelectorAll('#coach-dashboard textarea')[1].value;

  const win = window.open('', '', 'width=400,height=600');
  win.document.write(`
    <html><head><title>Coach Dashboard</title><style>
      body { font-family: sans-serif; padding: 20px; }
      h2 { color: #333; }
    </style></head><body>
      <h2>Match vs ${opponent}</h2>
      <p><strong>Date:</strong> ${date}</p>
      <h3>Lineup</h3><p>${lineup.replace(/\n/g, '<br>')}</p>
      <h3>Live Notes</h3><p>${notes.replace(/\n/g, '<br>')}</p>
    </body></html>
  `);
  win.document.close();
}
const levelRequirements = {
  1: 620, 2: 270, 3: 190, 4: 630, 5: 480, 6: 450,
  7: 300, 8: 120, 9: 100, 10: 100, 11: 100, 12: 100, 13: 'Custom'
};

const levelNames = {
  1: 'BasicJuggling', 2: 'ExtInt', 3: 'Alternate', 4: 'Sequence2',
  5: 'Sequence2Combo', 6: 'Sequence3', 7: 'Sequence3Combo',
  8: 'Sequence4', 9: 'Ladder', 10: '1stDegree', 11: '2ndDegree',
  12: '3rdDegree', 13: 'Freestyle Creation'
};

document.getElementById('exam-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const photoURL = entry.photo ? URL.createObjectURL(entry.photo) : 'images/default-player.png';
<img src="${photoURL}" alt="${entry.name}" style="width:60px; border-radius:50%; margin-right:10px;"></img>
  const level = parseInt(this.querySelector('select').value);
  const count = parseInt(this.querySelector('input[type="number"]').value);

  const required = levelRequirements[level];
  const unlocked = (required === 'Custom') || count >= required;

  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  log.push({ name, level, count, unlocked });
  localStorage.setItem('cmdExamLog', JSON.stringify(log));
  renderExamLog();
  this.reset();
});

function renderExamLog() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  document.getElementById('exam-log').innerHTML = log.map(entry => `
    <p>
      <strong>${entry.name}</strong> – Level ${entry.level}: ${levelNames[entry.level]}<br>
      Juggles: ${entry.count} / Required: ${levelRequirements[entry.level]}<br>
      Status: <span style="color:${entry.unlocked ? 'green' : 'red'};">
        ${entry.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}
      </span>
    </p>
  `).join('');
}

renderExamLog();
function renderProgressChart() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const playerLevels = {};

  log.forEach(entry => {
    if (entry.unlocked) {
      playerLevels[entry.name] = Math.max(playerLevels[entry.name] || 0, entry.level);
    }
  });

  const labels = Object.keys(playerLevels);
  const data = Object.values(playerLevels);

  new Chart(document.getElementById('progressChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Highest Unlocked Level',
        data,
        backgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 13 }
      }
    }
  });
}
function getBadge(level) {
  const colors = ['#ccc', '#6c757d', '#007bff', '#28a745', '#ffc107', '#dc3545'];
  const color = colors[Math.floor((level - 1) / 2)];
  return `<span style="background:${color}; color:white; padding:4px 8px; border-radius:4px;">
    Level ${level}: ${levelNames[level]}
  </span>`;
}
function getBadge(level) {
  const colors = ['#ccc', '#6c757d', '#007bff', '#28a745', '#ffc107', '#dc3545'];
  const color = colors[Math.floor((level - 1) / 2)];
  const name = levelNames[level];
  return `<span title="${name}" style="
    background:${color};
    color:white;
    padding:4px 8px;
    border-radius:4px;
    font-weight:bold;
    box-shadow:0 0 5px ${color};
    display:inline-block;
    margin-top:5px;
  ">🏅 ${name}</span>`;
}
function applyFilters() {
  const team = document.getElementById('filter-team').value;
  const coach = document.getElementById('filter-coach').value;
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  const filtered = log.filter(entry => {
    return (!team || entry.team === team) && (!coach || entry.coach === coach);
  });

  renderExamLog(filtered);
}
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  log.forEach((entry, i) => {
    doc.text(`${entry.name} – Level ${entry.level}: ${levelNames[entry.level]}`, 10, 10 + i * 10);
    doc.text(`Juggles: ${entry.count} | Date: ${entry.date}`, 10, 15 + i * 10);
    doc.text(`Status: ${entry.unlocked ? 'Unlocked' : 'Locked'}`, 10, 20 + i * 10);
  });

  doc.save('CMD_Exam_Tracker.pdf');
}
document.getElementById('exam-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Collect form values
  const name = this.querySelector('input[type="text"]').value;
  const level = parseInt(this.querySelector('select').value);
  const count = parseInt(this.querySelector('input[type="number"]').value);
  const date = this.querySelector('input[type="date"]').value;
  const feedback = this.querySelector('textarea').value;

  // ✅ Paste this block right here
  const team = this.querySelector('select[name="team"]').value;
  const coach = this.querySelector('select[name="coach"]').value;

  if (!team || !coach) {
    alert("Please select both team and coach before logging.");
    return;
  }

  // Unlock logic
  const required = levelRequirements[level];
  const unlocked = (required === 'Custom') || count >= required;

  // Save to localStorage
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  log.push({ name, level, count, date, feedback, unlocked, team, coach });
  localStorage.setItem('cmdExamLog', JSON.stringify(log));

  renderExamLog();
  function renderExamLog(filteredLog = null) {
  const log = filteredLog || JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  document.getElementById('exam-log').innerHTML = log.map(entry => `
    <div class="player-card">
      <strong>${entry.name}</strong><br>
      Level ${entry.level}: ${levelNames[entry.level]}<br>
      Juggles: ${entry.count} / Required: ${levelRequirements[entry.level]}<br>
      Date: ${entry.date}<br>
      Team: ${entry.team}<br>
      Coach: ${entry.coach}<br>
      Feedback: ${entry.feedback || '—'}<br>
      Status: <span style="color:${entry.unlocked ? 'green' : 'red'};">
        ${entry.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}
      </span><br>
      Badge: ${getBadge(entry.level)}
    </div>
  `).join('');
}
  this.reset();
});

function renderFreestyleLog() {
  const log = JSON.parse(localStorage.getItem('cmdFreestyleLog')) || [];
  document.getElementById('freestyle-log').innerHTML = log.map(entry => `
    <div>
      <strong>${entry.name}</strong><br>
      <a href="${entry.url}" target="_blank">Watch Submission</a><br>
      <p>${entry.notes}</p>
    </div>
  `).join('');
}
function renderTimelineChart() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const playerMilestones = {};

  log.forEach(entry => {
    if (!playerMilestones[entry.name]) playerMilestones[entry.name] = [];
    playerMilestones[entry.name].push({ level: entry.level, date: entry.date });
  });

  const labels = Object.keys(playerMilestones);
  const datasets = labels.map(name => ({
    label: name,
    data: playerMilestones[name].map(m => ({ x: m.date, y: m.level })),
    borderColor: '#007bff',
    fill: false
  }));

  new Chart(document.getElementById('timelineChart'), {
    type: 'line',
    data: { datasets },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'week' } },
        y: { beginAtZero: true, max: 13 }
      }
    }
  });
}
const teamCoachMap = {
  U9: "Coach Mo",
  U13: "Coach Sam",
  U17: "Coach Lina"
};

document.querySelector('select[name="team"]').addEventListener('change', function() {
  const selectedTeam = this.value;
  const coachSelect = document.querySelector('select[name="coach"]');
  coachSelect.value = teamCoachMap[selectedTeam] || "";
});function renderExamLog(filteredLog = null) {
  const log = filteredLog || JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  document.getElementById('exam-log').innerHTML = log.map(entry => `
    <div class="player-card">
      <strong>${entry.name}</strong><br>
      Level ${entry.level}: ${levelNames[entry.level]}<br>
      Juggles: ${entry.count} / Required: ${levelRequirements[entry.level]}<br>
      Date: ${entry.date}<br>
      Team: ${entry.team}<br>
      Coach: ${entry.coach}<br>
      Feedback: ${entry.feedback || '—'}<br>
      Status: <span style="color:${entry.unlocked ? 'green' : 'red'};">
        ${entry.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}
      </span><br>
      Badge: ${getBadge(entry.level)}
    </div>
  `).join('');
}
function applySort() {
  const sortBy = document.getElementById('sort-by').value;
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  log.sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'level') return a.level - b.level;
    return 0;
  });

  renderExamLog(log);
}
function applySearch() {
  const query = document.getElementById('search-player').value.toLowerCase();
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  const filtered = log.filter(entry => entry.name.toLowerCase().includes(query));
  renderExamLog(filtered);
}
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  log.forEach((entry, i) => {
    doc.text(`${entry.name} | Level ${entry.level}: ${levelNames[entry.level]}`, 10, 10 + i * 10);
    doc.text(`Juggles: ${entry.count} | Date: ${entry.date} | Team: ${entry.team} | Coach: ${entry.coach}`, 10, 15 + i * 10);
  });

  doc.save('CMD_Exam_Tracker.pdf');
}
function exportToCSV() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  let csv = "Name,Level,Level Name,Juggles,Date,Team,Coach,Unlocked,Feedback\n";

  log.forEach(entry => {
    csv += `"${entry.name}",${entry.level},"${levelNames[entry.level]}",${entry.count},"${entry.date}","${entry.team}","${entry.coach}",${entry.unlocked},"${entry.feedback}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'CMD_Exam_Tracker.csv';
  link.click();
}
function renderCoachDashboard() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  const totalPlayers = log.length;
  const avgJuggles = Math.round(log.reduce((sum, e) => sum + e.count, 0) / totalPlayers || 0);
  const unlockedCount = log.filter(e => e.unlocked).length;
  const unlockRate = Math.round((unlockedCount / totalPlayers) * 100 || 0);

  const levelCounts = {};
  log.forEach(e => {
    levelCounts[e.level] = (levelCounts[e.level] || 0) + 1;
  });

  document.getElementById('dashboard-stats').innerHTML = `
    <p><strong>Total Players Tested:</strong> ${totalPlayers}</p>
    <p><strong>Average Juggle Count:</strong> ${avgJuggles}</p>
    <p><strong>Unlock Rate:</strong> ${unlockRate}%</p>
  `;

  // Bar Chart: Players per Level
  new Chart(document.getElementById('levelChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(levelCounts).map(l => `Level ${l}`),
      datasets: [{
        label: 'Players per Level',
        data: Object.values(levelCounts),
        backgroundColor: '#007bff'
      }]
    }
  });

  // Pie Chart: Unlock vs Locked
  new Chart(document.getElementById('unlockChart'), {
    type: 'pie',
    data: {
      labels: ['Unlocked ✅', 'Locked 🔒'],
      datasets: [{
        data: [unlockedCount, totalPlayers - unlockedCount],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    }
  });
}
renderCoachDashboard();
function renderTeamComparison() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const teamStats = {};

  log.forEach(entry => {
    if (!teamStats[entry.team]) {
      teamStats[entry.team] = { count: 0, unlocked: 0, totalJuggles: 0 };
    }
    teamStats[entry.team].count++;
    teamStats[entry.team].totalJuggles += entry.count;
    if (entry.unlocked) teamStats[entry.team].unlocked++;
  });

  const labels = Object.keys(teamStats);
  const unlockRates = labels.map(team => Math.round((teamStats[team].unlocked / teamStats[team].count) * 100));
  const avgJuggles = labels.map(team => Math.round(teamStats[team].totalJuggles / teamStats[team].count));

  new Chart(document.getElementById('teamChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Unlock Rate (%)',
          data: unlockRates,
          backgroundColor: '#28a745'
        },
        {
          label: 'Avg Juggles',
          data: avgJuggles,
          backgroundColor: '#007bff'
        }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
renderTeamComparison();
function renderCoachLeaderboard() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const coachStats = {};

  log.forEach(entry => {
    if (!coachStats[entry.coach]) {
      coachStats[entry.coach] = { count: 0, unlocked: 0 };
    }
    coachStats[entry.coach].count++;
    if (entry.unlocked) coachStats[entry.coach].unlocked++;
  });

  const rows = Object.entries(coachStats).map(([coach, stats]) => {
    const rate = Math.round((stats.unlocked / stats.count) * 100);
    return `<tr><td>${coach}</td><td>${stats.count}</td><td>${stats.unlocked}</td><td>${rate}%</td></tr>`;
  });

  document.getElementById('leaderboard-table').innerHTML = `
    <tr><th>Coach</th><th>Tests</th><th>Unlocked</th><th>Unlock Rate</th></tr>
    ${rows.join('')}
  `;
}
renderCoachLeaderboard();
function exportDashboardPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const total = log.length;
  const avg = Math.round(log.reduce((sum, e) => sum + e.count, 0) / total || 0);
  const unlocked = log.filter(e => e.unlocked).length;
  const unlockRate = Math.round((unlocked / total) * 100 || 0);

  doc.text("CMD Football Coach Dashboard", 10, 10);
  doc.text(`Total Players: ${total}`, 10, 20);
  doc.text(`Average Juggles: ${avg}`, 10, 30);
  doc.text(`Unlock Rate: ${unlockRate}%`, 10, 40);

  doc.save("CMD_Coach_Dashboard.pdf");
}
function exportDashboardCSV() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  let csv = "Name,Level,Juggles,Date,Team,Coach,Unlocked\n";

  log.forEach(entry => {
    csv += `"${entry.name}",${entry.level},${entry.count},"${entry.date}","${entry.team}","${entry.coach}",${entry.unlocked}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "CMD_Coach_Dashboard.csv";
  link.click();
}
function renderLiveScoreboard() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  const recent = log.slice(-10).reverse(); // Last 10 entries
  const rows = recent.map(entry => `
    <tr>
      <td>${entry.name}</td>
      <td>${entry.team}</td>
      <td>${entry.level} (${levelNames[entry.level]})</td>
      <td>${entry.count}</td>
      <td>${entry.unlocked ? '✅' : '🔒'}</td>
    </tr>
  `);

  document.getElementById('scoreboard-table').innerHTML = `
    <tr><th>Player</th><th>Team</th><th>Level</th><th>Juggles</th><th>Status</th></tr>
    ${rows.join('')}
  `;
}
renderLiveScoreboard();
function renderPlayerSpotlight() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  if (log.length === 0) return;

  const top = log.reduce((best, entry) => entry.count > best.count ? entry : best, log[0]);

  document.getElementById('spotlight-card').innerHTML = `
    <div style="border:2px solid gold; padding:12px; border-radius:8px; background:#fffbe6;">
      <h3>🏅 ${top.name}</h3>
      <p><strong>Team:</strong> ${top.team}</p>
      <p><strong>Level:</strong> ${top.level} – ${levelNames[top.level]}</p>
      <p><strong>Juggles:</strong> ${top.count}</p>
      <p><strong>Status:</strong> ${top.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}</p>
      <p><strong>Coach:</strong> ${top.coach}</p>
      <p><strong>Date:</strong> ${top.date}</p>
    </div>
  `;
}
renderPlayerSpotlight();
function renderTeamSpotlight() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const teamStats = {};

  log.forEach(entry => {
    if (!teamStats[entry.team]) {
      teamStats[entry.team] = { total: 0, count: 0 };
    }
    teamStats[entry.team].total += entry.count;
    teamStats[entry.team].count++;
  });

  const bestTeam = Object.entries(teamStats).reduce((best, [team, stats]) => {
    const avg = stats.total / stats.count;
    return avg > best.avg ? { team, avg } : best;
  }, { team: '', avg: 0 });

  document.getElementById('team-spotlight-card').innerHTML = `
    <div style="border:2px solid #007bff; padding:12px; border-radius:8px; background:#e6f0ff;">
      <h3>🏆 ${bestTeam.team}</h3>
      <p><strong>Average Juggles:</strong> ${Math.round(bestTeam.avg)}</p>
    </div>
  `;
}
function renderCoachSpotlight() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const coachStats = {};

  log.forEach(entry => {
    if (!coachStats[entry.coach]) {
      coachStats[entry.coach] = { unlocked: 0, total: 0 };
    }
    coachStats[entry.coach].total++;
    if (entry.unlocked) coachStats[entry.coach].unlocked++;
  });

  const bestCoach = Object.entries(coachStats).reduce((best, [coach, stats]) => {
    const rate = stats.unlocked / stats.total;
    return rate > best.rate ? { coach, rate } : best;
  }, { coach: '', rate: 0 });

  document.getElementById('coach-spotlight-card').innerHTML = `
    <div style="border:2px solid #28a745; padding:12px; border-radius:8px; background:#e6ffe6;">
      <h3>🎖️ ${bestCoach.coach}</h3>
      <p><strong>Unlock Rate:</strong> ${Math.round(bestCoach.rate * 100)}%</p>
    </div>
  `;
}
function renderMobileScoreboard() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const recent = log.slice(-10).reverse();

  const rows = recent.map(entry => `
    <tr>
      <td>${entry.name}</td>
      <td>${entry.team}</td>
      <td>${entry.level} (${levelNames[entry.level]})</td>
      <td>${entry.count}</td>
      <td>${entry.unlocked ? '✅' : '🔒'}</td>
    </tr>
  `);

  document.getElementById('mobile-scoreboard-table').innerHTML = `
    <tr><th>Player</th><th>Team</th><th>Level</th><th>Juggles</th><th>Status</th></tr>
    ${rows.join('')}
  `;
}

// 🔁 Auto-refresh every 30 seconds
setInterval(renderMobileScoreboard, 30000);
renderTeamSpotlight();
renderCoachSpotlight();
renderMobileScoreboard();
function renderQRCodeLauncher() {
  const scoreboardURL = window.location.href + "#mobile-scoreboard"; // or use a dedicated mobile page
  new QRCode(document.getElementById("qrCanvas"), {
    text: scoreboardURL,
    width: 200,
    height: 200
  });
}
renderQRCodeLauncher();
function renderSpotlightCarousel() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];

  // Top 3 teams by average juggles
  const teamStats = {};
  log.forEach(e => {
    if (!teamStats[e.team]) teamStats[e.team] = { total: 0, count: 0 };
    teamStats[e.team].total += e.count;
    teamStats[e.team].count++;
  });
  const topTeams = Object.entries(teamStats)
    .map(([team, stats]) => ({ team, avg: stats.total / stats.count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3);

  // Top 3 coaches by unlock rate
  const coachStats = {};
  log.forEach(e => {
    if (!coachStats[e.coach]) coachStats[e.coach] = { unlocked: 0, total: 0 };
    coachStats[e.coach].total++;
    if (e.unlocked) coachStats[e.coach].unlocked++;
  });
  const topCoaches = Object.entries(coachStats)
    .map(([coach, stats]) => ({ coach, rate: stats.unlocked / stats.total }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

  const html = `
    <h3>🏆 Top Teams</h3>
    ${topTeams.map(t => `<p><strong>${t.team}</strong> – Avg Juggles: ${Math.round(t.avg)}</p>`).join('')}
    <h3>🎖️ Top Coaches</h3>
    ${topCoaches.map(c => `<p><strong>${c.coach}</strong> – Unlock Rate: ${Math.round(c.rate * 100)}%</p>`).join('')}
  `;

  document.getElementById('carousel-container').innerHTML = html;
}
renderSpotlightCarousel();
function renderAnnouncerFeed() {
  const log = JSON.parse(localStorage.getItem('cmdExamLog')) || [];
  const latest = log.slice(-1)[0];

  if (!latest) return;

  const message = `${latest.name} from ${latest.team} just attempted Level ${latest.level} (${levelNames[latest.level]}) with ${latest.count} juggles — ${latest.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}!`;

  document.getElementById('announcer-feed').innerText = message;
}

// 🔁 Auto-refresh every 10 seconds
setInterval(renderAnnouncerFeed, 10000);
renderQRCodeLauncher();
renderSpotlightCarousel();
renderAnnouncerFeed();
document.getElementById("register-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    fullName: form.fullName.value,
    dob: form.dob.value,
    team: form.team.value,
    position: form.position.value,
    level: parseInt(form.level.value)
  };

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(msg => alert(msg));
});
function loadFilteredPlayers(filter = {}) {
  fetch("/api/players")
    .then(res => res.json())
    .then(players => {
      let filtered = players;

      if (filter.team) {
        filtered = filtered.filter(p => p.team === filter.team);
      }
      if (filter.position) {
        filtered = filtered.filter(p => p.position === filter.position);
      }
      if (filter.ageGroup) {
        filtered = filtered.filter(p => {
          const birthYear = new Date(p.dob).getFullYear();
          const age = new Date().getFullYear() - birthYear;
          return filter.ageGroup === "U13" ? age <= 13 : age > 13;
        });
      }

      renderPlayers(filtered); // Your rendering logic here
    });
}
function loadTeamsDashboard() {
  fetch("/api/teams")
    .then(res => res.json())
    .then(teams => {
      const container = document.getElementById("dashboard");
      container.innerHTML = "";

      teams.forEach(team => {
        const section = document.createElement("div");
        section.innerHTML = `<h3>${team.name}</h3><ul>${team.players.map(p => `<li>${p.fullName} (${p.position})</li>`).join("")}</ul>`;
        container.appendChild(section);
      });
    });
}