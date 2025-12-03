const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1234!',
  database: 'doceria_db'
});

const drops = [
  'DROP TABLE IF EXISTS pedidos_brigadeiro',
  'DROP TABLE IF EXISTS pedidos_brownie',
  'DROP TABLE IF EXISTS pedidos_pipoca',
  'DROP TABLE IF EXISTS produtos_brigadeiro',
  'DROP TABLE IF EXISTS produtos_brownie',
  'DROP TABLE IF EXISTS produtos_pipoca'
];

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message || err);
    process.exit(1);
  }

  console.log('Conectado ao MySQL — removendo tabelas...');

  const run = async () => {
    for (const sql of drops) {
      await new Promise((resolve, reject) => {
        connection.query(sql, (err) => {
          if (err) {
            console.error('Erro ao executar:', sql, err.message || err);
            return reject(err);
          }
          console.log('✓', sql);
          resolve();
        });
      });
    }

    console.log('\n✓ Todas as tabelas foram removidas (quando existiam)');
    connection.end();
  };

  run().catch(e => {
    console.error('Erro durante a remoção:', e.message || e);
    connection.end();
    process.exit(1);
  });
});
