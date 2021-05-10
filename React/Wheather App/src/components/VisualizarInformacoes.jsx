import React from "react";

const VisualizarInformacoes = ({
  city,
  img_id,
  temp,
  description,
  sunrise,
  sunset,
  time,
  wind_speedy,
}) => {
  return (
    <article className="main-info">
      <header className="temp-info">
        <h2 className="nome-cidade">{city}</h2>
        <h3>{temp}°C</h3>
      </header>
      <div className="temp-details">
        {/* <img src={`http://assets.api.hgbrasil.com/weather/images/${img_id}.png`} alt={`Imagem ${description}`} title={`Imagem ${description}`}/> */}
        <ul>
          <li>Condição: {description}</li>
          <li>
            Nascer do sol: <time>{sunrise}</time>
          </li>
          <li>
            Pôr do sol: <time>{sunset}</time>
          </li>
          <li>
            Horário Local: <time>{time}</time>h
          </li>
          <li>Velocidade dos ventos: {wind_speedy}</li>
        </ul>
      </div>
    </article>
  );
};

export default VisualizarInformacoes;
