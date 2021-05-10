import { Link } from "react-router-dom"

const About = () => {
  return ( 
    <section className="content">
      <h2>Estou na rota About</h2> 
      <ul>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
      </ul>
      <Link to="/contato">Ir para Contato</Link>
    </section>
  );
}
 
export default About;