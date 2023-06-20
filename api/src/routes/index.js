const { Router } = require('express');
const router = Router();
const express = require('express');
router.use(express.json());
const { routePostMessage } = require('./postMessage');



router.post("/message", routePostMessage);






module.exports = router;