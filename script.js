//Blank namespace
var guac = {
};

guac.clientId = 'M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5';
guac.clientSecret = 'YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU';

// Walking + driving variables.
const walkingButton = document.querySelector( 'button.walking' );
const drivingButton = document.querySelector( 'button.driving' );

guac.init = function() {
	guac.setListeners();
} // end .init

guac.getCoordinates = function() {

	// Geolocator.
	var getPosition = function ( options ) {
		return new Promise(function ( resolve, reject ) {
			navigator.geolocation.getCurrentPosition( resolve, reject, options );
		});
	}

	getPosition()
		.then( ( position ) => {
			guac.lat = position.coords.latitude;
			guac.lon = position.coords.longitude;

			// Check to see if walking or driving selected.
			guac.checkQuery();

			// Get results.
			guac.getPlaces();
		})
		.catch( ( err ) => {
			console.error( err.message );
		});
}; // end getCoordinates.

guac.setListeners = function() {

	// Walking icon click.
	walkingButton.addEventListener( 'click', function(e) {

		// Adds class.
		this.classList.add( 'toggleSVG' );

		// Remove class from driving icon if selected.
		if( drivingButton.classList.contains( 'toggleSVG' ) ) {
			drivingButton.classList.remove( 'toggleSVG' );
		}
	} );

	// Driving icon click.
	drivingButton.addEventListener( 'click', function(e) {

		// Adds class.
		this.classList.add( 'toggleSVG' );

		// Remove class from driving icon if selected.
		if( walkingButton.classList.contains( 'toggleSVG' ) ) {
			walkingButton.classList.remove( 'toggleSVG' );
		}
	} );

	// What happens when you submit the form?
	document.querySelector( '.search' ).addEventListener( 'submit', function(e) {

		// Prevent the default.
		e.preventDefault();

		// Begin loading animation.
		document.querySelector( '.waiting' ).classList.remove( 'loading' );
		document.querySelector( 'img.avocado' ).classList.add( 'avocadoFade' );

		// Get coordinates.
		guac.getCoordinates();
	} );
} // end .setListeners

guac.checkQuery = function() {

	// Conditional to check for selection class.
	if ( walkingButton.classList.contains( 'toggleSVG' ) ) {
		guac.radius = 2500;
	} else if ( drivingButton.classList.contains( 'toggleSVG' ) ) {
		guac.radius = 40000;
	}
} // end .checkQuery

// Function that will go and get information from the API.
guac.getPlaces = function() {
	const url = 'https://api.foursquare.com/v2/venues/explore';

	const searchArguments = {
		intent : 'browse',
		client_id : guac.clientId,
		client_secret : guac.clientSecret,
		ll : `${guac.lat},${guac.lon}`,
		radius : guac.radius,
		limit : 9,
		query : 'guacamole',
		openNow : true,
		sortByDistance: 1,
		venuePhotos : '1',
		v : 20160806
	}

	axios.get( url, {
		params: searchArguments
	})
	.then(function (response) {
		guac.displayPlaces(response);

		// End Loading Animation.
		document.querySelector( '.waiting' ).classList.add( 'loading' );
		document.querySelector( 'img.avocado' ).classList.remove( 'avocadoFade' );
	})
	.catch(function (error) {
		console.error(error);
	});
} // end .getPlaces.

// Function that is used to display information in html
guac.displayPlaces = function(result) {

	// Clear old results.
	document.querySelector( '.results' ).innerHTML = null;

	// Create variable that holds path to data.
	const places = result.data.response.groups[0].items;

	// If there aren't any results, display this message to the user.
	if (places.length === 0) {
		const gothamole = '<h4>Uh oh.  It looks like there aren\'t any open places near you that have guac.</h4>';
		document.querySelector( 'section.results' ).insertAdjacentHTML( 'afterbegin', gothamole );
	}

	// Loop that will go through array being held in items above.
	places.forEach( function(place) {
		const name = place.venue.name;
		const id = place.venue.id;
		const address = place.venue.location.address;
		const distance = place.venue.location.distance;
		const stars = place.venue.rating;
		const photo = place.venue.photos.groups[0].items[0];
		const addrPrefix = 'https://foursquare.com/v/';
		const photoLink = photo.prefix + photo.height + photo.suffix;

		let dist = '';

		// If distance from current location is more than 1000m, convert it to km and attach different concatenation to add to page.
		if ( distance > 1000 ) {
			dist = `You are ${(distance/1000).toFixed( 1 )} km away.`;
		} else {
			dist = `You are ${distance} m away.`;
		}

		const placeCard =
		`<div class="places">
			<h3>${name}</h3>
			<a class="addr" href="${addrPrefix}${id}"><i class="fa fa-home"></i>${address}</a>
			<p class="dist">${dist}</p>
			<p class="rating">This place is rated ${stars} stars!</p>
			<img src="${photoLink}" alt="${name}">
		</div>`;

		// Append that div to results section of HTML.
		document.querySelector( 'section.results' ).insertAdjacentHTML( 'afterbegin', placeCard );
	} ); // end forEach.
} // end displayResults.

// Document ready statement.
document.addEventListener( 'DOMContentLoaded', function() {
	guac.init();
} ) ;
