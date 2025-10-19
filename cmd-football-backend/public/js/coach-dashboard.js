fetch('/api/teams')
  .then(res => res.json())
  .then(teams => {
    const container = document.getElementById('dashboard');

    teams.forEach(team => {
      const block = document.createElement('div');
      block.className = 'team-block';
      block.innerHTML = `<h2>${team.name}</h2>`;

      team.players.forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
          <h3>${p.fullName}</h3>
          <p>ID: ${p.id}</p>
          <p>Team: ${p.team}</p>
          <p>Position: ${p.position}</p>
          <p>Level: ${p.level}</p>
          <p>Juggling Level: ${p.currentJugglingLevel} (${p.badge})</p>
          <p>Last Juggle Count: ${p.lastJuggleCount}</p>
          <p>Completed Drills: ${p.completedDrills?.join(', ') || 'None'}</p>
          <a href="certificate.html?playerId=${p.id}">🎖 View Certificate</a> |
          <a href="progress.html?playerId=${p.id}">📈 View Progress</a>
        `;
        block.appendChild(card);
      });

      container.appendChild(block);
    });
  });
  let allTeams = [];

function renderDashboard(teams) {
  const container = document.getElementById('dashboard');
  container.innerHTML = '';

  const ageGroup = document.getElementById('ageGroupFilter').value;
  const level = document.getElementById('levelFilter').value;

  teams.forEach(team => {
    const block = document.createElement('div');
    block.className = 'team-block';
    block.innerHTML = `<h2>${team.name}</h2>`;

    team.players
      .filter(p => {
        const ageMatch = !ageGroup || p.ageGroup === ageGroup;
        const levelMatch = !level || (level === '5' ? p.currentJugglingLevel >= 5 : p.currentJugglingLevel == level);
        return ageMatch && levelMatch;
      })
      .forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
          <h3>${p.fullName}</h3>
          <p>ID: ${p.id}</p>
          <p>Team: ${p.team}</p>
          <p>Position: ${p.position}</p>
          <p>Level: ${p.level}</p>
          <p>Juggling Level: ${p.currentJugglingLevel} (${p.badge})</p>
          <p>Completed Drills: ${p.completedDrills?.join(', ') || 'None'}</p>
        `;
        block.appendChild(card);
      });

    container.appendChild(block);
  });
}

function applyFilters() {
  renderDashboard(allTeams);
}

fetch('/api/teams')
  .then(res => res.json())
  .then(teams => {
    allTeams = teams;
    renderDashboard(teams);
  });