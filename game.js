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

function prompt(){
let input=document.createElement('input');
input.style.background="black";
input.style.color="white";
input.style.border="none";
terminal.appendChild(input);
input.focus();

input.addEventListener('keydown',(e)=>{
if(e.key==="Enter"){
let val=input.value;
print("> "+val);
input.remove();

if(val==="sudo"){
let img=document.createElement('img');
img.src="tenor.gif";
img.style.width="200px";
terminal.appendChild(img);
}else{
print("Unbekannt.");
}

prompt();
}
});
}

enterBtn.onclick=()=>{
enterBtn.classList.add('clicked');
setTimeout(start,200);
};

version.onclick=()=>{
dropdown.classList.toggle('hidden');
};
