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

  /* takes in our new "updated state" as an incoming paramater
   * in our specific case, it takes in an object that is a simulation of the updated state that we will set in the furutre after our PUT request
   * loop through newState.days data structure, for each day do a .filter on the day.appointments[] array. if the interview === null on each day
   * being looped through, then add that index to a new array, then calculate the length of that new array and assign that as the new spots value 
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter */
  const getUpdatedDays = function (newState) {
    return newState.days.map((day) => {
      return {
        ...day, 
        spots: day.appointments.filter((id) => newState.appointments[id].interview === null).length
      }
    });
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
    const newState = {...state, appointments: apointmentsCopy}
    const newDaysArr = getUpdatedDays(newState);

    const appointmentsUpdateUrl = `/api/appointments/${id}`;
    return axios.put(appointmentsUpdateUrl, {interview})
      .then(() => {
        setState((current) => ({
          ...current,
          days: newDaysArr,
          appointments: apointmentsCopy
        }));
      });
  }

  /* function that will be able to delete interviews when called
   * call updateSpots() to get a updated array with the correct spots counter to set in our applications state */
  const deleteInterview = function (id) {
    const apointmentsCopy = { ...state.appointments }
    apointmentsCopy[id].interview = null;
    const newState = {...state, appointments: apointmentsCopy}
    const newDaysArr = getUpdatedDays(newState);

    const appointmentsDelUrl = `/api/appointments/${id}`;
    return axios.delete(appointmentsDelUrl)
      .then(() => {
        setState((current) => ({
          ...current,
          days: newDaysArr,
          appointments: apointmentsCopy
        }));
      });
  }

  // return all functions the application.js component needs
  return { state, setDay, bookInterview, deleteInterview }
}

export default useApplicationData;