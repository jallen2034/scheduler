import React from 'react';
import '../Appointment/styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import useVisualMode from '../../hooks/useVisualMode';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

/* add the mode constants to the src/components/Appointment/index.js file.
 * terinary in function call asks if props.interview prop is truthy, if so pass in show, otherwise pass empty */
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVE = 'SAVE';
const DELETE = 'DELETE';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERRORSAVE = 'ERRORSAVE';
const ERRORDEL = 'ERRORDEL';

/* child component for appointments
 * has a save() helper function that will is able to save an apointment
 * has a cancelInterview() helper function that is able to delete an apointment
 * has contiiodnal rendering for all grandchild components based on what mode is currently set by the user */
export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    if (!interviewer || name.length === 0) {
      return console.log(
        'Something wrong no interviewer selected or no name inputted'
      );
    }

    transition(SAVE);
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((error) => {
        transition(ERRORSAVE, true);
      });
  }

  function cancelInterview(mode) {
    transition(DELETE);
    props
      .deleteInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((error) => {
        transition(ERRORDEL, true);
      });
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === SHOW && (
        <Show
          students={props.interview ? props.interview.student : null}
          interviewer={props.interview ? props.interview.interviewer : null}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={[]}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          mode="book"
        />
      )}
      {mode === SAVE && <Status message="Saving..." />}
      {mode === DELETE && <Status message="Deleting..." />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={back}
          onConfirm={cancelInterview}
          mode="cancel"
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={[]}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          name={props.interview ? props.interview.student : null}
          interviewer={props.interview.interviewer.id}
          mode="edit"
        />
      )}
      {mode === ERRORSAVE && (
        <Error message="Error saving appointment" onClose={back} />
      )}
      {mode === ERRORDEL && (
        <Error message="Error deleting appointment" onClose={back} />
      )}
    </article>
  );
}
