//{origin: 'http://localhost:5173'}
const mongoose = require('mongoose');
const express = require('express');
const routes = require('./src/routes/index');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const cors = require('cors');
const socketIO = require('socket.io');
const Chat = require ('./src/models/chat');
require("dotenv").config();

// INICIALIZACION
const app = express();
//app.use(cors());

//MIDDLEWARES
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
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