const Brigadeiro = require('../models/Brigadeiro');

exports.formulario = (req, res) => {
    res.render('brigadeiro');
};

exports.calcularValor = (req, res) => {
    const { quantidade } = req.body;
    let valorUnitario = 0;
    
    if (quantidade == 25) valorUnitario = 37.50;
    else if (quantidade == 50) valorUnitario = 75.00;
    else if (quantidade == 100) valorUnitario = 150.00;
    
    res.json({ valor: valorUnitario });
};

exports.finalizarPedido = (req, res) => {
    const { cliente, sabor, quantidade, valor_total, favorito } = req.body;
    
    const pedido = {
        cliente,
        sabor,
        quantidade,
        valor_total: parseFloat(valor_total),
        favorito: favorito === 'on'
    };
    
    Brigadeiro.criar(pedido, (err, result) => {
        if (err) {
            console.error('Erro ao salvar pedido:', err);
            return res.status(500).json({ success: false, message: 'Erro ao salvar pedido' });
        }
        res.json({ success: true, message: 'Pedido salvo com sucesso!' });
    });
};