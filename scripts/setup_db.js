const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1234!',
  database: 'doceria_db'
});

const tables = [
  `CREATE TABLE IF NOT EXISTS pedidos_brigadeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    sabor VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    favorito BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS pedidos_brownie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    sabor VARCHAR(255) NOT NULL,
    tamanho VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    favorito BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS pedidos_pipoca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    sabor VARCHAR(255) NOT NULL,
    peso VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    favorito BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS produtos_brigadeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_25 DECIMAL(10,2),
    preco_50 DECIMAL(10,2),
    preco_100 DECIMAL(10,2),
    disponivel BOOLEAN DEFAULT TRUE
  )`,
  `CREATE TABLE IF NOT EXISTS produtos_brownie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_pequeno DECIMAL(10,2),
    preco_medio DECIMAL(10,2),
    preco_grande DECIMAL(10,2),
    disponivel BOOLEAN DEFAULT TRUE
  )`,
  `CREATE TABLE IF NOT EXISTS produtos_pipoca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_45gr DECIMAL(10,2),
    preco_50gr DECIMAL(10,2),
    preco_100gr DECIMAL(10,2),
    disponivel BOOLEAN DEFAULT TRUE
  )`
];

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message || err);
    process.exit(1);
  }

  console.log('Conectado ao MySQL — criando tabelas se necessário...');

  const run = async () => {
    for (const sql of tables) {
      await new Promise((resolve, reject) => {
        connection.query(sql, (err) => {
          if (err) {
            console.error('Erro ao criar tabela:', err.message || err);
            return reject(err);
          }
          console.log('✓ Tabela criada/verificada');
          resolve();
        });
      });
    }

    console.log('\n✓ Todas as tabelas foram verificadas/criadas com sucesso!');
    connection.end();
  };

  run().catch(e => {
    console.error('Erro durante o setup:', e.message || e);
    connection.end();
    process.exit(1);
  });
});
