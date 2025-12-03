const db = require('../config/database');

class Brigadeiro {
    static criar(pedido, callback) {
        const { cliente, sabor, quantidade, valor_total, favorito } = pedido;
        const sql = 'INSERT INTO pedidos_brigadeiro (cliente, sabor, quantidade, valor_total, favorito) VALUES (?, ?, ?, ?, ?)';
        
        db.query(sql, [cliente, sabor, quantidade, valor_total, favorito], callback);
    }
    
    static listar(callback) {
        const sql = 'SELECT * FROM pedidos_brigadeiro ORDER BY created_at DESC';
        db.query(sql, callback);
    }
}

module.exports = Brigadeiro;