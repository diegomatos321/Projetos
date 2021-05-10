import React from "react"
import User from "./user.js"

function Header(props){
    return (
        <div id="header">
            <h1>Meu primeiro App no React</h1>
            <User user={props.user}/>
        </div>
    )
}

export default Header;