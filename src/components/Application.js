import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList"
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {

  // use state to store our collected days from our AXIOS api call in this component to be retained on refresh
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // call getAppointmentsForDay function to tranform the apointments object we stored in state from our API call into something react can render
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  /* Create a function called bookInterview inside the Application component. Copy and paste the template below. 
   * Then pass bookInterview to each Appointment component as props. */
  function bookInterview(id, interview) {

    // populating the correct appointment on the incoming id with the new incoming interview 
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // update the state on the front-end to reflect the new apointment being booked
    const apointmentsCopy = {...state.appointments}
    apointmentsCopy[id] = newAppointment;
    
    // perform axios POST to back-end call to server to send the new booked appointment to our server with the changes
    const appointmentsUpdateUrl = `/api/appointments/${id}`;
    return axios.put(appointmentsUpdateUrl, apointmentsCopy[id])
    .then((response) => {
      if (response.status === 204) {
        setState({...state, appointments: apointmentsCopy});
      }
    });
  }

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
    const interviewersUrl = `/api/interviewers`;
    Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
      axios.get(interviewersUrl)
    ])
    .then((all) => {
      console.log("Interviewers Object from endpoint: ", all[2].data);
      setState({
        ...state, 
        days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      });
    })
    .catch(err => {
      console.log(err)
    });
  }, []);

  /* child component that will loop through the array of apointments and mapa new array of apointments with JSX in each index for each one
   * call setInterview & interviewers here */
  const mappedApointments = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);
    // console.log("appointment object: ", appointment);
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
      />
    )
  });

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
        <Appointment 
          key="last" 
          time="5pm" 
        />
      </section>
    </main>
  );
}