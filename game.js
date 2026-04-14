const VERSION = 'v0.4';

const landing = document.getElementById('landing');
const game = document.getElementById('game');
const enterBtn = document.getElementById('enter-btn');
const terminal = document.getElementById('terminal');
const versionEl = document.getElementById('version');
const dropdownEl = document.getElementById('dropdown');

versionEl.textContent = VERSION;

const fs = {
  '/': { type: 'dir', children: ['home', 'levels'] },
  '/home': { type: 'dir', children: ['player1'] },
  '/home/player1': { type: 'dir', children: ['start.txt'] },
  '/home/player1/start.txt': {
    type: 'file',
    content: 'Du bist nicht am richtigen Ort.'
  },

  '/levels': { type: 'dir', children: ['level1', '.level2'] },
  '/levels/level1': { type: 'dir', children: ['stille.txt', 'schatten.txt', 'tor.txt'] },

  '/levels/level1/stille.txt': {
    type: 'file',
    content: 'Im Limbus sind nicht alle Seelen sichtbar.\nManches entzieht sich deinem ersten Blick.'
  },
  '/levels/level1/schatten.txt': {
    type: 'file',
    content: 'Die Schatten sprechen, doch sie führen nicht.'
  },
  '/levels/level1/tor.txt': {
    type: 'file',
    content: 'Am Rand des Limbus endet der erste Blick.'
  },

  '/levels/.level2': { type: 'dir', children: ['stimme.txt', 'fragment.txt', 'level3'] },
  '/levels/.level2/stimme.txt': {
    type: 'file',
    content: 'Namen sind Schall und Rauch, doch jeder trägt eine Zahl.'
  },
  '/levels/.level2/fragment.txt': {
    type: 'file',
    content: 'Du glaubst dich zu kennen? Doch die da Oben kennt dich besser.'
  },

  '/levels/.level2/level3': { type: 'dir', children: ['echo.txt', 'level4'] },
  '/levels/.level2/level3/echo.txt': {
    type: 'file',
    content: 'Die Mauern schweigen – doch nicht alles ist still.\nZwischen den Stimmen liegt der Weg verborgen.\nNur wer zuhört, wird ihn erkennen.\n\nhttps://www.youtube.com/watch?v=55e9OydtJFI'
  },

  '/levels/.level2/level3/level4': { type: 'dir', children: ['final.txt', 'level5'] },
  '/levels/.level2/level3/level4/final.txt': {
    type: 'file',
    content: 'Demo Ende. Doch wer den Weg nur fremdem Geist entriss, der trat nicht tiefer – er begehrte nur, gesehen zu werden. Ich danke euch :>'
  },

  '/levels/.level2/level3/level4/level5': { type: 'dir', children: ['asche.txt', 'stimme.txt', 'spiegel.txt'] },
  '/levels/.level2/level3/level4/level5/asche.txt': {
    type: 'file',
    content: 'Was verbrannt ist, trägt keine Zahl mehr. In der Asche liegt nur das, was andere hineinsehen wollen.'
  },
  '/levels/.level2/level3/level4/level5/stimme.txt': {
    type: 'file',
    content: 'Nicht jede Stimme führt. Manche wollen nur geprüft wissen, wer blind dem Flüstern folgt.'
  },
  '/levels/.level2/level3/level4/level5/spiegel.txt': {
    type: 'file',
    content: 'Der Spiegel zeigt nicht den Weg, sondern den, der zu schnell glaubt, ihn schon gefunden zu haben.'
  }
};

const COMMANDS = ['help', 'ls', 'cd', 'cat', 'pwd', 'clear', 'id', 'ip'];

const state = {
  user: 'player1',
  uid: 1001,
  gid: 1001,
  cwd: '/home/player1',
  history: [],
  historyIndex: 0,
  started: false,
  gate: null,
  gatePrompt: null,
  demoEnded: false
};

function print(text = '', className = '') {
  const line = document.createElement('div');
  line.className = ('line ' + className).trim();
  line.textContent = text;
  terminal.appendChild(line);
  scrollToBottom();
}

function printHTML(html = '', className = '') {
  const line = document.createElement('div');
  line.className = ('line ' + className).trim();
  line.innerHTML = html;
  terminal.appendChild(line);
  scrollToBottom();
}

