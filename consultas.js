/*
  CREATE DATABASE nasa;

  CREATE TABLE usuarios (id SERIAL, email varchar(50), nombre varchar(50), password varchar(50), auth BOOLEAN);
*/

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgresql",
  database: "nasa",
  port: 5432,
});

nuevoUsuario = async (email, nombre, password) => {
  const result = await pool.query(
    `INSERT INTO usuarios(email, nombre, password, auth) VALUES('${email}', '${nombre}', '${password}', false) RETURNING *`
  );
  const usuario = result.rows[0];
  return usuario;
};

getUsuarios = async () => {
  const result = await pool.query(`SELECT * FROM usuarios`);
  return result.rows;
};

setUsuarioStatus = async (id, auth) => {
  const result = await pool.query(
    `UPDATE usuarios SET auth = ${auth} WHERE id = ${id} RETURNING *`
  );
  const usuario = result.rows[0];
  return usuario;
};

getUsuario = async (email, password) => {
  const result = await pool.query(
    `SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}'`
  );
  return result.rows[0];
};

module.exports = {
  nuevoUsuario,
  getUsuarios,
  setUsuarioStatus,
  getUsuario,
};
