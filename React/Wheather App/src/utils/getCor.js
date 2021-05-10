let tabelaDeCores = {
  storm: "cor-fria",
  snow: "cor-fria",
  hail: "cor-fria",
  rain: "cor-fria",
  fog: "cor-fria",
  clear_day: "cor-quente",
  clear_night: "cor-fria",
  cloud: "cor-fria",
  cloudly_day: "cor-quente",
  cloudly_night : "cor-fria",
  none_day: "cor-quente",
  none_night: "cor-quente"
}

export default function getCor (condition_slug) {

  return tabelaDeCores[condition_slug];
}
