const trabalhosRouter = require('express').Router({ mergeParams: true });
const flappyBirdRouter = require("./flappybirdRouter.js");

trabalhosRouter.get("/", async (req, res)=>{
    res.render("./trabalhos/index", {
        layout: "./layouts/pages",
        data: { page:"trabalhos"}
    })
})

trabalhosRouter.use("/flappybird", flappyBirdRouter)

trabalhosRouter.get("/super-mario", async (req, res)=> {
    res.render("./trabalhos/super-mario", {
        layout: "./layouts/jogos",
        data: { 
            page:"super-mario"
        }
    })
})

trabalhosRouter.get("/jogo-da-nave", async (req, res)=>{
    res.render("./trabalhos/jogo-da-nave", {
        layout: "./layouts/jogos",
        data: { 
            page:"jogo-da-nave"
        }
    })
})

module.exports = trabalhosRouter;