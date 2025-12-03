const db = require('../config/database');

class Pipoca {
    static criar(pedido, callback) {
        const { cliente, sabor, peso, quantidade, valor_total, favorito } = pedido;
        const sql = 'INSERT INTO pedidos_pipoca (cliente, sabor, peso, quantidade, valor_total, favorito) VALUES (?, ?, ?, ?, ?, ?)';
        
        db.query(sql, [cliente, sabor, peso, quantidade, valor_total, favorito], callback);
    }
    
    static listar(callback) {
        const sql = 'SELECT * FROM pedidos_pipoca ORDER BY created_at DESC';
        db.query(sql, callback);
    }
}

module.exports = Pipoca;