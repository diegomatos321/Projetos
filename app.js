const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");

const flappybirdRouter = require("./js/routes/flappybirdRouter.js")
const bodyParser = require("body-parser")
require("dotenv/config")

app.use(bodyParser.json())

let htmlPath = path.join(__dirname);
app.use(express.static(htmlPath));

app.use("/", flappybirdRouter);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('error', error => console.log("Ocorreu um erro ao conectar na base de dados: ", error));
mongoose.connection.once('open', () => console.log("Conectado na base de dados"));

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor Ligado !")
});