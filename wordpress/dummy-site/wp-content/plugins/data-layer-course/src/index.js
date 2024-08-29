import { render } from "@wordpress/element";

import MyFirstApp from "./App";
  
window.addEventListener(
    'load',
    function () {
        render(
            <MyFirstApp />,
            document.querySelector( '#data-layer-course' )
        );
    },
    false
);