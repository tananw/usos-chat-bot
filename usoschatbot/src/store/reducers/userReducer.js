export const SET_USER_DATA = 'SET_USER_DATA';

const initialState = {
  user: {}
  // isAuthorized: false,
  // accessToken: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

export const setUserData = (user) => ({
  type: SET_USER_DATA,
  user
});
