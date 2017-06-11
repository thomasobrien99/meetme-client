/*global google*/
import React, { Component } from 'react';
import MapView from './components/MapView';

import LocationFormCard from './components/LocationFormCard';
import { geocodeLocation, extractInstructions, findRoute } from './utils/MapUtils';
import ResultsCard from './components/ResultsCard';
import YelpResultsCard from './components/YelpResultsCard';

import './App.css';

let directionsService;
let geocoder;
let map;
let infowindow;

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      origin: '',
      destination: '',
      instructions: [],
      userInput: {}
    };

    this._handleClickGeocodeLocation.bind(this);
  }

  componentDidMount() {
    directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();
  }

  render() {
    return (
      <div className="App">
        <div className="App-body">
          <div className="App-inputContainer">
            {this._renderInputContainer()}
          </div>
          <MapView
            center={this.state.center || {lat: 0, lng: 0}}
            containerElement={this._getMapViewContainerElement()}
            directions={this.state.directions || []}
            mapElement={this._getMapViewElement()}
            markers={this.state.markers || []} />
          <div className="App-resultsContainer">
            {this._renderResultsContainer()}
          </div>
        </div>
      </div>
    );
  }

  _getMapViewContainerElement() {
    return <div style={{ flex: 1 }} />;
  }

  _getMapViewElement() {
    return <div style={{ height: 800, width: '100%', margin: '0 auto' }} />;
  }

  _renderInputContainer() {
    if (this.state.origin &&
        this.state.destination &&
        this.state.confirmedMeetingPlace &&
        this.state.destinationDirectionsInstructions &&
        this.state.destinationDirectionsInstructions.length) {
      return (
        <ResultsCard
          originDirectionsInstructions={this.state.originDirectionsInstructions}
          destinationDirectionsInstructions={this.state.destinationDirectionsInstructions}
          confirmedMeetingPlace={this.state.confirmedMeetingPlace} />
      )
    } else if (this.state.origin &&
               this.state.destination &&
               this.state.yelpBusinesses &&
               this.state.yelpBusinesses.length) {
      return (
        <YelpResultsCard
          center={this.state.center}
          yelpBusinesses={this.state.yelpBusinesses}
          confirmMeetingPlace={this._confirmMeetingPlace.bind(this)} />
      );
    } else if (this.state.origin) {
      return (
        <LocationFormCard
          headerText={'Enter Friend\s Location'}
          location={this.state.destination}
          onClickGeocodeLocation={this._handleClickGeocodeLocation.bind(this, 'destination')} />
        );
    }
    return (
      <LocationFormCard
        headerText={'Enter Your Location'}
        location={this.state.origin}
        onClickGeocodeLocation={this._handleClickGeocodeLocation.bind(this, 'origin')} />
    );
  }

  _renderResultsContainer() {
    const meetingAddress = this.state.confirmedMeetingPlace && this.state.confirmedMeetingPlace.location && this.state.confirmedMeetingPlace.location.display_address ? this.state.confirmedMeetingPlace.location.display_address.join(', ') : null;

   return (
      <div>
        {this.state.origin ?<div className="Results-result">Your Location: {this.state.origin}<button onClick={()=>this.setState({origin: '', confirmedMeetingPlace: undefined})}>X</button></div> : null}
        {this.state.destination ? <div className="Results-result">Friend's Location: {this.state.destination}<button onClick={()=>this.setState({destination: '', confirmedMeetingPlace: undefined})}>X</button></div> : null}
        {meetingAddress ?<div className="Results-result">Meeting At: {this.state.confirmedMeetingPlace.name}<button onClick={()=>this.setState({confirmedMeetingPlace: undefined})}>X</button></div> : null}
      </div>
    );
  }

  _confirmMeetingPlace(confirmedMeetingPlace) {
    this.setState({confirmedMeetingPlace}, () => {
      this._findDirectionsToMeetingPlace()
    })
  }

  _handleClickGeocodeLocation(field, address) {
    geocodeLocation(geocoder, address, geocodedLocation => {
      this.setState({ [field]: geocodedLocation[0].formatted_address }, () => {
        if (this.state.origin && this.state.destination) this._findMidPoint(this.state.origin, this.state.destination);
      });
    });
  }

  _findMidPoint(origin, destination) {
    findRoute(directionsService, origin, destination)
    .then(response => {
      let directions = response;
      let instructions = extractInstructions(response)
      let center = {
        lat: response.routes[0].overview_path[Math.floor((response.routes[0].overview_path.length-1) / 2)].lat(),
        lng: response.routes[0].overview_path[Math.floor((response.routes[0].overview_path.length-1) / 2)].lng()
      }
      let markers = [new google.maps.Marker({ position: center })];

      fetch(`http://meetme-core.herokuapp.com/api/businesses/search?lat=${center.lat}&lng=${center.lng}`, { mode: 'no-cors' })
      .then(response => {
        debugger;
        return response.json()
      })
      .then(results => {
        debugger;
        this.setState({ directions, center, markers, yelpBusinesses: results.businesses })
      });
    });
  }

  _findDirectionsToMeetingPlace() {
    const meetingAddress = this.state.confirmedMeetingPlace && this.state.confirmedMeetingPlace.location && this.state.confirmedMeetingPlace.location.display_address ? this.state.confirmedMeetingPlace.location.display_address.join(', ') : null;

    Promise.all([
      findRoute(directionsService, this.state.origin, meetingAddress),
      findRoute(directionsService, this.state.destination, meetingAddress)
    ])
    .then(([originResponse, destinationResponse]) => {
      this.setState({
        originDirections: originResponse,
        originDirectionsInstructions: extractInstructions(originResponse),
        destinationDirections: destinationResponse,
        destinationDirectionsInstructions: extractInstructions(destinationResponse)
      });
    });
  }
}

export default App;
