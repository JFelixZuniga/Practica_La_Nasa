const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const secretKey = "Shhhh";

const {
  nuevoUsuario,
  getUsuarios,
  setUsuarioStatus,
  getUsuario,
} = require("./consultas");

const send = require("./correo");

/* ---------- Rutas ---------- */
app.listen(3000, () => console.log("Servidor ON"));

/* ---------- Middlewares ---------- */
// Para recibir la carga de imágenes al servidor a través de un formulario
app.use(bodyParser.urlencoded({ extended: false }));
// Para recibir el payload de las consultas PUT y POST
app.use(bodyParser.json());
// Declaramos como estático el contenido que este en la carpeta public
app.use(express.static(__dirname + "/public"));
// Configuramos expressFileUpload con un máximo de 5 MB para la carga de archivo
app.use(
  expressFileUpload({
    limits: 5000000,
    abortOnLimit: true,
    responseOnLimit: "El tamaño de la imagen supera el límite permitido",
  })
);
// Declaramos la ruta para el css de nuestro contenido, es una forma de ocuparlos, utilizando el código fuente del paquete de npm
app.use(
  "/css",
  express.static(__dirname + "/node_modules//bootstrap/dist/css")
);
// Configuración de handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/mainLayout`,
  })
);
app.set("view engine", "handlebars");

/* ---------- Rutas ---------- */
app.get("/", (req, res) => {
  res.render("Home");
});

app.post("/usuarios", async (req, res) => {
  // console.log(req.body);
  // Imprime: { email: 'john@john.cl', nombre: 'john', password: '123' }
  const { email, nombre, password } = req.body;
  try {
    const usuario = await nuevoUsuario(email, nombre, password);
    res.status(201).send(usuario);
  } catch (err) {
    res.status(500).send({
      error: `Algo salió mal... ${err}`,
      code: 500,
    });
  }
});

app.put("/usuarios", async (req, res) => {
  const { id, auth } = req.body;
  try {
    const usuario = await setUsuarioStatus(id, auth);
    res.status(200).send(JSON.stringify(usuario));
  } catch (err) {
    res.status(500).send({
      error: `Algo salió mal... ${err}`,
      code: 500,
    });
  }
});

app.get("/Admin", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.render("Admin", { usuarios });
  } catch (err) {
    res.status(500).send({
      error: `Algo salió mal... ${err}`,
      code: 500,
    });
  }
});

app.get("/Login", async (req, res) => {
  res.render("Login");
});

app.post("/verify", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUsuario(email, password);
  if (user) {
    if (user.auth) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 180,
          data: user,
        },
        secretKey
      );
      res.send(token);
    } else {
      res.status(401).send({
        error: "Este usuario aún no ha sido validado para subir imágenes.",
        code: 401,
      });
    }
  } else {
    res.status(401).send({
      error: "Este usuario no está registrado en la base de datos.",
      code: 401,
    });
  }
});

app.get("/Evidencias", (req, res) => {
  const { token } = req.query;
  jwt.verify(token, secretKey, (err, decode) => {
    const { data } = decode;
    const { nombre, email } = data;
    err
      ? res.status(401).send(
          res.send({
            error: "401 Unauthorized",
            messege: "Usted no está autorizado para estar aquí.",
            token_error: err.message,
          })
        )
      : res.render("Evidencias", { nombre, email });
  });
});

app.post("/upload", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res
      .status(400)
      .send("No se encontro ningún archivo en la consulta.");
  }
  const { files } = req;
  const { foto } = files;
  const { name } = foto;
  const { email, nombre } = req.body;
  foto.mv(`${__dirname}/public/uploads/${name}`, async (err) => {
    if (err)
      return res.status(500).send({
        error: `Algo salió mal... ${err}`,
        code: 500,
      });
    await send(email, nombre);
    res.send("Foto cargada con éxito.");
  });
});
