fetch('/api/teams')
  .then(res => res.json())
  .then(teams => {
    const container = document.getElementById('report');
    teams.forEach(team => {
      const block = document.createElement('div');
      block.innerHTML = `
        <h2>${team.name}</h2>
        <ul>
          ${team.players.map(p => `
            <li>
              ${p.fullName} — Level ${p.currentJugglingLevel} (${p.badge})<br>
              Completed: ${p.completedDrills?.length || 0} drills
            </li>
          `).join('')}
        </ul>
      `;
      container.appendChild(block);
    });
  });