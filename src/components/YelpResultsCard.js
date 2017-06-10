import React, { Component } from 'react';

import './YelpResultsCard.css';

export default class YelpResultsCard extends Component {
  render() {
    return (
      <div className="Card">
        <header className="Card-header">Potential Meeting Points</header>
        <div className="Card-body">
        <p>
          The midpoint between the two locations is: {this.props.center.lat.toFixed(2)} {this.props.center.lng.toFixed(2)}, here are some potential places to meet for ice cream!
        </p>
          {this.props.yelpBusinesses.map(this._renderBusinessResultCard.bind(this))}
          {/* => {
            return (
              <div className="Card-resultCard" onClick={this.props.confirmMeetingPlace.bind(this, locationResult)}>
                <header>{locationResult.name}</header>
                <div>{locationResult.rating} - {locationResult.distance} meters from midpoint</div>
              </div>
            );
          })} */}
        </div>
      </div>
    );
  }

  _renderBusinessResultCard(locationResult) {
    return (
      <div className="YelpResultsCard-resultCard" onClick={this.props.confirmMeetingPlace.bind(this, locationResult)}>
        <img className="YelpResultsCard-resultCardThumbnail" src={locationResult.image_url} />
        <div className="YelpResultsCard-resultCardInfo">
          <span>{locationResult.name}</span>
          <span>Yelp Rating: {locationResult.rating}</span>
          <span>Distance to Midpoint: {(locationResult.distance/1609.344).toFixed(2)}</span>
        </div>
      </div>
    );
  }
}
