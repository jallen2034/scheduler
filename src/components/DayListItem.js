import React from "react";
import classNames from 'classnames/bind';
import "components/DayListItem.scss";

export default function DayListItem(props) {

  const dayName = props.name;
  const spots = props.spots;

  const formatSpots = (spots) => {

    if (spots === 0) {
      return "no spots remaining";
    } else if (spots === 1) {
      return `${spots} spot remaining`;
    } else {
      return `${spots} spots remaining`;
    }
  }
  
  // https://github.com/JedWatson/classnames
  const day_list_item_class = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li className={day_list_item_class} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular"> {dayName} </h2> 
      <h3 className="text--light"> {formatSpots(spots)}</h3>
    </li>
  )
}