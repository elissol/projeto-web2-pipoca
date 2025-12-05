const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Rotas
const indexRoutes = require('./routes/index');
const brigadeiroRoutes = require('./routes/brigadeiro');
const brownieRoutes = require('./routes/brownie');
const pipocaRoutes = require('./routes/pipoca');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/brigadeiro', brigadeiroRoutes);
app.use('/brownie', brownieRoutes);
app.use('/pipoca', pipocaRoutes);
app.use('/admin', adminRoutes);

/*-----------------------------------------------------------------
    ROTAS DE LOGIN DIRETO AQUI NO SERVER.JS
----------------------------------------------------------------*/

// Tela de Login
app.get("/login", (req, res) => {
    res.render("login", { erro: null });
});

// Autenticação do Login
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (email === "admin@pipoca.com" && senha === "123456") {
        res.redirect("/admin");
    } else {
        res.render("login", { erro: "Usuário ou senha inválidos!" });
    }
});

/*-----------------------------------------------------------------*/

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando na porta ${PORT}`);
});
