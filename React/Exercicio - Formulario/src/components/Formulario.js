import React from "react";

export default function SecaoFormulario(props) {
  const { nome, idade, raca, classe, antecedente } = props;

  const { handleChange } = props;

  return (
    <div className="container-formulario">
      <form className="formulario">
        <fieldset>
          <legend>Crie seu personagem</legend>
          <div className="item-formulario">
            <label htmlFor="nome-personagem">
              Digite um nome para seu personagem:
            </label>
            <input
              type="text"
              id="nome-personagem"
              name="nome"
              placeholder="Ex: Leomund"
              maxLength="50"
              value={nome}
              onChange={handleChange}
            ></input>
          </div>
          <div className="item-formulario">
            <label htmlFor="idade-personagem">Digite a idade personagem:</label>
            <input
              type="number"
              id="idade-personagem"
              name="idade"
              placeholder="Ex: 20"
              maxLength="3"
              value={idade}
              onChange={handleChange}
            ></input>
          </div>
          <div className="item-formulario">
            <label htmlFor="raca-personagem">Escolha uma raça:</label>
            <select name="raca" value={raca} onChange={handleChange}>
              <option value="" selected disabled hidden>
                Selecione uma Raça
              </option>
              <optgroup label="Anão">
                <option value="anao-da-colina">Anão da Colina</option>
                <option value="anao-da-montanha">Anão da Montanha</option>
              </optgroup>
              <optgroup label="Elfo">
                <option value="alto-elfo">Alto Elfo</option>
                <option value="elfo-da-floresta">Elfo da Floresta</option>
                <option value="elfo-negro">Elfo Negro</option>
              </optgroup>
              <optgroup label="Halfling">
                <option value="halfling-robusto">Robusto</option>
                <option value="halfling-pes-leves">Pés leves</option>
              </optgroup>
              <option value="humano">Humano</option>
              <optgroup label="Draconato">
                <option value="draconato-dragao-azul">Dragão Azul</option>
                <option value="draconato-dragao-branco">Dragão Branco</option>
                <option value="draconato-dragao-preto">Dragão Preto</option>
                <option value="draconato-dragao-verde">Dragão Verde</option>
                <option value="draconato-dragao-vermelho">
                  Dragão Vermelho
                </option>
                <option value="draconato-dragao-bronze">Dragão Bronze</option>
                <option value="draconato-dragao-cobre">Dragão Cobre</option>
                <option value="draconato-dragao-latao">Dragão Latão</option>
                <option value="draconato-dragao-ouro">Dragão Ouro</option>
                <option value="draconato-dragao-prata">Dragão Prata</option>
              </optgroup>
              <optgroup label="Gnomo">
                <option value="gnomo-da-floresta">Gnomo da Floresta</option>
                <option value="gnomo-da-rocha">Gnomo da Rocha</option>
              </optgroup>
              <option value="meio-elfo">Meio-Elfo</option>
              <option value="tiefling"> Tiefling</option>
              <option value="meio-orc">Meio-Orc</option>
            </select>
          </div>
          <div className="item-formulario">
            <label htmlFor="classe-personagem">Escolha uma classe:</label>
            <select name="classe" value={classe} onChange={handleChange}>
              <option value="selecione-uma-classe">Selecione uma Classe</option>
              <option value="barbaro">Bárbaro</option>
              <option value="bardo">Bardo</option>
              <option value="bruxo">Bruxo</option>
              <option value="clérigo">Clérigo</option>
              <option value="druida">Druida</option>
              <option value="feiticeiro">Feiticeiro</option>
              <option value="guerreiro">Guerreiro</option>
              <option value="ladino">Ladino</option>
              <option value="mago">Mago</option>
              <option value="monge">Monge</option>
              <option value="paladino">Paladino</option>
              <option value="ranger">Ranger</option>
            </select>
          </div>
          <div className="item-formulario">
            <label htmlFor="antecedente-personagem">
              Escolha um antecedente:
            </label>
            <select
              name="antecedente"
              value={antecedente}
              onChange={handleChange}
            >
              <option value="escolha-um-antecedente">
                Escolha um antecedente
              </option>
              <option value="acólito">Acólito</option>
              <option value="artesão-de-guilda">Artesão de Guilda</option>
              <option value="artista">Artista</option>
              <option value="charlatao">Charlatão</option>
              <option value="criminoso">Criminoso</option>
              <option value="eremita">Eremita</option>
              <option value="forasteiro">Forasteiro</option>
              <option value="heroi-popular">Herói Popular</option>
              <option value="marinheiro">Marinheiro</option>
              <option value="morador-de-rua">Morador de Rua</option>
              <option value="nobre">Nobre</option>
              <option value="sabio">Sábio</option>
              <option value="soldado">Soldado</option>
            </select>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
