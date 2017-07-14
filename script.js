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

		// Checks off form property.
		walkingButton.classList.add( 'toggleSVG' );

		// Remove class from driving icon if selected.
		if( drivingButton.classList.contains( 'toggleSVG' ) ) {
			drivingButton.classList.remove( 'toggleSVG' );
		}
	} );

	// Driving icon click.
	drivingButton.addEventListener( 'click', function(e) {

		// Checks off form property.
		drivingButton.classList.add( 'toggleSVG' );

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

// Function that will go and get information from the API
guac.getPlaces = function() {
	const url = 'https://api.foursquare.com/v2/venues/explore?';

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
		const zilch = document.createElement( 'h4' );
		const gothamole = document.createTextNode( 'Uh oh.  It looks like there aren\'t any open places near you that have guac.' );
		zilch.appendChild( gothamole );
		document.querySelector( 'section.results' ).appendChild( zilch );
	}

	// LOOP that will go through array being held in items above.
	for ( i=0; i < places.length; i++ ) {

		const name = places[i].venue.name;
		const id = places[i].venue.id;
		const address = places[i].venue.location.address;
		const distance = places[i].venue.location.distance;
		const stars = places[i].venue.rating;
		const photo = places[i].venue.photos.groups[0].items[0];

		// Create blank div. Add class name.
		const div = document.createElement( 'div' );
		div.classList.add( 'places' );

		// Get venue name.
		const h3 = document.createElement( 'h3' );
		const venue = document.createTextNode( name );
		h3.appendChild( venue );

		// Get venue address.
		const addrPrefix = 'https://foursquare.com/v/' + id;
		const addr = document.createElement( 'a' );
		addr.classList.add( 'addr' );
		addr.setAttribute( 'href', addrPrefix );
		addr.innerHTML = `<i class="fa fa-home"></i>${address}`;

		let dist = '';

		// If distance from current location is more than 1000m, convert it to km and attach different concatenation to add to page.
		if ( distance > 1000 ) {
			dist = document.createElement( 'p' );
			dist.classList.add( 'dist' );
			dist.innerHTML = `You are ${(distance/1000).toFixed( 1 )} km away.`;
		} else {
			dist = document.createElement( 'p' );
			dist.classList.add( 'dist' );
			dist.innerHTML = `You are ${distance} m away.`;
		}

		// Get rating of venue.
		const p = document.createElement( 'p' );
		const rating = document.createTextNode( `This place is rated ${stars} stars!` );
		p.classList.add( 'rating' );
		p.appendChild( rating );

		// Venue photo.
		const photoLink = photo.prefix + photo.height + photo.suffix;
		const img = document.createElement( 'img' );
		img.setAttribute( 'src', photoLink );

		// Put all the variables into div.
		div.appendChild( h3 );
		div.appendChild( p );
		div.appendChild( addr );
		div.appendChild( dist );
		div.appendChild( img );

		// Append that div to results section of HTML.
		document.querySelector( 'section.results' ).appendChild( div );
	} // end loop.
} // end displayResults.

// Document ready statement.
document.addEventListener( 'DOMContentLoaded', function() {
	guac.init();
} ) ;
