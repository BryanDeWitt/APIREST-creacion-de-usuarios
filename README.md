Api REST con aquitectura MVC, contiene todas las operaciones CRUD, se comunica con una base de datos en mongoDB <br />
get /users para recuperar los usuarios <br />
get /users/:email para recuperar el usuario con el email si es que hay uno registrado <br />
post /users/sign-in crea un usuario con mail, username y contraseña, primero comprueba si ese mail ya esta registrado, y si no lo esta procede con la creacion, usa bcryptjs para el hash de la contraseña <br />
post /users/log-in para inciar sesion si el usuario existe, comprueba si la contraseña es correcta y envia un token para no tener que volver a loguear en 1 hora <br />
post /users/log-out elimina el token de sesion <br />
patch /users/update-password se usa para cambiar la contraseña, primer comprueba que la contraseña sea correcta, si lo es comprueba que la nueva contraseña y la anterior no sean iguales <br />
patch /users/update-username cambia el nombre de usuario <br />
delete /users/delete-user/:email borra el usuario con el email proporcionado <br />

