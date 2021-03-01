import { useState, useEffect } from 'react';
import axios from 'axios';

const useApplicationData = function () {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  /* useffect that fires off on this components inital mounting
   * useEffect which only runs when the page loads ONCE to make API call to get our days for react to render to our page */
  useEffect(() => {
    const daysUrl = '/api/days';
    const appointmentsUrl = '/api/appointments';
    const interviewersUrl = '/api/interviewers';
    Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
      axios.get(interviewersUrl),
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
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
        spots: day.appointments.filter(
          (id) => newState.appointments[id].interview === null
        ).length,
      };
    });
  };

  /* https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
   * call bookInterview() whenever a user creates an interview - no shallow copies!
   * we pretty much make a deep copy of our previous state, update a copy of it with the new optimistic state anticipated before making our axios request
   * we also calculate how many empty spots there will be after we change our state and do pur put request optimistically */
  const bookInterview = function (id, interview) {
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointmentsCopy = { ...state.appointments, [id]: newAppointment };
    const newState = { ...state, appointments: appointmentsCopy };
    const newDaysArr = getUpdatedDays(newState);

    const appointmentsUpdateUrl = `/api/appointments/${id}`;
    return axios.put(appointmentsUpdateUrl, { interview }).then(() => {
      setState((current) => ({
        ...current,
        days: newDaysArr,
        appointments: appointmentsCopy,
      }));
    });
  };

  /* call deleteInterview() whenever a user deletes an interview - no shallow copies!
   * pretty much works the same as above, but we change the newApointments interview key to have a null val instead of a valid interview object before 
   * we make our delete request and update our state */
  const deleteInterview = function (id) {
    const newAppointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointmentsCopy = { ...state.appointments, [id]: newAppointment };
    const newState = { ...state, appointments: appointmentsCopy };
    const newDaysArr = getUpdatedDays(newState);

    const appointmentsDelUrl = `/api/appointments/${id}`;
    return axios.delete(appointmentsDelUrl).then(() => {
      setState((current) => ({
        ...current,
        days: newDaysArr,
        appointments: appointmentsCopy,
      }));
    });
  };

  return { state, setDay, bookInterview, deleteInterview };
};

export default useApplicationData;
