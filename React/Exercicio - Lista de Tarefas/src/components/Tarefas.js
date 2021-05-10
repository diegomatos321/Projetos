import React from "react"

import Tarefa from "./Tarefa.js"
import listaDeTarefas from "../listaDeTarefas.json"

class Tarefas extends React.Component {
  constructor(){
    super();
    this.state = {
      tarefas : listaDeTarefas
    }

    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(id){
    this.setState(prevState =>{
      const listaAtualizada = prevState.tarefas.map(tarefa =>{
        if(tarefa.id === id){
          tarefa.realizada = !tarefa.realizada
        }
        return tarefa
      })
      return {
        listaAtualizada
      }
    })
  }

  render() {
    const listaDeTarefasComponents = listaDeTarefas.map((tarefa) => {
      return <Tarefa 
      key={tarefa.id}
      tarefa={tarefa}
      changeHandler={this.changeHandler}
      />
    })

    const body =
      <div className="container-tarefas">
        <form className="tarefas">
          <fieldset>
            <legend>Lista de Tarefas</legend>
            {listaDeTarefasComponents}
          </fieldset>
        </form>
      </div>

    return body;
  }
}

export default Tarefas;