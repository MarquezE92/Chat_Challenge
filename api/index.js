//{origin: 'http://localhost:5173'}
const mongoose = require('mongoose');  //*  Biblioteca de modelado de objetos de MongoDB diseñada para Node.
const express = require('express');    //* Framework web para Node.js
const routes = require('./src/routes/index'); //En routes tenemos los endpoints de nuestra API
//const cookieParser = require('cookie-parser'); //* No es necesario, no vamos a estar manejando cookies
//const bodyParser = require('body-parser'); //* No es necesario, se puede reemplazar con express
//const cors = require('cors'); //*paquete de middleware de Express que simplifica la configuración de CORS, en este caso vamos a configurar los headers manualmente
const socketIO = require('socket.io'); //* biblioteca JavaScript para comunicación bidireccional y en tiempo real cliente/servidor
const Chat = require ('./src/models/chat'); //* Llamo al esquema creado con Mongoose.
require("dotenv").config();     //*Para usar las variables de entorno de nuestro archivo .env

// INICIALIZACION
const app = express();  //* creo una instancia de la aplicación de Express

//app.use(cors());  //* Habilita CORS para todos los orígenes

//MIDDLEWARES
    //* Son funciones que se ejecutan en el flujo de solicitud y respuesta y pueden realizar diversas tareas, 
    //*como manipular los datos de la solicitud, realizar validaciones, autenticar usuarios...
//app.use(express.urlencoded({ extended: true, limit: '50mb' }));
//app.use(express.json({ limit: '50mb' }));
//app.use(cookieParser());
                            //* Configuración personalizada de cors 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); //* para permitir solicitudes desde nuestro front
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //* tipos de encabezados permitidos
    res.header('Access-Control-Allow-Methods', 'GET, POST');            //* métodos HTTP permitidos
    next();                                                //* Pasa la solicitud al siguiente middleware en la cadena de manejo de solicitudes.
});

// CONFIGURACION DE PUERTO
app.set('port', process.env.PORT || 3002)

// APPLICATION CODE MONGO DB
const url =  process.env.MONGO_URL //* URL de conexión a la base de datos MongoDB en la nube = Atlas

// UNION DE MONGODB CON LA APLICACION
const connectionParams = {          //* definimos las opciones de configuración para la conexión de MongoDB.
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, connectionParams)     //* Usamos Mongoose para la conexión a la db de Mongo
    .then(() => {                           //* connect devuelve una promesa
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


app.use('/', routes);
//* Al establecer '/' como punto de montaje, este middleware se aplica a todas las solicitudes que lleguen.
//* 'routes' contiene la lógica para manejar las solicitudes GET y POST que definimos en la carpeta de routes.



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