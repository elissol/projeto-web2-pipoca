const express = require('express');
const router = express.Router();
const brownieController = require('../controllers/brownieController');

router.get('/', brownieController.formulario);
router.post('/calcular', brownieController.calcularValor);
router.post('/finalizar', brownieController.finalizarPedido);

module.exports = router;