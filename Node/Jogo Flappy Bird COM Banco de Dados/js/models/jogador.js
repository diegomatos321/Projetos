const mongoose = require("mongoose");

const JogadorScheme = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    highScore: {
        type: Number,
        required: true
    }
},
{
    collection: "Jogadores"
})

module.exports = mongoose.model("Jogador", JogadorScheme)