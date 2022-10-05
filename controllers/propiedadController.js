import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    barra: true,
  });
};

// Formulario para crear una nueva propiedad
const crear = async (req, res) => {
  //* Consultar Modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  // console.log(req.body)
  // Validacion del post
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Consultar el Modelo de Precio y Categorías
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]); // Se require pq si hay error en el post del form igualmente tenemos que tener
    // las categorias y precios

    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      csrfToken: req.csrfToken(),
      categorias: categorias,
      precios: precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  //Crear registro
  const {
    titulo,
    descripcion,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
    precio,
    categoria,
  } = req.body;
  const { usuario } = req;
  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId: precio,
      categoriaId: categoria,/* 
      usuarioId: usuario.id, */
      /* imagen: "", */
    });

    /* const { id } = propiedadGuardada;
    res.redirect(`/propiedades/agregar-imagen/${id}`); */
  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardar };
