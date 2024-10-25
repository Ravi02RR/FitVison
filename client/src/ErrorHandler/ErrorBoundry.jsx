/* eslint-disable no-unused-vars */
import React from 'react';

class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log("error caught", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default ErrorBoundry;
