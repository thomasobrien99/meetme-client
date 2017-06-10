/*global google*/
import React from 'react';
import { DirectionsRenderer, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

import SearchBox from '../../node_modules/react-google-maps/lib/places/SearchBox'
import { ASSASSINS_CREED_GOOGLE_MAP_STYLES } from './MapView.styles.js'

const MapView = withGoogleMap(props => {
  return (
    <GoogleMap
      ref={props.onMapLoad}
      center={props.center}
      defaultZoom={3}
      defaultOptions={{ styles: ASSASSINS_CREED_GOOGLE_MAP_STYLES, scrollwheel: false}}
      defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
      onClick={props.onMapClick} >
        {props.markers.map((marker, index) => <Marker key={index} {...marker} />)}
        {props.directions ? <DirectionsRenderer
          directions={props.directions} /> : null}
    </GoogleMap>
  );

});

export default MapView;
