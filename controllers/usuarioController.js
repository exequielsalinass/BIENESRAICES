import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  try {
    await check("email")
      .isEmail()
      .withMessage("El email es obligatorio")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
      return res.render("auth/login", {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email: email } });

    if (!usuario) {
      return res.render("auth/login", {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "El usuario no existe" }],
      });
    }

    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
      return res.render("auth/login", {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "Aún no has confirmado tu cuenta. Revisa tu email" }],
      });
    }

    //Revisar password. La funcion ya la tiene en el prototype del objeto Usuario
    if (!usuario.verificarPassword(password)) {
      return res.render("auth/login", {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "La contraseña es incorrecta" }],
      });
    }

    //Autenticar usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

    //Almacenar token en cookie
    return res
      .cookie("_token", token, {
        httpOnly: true,
        // secure: true,
        // SameSite: true,
      })
      .redirect("/mis-propiedades");
  } catch (error) {
    console.log(error);
  }
};

const cerrarSesion = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
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
        csrfToken: req.csrfToken(),
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
        csrfToken: req.csrfToken(),
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

  // Confimar cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  return res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    csrfToken: req.csrfToken(),
    mensaje: "La cuenta fue confirmada correctamente",
    error: false,
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await check("email")
      .isEmail()
      .withMessage("Lo que ingresaste no es un email")
      .run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
      return res.render("auth/olvide-password", {
        pagina: "Recupera tu cuenta",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }

    //Buscar el usuario
    const usuario = await Usuario.findOne({ where: { email: email } });

    if (!usuario) {
      return res.render("auth/olvide-password", {
        pagina: "Recupera tu cuenta",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "El email no existe" }],
      });
    }

    // Si existe el usuario genero un nuevo token
    usuario.token = generarId();
    await usuario.save();

    //Envio de email
    emailOlvidePassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    res.render("templates/mensaje", {
      pagina: "Restablece tu Contraseña",
      mensaje:
        "Hemos enviado un email. Revisa tu correo. Puede tardar unos minutos",
    });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token: token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Recupera tu contraseña",
      mensaje: "Hubo un error al validar tu información. Intenta de nuevo",
      error: true,
    });
  }
  //Mostrar formulario para modificar contraseña
  res.render("auth/reset-password", {
    pagina: "Restablece tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    await check("password")
      .isLength({ min: 6 })
      .withMessage("El password debe ser de al menos 6 caracteres")
      .run(req);
    await check("repetir_password")
      .equals(password)
      .withMessage("Los passwords no son iguales")
      .run(req);

    let resultado = validationResult(req);

    //Verificar que el array tenga erroes
    if (!resultado.isEmpty()) {
      return res.render("auth/reset-password", {
        pagina: "Restablece tu contraseña",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }
    //Identificar usuario que solicita el cambio
    const usuario = await Usuario.findOne({ where: { token: token } });

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.token = null;
    await usuario.save();

    res.render("auth/confirmar-cuenta", {
      pagina: "Contraseña reestablecida",
      mensaje: "La contraseña se guardo correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar,
  cerrarSesion,
};
