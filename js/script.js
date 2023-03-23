var dataOra = new Date();
var dataOraElem = document.getElementById("data-ora");
dataOraElem.innerHTML = dataOra.toLocaleString();

// Definim funcția pentru actualizarea timpului
function actualizareTimp() {
  // Obținem timpul curent
  var dataOraCurenta = new Date();

  // Actualizăm elementul HTML cu timpul curent
  dataOraElem.innerHTML = dataOraCurenta.toLocaleString();
}

// Programăm execuția funcției de actualizare a timpului la fiecare 1000 de milisecunde (1 secundă)
setInterval(actualizareTimp, 1000);

// afișare adresa URL
document.getElementById("url").innerHTML = window.location.href;

// afișare locația curentă
document.getElementById("locație").innerHTML = window.location.pathname;

// afișare numele și versiunea browser-ului
var browser = navigator.userAgent;
document.getElementById("browser").innerHTML = browser;

// afișare sistemul de operare folosit de utilizator
var os = navigator.platform;
document.getElementById("os").innerHTML = os;



// Obținem elementul canvas și contextul 2D pentru desenare
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

window.onload = function() {
  var img = document.getElementById("comp");
 context.drawImage(img, 10, 10);
};

// Setăm culorile implicite pentru contur și umplere
var culoareContur = "#000000";
var culoareUmplere = "#ffffff";

// Obținem pickerele de culoare și adăugăm event listeners pentru a detecta schimbările
var colorPickerContur = document.getElementById("color-picker-contur");
var colorPickerUmplere = document.getElementById("color-picker-umplere");

colorPickerContur.addEventListener("input", actualizeazaCuloareContur);
colorPickerUmplere.addEventListener("input", actualizeazaCuloareUmplere);

// Funcție pentru a actualiza culoarea conturului
function actualizeazaCuloareContur() {
  culoareContur = colorPickerContur.value;
}

// Funcție pentru a actualiza culoarea de umplere
function actualizeazaCuloareUmplere() {
  culoareUmplere = colorPickerUmplere.value;
}

// Adăugăm event listeners pentru a detecta evenimentele de mouse
canvas.addEventListener("mousedown", incepeDesenul);
canvas.addEventListener("mousemove", deseneaza);
canvas.addEventListener("mouseup", opresteDesenul);

// Funcție pentru a începe desenul
function incepeDesenul(event) {
  // Setăm culoarea conturului
  culoareContur = document.getElementById("color-picker-contur").value;

  // Setăm culoarea de umplere
  culoareUmplere = document.getElementById("color-picker-umplere").value;

  // Începem desenul
  context.beginPath();

  // Setăm poziția inițială a mouse-ului ca punct de început al desenului
  context.moveTo(event.offsetX, event.offsetY);
}

// Funcție pentru a desena
function deseneaza(event) {
  // Dacă mouse-ul este apăsat, desenăm
  if (event.buttons !== 1) {
    return;
  }

  // Setăm culoarea conturului
  context.strokeStyle = culoareContur;

  // Setăm culoarea de umplere
  context.fillStyle = culoareUmplere;

  // Desenăm linia curentă
  context.lineTo(event.offsetX, event.offsetY);

  // Desenăm conturul și umplerea formei
  context.stroke();
  context.fill();

  // Începem o nouă formă pentru a avea un nou contur și umplere
  context.beginPath();

  // Setăm poziția curentă a mouse-ului ca punct de început al noii forme
  context.moveTo(event.offsetX, event.offsetY);
}

// Funcție pentru a opri desenul
function opresteDesenul() {
  // Terminăm forma curentă
  context.closePath();
}


var butonDesenareDreptunghi = document.getElementById("deseneaza-dreptunghi");
butonDesenareDreptunghi.addEventListener("click", incepeDesenareDreptunghi);

var x1, y1, x2, y2;

function incepeDesenareDreptunghi() {
  // Adăugăm un event listener la canvas pentru a detecta clic-urile mouse-ului
  canvas.removeEventListener("mousedown", incepeDesenul);
  canvas.removeEventListener("mousemove", deseneaza);
  canvas.removeEventListener("mouseup", opresteDesenul);
  canvas.addEventListener("mousedown", deseneazaDreptunghi);
}
function deseneazaDreptunghi(event) {
  // Dacă acesta este primul clic, memorăm coordonatele punctului inițial
  if (!x1 && !y1) {
    x1 = event.clientX - canvas.offsetLeft;
    y1 = event.clientY- canvas.getBoundingClientRect().top;
//    y1 = event.clientY - canvas.offsetTop;
  }
  // Dacă acesta este al doilea clic, memorăm coordonatele punctului final
  else {
    actualizeazaCuloareContur();
    actualizeazaCuloareUmplere();
    x2 = event.clientX - canvas.offsetLeft;
 //   y2 = event.clientY - canvas.offsetTop;
 y2 = event.clientY- canvas.getBoundingClientRect().top;
    // Calculăm coordonatele dreptunghiului
    var xMin = Math.min(x1, x2);
    var xMax = Math.max(x1, x2);
    var yMin = Math.min(y1, y2);
    var yMax = Math.max(y1, y2);
    // Desenăm dreptunghiul
    context.beginPath();
    context.rect(parseFloat(xMin),parseFloat(yMin),parseFloat(xMax - xMin),parseFloat(yMax - yMin)); 
 //   context.rect(100, 100, 10, 10); 
    context.strokeStyle = culoareContur;
    context.fillStyle = culoareUmplere;
    context.fill();
    context.stroke();
    // Resetăm coordonatele punctelor
    x1 = null;
    y1 = null;
    x2 = null;
    y2 = null;
// Înlăturăm event listener-ul pentru a evita desenarea de dreptunghiuri suplimentare
canvas.removeEventListener("mousedown", deseneazaDreptunghi);
canvas.addEventListener("mousedown", incepeDesenul);
canvas.addEventListener("mousemove", deseneaza);
canvas.addEventListener("mouseup", opresteDesenul);

}
}

