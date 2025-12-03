const db = require('../config/database');

class Brownie {
    static criar(pedido, callback) {
        const { cliente, sabor, tamanho, quantidade, valor_total, favorito } = pedido;
        const sql = 'INSERT INTO pedidos_brownie (cliente, sabor, tamanho, quantidade, valor_total, favorito) VALUES (?, ?, ?, ?, ?, ?)';
        
        db.query(sql, [cliente, sabor, tamanho, quantidade, valor_total, favorito], callback);
    }
    
    static listar(callback) {
        const sql = 'SELECT * FROM pedidos_brownie ORDER BY created_at DESC';
        db.query(sql, callback);
    }
}

module.exports = Brownie;