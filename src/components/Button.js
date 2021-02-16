import React from "react";
import classNames from 'classnames/bind';
import "components/Button.scss";

// props {disabled: true, onClick: function(), confirm: false}
export default function Button(props) {
   
   // https://github.com/JedWatson/classnames
   const buttonClass = classNames("button", {
      "button--confirm": props.confirm,
      "button--danger": props.danger
   });

   return (
      <button 
         className={buttonClass} 
         disabled={props.disabled} 
         onClick={props.onClick}
      >
         {props.children}
      </button>
   );
}