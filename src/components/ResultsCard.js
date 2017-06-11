import React, { Component } from 'react';

import './ResultsCard.css';

export default class ResultsCard extends Component {
  static defaultProps = {
    originDirectionsInstructions: [],
    destinationDirectionsInstructions: []
  }
  constructor(props) {
    super(props)
    this.state = {
      tab: 0
    };
  }

  render() {
    return (
      <div className="Card" onClick={this._handleClick.bind(this)}>
        <div className="Card-header">
          Go meet your friend!
        </div>
        <div className="Card-body">
          <div className="YelpResultsCard-resultCard">
            <img className="YelpResultsCard-resultCardThumbnail" src={this.props.confirmedMeetingPlace.image_url} />
            <div className="YelpResultsCard-resultCardInfo">
              <span>{this.props.confirmedMeetingPlace.name}</span>
              <span>Yelp Rating: {this.props.confirmedMeetingPlace.rating}</span>
              <span>Distance to Midpoint: {(this.props.confirmedMeetingPlace.distance/1609.344).toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => this.setState({directions: this.props.originDirections})}>Your Directions</button>
          <button onClick={() => this.setState({directions: this.props.destinationDirections})}>Friends Direction</button>
          {this._renderDirections()}
        </div>
      </div>
    );
  }

  _handleClick() {
    this.setState({tab: this.state.tab ? 0 : 1});
  }

  _renderDirections() {
    const directionsInstructions = this.state.tab ? this.props.originDirectionsInstructions : this.props.destinationDirectionsInstructions;
    return (
      <ol>
         {directionsInstructions.map((el, i) =>
           <li key={i} dangerouslySetInnerHTML={{__html: el}}></li>)
         }
      </ol>
    )
  }
}
