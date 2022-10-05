import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from './usuario.js'
/* import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js"; */
import { Categoria, Precio, Usuario } from '../models/index.js'
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    // Autenticar
    await db.authenticate();

    // Generar las columnas
    await db.sync();

    // Insertamos los datos
    // Forma no muy profesional
    /* await Categoria.bulkCreate(categorias)
        await Precio.bulkCreate(precios) */
    //* Forma profesional:
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
      Usuario.bulkCreate(usuarios)
    ]);
    console.log("Datos importados correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    /* await Promise.all([
      Categoria.destroy({ where: {}, truncate: true }),
      Precio.destroy({ where: {}, truncate: true }),
    ]); */
    // Una forma mas fuerte de hacerlo
    await db.sync({force: true})
    console.log('Datos eliminados correctamente')
    exit()
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
