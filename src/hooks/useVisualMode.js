import { useState } from "react";

/* declare our inital default useState for this custom component we are building
 * set the mode state with the initial mode provided
 * return the object containing our mode property */
const useVisualMode = function (inital) {
  const [mode, setMode] = useState([inital]);

  // transition function would be declared in here
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
  const transitionMode = function (newMode, replace = false) {

    // check if replace as an incoming parmater is true
    if (replace) {
      const replacedMode = [...mode]
      replacedMode.pop();
      replacedMode.push(newMode);
      setMode(replacedMode);
    } else {
      setMode([...mode, newMode])
    }
  }

  const back = function () {
    const poppedArr = [...mode];
    console.log("poppedArr", poppedArr);
  
    // implement back limit
    if (poppedArr.length > 1){
      poppedArr.pop();
      setMode(poppedArr);
    }

    setMode(poppedArr);
    return;
  }

  return { mode: mode.slice(-1)[0], transition: transitionMode, back };
}

export default useVisualMode;
