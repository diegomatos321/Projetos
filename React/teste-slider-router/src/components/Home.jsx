import { Link } from "react-router-dom"

const Home = () => {
  return ( 
    <section className="content">
      <h2>Estou na rota Home</h2> 
      <ul>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
        <li>Este é seu conteúdo</li>
      </ul>
      <Link to="/about">Ir para About</Link>
    </section>
  );
}
 
export default Home;