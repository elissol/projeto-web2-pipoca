const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin1234!',
    database: 'doceria_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o MySQL:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL');
});

module.exports = connection;