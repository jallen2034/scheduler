import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList"
import "components/Application.scss";
import Appointment from "components/Appointment";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Bob Bobson",
      interviewer: {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Alice Alison",
      interviewer: {
        id: 5,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  },
  {
    id: 5,
    time: "4pm",
  },
];

export default function Application(props) {

  // use state to store our collected days from our AXIOS api call in this component to be retained on refresh
  const [days, setDays] = useState([]);

  // useEffect which only runs when the page loads ONCE to make API call to get our days for react to render to our page
  useEffect(() => {
    const url = `/api/days`
    axios.get(url)
    .then(response => {
      console.log(response);
      setDays([...response.data]);
    })
    .catch(err => {
      console.log(err)
    });
  }, []);

  const mappedApointments = appointments.map(appointment => {
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
      />
    )
  });

  // const [count, setCount] = useState(0);
  // The Application component should set the default day state to "Monday"
  const [currentDay, setCurrentDay] = useState("Monday");

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
          days={days}
          day={currentDay}
          setDay={setCurrentDay}
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