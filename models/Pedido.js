const db = require('../config/database');

class Pedido {

    // 🔹 Criar pedido genérico (serve para qualquer tipo)
    static criar(pedido, callback) {
        const { tipo, cliente, sabor, tamanho, peso, quantidade, valor_total, favorito } = pedido;

        const sql = `
            INSERT INTO pedidos 
            (tipo, cliente, sabor, tamanho, peso, quantidade, valor_total, favorito)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                tipo,
                cliente,
                sabor,
                tamanho || null,
                peso || null,
                quantidade,
                valor_total,
                favorito ? 1 : 0
            ],
            callback
        );
    }

    // 🔹 Listar todos os pedidos
    static listarTodos(callback) {
        const sql = `SELECT * FROM pedidos ORDER BY created_at DESC`;
        db.query(sql, callback);
    }

    // 🔹 Listar pedidos por tipo (brigadeiro, brownie, pipoca)
    static listarPorTipo(tipo, callback) {
        const sql = `SELECT * FROM pedidos WHERE tipo = ? ORDER BY created_at DESC`;
        db.query(sql, [tipo], callback);
    }

    // 🔹 Buscar pedido por ID
    static buscarPorId(id, callback) {
        const sql = `SELECT * FROM pedidos WHERE id = ?`;
        db.query(sql, [id], callback);
    }

    // 🔹 Atualizar pedido
    static atualizar(id, pedido, callback) {
        const { cliente, sabor, tamanho, peso, quantidade, valor_total, favorito } = pedido;

        const sql = `
            UPDATE pedidos SET 
                cliente = ?, 
                sabor = ?, 
                tamanho = ?, 
                peso = ?, 
                quantidade = ?, 
                valor_total = ?, 
                favorito = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                cliente,
                sabor,
                tamanho || null,
                peso || null,
                quantidade,
                valor_total,
                favorito ? 1 : 0,
                id
            ],
            callback
        );
    }

    // 🔹 Excluir pedido
    static excluir(id, callback) {
        const sql = `DELETE FROM pedidos WHERE id = ?`;
        db.query(sql, [id], callback);
    }
}

module.exports = Pedido;
