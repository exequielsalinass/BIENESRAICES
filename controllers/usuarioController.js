import { check, validationResult } from "express-validator";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    // Validación
    await check("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .run(req);
    await check("email")
      .isEmail()
      .withMessage("Lo que ingresaste no es un email")
      .run(req);
    await check("password")
      .isLength({ min: 8 })
      .withMessage("El password debe ser de al menos 6 caracteres")
      .run(req);
    await check("repetir_password")
      .equals(password)
      .withMessage("Los passwords no son iguales")
      .run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
      // Errores
      return res.render("auth/registro", {
        pagina: "Crear Cuenta",
        /* csrfToken: req.csrfToken(), */
        errores: resultado.array(),
        usuario: {
          // Para que se mantengan los campos si son correctos en los errores
          nombre: nombre,
          email: email,
        },
      });
    }

    // Evitar usuarios duplicapos
    const usuarioExiste = await Usuario.findOne({ where: { email: email } });

    if (usuarioExiste) {
      return res.render("auth/registro", {
        pagina: "Crear Cuenta",
        /* csrfToken: req.csrfToken(), */
        errores: [{ msg: "El usuario ya está registrado" }],
        usuario: {
          // Para que se mantengan los campos si son correctos en los errores
          nombre: nombre,
          email: email,
        },
      });
    }

    // Almacenar Usuario y se hashea el passsword con el hook en el modelo
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      token: generarId(),
    });

    //Envia email de confirmacion
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    //Mostrar msj
    res.render("templates/mensaje", {
      pagina: "Cuenta Creada Correctamente",
      mensaje:
        "Hemos enviado un email. Revisa tu correo. Puede tardar unos minutos...",
    });
  } catch (error) {
    console.log(error);
  }
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token: token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar. Intenta de nuevo",
      error: true,
    });
  }
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu Contraseña",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
};
