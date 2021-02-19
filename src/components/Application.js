import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList"
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {

  // use state to store our collected days from our AXIOS api call in this component to be retained on refresh
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  // Add the line below:
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // function that will allow us to update the state JUST for the indiivdual day in our object of states
  const setDay = function (newDay) {
    setState({...state, day: newDay});
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
   * useffect that fires off on this components inital mounting
   * useEffect which only runs when the page loads ONCE to make API call to get our days for react to render to our page
   * performs 2 API calls with Promise.all then sets the state for this component to all[0]'s data for days from days api call
   * and all[1]'s data for appointments from appointments api call */
  useEffect(() => {
    const daysUrl = `/api/days`;
    const appointmentsUrl = `/api/appointments`;
    Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
    ])
    .then((all) => {
      setState({...state, days: all[0].data, appointments: all[1].data});
    })
    .catch(err => {
      console.log(err)
    });
  }, []);

  // chile component that will loop through the array of apointments and mapa new array of apointments with JSX in each index for each one
  const mappedApointments = dailyAppointments.map(appointment => {
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
      />
    )
  });

  // old way to store state
  // The Application component should set the default day state to "Monday"
  // const [currentDay, setCurrentDay] = useState("Monday");
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {mappedApointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}