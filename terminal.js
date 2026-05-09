const terminal = document.getElementById('terminal');

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

function focusInput() {
  const input = terminal.querySelector('.input');
  if (input) input.focus();
}
