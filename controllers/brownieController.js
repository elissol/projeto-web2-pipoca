const Brownie = require('../models/Brownie');

exports.formulario = (req, res) => {
    res.render('brownie');
};

exports.calcularValor = (req, res) => {
    const { tamanho } = req.body;
    let valorUnitario = 0;
    
    if (tamanho === 'pequeno') valorUnitario = 12.00;
    else if (tamanho === 'medio') valorUnitario = 15.00;
    else if (tamanho === 'grande') valorUnitario = 18.00;
    
    res.json({ valor: valorUnitario });
};

exports.finalizarPedido = (req, res) => {
    const { cliente, sabor, tamanho, quantidade, valor_total, favorito } = req.body;
    
    const pedido = {
        cliente,
        sabor,
        tamanho,
        quantidade,
        valor_total: parseFloat(valor_total),
        favorito: favorito === 'on'
    };
    
    Brownie.criar(pedido, (err, result) => {
        if (err) {
            console.error('Erro ao salvar pedido:', err);
            return res.status(500).json({ success: false, message: 'Erro ao salvar pedido' });
        }
        res.json({ success: true, message: 'Pedido salvo com sucesso!' });
    });
};