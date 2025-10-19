function logAttempt() {
  const id = document.getElementById('playerId').value;
  const drill = document.getElementById('drillName').value;
  const result = document.getElementById('result').value;

  fetch('/api/logDrillAttempt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, drill, result })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('status').innerText = data.message;
  });
}