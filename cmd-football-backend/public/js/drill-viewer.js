function loadDrills() {
  const playerId = document.getElementById('playerId').value;

  fetch(`/api/player/${playerId}`)
    .then(res => res.json())
    .then(player => {
      const level = player.currentJugglingLevel;

      fetch('/api/drills')
        .then(res => res.json())
        .then(drills => {
          const filtered = drills.filter(d => level >= d.minLevel);
          const container = document.getElementById('drillList');
          container.innerHTML = `<h2>Drills for Level ${level}</h2>`;

          filtered.forEach(d => {
            const card = document.createElement('div');
            card.className = 'drill-card';
            card.innerHTML = `
              <h3>${d.name}</h3>
              <p>${d.description}</p>
              <p>Bonus: ${d.bonus} | Malus: ${d.malus}</p>
              <p>Min Level: ${d.minLevel}</p>
            `;
            container.appendChild(card);
          });

          if (filtered.length === 0) {
            container.innerHTML += `<p>No drills available for this level.</p>`;
          }
        });
    })
    .catch(err => {
      document.getElementById('drillList').innerText = '❌ Player not found or error loading drills.';
    });
}