function printLines(text) {
  String(text).split('\n').forEach((line) => print(line));
}

function printImage(src) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'terminal-image';
  terminal.appendChild(img);
  scrollToBottom();
}

function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

function promptText() {
  if (state.gatePrompt) {
    return state.gatePrompt;
  }
  return state.user + '@xeidos:' + state.cwd + '$';
}

function focusInput() {
  const input = terminal.querySelector('.input');
  if (input) input.focus();
}

function exists(path) {
  return Object.prototype.hasOwnProperty.call(fs, path);
}

function isDir(path) {
  return exists(path) && fs[path].type === 'dir';
}

function isFile(path) {
  return exists(path) && fs[path].type === 'file';
}

function normalizePath(inputPath, basePath = state.cwd) {
  if (!inputPath || inputPath.trim() === '') return basePath;

  const rawPath = inputPath.startsWith('/') ? inputPath : basePath + '/' + inputPath;
  const parts = rawPath.split('/');
  const stack = [];

  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (stack.length > 0) stack.pop();
      continue;
    }
    stack.push(part);
  }

  return '/' + stack.join('/');
}

function getChildren(path, showHidden = false) {
  if (!isDir(path)) return [];
  return fs[path].children.filter((name) => showHidden || !name.startsWith('.'));
}

function getSuggestions() {
  const suggestions = [...COMMANDS];
  if (isDir(state.cwd)) {
    suggestions.push(...fs[state.cwd].children);
  }
  return [...new Set(suggestions)];
}

function autocompleteInput(input) {
  const value = input.value;
  const parts = value.split(/\s+/);
  const lastPart = parts[parts.length - 1] || '';

  if (parts.length === 1 && !value.endsWith(' ')) {
    const matches = COMMANDS.filter((entry) => entry.startsWith(parts[0]));
    if (matches.length === 1) {
      input.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      print(matches.join('  '));
    }
    return;
  }

  const command = parts[0];
  if (!['cat', 'cd', 'ls', 'ip'].includes(command)) {
    return;
  }

  const matches = getSuggestions().filter((entry) => entry.startsWith(lastPart));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    input.value = parts.join(' ') + ' ';
  } else if (matches.length > 1) {
    print(matches.join('  '));
  }
}

function addPrompt() {
  if (state.demoEnded) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'prompt-line';

  const prompt = document.createElement('span');
  prompt.className = 'prompt';
  prompt.textContent = promptText();

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

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = input.value;
      wrapper.remove();
      print(promptText() + ' ' + value);
      runCommand(value);
      if (!state.demoEnded) addPrompt();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!state.history.length) return;
      state.historyIndex = Math.max(0, state.historyIndex - 1);
      input.value = state.history[state.historyIndex] || '';
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!state.history.length) return;
      state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
      input.value = state.history[state.historyIndex] || '';
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      autocompleteInput(input);
    }
  });
}

function readFiles(args) {
  if (!args.length) {
    print('Was willst du lesen?');
    return;
  }

  for (const name of args) {
    const target = normalizePath(name);
    if (!isFile(target)) {
      print(name + ': Diese Datei existiert nicht.');
      continue;
    }
    printLines(fs[target].content);
  }
}

function handleGateAnswer(answer) {
  if (state.gate === 'level3') {
    if (answer === String(state.uid)) {
      state.cwd = '/levels/.level2/level3';
    } else {
      print('Das Tor bleibt verschlossen.');
    }
  } else if (state.gate === 'level4') {
    if (answer === '00100101') {
      state.cwd = '/levels/.level2/level3/level4';
      print('Demo Ende. Doch wer den Weg nur fremdem Geist entriss, der trat nicht tiefer – er begehrte nur, gesehen zu werden. Ich danke euch :>');
    } else {
      print('Das Tor bleibt verschlossen.');
    }
  } else if (state.gate === 'level5') {
    if (answer === 'sub7') {
      state.cwd = '/levels/.level2/level3/level4/level5';
      print('Du bist bis hierhin gekommen.');
      print('Nenne mir persönlich das Passwort.');
      state.demoEnded = true;
    } else {
      print('Das Tor bleibt verschlossen.');
    }
  }

  state.gate = null;
  state.gatePrompt = null;
}

