var listaCumparaturi = [];

var localStorageBtn = document.getElementById("localStorage");
var indexedDBBtn = document.getElementById("indexedDB");

localStorage.setItem("selectedOption", "localStorage");
localStorageBtn.addEventListener("click", () => {
    localStorage.setItem("selectedOption", "localStorage");
    initTable();
});

indexedDBBtn.addEventListener("click", () => {
    localStorage.setItem("selectedOption", "indexedDB");
    initTable();
});
class Produs {
    constructor(nume, cantitate, id) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.id = id;
    }
}
class Stocare {
    adaugăProdus(produs) {}
    preiaProduse() {}
}

class LocalStorageStocare extends Stocare {
    adaugăProdus(produs) {
        listaCumparaturi.push(produs);
        localStorage.setItem('listaProduse', JSON.stringify(listaCumparaturi));
    }

    preiaProduse() {
        listaCumparaturi = JSON.parse(localStorage.getItem('listaProduse')) || [];
        return listaCumparaturi;
    }
}
class IndexDBStocare extends Stocare {
  constructor() {
    super();
    this.openDB();
  }

  openDB() {
    // deschiderea bazei de date indexDB
    const request = window.indexedDB.open("listaProduseDB", 1);

    request.onerror = (event) => {
      console.error("Eroare la deschiderea bazei de date", event);
    };

    request.onsuccess = (event) => {
      console.log("Baza de date a fost deschisă cu succes");
      this.db = event.target.result;
    };

    request.onupgradeneeded = (event) => {
      console.log("Upgradare baza de date");
      const db = event.target.result;

      if (!db.objectStoreNames.contains("produse")) {
        const objectStore = db.createObjectStore("produse", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("nume", "nume", { unique: false });
        objectStore.createIndex("cantitate", "cantitate", { unique: false });
      }
    };
  }

  adaugăProdus(produs) {
    listaCumparaturi.push(produs);
    const transaction = this.db.transaction(["produse"], "readwrite");
    const objectStore = transaction.objectStore("produse");
    const request = objectStore.add(produs);
    request.onerror = (event) => {
      console.error("Eroare la adăugarea produsului în baza de date", event);
    };

    request.onsuccess = (event) => {
      console.log("Produsul a fost adăugat cu succes în baza de date");
    };
  }

  preiaProduse() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["produse"], "readonly");
      const objectStore = transaction.objectStore("produse");
      const request = objectStore.getAll();

      request.onerror = (event) => {
        console.error("Eroare la preluarea produselor din baza de date", event);
        reject(event);
      };

      request.onsuccess = (event) => {
        console.log("Produsele au fost preluate cu succes din baza de date");
        resolve(request.result);
      };
    });
  }
}

var localStorageStocare = new LocalStorageStocare();
var indexDBStocare=new IndexDBStocare();
var formular = document.querySelector('form');
var butonAdauga = document.querySelector('#buton-adauga');
var worker = new Worker('./js/worker.js');
var adaugaProdus = () => {
    const nume = formular.nume.value;
    const cantitate = formular.cantitate.value;

    const produs = new Produs(nume, cantitate, listaCumparaturi.length + 1);

    return new Promise((resolve, reject) => {
            if (!produs.nume || !produs.cantitate) {
                reject('Produsul trebuie să aibă un nume și o cantitate!');
            } else {
                resolve(produs);
                const produsClone = Object.assign({}, produs);
                worker.postMessage(produsClone);
            }
        })
        .then((produs) => {
            var selectedOption = localStorage.getItem("selectedOption");
            if (selectedOption === "localStorage")
                localStorageStocare.adaugăProdus(produs);
            else if (selectedOption === "indexedDB")
                indexDBStocare.adaugăProdus(produs);
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
    row.insertCell().textContent = event.data.id;
    row.insertCell().textContent = event.data.nume;
    row.insertCell().textContent = event.data.cantitate;
};

var initTable = async () => {
    var selectedOption = localStorage.getItem("selectedOption");
    if (selectedOption === "localStorage")
        listaCumparaturi = localStorageStocare.preiaProduse();
    else if (selectedOption === "indexedDB"){
        listaCumparaturi =await indexDBStocare.preiaProduse();
}
    var tableBody = document.querySelector('#tabel-cumparaturi tbody');
    tableBody.innerHTML = '';
    var listaProduse = JSON.parse(localStorage.getItem('listaProduse'));

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
