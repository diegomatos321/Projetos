const flappybirdRouter = require("express").Router();
const Jogador = require("../models/jogador.js");
const { body, validationResult } = require('express-validator');
const csurf = require('csurf');

//CSURF Protection
const csrfMiddleware = csurf({
    cookie: true
});

flappybirdRouter.use(csrfMiddleware);

// RENDER PAGE
flappybirdRouter.get("/", async (req, res) => {
  res.render("./trabalhos/flappybird", {
    layout: "./layouts/jogos",
    data: {
      page: "flappybird",
      csfrToken: req.csrfToken()
    },
  });
});

// GET ALL PLAYERS
flappybirdRouter.get("/jogadores/:quantidade", async (req, res) => {
  const quantidade = Number(req.params.quantidade);
  try {
    let jogadores;
    if (quantidade){
      jogadores = await Jogador.find().sort({highScore: -1}).limit(quantidade);
    } else{
      jogadores = await Jogador.find().sort({highScore: -1});
    }

    if (jogadores) {
      res.status(201).json(jogadores);
      return;
    }
    res.status(400).json({ message: "Não há jogadores cadastrados" }); // TODO: VERIFICAR HEADER
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// SAVE NEW PLAYER
flappybirdRouter.post("/", [
  body("nome").isLength({ min: 3, max: 10 }).withMessage("Campo nome deve ter entre 3 à 10 caracteres"),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  try {
    let jogador = await Jogador.findOne({ nome: req.body.nome });

    if (!jogador) {

      const novoJogador = new Jogador({
        nome: req.body.nome,
        highScore: 0,
      });

      let jogadorSalvo = await novoJogador.save();

      res.status(201).json(jogadorSalvo);
    } else {
      res.status(404).json(jogador);
      return;
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// UPDATE PLAYER
flappybirdRouter.patch("/editar", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Body Vazio");
  }

  try {
    let jogador = await Jogador.updateOne(
      { nome: req.body.nome },
      { $set: { highScore: req.body.score } }
    );

    res.status(201).json({ message: "Atualizado com sucesso !" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = flappybirdRouter;
