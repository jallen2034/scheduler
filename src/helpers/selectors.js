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
  return foundDay.appointments.map(appointment => state.appointments[appointment]);
};

// helper functin that will transform the 
// interview second paramater takes in interview object that looks like this: interview: { student: "Chad Takahashi", interviewer: 2 }
export function getInterview(state, interview) {

  if (!interview) {
    return null;
  }

  const interviewerID = interview.interviewer;
  const foundInterviewer = state.interviewers[interviewerID];
  const interviewInfo = {...interview, interviewer: foundInterviewer};
  return interviewInfo;
}


export function getInterviewersForDay(state, dayName) {

  if (state.days.length === 0 || state.days === undefined) {
    return [];
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  const foundDay = state.days.find(day => day.name === dayName);

  console.log("My foundDay!: ", foundDay)

  // returns an empty array when the day is not found :(
  if (!foundDay) {
    return [];
  }

  // grab interviewers array from the found day
  const foundDayInterviewers = foundDay.interviewers.map(interviewer => state.interviewers[interviewer]);
  return foundDayInterviewers;
};