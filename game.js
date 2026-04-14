const enterBtn = document.getElementById('enter-btn');
const landing = document.getElementById('landing');
const game = document.getElementById('game');
const terminal = document.getElementById('terminal');
const version = document.getElementById('version');
const dropdown = document.getElementById('dropdown');

let started=false;

function print(text){
let div=document.createElement('div');
div.innerHTML=text;
terminal.appendChild(div);
terminal.scrollTop=terminal.scrollHeight;
}

function start(){
if(started)return;
started=true;
landing.style.display="none";
game.style.display="flex";
print("Willkommen.");
prompt();
}

function prompt() {
  const wrapper = document.createElement('div');

  const input = document.createElement('input');
  input.style.background = "black";
  input.style.color = "white";
  input.style.border = "none";
  input.style.outline = "none";
  input.style.width = "300px";

  wrapper.appendChild(input);
  terminal.appendChild(wrapper);

  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      wrapper.remove();

      print("> " + val);

      if (val === "sudo") {
        const img = document.createElement('img');
        img.src = "sudo.gif";
        img.style.width = "200px";
        img.style.display = "block";
        img.style.marginTop = "10px";
        terminal.appendChild(img);
      } else {
        print("Unbekannt.");
      }

      prompt();
    }
  });
}
