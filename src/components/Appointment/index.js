import React, { Fragment } from "react";
import "../Appointment/styles.scss";
import Header from "./Header";
import Empty from "./Empty"
import Show from "./Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";

// add the mode constants to the src/components/Appointment/index.js file.
// terinary in function call asks if props.interview prop is truthy, if so pass in show, otherwise pass empty
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  // helper function that will eventually be able to save an apointment
  // const save = function (name, interviewer, isNew) {

  // }

  return (
      <article className="appointment">
        <Header time={props.time}/>
       { mode === SHOW && (
         <Show
           students={props.interview.student}
           interviewer={props.interview.interviewer} 
           onEdit={props.onEdit}
           onDelete={props.onDelete}
         /> 
       )
       }
       { mode === EMPTY && (
         <Empty
           onAdd={() => transition(CREATE)} 
         />
       )
       }
       { mode === CREATE && (
         <Form 
          interviewers={[]}
          onSave={props.onSave}
          onCancel={back}
         />
       )
       }
      </article>
  )
}