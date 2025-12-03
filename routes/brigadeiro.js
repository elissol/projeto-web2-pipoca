const express = require('express');
const router = express.Router();
const brigadeiroController = require('../controllers/brigadeiroController');

router.get('/', brigadeiroController.formulario);
router.post('/calcular', brigadeiroController.calcularValor);
router.post('/finalizar', brigadeiroController.finalizarPedido);

module.exports = router;