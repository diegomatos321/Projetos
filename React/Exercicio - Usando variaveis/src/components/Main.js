import React from "react"

import Artigo from "./artigo.js"
import data from "../listaDeTrabalhos.json"

class Main extends React.Component{
  render(){
    const artigosComponents = data.map(data =>{
      const artigo = <Artigo
        imagem = {data.imagem}
        conteudo = {data.conteudo}
      />
      return artigo
    })
  
    const body = 
    <main className="main">
      <section className="grid">
        {artigosComponents}
      </section>
    </main>
    return body
  }
}

export default Main