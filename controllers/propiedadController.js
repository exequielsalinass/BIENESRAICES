import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
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
      categoriaId: categoria,
      usuarioId: usuario.id,
      imagen: "",
    });

    const { id } = propiedadGuardada;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id); //buscar por primary key
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  //Validar que no este publicada(tiene que ser false) -- 0 retorna false
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  //Validar que la propiedad pertenece a quien visita la pagina. Al comparar id es recomendable pasarlos a toString()
  // porque algunos ORM´s los evalua como objetos y siempre daria false aunque los id's sean iguales
  if (usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar Imagen a: "${propiedad.titulo}"`,
    csrfToken: req.csrfToken(),
    propiedad: propiedad,
  });
};

const guardarCambios = async (req, res) => {};

export { admin, crear, guardar, agregarImagen, guardarCambios };
