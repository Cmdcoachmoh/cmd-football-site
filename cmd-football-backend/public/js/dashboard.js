fetch('/api/dashboard')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('dashboard');
    container.innerHTML = ''; // Clear previous content

    data.forEach(player => {
      const card = document.createElement('div');
      card.className = 'player-card';

      card.innerHTML = `
        <img src="${player.photoUrl}" class="player-photo" alt="${player.name}">
        <h3>${player.badgeEmoji || '🎯'} ${player.name}</h3>
        <p><strong>Team:</strong> ${player.team}</p>
        <p><strong>Level:</strong> ${player.level}</p>
        <p><strong>Juggling Level:</strong> ${player.jugglingLevel}</p>
        <p><strong>Badge:</strong> ${player.badge}</p>
        <p><strong>Position:</strong> ${player.position}</p>
        <p><strong>Age Group:</strong> ${player.ageGroup}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error('❌ Error loading dashboard:', err);
    document.getElementById('dashboard').innerText = 'Failed to load player data.';
  });