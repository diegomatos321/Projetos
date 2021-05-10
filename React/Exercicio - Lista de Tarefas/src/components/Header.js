import React from "react"

class Header extends React.Component{
  constructor(){
    super();
    this.state = {
      isLoggedIn : false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(){
    this.setState(prevState =>{
      prevState.isLoggedIn = !prevState.isLoggedIn
      return prevState
    })
    // this.setState({isLoggedIn : !this.state.isLoggedIn})
  }

  render(){
    console.log(this.state.isLoggedIn )
    const textoBotaoUsuario = this.state.isLoggedIn ? "Sair" : "Entrar"
    const body =
    <header>
      <h1>Desenvolvendo com React</h1>
    <button onClick={() => this.handleChange()}>{textoBotaoUsuario}</button>
    </header>
    return body;
  }
}

export default Header;