const modeBtn = document.getElementById('mode-btn');

const easyQuestions = [
  {
    q: 'Frage 1:\nWas ergibt 3+2',
    a: '5'
  },
  {
    q: 'Frage 2:\nDie anderen Kinder wollen nicht mit dir spielen, was kannst du dagegen tun?',
    a: 'Duschen'
  },
  {
    q: 'Frage 3:\nDeine Mama und dein Papa haben sich getrennt, kommen sie wieder zusammen?',
    a: 'Nein, Papa empfängt nun bezahlte Liebe und Mama verteilt sie an die Väter meiner Freunde gratis'
  },
  {
    q: 'Frage 4:\nWas willst du werden wenn du gross bist?',
    a: 'Das was ich jetzt schon bin, ein Opfer'
  }
];

const easyState = {
  active: false,
  index: 0,
  expected: ''
};

function startEasyMode() {
  state.started = true;
  state.demoEnded = false;
  state.gate = null;
  state.gatePrompt = null;

  easyState.active = true;
  easyState.index = 0;

  landing.style.display = 'none';
  game.style.display = 'block';
  terminal.innerHTML = '';
  modeBtn.textContent = 'zurück';

  print('EASY MODE AKTIVIERT');
  print('Du hast den Knopf gedrückt. Das wird nicht vergessen.');
  print('');

  startRoastPopups();
  askEasyQuestion();
}

function askEasyQuestion() {
  if (easyState.index >= easyQuestions.length) {
    print('');
    print('Suuuuuuupi das hast du Highkey toll gemacht :DDDDDDDDDDD XDDDDD');
    print('Hier deine Belohnung:');
    print('');
    print('https://youtu.be/Sv2LhNnK9pw');
    state.demoEnded = true;
    return;
  }

  const current = easyQuestions[easyState.index];
  easyState.expected = current.a;

  printLines(current.q);
  addEasyPrompt();
}

function addEasyPrompt() {
  const wrapper = document.createElement('div');
  wrapper.className = 'prompt-line';

  const prompt = document.createElement('span');
  prompt.className = 'prompt';
  prompt.textContent = 'antwort>';

  const input = document.createElement('input');
  input.className = 'input';
  input.type = 'text';
  input.autocomplete = 'off';
  input.autocorrect = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;

  wrapper.appendChild(prompt);
  wrapper.appendChild(input);
  terminal.appendChild(wrapper);
  input.focus();
  scrollToBottom();

  input.addEventListener('input', () => {
    const expected = easyState.expected;
    const typedLength = input.value.length;
    input.value = expected.slice(0, typedLength);
    input.setSelectionRange(input.value.length, input.value.length);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      input.value = easyState.expected;
      wrapper.remove();

      print('antwort> ' + easyState.expected);
      print('');

      easyState.index++;
      askEasyQuestion();
    }
  });
}

function leaveEasyMode() {
  location.reload();
}

modeBtn.addEventListener('click', (event) => {
  event.stopPropagation();

  if (easyState.active) {
    leaveEasyMode();
    return;
  }

  startEasyMode();
});
