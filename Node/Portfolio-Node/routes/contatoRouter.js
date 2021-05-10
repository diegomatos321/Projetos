const contatoRouter = require("express").Router();
const nodemailer = require("nodemailer");
const Contato = require("../models/contato.js");
const { body, validationResult } = require('express-validator');
const csurf = require('csurf');

//CSURF Protection
const csrfMiddleware = csurf({
  cookie: true
});

contatoRouter.use(csrfMiddleware);

contatoRouter.get("/", async (req, res) => {
  res.render("./contato/index", {
    layout: "./layouts/pages",
    data: {
      page: "contato",
      csfrToken: req.csrfToken()
    }
  });
});

contatoRouter.post("/", [
  body('nome').isLength({ min: 5, max: 50 }).withMessage("Campo nome deve ter entre 5 à 50 caracteres").not().isEmpty().trim().escape(),
  body('email', "Campo Email Invalido").isEmail().normalizeEmail(),
  body('assunto').isLength({ min: 5, max: 25 }).withMessage("Campo assunto deve ter entre 5 à 25 caracteres").not().isEmpty().trim().escape(),
  body('mensagem').isLength({ min: 10, max: 250 }).withMessage("Campo mensagem deve ter entre 10 à 250 caracteres").not().isEmpty().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("./contato/index", {
      layout: "./layouts/pages",
      data: {
        page: "contato",
        mensagem: {
          tipo: "error",
          conteudo: errors.array()
        },
        csfrToken: req.csrfToken()
      },
    });
  }

  const { nome, email, assunto, mensagem } = req.body;
  try {
    //Envia o e-mail
    const output = `
      <h1>Pedido para contato Recebido</h1>
      <p><strong>${nome}</strong> deseja falar com você sobre <strong>${assunto}</strong>, seu e-mail para contato é: ${email}</p>
      <p>${mensagem}</p>
    `

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAILLOGIN,
        pass: process.env.EMAILPASSWORD,
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `Portfolio <${process.env.EMAILLOGIN}>`, // sender address
      to: `${process.env.EMAILRECEIVER1}, ${process.env.EMAILRECEIVER2}`, // list of receivers
      subject: assunto, // Subject line
      text: "E-mail enviado pelo Portfolio", // plain text body
      html: output, // html body
    });

    // Caso de tudo certo, Salva o email no banco de dados
    const novoContato = new Contato({
      _id: info.messageId, //Id da mensagem, assim podemos presquisar por esse id unico futuramente
      nome: nome,
      email: email,
      assunto: assunto,
      mensagem: mensagem,
    });

    const contatoSalvo = await novoContato.save();

    res.status(201).render("./contato/index", {
      layout: "./layouts/pages",
      data: {
        page: "contato",
        mensagem: {
          tipo: "sucesso",
          conteudo: ["Mensagem enviada com sucesso!", `Id da mensagem: ${info.messageId}`,
            "Email salvo no banco de dados com sucesso !"],
        },
        csfrToken: req.csrfToken()
      },
    });

  } catch (error) {

    res.status(500).render("./contato/index", {
      layout: "./layouts/pages",
      data: {
        page: "contato",
        mensagem: {
          tipo: "error",
          conteudo: [`Ocorreu um error: ${error}`],
        },
        csfrToken: req.csrfToken()
      }
    });
  }
});

module.exports = contatoRouter;
