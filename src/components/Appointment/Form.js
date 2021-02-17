import React, { useState } from "react";
import InterviewerList from "components/InterviewerList"
import Button from "components/Button";

export default function Form(props) {

  // set our usestate hook for our name and interviewer
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  // helper functions that will fire off and call my setName and setInterviewer setters to update their state
  const reset = function () {
    setName("");
    setInterviewer(null);
  }

  // call my props.onCancel() funtions to display their triggering then call reset function to update my usestate in this coomponent
  const cancel = function() {
    props.onCancel();
    reset();
  }

  const save = function() {
    props.onSave(name, interviewer);
    reset();
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            // This must be a controlled component
            // value is what we are controlling in our controlled component
            className="appointment__create-input text--semi-bold"
            name="name"
            value={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={save}>Save</Button>
        </section>
      </section>
    </main>
  )
}