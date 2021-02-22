import React, { useState, useEffect } from "react";
import axios from 'axios';

const useApplicationData = function () {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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

  /* helper function to update the spots
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
   * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
   * count the amount of apointments booked in previous state
   * decide if the action is book or cancel to +1 or - 1 from this count to later update that in state
   * loop through all of the days in state.days, then we spread our found day to make a copy, then update the spots for that found day with new value */
  const updateSpots = function (apointmentId, action) {
    let apointmentCounter = 0;
    const foundDay = state.days.find(day => day.appointments.includes(apointmentId));

    foundDay.appointments.forEach(appointment => {

      if (state.appointments[appointment].interview === null) {
        apointmentCounter += 1;
      }
    });

    switch (action) {
      case 'book':
        apointmentCounter -= 1;
        break;
      case 'cancel':
        apointmentCounter += 1;
    }

    const updatedDayArr = state.days.map(day => {
      if (day.name === foundDay.name) {
        return {...foundDay, spots: apointmentCounter}
      }
      return day;
    });

    return updatedDayArr;
  }

  // function that will allow us to update the state JUST for the indiivdual day in our object of states
  const setDay = function (newDay) {
    setState({ ...state, day: newDay });
  }

  /* Create a function called bookInterview inside the Application component. Copy and paste the template below. 
   * Then pass bookInterview to each Appointment component as props
   * populating the correct appointment on the incoming id with the new incoming interview
   * update the state on the front-end to reflect the new apointment being booked
   * perform axios POST to back-end call to server to send the new booked appointment to our server with the changes */
  const bookInterview = function (id, interview) {
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const apointmentsCopy = { ...state.appointments }
    apointmentsCopy[id] = newAppointment;

    const appointmentsUpdateUrl = `/api/appointments/${id}`;
    return axios.put(appointmentsUpdateUrl, apointmentsCopy[id])
      .then((response) => {
        if (response.status === 204) {
          const updatedSpotsArr = updateSpots(id, "book");
          setState({ ...state, appointments: apointmentsCopy, days: updatedSpotsArr });
        }
      });
  }

  /* function that will be able to delete interviews when called
   * call updateSpots() to get a updated array with the correct spots counter to set in our applications state */
  const deleteInterview = function (id) {
    const appointmentsDelUrl = `/api/appointments/${id}`;
    const apointmentToNullify = { ...state.appointments[id], interview: null };
    const nullifiedApointmentState = { ...state.appointments, [id]: apointmentToNullify };

    return axios.delete(appointmentsDelUrl)
      .then((response) => {
        if (response.status === 204) {
          const updatedSpotsArr = updateSpots(id, "cancel");
          setState({ ...state, appointments: nullifiedApointmentState, days: updatedSpotsArr});
        }
      })
  }

  // return all functions the application.js component needs
  return { state, setDay, bookInterview, deleteInterview, updateSpots }
}

export default useApplicationData;