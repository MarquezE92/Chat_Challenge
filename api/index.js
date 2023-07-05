const app = require('./app')
const socketIO = require('socket.io'); //* biblioteca JavaScript para comunicación bidireccional y en tiempo real cliente/servidor
const Chat = require ('./src/models/chat'); //* Llamo al esquema creado con Mongoose.


//*  Toma dos argumentos: el puerto en el que se desea que el servidor escuche y una función de devolución de llamada
//* que se ejecutará una vez que el servidor esté escuchando.
// SERVIDOR ESCUCHANDO EN                           //* Usamos la instancia de Express para iniciar un servidor HTTP
const server = app.listen(app.get('port'), () => {  //* La propiedad 'port', que se configuró en la línea 33, nos da el número del puerto en el
                                                    //* que el servidor va a estar escuchando las solicitudes entrantes
  console.log("Server listening at", app.get('port'))
});


//TODO MANEJO DE LA COMUNICACIÓN EN TIEMPO REAL SERVIDOR/CLIENTES
//* La función socketIO() recibe dos argumentos: 
                         //* - el objeto server que representa el servidor HTTP creado anteriormente
                         //* - un objeto de opciones para configurar Socket.IO.
const io = socketIO(server, {       //* Creamos una instancia de Socket.IO y se la asignamos a la variable 'io'
cors: {
  origin:[ "http://localhost:5173"] //* origen permitido de nuestras peticiones, el front que vamos a montar con Vite
  //credentials: true,              //* habilitación de credenciales para permitir intercambio de cookies y otros datos de autenticación
}, //* no es necessario para el desafío ni autenticación ni manejo de sesiones
});


//* Vamos a usar una funcionalidad de MongoDB llamada Change Streams para observar cambios en la colección Chat.
//* La función watch() devuelve un objeto de cambio (ChangeStream) que puede recibir eventos de cambio en la colección.
Chat.watch().on('change', data => {     
            //*  El método on('change', ...) admite una función que se va a ejecutar cuando haya cambios en la colección Chat.
            
    io.emit('update', data?.fullDocument); //* esta función emite un evento: 'update'. A través de Socket.io vamos a enviar el evento
});                 //* y los datos asociados (en este caso el documento del mensaje nuevo) a todos los clientes conectados al servidor