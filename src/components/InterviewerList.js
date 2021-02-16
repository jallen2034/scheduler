import React from "react";
import classNames from 'classnames/bind';
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

export default function InterviewerList(props) {

  const renderedInterviewerList = props.interviewers.map(indivualInterviewr => {
    return (
      <InterviewerListItem
      id={indivualInterviewr.id}
      name={indivualInterviewr.name}
      avatar={indivualInterviewr.avatar}
      setInterviewer={props.setInterviewer}
      selected={props.interviewer === indivualInterviewr.id}
    />
    )
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list"> { renderedInterviewerList } </ul>
    </section>
  )
}