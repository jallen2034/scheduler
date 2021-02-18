import React from "react";
import classNames from 'classnames/bind';
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

export default function InterviewerList(props) {

  const renderedInterviewerList = props.interviewers.map(indivualInterviewer => {
    return (
      <InterviewerListItem
      key={indivualInterviewer.id}
      id={indivualInterviewer.id}
      name={indivualInterviewer.name}
      avatar={indivualInterviewer.avatar}
      setInterviewer={(event) => props.onChange(indivualInterviewer.id)}
      selected={props.value === indivualInterviewer.id}
    />
    )
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{ renderedInterviewerList }</ul>
    </section>
  )
};

