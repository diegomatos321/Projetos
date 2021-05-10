import React from "react"

class Header extends React.Component{
  render(){
    const body = 
    <header className="header">
      <div className="texto">
        <h1>Exercicio</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>Home</li>
          <li>Sobre</li>
          <li>Contato</li>
        </ul>
      </nav>
    </header>
    return body
  }
}

export default Header