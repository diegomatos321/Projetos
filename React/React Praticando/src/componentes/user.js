import React from "react"

function User(props){
    if(props.user.isLoggedIn){
        return (
            <div id="mensagem-do-sistema">
                <h2>Bem Vindo {props.user.name} !</h2>
            </div>
        )
    }

    return (
        <div id="mensagem-do-sistema">
            <h2>Você não está logado.</h2>
        </div>
    )
}

export default User