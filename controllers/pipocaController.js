const Pipoca = require('../models/Pipoca');

exports.formulario = (req, res) => {
    res.render('pipoca');
};

exports.calcularValor = (req, res) => {
    const { peso } = req.body;
    let valorUnitario = 0;
    
    if (peso === '45gr') valorUnitario = 5.50;
    else if (peso === '50gr') valorUnitario = 6.50;
    else if (peso === '100gr') valorUnitario = 13.00;
    
    res.json({ valor: valorUnitario });
};

exports.finalizarPedido = (req, res) => {
    const { cliente, sabor, peso, quantidade, valor_total, favorito } = req.body;
    
    const pedido = {
        cliente,
        sabor,
        peso,
        quantidade,
        valor_total: parseFloat(valor_total),
        favorito: favorito === 'on'
    };
    
    Pipoca.criar(pedido, (err, result) => {
        if (err) {
            console.error('Erro ao salvar pedido:', err);
            return res.status(500).json({ success: false, message: 'Erro ao salvar pedido' });
        }
        res.json({ success: true, message: 'Pedido salvo com sucesso!' });
    });
};