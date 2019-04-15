import React, { Component } from 'react';
import '../assets/scss/NotFound.scss'

export default class NotFound extends Component {
  constructor() {
    super();
    this.state = { timer: 5 }
  }

  componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState({ timer: this.state.timer - 1});
      if (this.state.timer <= 0)
      {
        clearInterval(this.timeout)
        this.props.history.replace('/');
      }
    }, 1000);
  }

  render() {
    document.title = "ZelEnjoy - Oops :c"
    return (
      <div className="NotFound">
        <div className="NotFoundImage"></div>
        <p className="NotFound-text">Ooooooh, tu t'es perdu :c</p>
        <p className="NotFound-text">On va arranger ça d'ici {this.state.timer} secondes...</p>
      </div>
    );
  }
}