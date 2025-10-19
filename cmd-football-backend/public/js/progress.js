function loadProgress() {
  const id = document.getElementById('playerId').value;
  const div = document.getElementById('progress');
  div.innerHTML = 'Loading...';

  fetch(`/api/player/${id}`)
    .then(res => res.json())
    .then(p => {
      div.innerHTML = `
        <h2>${p.fullName}</h2>
        <p>Team: ${p.team}</p>
        <p>Level: ${p.level}</p>
        <p>Juggling Level: ${p.currentJugglingLevel} (${p.badge})</p>
        <p>Last Juggle Count: ${p.lastJuggleCount}</p>
        <p>Completed Drills: ${p.completedDrills?.join(', ') || 'None'}</p>
      `;
    })
    .catch(() => {
      div.innerHTML = '❌ Player not found';
    });
}