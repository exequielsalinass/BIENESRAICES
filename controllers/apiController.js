import { Propiedad, Precio, Categoria } from "../models/index.js";

const propiedades = async (req, res) => {
  const propiedades = await Propiedad.findAll({
    include: [{ model: Precio }, { model: Categoria }],
  });

  res.json(propiedades);
};

export { propiedades };
