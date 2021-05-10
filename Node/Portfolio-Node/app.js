// MODULES
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// APP
const app = express();

// MIDDLEWARES
app.use(helmet());
app.use(compression()); //Compress all routes

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
    if (req.headers["x-forwarded-proto"] == "http") //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});

app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DATA BASE
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) return console.log(err)
    console.log("Conectado ao banco de dados")
})

mongoose.connection.on('error', err => {
    console.log(err);
});

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DEFININDO LAYOUTS
const mainLayout = "./layouts/pages";
const gameLayout = "./layouts/jogos"
app.set("layout", mainLayout, gameLayout);

// ROUTES
const trabalhosRouter = require("./routes/trabalhosRouter");
const homeRouter = require("./routes/homeRouter");
const contatoRouter = require("./routes/contatoRouter");

// ROTAS
app.use("/", homeRouter);
app.use("/trabalhos", trabalhosRouter);
app.use("/contato", contatoRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor Ligado !")
});