/* The term fixture can be used to describe reusable static data that is imported or embedded into a test file.
 * We need to make sure we have accurate data that matches the schema from the server. */
const fixtures = {
  days: [
    {
      id: 1,
      name: 'Monday',
      appointments: [1, 2],
      interviewers: [1, 2],
      spots: 1,
    },
    {
      id: 2,
      name: 'Tuesday',
      appointments: [3, 4],
      interviewers: [3, 4],
      spots: 1,
    },
  ],
  appointments: {
    1: { id: 1, time: '12pm', interview: null },
    2: {
      id: 2,
      time: '1pm',
      interview: { student: 'Archie Cohen', interviewer: 2 },
    },
    3: {
      id: 3,
      time: '2pm',
      interview: { student: 'Leopold Silvers', interviewer: 4 },
    },
    4: { id: 4, time: '3pm', interview: null },
  },
  interviewers: {
    1: {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
    2: {
      id: 2,
      name: 'Tori Malcolm',
      avatar: 'https://i.imgur.com/Nmx0Qxo.png',
    },
    3: {
      id: 3,
      name: 'Mildred Nazir',
      avatar: 'https://i.imgur.com/T2WwVfS.png',
    },
    4: {
      id: 4,
      name: 'Cohana Roy',
      avatar: 'https://i.imgur.com/FK8V841.jpg',
    },
  },
};

/* Now we need to export our fake axios library. We only need to include mock functions for the parts of the API that we are using.
The first test that we will write will only need to mock the axios.get() function. */
export default {
  get: jest.fn((url) => {
    if (url === '/api/days') {
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: fixtures.days,
      });
    }

    /* Resolve appointments data */
    if (url === '/api/appointments') {
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: fixtures.appointments,
      });
    }

    /* Resolve interviewers data */
    if (url === '/api/interviewers') {
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: fixtures.interviewers,
      });
    }
  }),
  put: jest.fn((url) => {
    return Promise.resolve({
      status: 204,
    });
  }),
  delete: jest.fn((url) => {
    return Promise.resolve({
      status: 204,
    });
  }),
};
