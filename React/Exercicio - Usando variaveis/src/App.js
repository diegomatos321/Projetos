import React from "react"

import Header from "./components/Header.js"
import Main from "./components/Main.js"

class App extends React.Component{
  render(){
    const body = 
    <div className="site">
      <Header />
      <Main />
    </div>
    return body
  }
}

export default App