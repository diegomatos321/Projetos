import tempestade from "../images/tempestade.webp"
import neve from "../images/neve.webp"
import granizo from "../images/granizo.webp"
import chuva from "../images/chuva.webp"
import neblina from "../images/neblina.webp"
import diaLimpo from "../images/dia-limpo.webp"
import noiteLimpa from "../images/noite-limpa.webp"
import nubladoDeDia from "../images/nublado-de-dia.webp"
import nubladoDeNoite from "../images/nublado-de-noite.webp"
import notFound from "../images/not-found.webp"

let imagens = {
  storm : tempestade,
  snow : neve,
  hail : granizo,
  rain : chuva,
  fog : neblina,
  clear_day : diaLimpo,
  clear_night : noiteLimpa,
  cloud : nubladoDeDia,
  cloudly_day : nubladoDeDia,
  cloudly_night : nubladoDeNoite,
  none_day: notFound,
  none_night: notFound
}

export default function getImage (condition_slug) {
  return imagens[condition_slug]
}