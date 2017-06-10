import React, { Component } from 'react';
import './LocationFormCard.css';

export default class LocationFormCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      location: ''
    }
  }

  render() {
    return (
      <div className="LocationFormCard">
        <header className="LocationFormCard-header">{this.props.headerText}</header>
        <div className="LocationFormCard-body">
          <input
            className="LocationFormCard-textInput"
            type="text"
            value={this.state.location}
            onChange={this._handleChangeTextInput.bind(this)} />
          <button
            type="button"
            onClick={this._handleClickGeocodeLocation.bind(this)} >
            Find Location
          </button>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.state.location) this.setState({ location: nextProps.location });
  }

  _handleChangeTextInput(event) {
    this.setState({location: event.target.value});
  }

  _handleClickGeocodeLocation() {
    this.props.onClickGeocodeLocation(this.state.location);
  }
}
