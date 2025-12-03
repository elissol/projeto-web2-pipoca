const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.dashboard);
router.get('/pedidos', adminController.listarPedidos);
router.get('/produtos', adminController.listarProdutos);
router.get('/doce/editar/:tipo/:id', adminController.editarProdutoForm);
router.post('/doce/editar/:tipo/:id', adminController.editarProduto);
router.get('/doce/excluir/:tipo/:id', adminController.excluirProduto);
router.get('/doce/novo', adminController.novoProdutoForm);
router.post('/doce/novo', adminController.novoProduto);

module.exports = router;