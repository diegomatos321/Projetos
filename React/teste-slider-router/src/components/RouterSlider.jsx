import { Switch, withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import usePageDirection from "../utils/usePageDirection.js"
import { cloneElement, useEffect, useState } from "react";

import "../css/router-slider.css"

const SliderRouter = ({location, children}) => {
  const pageDirecton = usePageDirection();
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    setAnimation(sessionStorage.getItem("react-router-slider-page-animation"))
  }, [pageDirecton])

  return (
    <TransitionGroup
      component="div"
      className={`slider-router-${animation}`}
      childFactory={(child) => cloneElement(child, { classNames: "router" })}
    >
      <CSSTransition
      timeout={1000}
      key={location.key}
      classNames="location"
      unmountOnExit
      >
        <Switch location={location}>
            {children}
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}
 
export default withRouter(SliderRouter);