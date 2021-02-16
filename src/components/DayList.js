import React from "react";
import classNames from 'classnames/bind';
import DayListItem from "components/DayListItem";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
export default function DayList(props) {

  // old array: [mon, tue, wed, thu, fri, sat, sun]
  const renderedDays = props.days.map(individualDay => {
    return (
      <DayListItem
      key={individualDay.id}
      name={individualDay.name}
      spots={individualDay.spots}
      selected={individualDay.name === props.day}
      setDay={props.setDay} />
    );
  });

  // new array returned into UL: [DayListItem1<jsx><jsx>, DayListItem2<jsx><jsx>, DayListItem3<jsx><jsx>]
  return (
    <ul>{ renderedDays }</ul>
  )
}