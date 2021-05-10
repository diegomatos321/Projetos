import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"

export default function usePageDirection() {
  const [locationKeys, setLocationKeys] = useState([])
  const [pageDirection, setPageDirection] = useState("forward");

  const history = useHistory();
 
  useEffect(() => {
     return history.listen((location) => {
      if (history.action === "PUSH") {
        setLocationKeys([ location.key ])
        setPageDirection("forward");
      }

      if (history.action === "POP") {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([ _, ...keys ]) => keys)
          setPageDirection("forward")
        } else {
          setLocationKeys((keys) => [ location.key , ...keys ])
          setPageDirection("backwards")
        }
      }
    });
  }, [locationKeys]);

  useEffect(() => {
    // console.log(pageDirection)
    if (pageDirection === "forward"){
      sessionStorage.setItem('react-router-slider-page-animation', 'from-right');
    } else if (pageDirection === "backwards") {
      sessionStorage.setItem('react-router-slider-page-animation', 'from-left');
    }
  }, [pageDirection])

  return pageDirection
}