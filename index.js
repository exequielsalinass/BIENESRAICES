import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes";
import db from "./config/db.js";

// Crear la App
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexion a la db
try {
  await db.authenticate();
  db.sync();
  console.log("Conexión Correcta a la Base de Datos");
} catch (error) {
  console.log(error);
}

// Habilitar Pug
app.set("view engine", "pug"); // Habilitar dependencia pug ("Template engine")
app.set("views", "./views");

// Carpeta Pública
app.use(express.static("public"));

// Routing
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);

// Puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});
