import express from "express";
import { propiedades } from "../controllers/apiController.js";

const routes = express.Router();

routes.get("/propiedades", propiedades);

export default routes;
