const worker = new Worker('./js/worker.js');
class Produs {
  constructor(nume, cantitate, id) {
    this.nume = nume;
    this.cantitate = cantitate;
    this.id = id;
  }
}

var listaCumparaturi = [];

const formular = document.querySelector('form');
const butonAdauga = document.querySelector('#buton-adauga');
const adaugaProdus = () => {
  const nume = formular.nume.value;
  const cantitate = formular.cantitate.value;

  const produs = new Produs(nume, cantitate, listaCumparaturi.length+1);

  return new Promise((resolve, reject) => {
    if (!produs.nume || !produs.cantitate) {
      reject('Produsul trebuie să aibă un nume și o cantitate!');
    } else {
      listaCumparaturi.push(produs);
      resolve(listaCumparaturi);
      const produsClone = Object.assign({}, produs);
      worker.postMessage(produsClone);
    }
  })
  .then((listaCumparaturi) => {
    localStorage.setItem('listaProduse', JSON.stringify(listaCumparaturi));
    formular.reset();
  })
  .catch((error) => {
    console.log(error);
  });
};
// Ascultăm mesajele primite de la worker
worker.onmessage = function(event) {
 // console.log(event.data);

  // Adăugăm o linie nouă în tabelul cu lista de cumpărături
  const tbody = document.querySelector('#tabel-cumparaturi tbody');
  const row = tbody.insertRow();
  row.insertCell().textContent=event.data.id;
  row.insertCell().textContent = event.data.nume;
  row.insertCell().textContent = event.data.cantitate;
};

const initTable = () => {
  listaCumparaturi=JSON.parse(localStorage.getItem('listaProduse')) || [];
  const tableBody = document.querySelector('#tabel-cumparaturi tbody');
  tableBody.innerHTML = '';
  const listaProduse = JSON.parse(localStorage.getItem('listaProduse'));

  if (listaCumparaturi) {
    listaCumparaturi.forEach((produs, index) => {
      const row = tableBody.insertRow();
      const nrCell = row.insertCell();
      const numeCell = row.insertCell();
      const cantitateCell = row.insertCell();

      nrCell.textContent = produs.id;
      numeCell.textContent = produs.nume;
      cantitateCell.textContent = produs.cantitate;
    });
  }
};
initTable();
/*document.addEventListener('DOMContentLoaded', () => {
  initTable();
});*/


