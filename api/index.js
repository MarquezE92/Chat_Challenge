//{origin: 'http://localhost:5173'}
const mongoose = require('mongoose');
const express = require('express');
const routes = require('./src/routes/index'); //En routes tenemos los endpoints de nuestra API
//const cookieParser = require('cookie-parser'); //* No es necesario, no vamos a estar manejando cookies
//const bodyParser = require('body-parser'); //* No es necesario, se puede reemplazar con express
const cors = require('cors');
const socketIO = require('socket.io');
const Chat = require ('./src/models/chat'); //* Llamo al esquema para nuestra base de datos creado con Mongoose.
require("dotenv").config();     //*Para usar las variables de entorno en nuestro archivo .env

// INICIALIZACION
const app = express();

//app.use(cors());  //* Habilita CORS para todos los orígenes

//MIDDLEWARES
    //* Son funciones que se ejecutan en el flujo de solicitud y respuesta y pueden realizar diversas tareas, 
    //*como manipular los datos de la solicitud, realizar validaciones, autenticar usuarios...
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
//app.use(cookieParser());
                            //* Configuración personalizada de cors 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// CONFIGURACION DE PUERTO
app.set('port', process.env.PORT || 3002)

// APPLICATION CODE MONGO DB
const url =  process.env.MONGO_URL

// UNION DE MONGODB CON LA APLICACION
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


app.use('/', routes);





// SERVIDOR ESCUCHANDO EN 
const server = app.listen(app.get('port'), () => {
  console.log("Server listening at", app.get('port'))

});

const io = socketIO(server, {
cors: {
  origin:[ "http://localhost:5173"],
  credentials: true,
},
});

Chat.watch().on('change', data => {
 
io.emit('update', data?.fullDocument);
});