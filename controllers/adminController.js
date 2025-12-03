// controllers/adminController.js
const db = require('../config/database');

// Função auxiliar para garantir que o valor seja um número
const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

// Valida tipos permitidos (evita SQL injection em nomes de tabela dinâmicos)
const VALID_TYPES = ['brigadeiro', 'brownie', 'pipoca'];

// Helper que executa uma query e, em caso de tabela inexistente, retorna um valor default
const runSafeQuery = (query, params, defaultValue) => {
    return new Promise((resolve) => {
        db.query(query, params || [], (err, results) => {
            if (err) {
                // Se a tabela não existir, tratamos como resultado vazio em vez de falhar
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    console.warn('Tabela ausente para query:', query);
                    resolve(defaultValue);
                } else {
                    console.error('Erro na query:', query, err);
                    resolve(defaultValue);
                }
            } else {
                resolve(results);
            }
        });
    });
};

// ========== DASHBOARD ==========
exports.dashboard = (req, res) => {
    const queries = [
        { sql: 'SELECT COUNT(*) as total FROM pedidos_brigadeiro', default: { total: 0 } },
        { sql: 'SELECT COUNT(*) as total FROM pedidos_brownie', default: { total: 0 } },
        { sql: 'SELECT COUNT(*) as total FROM pedidos_pipoca', default: { total: 0 } },
        { sql: 'SELECT SUM(valor_total) as total FROM pedidos_brigadeiro', default: { total: 0 } },
        { sql: 'SELECT SUM(valor_total) as total FROM pedidos_brownie', default: { total: 0 } },
        { sql: 'SELECT SUM(valor_total) as total FROM pedidos_pipoca', default: { total: 0 } }
    ];

    Promise.all(queries.map(q => runSafeQuery(q.sql, [], [q.default])))
        .then(resultsArrays => {
            const normalized = resultsArrays.map(r => {
                if (Array.isArray(r)) return r[0] || { total: 0 };
                return r || { total: 0 };
            });

            const stats = {
                totalBrigadeiros: safeNumber(normalized[0].total),
                totalBrownies: safeNumber(normalized[1].total),
                totalPipocas: safeNumber(normalized[2].total),
                valorBrigadeiros: safeNumber(normalized[3].total),
                valorBrownies: safeNumber(normalized[4].total),
                valorPipocas: safeNumber(normalized[5].total)
            };

            stats.totalPedidos = stats.totalBrigadeiros + stats.totalBrownies + stats.totalPipocas;
            stats.valorTotal = stats.valorBrigadeiros + stats.valorBrownies + stats.valorPipocas;

            res.render('admin/dashboard', { stats });
        })
        .catch(err => {
            console.error('Erro inesperado ao montar dashboard:', err);
            const stats = {
                totalBrigadeiros: 0,
                totalBrownies: 0,
                totalPipocas: 0,
                valorBrigadeiros: 0,
                valorBrownies: 0,
                valorPipocas: 0,
                totalPedidos: 0,
                valorTotal: 0
            };
            res.render('admin/dashboard', { stats });
        });
};

