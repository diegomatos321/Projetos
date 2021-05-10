import React from "react";

import Header from "./componentes/header.js"
import MainContent from "./componentes/main-content.js"
import Footer from "./componentes/footer.js"

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            user: {
                name: "Diego Matos",
                isLoggedIn: true
            }
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        this.setState((prevState) =>{
            return {
                user:{
                    name: "Diego Matos",
                    isLoggedIn: !this.state.user.isLoggedIn
                }
            }
        })
    }

    render(){
        let btnText = this.state.user.isLoggedIn ? "LogOut" : "LogIn"
        return(
            <div id="app">
                <Header user={this.state.user}/>
                <MainContent/>
                <button onClick={this.handleClick}>{btnText}</button>
                <Footer/>
            </div>
        )
    }
}

export default App;