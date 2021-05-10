import { Link } from "react-router-dom"

const Contato = () => {
  return ( 
    <section className="content">
      <h2>Estou na rota de Contato</h2> 
      <form action="">
        <fieldset>
          <legend>Formulário de contato</legend>
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" type="text"/>
        </fieldset>
      </form>
      <Link to="/">Voltar para home</Link>
    </section>
  );
}
 
export default Contato;