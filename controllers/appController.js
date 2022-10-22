import { Sequelize } from "sequelize";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
  const { usuario } = req;
  //Me trae los datos simplificados
  const [categorias, precios, casas, departamentos] = await Promise.all([
    Categoria.findAll({ raw: true }),  // El raw me da las categorias de otro formato
    Precio.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1, // Categoria de casas
        publicado: true,
      },
      include: [{ model: Precio }],
      order: [["createdAt", "DESC"]],
    }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 2, // Categoria de departamentos
      },
      include: [{ model: Precio }],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("inicio", {
    pagina: "Inicio",
    categorias: categorias,
    precios: precios,
    casas: casas,
    departamentos: departamentos,
    csrfToken: req.csrfToken(),
    usuario: usuario,
  });
};

const categoria = async (req, res) => {
  const { id } = req.params;

  //Comprobar que la categoria exista
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return res.redirect("/404");
  }

  // Obtener las propiedades de la categoria
  const propiedades = await Propiedad.findAll({
    where: { categoriaId: id, publicado: true },
    include: [{ model: Precio }],
  });

  res.render("categoria", {
    pagina:
      categoria.nombre == "Almacen"
        ? `${categoria.nombre}es en Venta`
        : `${categoria.nombre}s en Venta`,
    propiedades: propiedades,
    csrfToken: req.csrfToken(),
  });
};

const noEncontrado = async (req, res) => {
  res.render("404", {
    pagina: "No Encontrada",
    csrfToken: req.csrfToken(),
  });
};

const buscador = async (req, res) => {
  const { termino } = req.body;

  //Validar que termino no este vacio
  if (!termino.trim()) {
    return res.redirect("back");    //* back nos redirige a la pag donde estabamos
  }

  //Consultar las propiedades
  const propiedades = await Propiedad.findAll({     // 162 revisar
    where: {
      titulo: {
        [Sequelize.Op.iLike]: `%${termino}%`,
      },
      publicado: true,
    },
    include: [{ model: Precio }],
  });
  //  console.log(propiedades)

  res.render("busqueda", {
    pagina: "Resultados de la Busqueda",
    propiedades: propiedades,
    csrfToken: req.csrfToken(),
  });
};

export { inicio, categoria, noEncontrado, buscador };
