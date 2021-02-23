import { useState, useEffect } from "react";
import axios from 'axios';

const useApplicationData = function () {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  /* new way of updating spots client side only
   * update state on database when the counter changes */
  const updateState = function () {
    const daysUrl = `/api/days`;
    const appointmentsUrl = `/api/appointments`;
    const interviewersUrl = `/api/interviewers`;
    return Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
      axios.get(interviewersUrl)
    ])
      .then((all) => {
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
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
   * useffect that fires off on this components inital mounting
   * useEffect which only runs when the page loads ONCE to make API call to get our days for react to render to our page
   * performs 2 API calls with Promise.all then sets the state for this component to all[0]'s data for days from days api call
   * and all[1]'s data for appointments from appointments api call */
  useEffect(() => {
    updateState();
  }, []);

  // function that will allow us to update the state JUST for the indiivdual day in our object of states
  const setDay = function (newDay) {
    setState({ ...state, day: newDay });
  }

  /* Create a function called bookInterview inside the Application component. Copy and paste the template below. 
   * Then pass bookInterview to each Appointment component as props
   * populating the correct appointment on the incoming id with the new incoming interview
   * update the state on the front-end to reflect the new apointment being booked
   * perform axios POST to back-end call to server to send the new booked appointment to our server with the changes */
  const bookInterview = function (id, interview, mode) {
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
          // const updatedSpotsArr = updateSpots(id, mode);
          setState({ ...state, appointments: apointmentsCopy });
        }
      }).then(() => {
        return updateState();
      });
  }

  /* function that will be able to delete interviews when called
   * call updateSpots() to get a updated array with the correct spots counter to set in our applications state */
  const deleteInterview = function (id, mode) {
    const appointmentsDelUrl = `/api/appointments/${id}`;
    const apointmentToNullify = { ...state.appointments[id], interview: null };
    const nullifiedApointmentState = { ...state.appointments, [id]: apointmentToNullify };

    return axios.delete(appointmentsDelUrl)
      .then((response) => {
        if (response.status === 204) {
          // const updatedSpotsArr = updateSpots(id, mode);
          setState({ ...state, appointments: nullifiedApointmentState });
        }
      }).then(() => {
        return updateState();
      });
  }

  // return all functions the application.js component needs
  return { state, setDay, bookInterview, deleteInterview }
}

export default useApplicationData;