// Ascultăm mesajele primite de la script-ul principal
onmessage = function(event) {
  console.log(`A fost adăugat produsul ${event.data.nume}!`);
  
  // Trimitem un mesaj înapoi la script-ul principal pentru a indica faptul că am finalizat acțiunea
  postMessage({
  nume: event.data.nume,
  cantitate: event.data.cantitate,
  id: event.data.id
});
};

