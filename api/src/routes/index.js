const { Router } = require('express');
const router = Router();
const express = require('express');
router.use(express.json());
const { routePostMessage } = require('./postMessage');
const { routeGetAllMessages } = require('./getAllMessages');




router.post("/message", routePostMessage);
router.get("/messages", routeGetAllMessages);






module.exports = router;