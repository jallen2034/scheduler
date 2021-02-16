import React from "react";
import classNames from 'classnames/bind';
import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {

  // // https://github.com/JedWatson/classnames
  const interviewers__item = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  return (
    <li className={interviewers__item} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}