import React from "react";
import DayList from "components/DayList"
import "components/Application.scss";
import Appointment from "components/Appointment";
import useApplicationData from "hooks/useApplicationData";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

/*
 * call getAppointmentsForDay function to tranform the apointments object we stored in state from our API call into something react can render */
export default function Application(props) {
  const {state, setDay, bookInterview, deleteInterview, updateSpots} = useApplicationData();
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  /* child component that will loop through the array of apointments and mapa new array of apointments with JSX in each index for each one
   * call setInterview & interviewers here */
  const mappedApointments = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
        applicationState={state}
        applicationStateDay={state.day}
        updateSpots={updateSpots}
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