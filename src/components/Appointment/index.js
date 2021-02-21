import React, { Fragment } from "react";
import "../Appointment/styles.scss";
import Header from "./Header";
import Empty from "./Empty"
import Show from "./Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";

// add the mode constants to the src/components/Appointment/index.js file.
// terinary in function call asks if props.interview prop is truthy, if so pass in show, otherwise pass empty
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE"

export default function Appointment(props) {
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  /* helper function that will eventually be able to save an apointment
   * const save = function (name, interviewer, isNew) {
   * Create a function called save in the Appointment component
   * Call the props.bookInterview function with the appointment id and interview as arguments from within the save function.
   * Verify that the correct id and interview values are correct in the console output.
   * transition into save card when axios call is being made, when async axios call finishes, then transition back to show */
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);
    props.bookInterview(props.id, interview)
    .then(()=>{
      transition(SHOW);
    });
  }

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
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
         />
       )
       }
         { mode === SAVE && (
         <Status
           message="Saving..."
         />
       )
       }
      </article>
  )
}