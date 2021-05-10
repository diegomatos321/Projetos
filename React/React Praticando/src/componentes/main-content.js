import React from "react"
import MyInfo from "./my-info.js"
import Formulario from "./formulario.js"

class MainContent extends React.Component{
    render()
    {
        return (
            <div id="main">
                <MyInfo/>
                <Formulario/>
            </div>
        )
    }
}

export default MainContent;