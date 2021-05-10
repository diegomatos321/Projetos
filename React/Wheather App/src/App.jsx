import React from "react";

import { FaSearch } from "react-icons/fa";

import VisualizarInformacoes from "./components/VisualizarInformacoes.jsx";
import CardPrevisao from "./components/CardPrevisao.jsx";

import getCor from "./utils/getCor.js";
import getImage from "./utils/getImage.js";

import getFriendlyURLFromString from "./utils/getFriendlyURLFromString.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      default: "rio-de-janeiro",
    };
  }

  componentDidMount() {
    this.definirCidade(this.state.default);
  }

  definirCidade = async (value) => {
    /* TODO: tratar codigo 40~ da response */
    try {
      // console.log("FETCH");
      let cidade;

      if (!value) {
        cidade = this.state.default;
      } else {
        cidade = value;
      }

      let response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.hgbrasil.com/weather?key=9a79f177&city_name=${cidade}`
      );

      let data = await response.json();

      this.setState(() => {
        let weatherInfo = data.results;
        return {
          ...weatherInfo,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  submiHandler = (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target).entries());
    let friendlyURL = getFriendlyURLFromString(data.cidade);

    console.log(friendlyURL);
    this.definirCidade(friendlyURL);
  };

  render() {
    let { condition_slug } = this.state;

    let cor = getCor(condition_slug);
    let imagem = getImage(condition_slug);

    let cardPrevisaoComponents;
    if (this.state.forecast) {
      cardPrevisaoComponents = this.state.forecast.map((dia, index) => {
        // if (index > 6) return null
        return <CardPrevisao key={dia.date} {...dia} cor={cor} />;
      });
    }

    return (
      <div className="app">
        <section
          className="superior"
          style={{ backgroundImage: `url('./${imagem}')` }}
        >
          <header>
            <h1 className="title">Previsão do tempo</h1>
          </header>
          <div className="campo-de-busca">
            <form className="formulario" onSubmit={this.submiHandler}>
              <fieldset>
                <legend>Busque por uma cidade</legend>
                <input
                  id="campo-cidade"
                  name="cidade"
                  type="text"
                  className="campo-cidade"
                  placeholder="Ex: Rio de Janeiro"
                />
                <button className="search">
                  <FaSearch />
                </button>
              </fieldset>
            </form>
          </div>
          <VisualizarInformacoes {...this.state} />
        </section>
        <section className={`inferior ${cor}`}>
          <header>
            <h2>Previsão para os próximos 10 dias</h2>
          </header>
          <div className="previsao">{cardPrevisaoComponents}</div>
        </section>
      </div>
    );
  }
}

export default App;
