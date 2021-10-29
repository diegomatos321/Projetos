if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

//Routes
const flappybirdRouter = require("./js/routes/flappybirdRouter.js");
app.use("/", flappybirdRouter);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', error => console.log("Ocorreu um erro ao conectar na base de dados: ", error));
mongoose.connection.once('open', () => console.log("Conectado na base de dados"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor Ligado !")
});