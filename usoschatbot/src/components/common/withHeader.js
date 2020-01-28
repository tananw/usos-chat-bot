import React from 'react';
import Header from './navigation/Header';

export default function withHeader(WrappedComponent) {
  return (props) => {
    return (
      <React.Fragment>
        <Header {...props} />
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };
}
