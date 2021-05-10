import React from "react";

import Formulario from "./Formulario.js";
import Display from "./Display.js";

export default class SecaoFormulario extends React.Component {
  constructor() {
    super();
    this.state = {
      nome: "",
      idade: "",
      raca: "",
      classe: "",
      antecedente: "",
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    console.log(this.state[name]);

    this.setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  render() {
    return (
      <section id="formulario" className="secao-formulario">
        <Formulario {...this.state} handleChange={this.handleChange} />
        <hr/>
        <Display {...this.state} />
      </section>
    );
  }
}
