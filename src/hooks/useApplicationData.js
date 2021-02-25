import { useState, useEffect } from "react";
import axios from 'axios';

const useApplicationData = function () {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  /* update state on database when the counter changes */
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
      .catch(err => {
        console.log(err)
      });
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
   * useffect that fires off on this components inital mounting
   * useEffect which only runs when the page loads ONCE to make API call to get our days for react to render to our page */
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

  /* call bookInterview() function whenever a user wants to create an interview.
   * create a newAppointment object by spreading the state at appointments[id], set the interview key in this object to the spread interview object from incoming param
   * spread the state.apointments, then at the id in the apointments key, replace its value with the newAppointment
   * spread the state, then at the apointments key for all the apointments, replace its value with the updated appointmentsCopy
   * feed that newState into the getUpdatedDays to get how many free slots are left for apointments for that day
   * update our state after making our put request to set the length of days to the len of the returned newDaysArr + appointments key to show the user the apointment they changed */
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
  }

  /* https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
   * call deleteInterview() function in this custom hook whenever a user wants to delete an interview
   * spread the original state stored in this hook and store it in apointmentsCopy
   * spread the apointmentsCopy object specisifcally at the incoming user id, and set the interview value to none, store this 2nd copy into updatedAppointment
   * spread the state again, then at the appointment key of that copy, spread the entire apointmentsCopy object and at the key of that copied object at the id, add the updatedAppointment as a value 
   * with that new optimistic state, feed it into the getUpdatedDays() function to calculate the len of the newDaysarr it returns to then set our new state with before
   * making our put request */
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
}

export default useApplicationData;