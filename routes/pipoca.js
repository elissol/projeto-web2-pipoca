const express = require('express');
const router = express.Router();
const pipocaController = require('../controllers/pipocaController');

router.get('/', pipocaController.formulario);
router.post('/calcular', pipocaController.calcularValor);
router.post('/finalizar', pipocaController.finalizarPedido);

module.exports = router;