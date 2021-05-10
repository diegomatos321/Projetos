const homeRouter = require("express").Router();

homeRouter.get("/", async (req, res)=>{
    res.render("./home/index", {
        layout: "./layouts/pages",
        data: {page:"home"}
    })
})

module.exports = homeRouter;