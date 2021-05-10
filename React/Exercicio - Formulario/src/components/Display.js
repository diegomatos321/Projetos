import React from "react";

export default function Display(props) {
  const {
    nome,
    idade,
    raca,
    classe,
    antecedente,
  } = props;

/*   const renderIdade = () => {
    if (idade) {
      // return `${idade} Anos`
      return <p>Idade digitada: {idade} Anos</p>
    } else {
      return <p>Idade digitada:</p>
    }
  } */

  let txtIdade;
  if (idade){
    txtIdade = `${idade} Anos`;
  } else {
    txtIdade = "";
  }

  return (
    <div className="display">
      <h2>Valores do Estado | A "Verdade" do React</h2>
      <p>Nome digitado: <span style={{textTransform: "capitalize"}}>{nome}</span></p>
      {/* <p>Idade digitada: {idade ? `${idade} Anos` : ""}</p> */}
      {/* <p>Idade digitada: {renderIdade()}</p> */}
      {/* {renderIdade()}*/}
      <p>Idade digitada: {txtIdade}</p>
      <p>Raça digitada: <span className="capitalize">{raca.split("-").join(" ")}</span></p>
      <p>Classe digitada: <span className="capitalize">{classe.split("-").join(" ")}</span></p>
      <p>Antecedente digitada: <span className="capitalize">{antecedente.split("-").join(" ")}</span></p>
    </div>
  );
}
