const { Router } = require('express'); //* El módulo Router permite definir rutas en una aplicación Express.
const router = Router();               //* Creamos una instancia del enrutador
const express = require('express');    //* Importamos Express
router.use(express.json());            //* Utilizamos el método json() para parsear las solicitudes entrantes con formato JSON.
const { routePostMessage } = require('./postMessage');      //* Importamos las funciones para el manejo de las rutas
const { routeGetAllMessages } = require('./getAllMessages');


router.post("/message", routePostMessage);      //* Se registran las rutas de GET y POST
router.get("/messages", routeGetAllMessages);



module.exports = router;    //* Se exporta el enrutador