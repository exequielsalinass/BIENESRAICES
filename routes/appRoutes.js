import express from "express";
import {
  inicio,
  categoria,
  buscador,
  noEncontrado,
} from "../controllers/appController.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

//Pagina de Inicio
router.get("/", identificarUsuario, inicio);

//Categorias
router.get("/categorias/:id", categoria);

//Buscador
router.post("/buscador", buscador);

//Página 404
router.get("/404", noEncontrado);

export default router;
