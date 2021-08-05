## Desafío - Banco Solar

#### Servidor con Node que utilice PostgreSQL para la gestión y persistencia de datos, simulando un sistema de transferencias.

El servidor disponibiliza las siguientes rutas:

- / GET: Devuelve la aplicación cliente disponible en el apoyo de la prueba.
- /usuario POST: Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
- /usuarios GET: Devuelve todos los usuarios registrados con sus balances.
- /usuario PUT: Recibe los datos modificados de un usuario registrado y los actualiza.
- /usuario DELETE: Recibe el id de un usuario registrado y lo elimina .
- /transferencia POST: Recibe los datos para realizar una nueva transferencia. Se debe ocupar una transacción SQL en la consulta a la base de datos.
- /transferencias GET: Devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo.

<h1 align="end">
  <img src="https://i.ibb.co/Pzmb2Lp/banco.png">
</h1>
