import i18n from 'i18next';

export const SET_LANGUAGE = 'SET_LANGUAGE';

const initialState = {
  language: 'pl'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: action.language
      };
    default:
      return state;
  }
};

export const setLanguage = (language) => {
  i18n.changeLanguage(language);

  return {
    type: SET_LANGUAGE,
    language
  };
};
