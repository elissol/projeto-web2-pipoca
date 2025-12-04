const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mysql-3e7c74e3-magaliadrieli-89f0.k.aivencloud.com',
    port: 11452,
    user: 'avnadmin',
    password: 'AVNS_DpIiHFsvLqX4QCoOK5p', // Você precisa revelar e copiar a senha real
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar sçakda com o MySQL:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL no Aiven Cloud');
});

module.exports = connection;

