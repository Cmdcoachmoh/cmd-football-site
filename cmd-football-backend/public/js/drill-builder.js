document.getElementById('drillForm').addEventListener('submit', e => {
  e.preventDefault();

  const drill = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    bonus: parseInt(document.getElementById('bonus').value),
    malus: parseInt(document.getElementById('malus').value),
    minLevel: parseInt(document.getElementById('minLevel').value)
  };

  fetch('/api/drills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(drill)
  })
  .then(res => res.text())
  .then(msg => {
    document.getElementById('drillStatus').innerText = msg;
    document.getElementById('drillForm').reset();
  });
});