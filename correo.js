const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nodemailerADL@gmail.com",
    pass: "desafiolatam",
  },
});

const send = async (email, nombre) => {
  let mailOptions = {
    from: "nodemailerADL@gmail.com",
    to: [email],
    subject: `Saludos desde LA NASA`,
    html: `<h3> ¡Hola, ${nombre}! <br><br> La Nasa te da las gracias por subir tu foto a nuestro sistema y colaborar con las investigaciones extraterrestres. </h3>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = send;
