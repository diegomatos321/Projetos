import React from "react"
import "../main.css"

import Tarefas from "./Tarefas.js"

class Main extends React.Component{
  render(){
    const body =
    <main>
      <Tarefas />
    </main>
    
    return body;
  }
}

export default Main;