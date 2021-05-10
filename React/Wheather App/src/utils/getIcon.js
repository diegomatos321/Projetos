import React from "react";

import {FaCloud, FaCloudMoon, FaCloudSun, FaCloudShowersHeavy, FaCloudRain, FaSnowflake, FaSun, FaMoon, FaExclamationCircle} from "react-icons/fa"

let icons = {
  storm: <FaCloudShowersHeavy/>,
  snow: <FaSnowflake/>,
  hail: <FaCloudRain/>,
  rain: <FaCloudRain/>,
  fog: <FaCloud/>,
  clear_day: <FaSun/>,
  clear_night: <FaMoon/>,
  cloud: <FaCloud/>,
  cloudly_day: <FaCloudSun/>,
  cloudly_night : <FaCloudMoon/>,
  none_day: <FaExclamationCircle/>,
  none_night: <FaExclamationCircle/>
}

export default function getIcons(icon){
  return icons[icon]
}