// ========== PEDIDOS ==========
exports.listarPedidos = (req, res) => {
    const queries = [
        { sql: 'SELECT * FROM pedidos_brigadeiro ORDER BY created_at DESC', tipo: 'brigadeiro' },
        { sql: 'SELECT * FROM pedidos_brownie ORDER BY created_at DESC', tipo: 'brownie' },
        { sql: 'SELECT * FROM pedidos_pipoca ORDER BY created_at DESC', tipo: 'pipoca' }
    ];

    Promise.all(queries.map(q => runSafeQuery(q.sql, [], [])))
        .then(resultsArrays => {
            const pedidosArrays = resultsArrays.map(r => Array.isArray(r) ? r : []);

            const todosPedidos = [
                ...pedidosArrays[0].map(p => ({ ...p, tipo: 'brigadeiro' })),
                ...pedidosArrays[1].map(p => ({ ...p, tipo: 'brownie' })),
                ...pedidosArrays[2].map(p => ({ ...p, tipo: 'pipoca' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            res.render('admin/pedidos', { pedidos: todosPedidos });
        })
        .catch(err => {
            console.error('Erro inesperado ao buscar pedidos:', err);
            res.render('admin/pedidos', { pedidos: [] });
        });
};

// ========== PRODUTOS (CARDÁPIO) ==========

// LISTAR PRODUTOS
exports.listarProdutos = (req, res) => {
    const queries = [
        { sql: 'SELECT * FROM produtos_brigadeiro ORDER BY nome' },
        { sql: 'SELECT * FROM produtos_brownie ORDER BY nome' },
        { sql: 'SELECT * FROM produtos_pipoca ORDER BY nome' }
    ];

    Promise.all(queries.map(q => runSafeQuery(q.sql, [], [])))
        .then(resultsArrays => {
            const produtos = {
                brigadeiros: Array.isArray(resultsArrays[0]) ? resultsArrays[0] : [],
                brownies: Array.isArray(resultsArrays[1]) ? resultsArrays[1] : [],
                pipocas: Array.isArray(resultsArrays[2]) ? resultsArrays[2] : []
            };
            res.render('admin/produtos', { produtos });
        })
        .catch(err => {
            console.error('Erro inesperado ao buscar produtos:', err);
            res.render('admin/produtos', { produtos: {} });
        });
};

// FORM EDITAR PRODUTO
exports.editarProdutoForm = (req, res) => {
    const { tipo, id } = req.params;

    if (!VALID_TYPES.includes(tipo)) {
        return res.redirect('/admin/produtos');
    }

    const tabela = `produtos_${tipo}`;
    const query = `SELECT * FROM ${tabela} WHERE id = ?`;

    runSafeQuery(query, [id], [])
        .then(results => {
            const rows = Array.isArray(results) ? results : [];
            if (rows.length === 0) {
                return res.redirect('/admin/produtos');
            }
            const produto = rows[0];
            res.render('admin/editar-doce', { produto, tipo });
        })
        .catch(err => {
            console.error('Erro na query de editar produto:', err);
            res.redirect('/admin/produtos');
        });
};

// EDITAR PRODUTO (POST)
exports.editarProduto = (req, res) => {
    const { tipo, id } = req.params;
    if (!VALID_TYPES.includes(tipo)) return res.redirect('/admin/produtos');

    const tabela = `produtos_${tipo}`;
    const { nome, descricao, disponivel } = req.body;

    let query;
    let params;

    if (tipo === 'brigadeiro') {
        const { preco_25, preco_50, preco_100 } = req.body;
        query = `UPDATE ${tabela} 
                 SET nome = ?, descricao = ?, preco_25 = ?, preco_50 = ?, preco_100 = ?, disponivel = ? 
                 WHERE id = ?`;
        params = [nome, descricao, preco_25, preco_50, preco_100, disponivel === 'on' ? 1 : 0, id];
    } else if (tipo === 'brownie') {
        const { preco_pequeno, preco_medio, preco_grande } = req.body;
        query = `UPDATE ${tabela} 
                 SET nome = ?, descricao = ?, preco_pequeno = ?, preco_medio = ?, preco_grande = ?, disponivel = ? 
                 WHERE id = ?`;
        params = [nome, descricao, preco_pequeno, preco_medio, preco_grande, disponivel === 'on' ? 1 : 0, id];
    } else if (tipo === 'pipoca') {
        const { preco_45gr, preco_50gr, preco_100gr } = req.body;
        query = `UPDATE ${tabela} 
                 SET nome = ?, descricao = ?, preco_45gr = ?, preco_50gr = ?, preco_100gr = ?, disponivel = ? 
                 WHERE id = ?`;
        params = [nome, descricao, preco_45gr, preco_50gr, preco_100gr, disponivel === 'on' ? 1 : 0, id];
    }

    runSafeQuery(query, params, { affectedRows: 0 })
        .then(() => {
            res.redirect('/admin/produtos');
        });
};

// FORM NOVO PRODUTO
exports.novoProdutoForm = (req, res) => {
    res.render('admin/doce-novo');
};

// CRIAR NOVO PRODUTO
exports.novoProduto = (req, res) => {
    const { tipo, nome, descricao, disponivel } = req.body;
    if (!VALID_TYPES.includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });

    const tabela = `produtos_${tipo}`;

    let query;
    let params;

    if (tipo === 'brigadeiro') {
        const { preco_25, preco_50, preco_100 } = req.body;
        query = `INSERT INTO ${tabela} 
                 (nome, descricao, preco_25, preco_50, preco_100, disponivel) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
        params = [nome, descricao, preco_25, preco_50, preco_100, disponivel === 'on' ? 1 : 0];
    } else if (tipo === 'brownie') {
        const { preco_pequeno, preco_medio, preco_grande } = req.body;
        query = `INSERT INTO ${tabela} 
                 (nome, descricao, preco_pequeno, preco_medio, preco_grande, disponivel) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
        params = [nome, descricao, preco_pequeno, preco_medio, preco_grande, disponivel === 'on' ? 1 : 0];
    } else if (tipo === 'pipoca') {
        const { preco_45gr, preco_50gr, preco_100gr } = req.body;
        query = `INSERT INTO ${tabela} 
                 (nome, descricao, preco_45gr, preco_50gr, preco_100gr, disponivel) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
        params = [nome, descricao, preco_45gr, preco_50gr, preco_100gr, disponivel === 'on' ? 1 : 0];
    }

    runSafeQuery(query, params, { insertId: null })
        .then(() => {
            res.redirect('/admin/produtos');
        });
};

// EXCLUIR PRODUTO
exports.excluirProduto = (req, res) => {
    const { tipo, id } = req.params;
    if (!VALID_TYPES.includes(tipo)) return res.redirect('/admin/produtos');

    const tabela = `produtos_${tipo}`;
    const query = `DELETE FROM ${tabela} WHERE id = ?`;

    runSafeQuery(query, [id], { affectedRows: 0 })
        .then(() => res.redirect('/admin/produtos'));
};
