import React from "react"

function Artigo (props){
  console.log(props)
  const body =
  <article className="grid-item">
    <figure>
      <img src={props.imagem} alt="Imagem do Jogo"></img>
      <figcaption>{props.conteudo}</figcaption>
    </figure>
  </article>
  return body
}

// <img src=".\uploads\imagens\flappybird.webp" alt="Imagem do Jogo do FlappyBird"></img>
export default Artigo