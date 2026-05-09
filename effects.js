const roastTexts = [
  'Loser',
  'Du bist hässlich',
  'Du Kämpfst wie eine Kuh',
  'Du bist der Grund für Thanos Entscheidung',
  'Die Maskenpflicht damals war nur wegen dir',
  'Darum liebt dich keiner',
  'Deine Eltern bezahlen deine Freunde damit sie mit dir spielen',
  'Du hast einen Helm auf dem Spielplatz getragen und trägst ihn immer noch',
  'Du stinkst',
  'Niemand mag dich'
];

let roastTimer = null;

function startRoastPopups() {
  stopRoastPopups();
  showRoastPopup();

  roastTimer = setInterval(() => {
    showRoastPopup();
  }, 20000);
}

function stopRoastPopups() {
  if (roastTimer) {
    clearInterval(roastTimer);
    roastTimer = null;
  }
}

function showRoastPopup() {
  const popup = document.createElement('div');
  popup.className = 'roast-popup';

  const text = roastTexts[Math.floor(Math.random() * roastTexts.length)];
  popup.textContent = text;

  const maxX = Math.max(10, window.innerWidth - 460);
  const maxY = Math.max(10, window.innerHeight - 120);

  popup.style.left = Math.floor(Math.random() * maxX) + 'px';
  popup.style.top = Math.floor(Math.random() * maxY) + 'px';

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 5000);
}
