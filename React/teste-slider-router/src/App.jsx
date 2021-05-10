import { Route, BrowserRouter } from "react-router-dom";
import RouterSlide from "./components/RouterSlider.jsx";

import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Contato from "./components/Contato.jsx";

function App() {
  return (
    <div className="App">
      <h1>Testando meu slider de rotas</h1>
      <BrowserRouter>
        <RouterSlide>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contato">
            <Contato />
          </Route>
        </RouterSlide>
      </BrowserRouter>
    </div>
  );
}

export default App;
