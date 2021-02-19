/* We are going to create a data transformation function called getAppointmentsForDay that will receive two arguments state and day. 
 * The function will return an array of appointments for the given day. */
export function getAppointmentsForDay(state, dayName) {

  /* sad path catch for when the state recieved, its days array doesn't have anything in it :(
   * returns an empty array when the days data is empty */
  if (state.days.length === 0 || state.days === undefined) {
    return [];
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  const foundDay = state.days.find(day => day.name === dayName);

  // returns an empty array when the day is not found :(
  if (!foundDay) {
    return [];
  }

  // 2. happy path - loop through days apointment array find the associated apointments for that day and return as an array :)
  return foundDay.appointments.map(appointmentId => state.appointments[appointmentId]);
};