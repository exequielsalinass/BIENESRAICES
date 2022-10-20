(function () {
  const lat = -32.9838598;
  const lng = -68.7887384;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 14);

  //Los Pines que se van a mostar en el mapa de la pagina principal
  let markers = new L.FeatureGroup().addTo(mapa);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Lo lleno en la funcion de abajo ObtenerPropiedades()
  let propiedades = [];

  //Filtros
  const categoriasSelect = document.querySelector("#categorias");
  const preciosSelect = document.querySelector("#precios");

  const filtros = {
    categoria: "",
    precio: "",
  };

  //Filtrado de categorias
  categoriasSelect.addEventListener("change", (e) => {
    filtros.categoria = e.target.value; //* +e.target.value => el signo + lo transfroma de string a nro
    filtrarPropiedades();
  });

  //Filtrado de precios
  preciosSelect.addEventListener("change", (e) => {
    filtros.precio = e.target.value;
    filtrarPropiedades();
  });

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/propiedades";
      const respuesta = await fetch(url);
      //Lo almaceno en el array propiedades de arriba
      propiedades = await respuesta.json();

      mostrarPropiedades(propiedades);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarPropiedades = (propiedades) => {
    //Limpiar los markers previos
    markers.clearLayers();

    for (let p of propiedades) {
      //Agregar los pines
      if (p.publicado) {
        const marker = new L.marker([p?.lat, p?.lng], {
          autoPan: true,
        }).addTo(mapa).bindPopup(`
                    <p class="text-indigo-600 font-bold">${p?.categoria.nombre}</p>
                    <h1 class="text-xl font-extrabold my-2 uppercase">${p?.titulo}</h1>
                    <img src="/uploads/${p?.imagen}" alt="Imagen de la propiedad ${p?.titulo}"/>
                    <p class="text-gray-600 font-bold">${p?.precio.nombre}</p>
                    <a href="/propiedad/${p?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a> 
                `);

        markers.addLayer(marker);
        console.log(propiedades)
      }
    }
  };

  const filtrarPropiedades = () => {
    const resultado = propiedades
      .filter(filtrarCategoria)
      .filter(filtrarPrecio);

    mostrarPropiedades(resultado); //En resultado estan las propiedades filtradas
  };

  const filtrarCategoria = (propiedad) => {
    if (filtros.categoria) {
      return propiedad.categoria.nombre === filtros.categoria;
    }
    return propiedad;
  };

  const filtrarPrecio = (propiedad) => {
    if (filtros.precio) {
      return propiedad.precio.nombre === filtros.precio;
    }
    return propiedad;
  };

  obtenerPropiedades();
})();
