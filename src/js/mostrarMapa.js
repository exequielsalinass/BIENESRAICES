(function () {
  const lat = document.querySelector("#lat").value;
  const lng = document.querySelector("#lng").value;
  const calle = document.querySelector("#calle").textContent;
  const mapa = L.map("mapa").setView([lat, lng], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Agregar el Pin
  L.marker([lat, lng]).addTo(mapa).bindPopup(`Direccion:${calle}`);
})();
