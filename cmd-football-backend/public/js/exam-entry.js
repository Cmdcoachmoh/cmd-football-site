document.getElementById('examForm').addEventListener('submit', e => {
  e.preventDefault();

  const payload = {
    id: document.getElementById('playerId').value,
    juggles: parseInt(document.getElementById('juggles').value),
    bonus: parseInt(document.getElementById('bonus').value),
    malus: parseInt(document.getElementById('malus').value)
  };

  fetch('/api/submitExam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(result => {
    document.getElementById('examResult').innerText = result.message;
  });
});