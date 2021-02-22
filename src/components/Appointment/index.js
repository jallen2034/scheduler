import React from "react";
import "../Appointment/styles.scss";
import Header from "./Header";
import Empty from "./Empty"
import Show from "./Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

/* add the mode constants to the src/components/Appointment/index.js file.
 * terinary in function call asks if props.interview prop is truthy, if so pass in show, otherwise pass empty */
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERRORSAVE = "ERRORSAVE";
const ERRORDEL = "ERRORDEL";

/* save() helper function that will eventually be able to save an apointment
 * const save = function (name, interviewer, isNew) {
 * Create a function called save in the Appointment component
 * Call the props.bookInterview function with the appointment id and interview as arguments from within the save function.
 * Verify that the correct id and interview values are correct in the console output.
 * transition into save card when axios call is being made, when async axios call finishes, then transition back to show
 * cancel() helper function will control the delete behaviour to the Appointment component */
export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    if (!interviewer || name.length === 0) {
      return console.log("Something wrong no interviewer selected or no name inputted");
    }

    transition(SAVE);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((error) => {
        transition(ERRORSAVE, true);
      });
  }

  function cancelInterview() {
    transition(DELETE);
    props.deleteInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((error) => {
        transition(ERRORDEL, true)
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === SHOW && (
        <Show
          students={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
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
      { mode === DELETE && (
        <Status
          message="Deleting..."
        />
      )
      }
      { mode === CONFIRM && (
        <Confirm
          message="Would you like to delete this?"
          onCancel={back}
          onConfirm={cancelInterview}
        />
      )
      }
      { mode === EDIT && (
        <Form
          interviewers={[]}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )
      }
      { mode === ERRORSAVE && (
        <Error
          message="Error saving appointment"
          onClose={back}
        />
      )
      }
      { mode === ERRORDEL && (
        <Error
          message="Error deleting appointment"
          onClose={back}
        />
      )
      }
    </article>
  )
}