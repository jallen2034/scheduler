import { useState, useEffect } from "react";
import axios from 'axios';

const useApplicationData = function () {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  /* helper function which can update our custom hooks state
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all */
  const updateState = function () {
    const daysUrl = `/api/days`;
    const appointmentsUrl = `/api/appointments`;
    const interviewersUrl = `/api/interviewers`;
    Promise.all([
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
  };

  /* useffect that fires off on this components inital mounting
   * useEffect which only runs when the page loads ONCE to make API call to get our days for react to render to our page */
  useEffect(() => {
    updateState();
  }, []);

  // allows us to update the state JUST for the indiivdual day in our object of states
  const setDay = function (newDay) {
    setState({ ...state, day: newDay });
  };

  /* takes in newState as an incoming param, that we will set in the furutre after our PUT request
   * loop through newState.days data structure, for each day, do a filter on the day.appointments[] array. if the interview === null on each day
     being looped through, add that index to a new array, calculate the length of that new array + pass that back as the new spots value 
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter */
  const getUpdatedDays = function (newState) {
    return newState.days.map((day) => {
      return {
        ...day, 
        spots: day.appointments.filter((id) => newState.appointments[id].interview === null).length
      }
    });
  };

  /* https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
   * call bookInterview() whenever a user creates an interview. no shallow copies! 
   * create a newAppointment object by spreading the state at appointments[id]
   * spread the state.apointments, at the "id" in the apointments key, replace thid value "newAppointment"
   * spread the state, then at the apointments key for all the apointments, replace its value with "appointmentsCopy"
   * feed that newState into the getUpdatedDays, to get how many free slots are left for that day
   * update our state optimistically after making our put request, set length of days to len of the returned newDaysArr + appointments key */
  const bookInterview = function (id, interview) {
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointmentsCopy = { ...state.appointments, [id]: newAppointment }
    const newState = {...state, appointments: appointmentsCopy}
    const newDaysArr = getUpdatedDays(newState);

    const appointmentsUpdateUrl = `/api/appointments/${id}`;
    return axios.put(appointmentsUpdateUrl, {interview})
      .then(() => {
        setState((current) => ({
          ...current,
          days: newDaysArr,
          appointments: appointmentsCopy
        }));
      });
  };

  /* call deleteInterview() whenever a user deletes an interview - no shallow copies! 
   * spread the original state stored in this hook and store it in apointmentsCopy
   * spread the apointmentsCopy object at the incoming user id, set the interview val to none, store this 2nd copy in "updatedAppointment"
   * spread the state again, at the appointment key of that copy, spread the entire apointmentsCopy object, at "id" of that copied object add updatedAppointment as the val
   * feed this new optimistic state into the getUpdatedDays() function calculating the len of the newDaysarr it returns to then set our new state */
  const deleteInterview = function (id) {
    const apointmentsCopy = { ...state.appointments };
    const updatedAppointment = {...apointmentsCopy[id], interview: null };
    const newState = {...state, appointments: {...apointmentsCopy, [id]: updatedAppointment}};
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
};

export default useApplicationData;