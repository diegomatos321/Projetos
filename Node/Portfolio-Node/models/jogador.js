const mongoose = require("mongoose");

const JogadorScheme = mongoose.Schema({
    nome: {
        type: String,
        trim: true,
        required: true
    },
    highScore: {
        type: Number,
        trim: true,
        required: true
    }
},
{
    collection: "Jogadores"
})

module.exports = mongoose.model("Jogador", JogadorScheme)