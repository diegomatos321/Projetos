import React from "react"

class Formulario extends React.Component{
    render()
    {
        return (
            <div id="formulario">
                <h3>Digite sua mensagem</h3>
                <form>
                    <input type="text" name="nome" placeholder="Nome Completo"></input>
                    <br/>
                    <input type="text" name="e-mail" placeholder="Digite seu e-mail"></input>
                    <br/>
                    <input type="text" name="assunto" placeholder="Assunto"></input>
                    <br/>
                    <textarea placeholder="Digite sua mensagem aqui"></textarea>
                    <input type="submit"></input>
                    <br/>
                </form>
            </div>
        )
    }
}

export default Formulario;