function runCommand(raw) {
  const trimmed = raw.trim();
  if (trimmed) {
    if (state.history[state.history.length - 1] !== trimmed) {
      state.history.push(trimmed);
    }
    state.historyIndex = state.history.length;
  }

  if (!trimmed) return;

  if (state.gate) {
    handleGateAnswer(trimmed);
    return;
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      print('Befehle: help, ls, cd, cat, pwd, clear, id, ip');
      break;

    case 'ls': {
      let showHidden = false;
      let target = state.cwd;

      for (const arg of args) {
        if (arg === '-a') {
          showHidden = true;
        } else {
          target = normalizePath(arg);
        }
      }

      if (!isDir(target)) {
        print('Kein gültiger Ort.');
        break;
      }

      print(getChildren(target, showHidden).join('  '));
      break;
    }

    case 'pwd':
      print(state.cwd);
      break;

    case 'id':
      print('uid=' + state.uid + '(' + state.user + ') gid=' + state.gid + '(' + state.user + ') groups=' + state.gid + '(' + state.user + ')');
      break;

    case 'cat':
      readFiles(args);
      break;

    case 'cd': {
      if (!args[0]) {
        state.cwd = '/home/player1';
        break;
      }

      const target = normalizePath(args[0]);

      if (target === '/levels/.level2/level3' && state.cwd !== '/levels/.level2/level3') {
        print('Das Tor verlangt deine Zahl:');
        state.gate = 'level3';
        state.gatePrompt = 'eingabe>';
        break;
      }

      if (target === '/levels/.level2/level3/level4' && state.cwd !== '/levels/.level2/level3/level4') {
        print('Das Tor verlangt Licht und Schatten:');
        state.gate = 'level4';
        state.gatePrompt = 'eingabe>';
        break;
      }

      if (target === '/levels/.level2/level3/level4/level5' && state.cwd !== '/levels/.level2/level3/level4/level5') {
        print('Das Tor verlangt den Namen, der keiner der Wege war:');
        state.gate = 'level5';
        state.gatePrompt = 'eingabe>';
        break;
      }

      if (!isDir(target)) {
        print('Dieser Pfad existiert nicht.');
        break;
      }

      state.cwd = target;
      break;
    }

    case 'clear':
      terminal.innerHTML = '';
      break;

    case 'ip':
      if (args.length === 1 && args[0] === 'route') {
        print('default via 10.13.37.1 dev eth0 proto static');
        print('10.13.37.0/24 dev eth0 proto kernel scope link src 10.13.37.41');
        print('172.18.0.0/16 dev eth1 proto kernel scope link src 172.18.0.2');
        print('192.168.56.0/24 dev eth2 proto kernel scope link src 192.168.56.1');
        print('10.0.2.0/24 dev eth3 proto kernel scope link src 10.0.2.15');
      } else {
        print('Nur der Weg ist hier von Bedeutung.');
      }
      break;

    case 'sudo':
      printImage('sudo.gif');
      break;

    default:
      print('Noch nicht.');
  }
}

function startDemo() {
  if (state.started) return;
  state.started = true;
  landing.style.display = 'none';
  game.style.display = 'block';

  print('Lasst, die ihr eintretet, alle Hoffnung fahren');
  print('Verfügbare Befehle sind begrenzt.');
  print('Beginne mit: ls');
  print('');
  addPrompt();
}

function startWithEffect() {
  if (state.started) return;

  enterBtn.classList.add('clicked');

  setTimeout(() => {
    startDemo();
  }, 220);
}

enterBtn.addEventListener('click', startWithEffect);

window.addEventListener('click', (event) => {
  if (event.target === versionEl) return;
  if (dropdownEl.contains(event.target)) return;
  focusInput();
  if (!dropdownEl.classList.contains('hidden')) {
    dropdownEl.classList.add('hidden');
  }
});

versionEl.addEventListener('click', (event) => {
  event.stopPropagation();
  dropdownEl.classList.toggle('hidden');
});

window.addEventListener('keydown', (event) => {
  if (!state.started && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    startWithEffect();
  }
});
