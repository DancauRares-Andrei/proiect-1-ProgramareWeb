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


