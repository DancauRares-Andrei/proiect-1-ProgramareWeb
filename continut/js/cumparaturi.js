class Produs {
  constructor(nume, cantitate, id) {
    this.nume = nume;
    this.cantitate = cantitate;
    this.id = id;
  }
}

const listaCumparaturi = [];

const salvareInStorage = (produs) => {
  let listaProduse = localStorage.getItem('listaProduse');

  if (listaProduse) {
    listaProduse = JSON.parse(listaProduse);
  } else {
    listaProduse = [];
  }

  listaProduse.push(produs);
  localStorage.setItem('listaProduse', JSON.stringify(listaProduse));
};

const formular = document.querySelector('form');
const butonAdauga = document.querySelector('#buton-adauga');
const adaugaProdus = () => {
console.log("aa");
  const nume = formular.nume.value;
  const cantitate = formular.cantitate.value;

  const produs = new Produs(nume, cantitate, Date.now());

  return new Promise((resolve, reject) => {
    if (!produs.nume || !produs.cantitate) {
      reject('Produsul trebuie să aibă un nume și o cantitate!');
    } else {
      listaCumparaturi.push(produs);
      resolve(listaCumparaturi);
    }
  })
  .then((listaCumparaturi) => {
    salvareInStorage(listaCumparaturi);
    formular.reset();
  })
  .catch((error) => {
    console.log(error);
  });
};

