import React from 'react';
import DayListItem from 'components/DayListItem';

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 * loop through props.days array and return a new array with the JSX in each index for react to render later
 * new array returned into UL looks something like this: [DayListItem1<jsx><jsx>, DayListItem2<jsx><jsx>, DayListItem3<jsx><jsx>] */
export default function DayList(props) {
  const renderedDays = props.days.map((individualDay) => {
    return (
      <DayListItem
        key={individualDay.id}
        name={individualDay.name}
        spots={individualDay.spots}
        selected={individualDay.name === props.day}
        setDay={props.setDay}
      />
    );
  });

  return <ul>{renderedDays}</ul>;
}
