import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  // Enviar email
  await transport.sendMail({
    from: '"Bienes Raices" <bienesraices@braices.com>',
    to: email,
    subject: "Bienes Raices - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en Bienes Raices",
    html: `<p  style="font-family:Arial; font-weight:900; color:#0284c7; font-size:20px;">Hola: ${nombre}, comprueba tu cuenta en Bienes Raices</p>
    <p  style="font-family:Arial; font-weight:500;">Tu cuenta ya esta casi lista, solo debes darle 'click' al siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Comprobar Cuenta</a>
    </p>
    <p  style="font-family:Arial; font-weight:500;" >Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
    
    `,
  });
};

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const { email, nombre, token } = datos;
  
    // Enviar email
    await transport.sendMail({
      from: '"Bienes Raices" <bienesraices@braices.com>',
      to: email,
      subject: "Bienes Raices - Reestablece tu Password",
      text: "Reestablece tu Password en Bienes Raices",
      html: `<p  style="font-family:Arial; font-weight:900; color:#0284c7; font-size:20px;">Hola: ${nombre}, reestablece tu password en Bienes Raices</p>
      <p  style="font-family:Arial; font-weight:500;">Sigue el siguiente enlace para generar un nuevo password:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Comprobar Cuenta</a>
      </p>
      <p  style="font-family:Arial; font-weight:500;" >Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
      
      `,
    });
  };

export { emailRegistro };
