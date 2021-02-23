import React, { useState } from "react";
import InterviewerList from "components/InterviewerList"
import Button from "components/Button";

/* 
 * set our usestate hook for our name and interviewer, there are also two helper functions that:
 * helper function that will fire off and call my setName and setInterviewer setters to update their state
 * helper function that will call my props.onCancel() functions to display their triggering then call reset function to update my usestate in this component */
export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  // helper functions that will fire off and call my setName and setInterviewer setters to update their state
  const reset = function () {
    setName("");
    setInterviewer(null);
  }

  // call my props.onCancel() funtions to display their triggering then call reset function to update my usestate in this coomponent
  const cancel = function () {
    props.onCancel();
    reset();
  }

  // when called, performs a quick validation to ensue the name variable as the value of the form is empty
  function validate() {

    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }

    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            // This must be a controlled component, value is what we are controlling in our controlled component
            className="appointment__create-input text--semi-bold"
            name="name"
            value={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => validate()}>Save</Button>
        </section>
      </section>
    </main>
  )
}