function searchPlayer() {
  const id = document.getElementById('searchId').value;
  fetch(`/api/player/${id}`)
    .then(res => res.json())
    .then(p => {
      const container = document.getElementById('playerInfo');
      container.innerHTML = `
        <h2>${p.fullName}</h2>
        <p>Team: ${p.team}</p>
        <p>Position: ${p.position}</p>
        <p>Level: ${p.level}</p>
        <p>Juggling Level: ${p.currentJugglingLevel}</p>
        <p>Badge: ${p.getBadge}</p>
      `;
    });
}