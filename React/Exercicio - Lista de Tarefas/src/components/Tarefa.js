import React from "react"

class Tarefa extends React.Component {
  render() {
    const body =
    <div>
      <input 
      className="tarefa"
      checked={this.props.tarefa.realizada} 
      type="checkbox" 
      id={this.props.tarefa.slug} 
      onChange={() => this.props.changeHandler(this.props.tarefa.id)}
      />
      <label htmlFor={this.props.tarefa.slug}>{this.props.tarefa.texto}</label>
    </div>
  return body
  }
}

export default Tarefa;