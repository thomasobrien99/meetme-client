export function geocodeLocation(geocoder, address, onSuccess) {
  geocoder.geocode( { address }, (geocodedLocation, status) => {
    switch (status) {
      case 'OK':
        onSuccess(geocodedLocation)
        break;
      default: alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

export function findRoute(directionsService, origin, destination) {
  return new Promise((resolve, reject) => {
    directionsService.route({
      origin,
      destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      switch (status) {
        case 'OK':
          resolve(response)
        break;
      default: return reject(alert('Directions request failed due to ' + status));
      }
    });
  });
}

export function extractInstructions(directionsResponse) {
  // TODO: consider stripping the HTML out of these tags
  return directionsResponse.routes[0].legs[0].steps.map(el => el.instructions)
}
