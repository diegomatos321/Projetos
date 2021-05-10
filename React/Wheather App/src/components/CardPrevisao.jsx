import React from "react";
import getIcon from "../utils/getIcon.js"

const CardPrevisao = ({
  condition,
  date,
  description,
  max,
  min,
  weekday,
  cor,
}) => {
  const tempMedia = (max + min) / 2;
  const icone = getIcon(condition);

  return (
    <article className={`cardPrevisao ${cor}`}>
      <header>
        <h3>
          <span>{icone}</span>
          {weekday} | {date}
        </h3>
        <h2>{tempMedia}°C</h2>
      </header>
      <p>{description}</p>
    </article>
  );
};

export default CardPrevisao;
