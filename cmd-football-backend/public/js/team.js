fetch('/api/teams')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('teams');
    data.forEach(team => {
      const block = document.createElement('div');
      block.className = 'team-block';
      block.innerHTML = `<h2>${team.name} (${team.ageGroup})</h2>`;
      team.players.forEach(p => {
        block.innerHTML += `<p>${p.fullName} - ${p.position} - Level ${p.level}</p>`;
      });
      container.appendChild(block);
    });
  });