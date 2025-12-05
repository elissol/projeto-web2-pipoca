export const loginPage = (req, res) => {
    res.render("login", { erro: null });
};

export const autenticar = (req, res) => {
    const { email, senha } = req.body;

    if (email === "admin@pipoca.com" && senha === "123456") {
        return res.redirect("/admin");
    }

    res.render("login", { erro: "Usuário ou senha inválidos!" });
};
