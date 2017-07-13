//Blank namespace
var guac = {
};

guac.clientId = 'M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5';
guac.clientSecret = 'YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU';

// Walking + driving variables.
const walkingButton = document.querySelector( 'button.walking' );
const drivingButton = document.querySelector( 'button.driving' );

guac.init = function() {
	console.log("I am ignited!");

	guac.getCoordinates();
	guac.setListeners();
} // end .init

guac.setListeners = function() {
	console.log("Set listeners")

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

		console.log('this is when submit is pressed');

		// Begin loading animation.
		document.querySelector( '.waiting' ).classList.remove( 'loading' );
		document.querySelector( 'img.avocado' ).classList.add( 'avocadoFade' );

		// Check to see if walking or driving selected.
		guac.checkQuery();

		guac.getPlaces();
	} );
}

guac.getCoordinates = function() {
	console.log("get coords")

	// Geolocator.
	navigator.geolocation.getCurrentPosition(function(position) {
		guac.lat = position.coords.latitude;
		guac.lon = position.coords.longitude;
	}); //end Geolocator.
};

guac.checkQuery = function() {
	console.log("check query")
	// Conditional to check for selection class.
	if ( walkingButton.classList.contains( 'toggleSVG' ) ) {

		console.log( "walking" )
		guac.radius = 2500;
	} else if ( drivingButton.classList.contains( 'toggleSVG' ) ) {

		console.log( "driving" )
		guac.radius = 40000;
	}
}

// Function that will go and get information from the API
guac.getPlaces = function() {
	console.log("get places")
	// console.log(">>",guac.radius, guac.lat, guac.lon);

	const url = 'https://api.foursquare.com/v2/venues/explore?';

	// 43.794393, -79.320259

	// https://api.foursquare.com/v2/venues/explore?&intent=browse&client_id=M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5&client_secret=YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU&ll=undefined,undefined&limit=9&query=guacamole&openNow=true&sortByDistance=1&venuePhotos=1&v=20151010

	const searchArguments = {
		// ll=${guac.lat},${guac.lon}&client_id=${guac.clientID}&client_secret=${guac.clientSecret}&v=20151010
		intent : 'browse',
		// format :'jsonp',
		client_id : guac.clientId,
		client_secret : guac.clientSecret,
		ll : `${guac.lat},${guac.lon}`,
		radius : guac.radius,
		limit : 9,
		query : 'guacamole',
		openNow : true,
		sortByDistance: 1,
		venuePhotos : '1',
		v : 20151010
	}

	axios.get( url, {
		params: searchArguments
	})
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.error(error);
	});

	// guac.axiosInit;

	// Ajax response to gather data from API
	// $.ajax( {
	// 	url : 'https://api.foursquare.com/v2/venues/explore?ll=' + guac.lat + ',' + guac.lon + '&client_id=' + guac.clientID + '&client_secret=' + guac.clientSecret + '&v=20151010',
	// 	dataType : 'jsonp',
	// 	type : 'GET',
	// 	v : '20160806',
	// 	// Parameters that need to go along with the request
	// 	data : {
	// 		intent : 'browse',
	// 		format :'jsonp',
	// 		client_id : guac.clientId,
	// 		client_secret : guac.clientSecret,
	// 		ll : guac.lat + "," + guac.lon,
	// 		radius : 2500,
	// 		limit : 9,
	// 		query : 'guacamole',
	// 		openNow : true,
	// 		sortByDistance: 1,
	// 		venuePhotos : '1'
	// 	},
	// 	success : function(result) {
	// 		guac.displayPlaces(result);
	// 		// End Loading Animation
	// 		$('.waiting').addClass('loading');
	// 		$('img.avocado').removeClass('avocadoFade');
	// 	}

	// }); // end ajax
} // end .getPlaces

// guac.getCarPlaces = function(place) {

// 	const url = `'https://api.foursquare.com/v2/venues/explore?ll=' + guac.lat + ',' + guac.lon + '&client_id=' + guac.clientID + '&client_secret=' + guac.clientSecret + '&v=20151010'`;

// 	// Ajax response to gather data from API
// 	$.ajax( {
// 		url : 'https://api.foursquare.com/v2/venues/explore?ll=' + guac.lat + ',' + guac.lon + '&client_id=' + guac.clientID + '&client_secret=' + guac.clientSecret + '&v=20151010',
// 		dataType : 'jsonp',
// 		type : 'GET',
// 		v : '20160806',
// 		// Parameters that need to go along with the request
// 		data : {
// 			intent : 'browse',
// 			format :'jsonp',
// 			client_id : guac.clientId,
// 			client_secret : guac.clientSecret,
// 			ll : guac.lat + "," + guac.lon,
// 			radius : 40000,
// 			limit : 9,
// 			query : 'guacamole',
// 			openNow : true,
// 			sortByDistance: 1,
// 			venuePhotos : '1'
// 		},
// 		success : function(result) {
// 			guac.displayPlaces(result);

// 			// End Loading Animation
// 			$('.waiting').addClass('loading');
// 			$('img.avocado').removeClass('avocadoFade');
// 		}

// 	}); // end ajax
// } // end .getCarPlaces

// Function that is used to display information in html
// guac.displayPlaces = function(result) {

// 	//clear old results to find new ones
// 	$(".results").html('');
// 	//create variable that holds path to data
// 	var places = result.response.groups[0].items;
// 	// console.log(places);

// 	//if there aren't any results, display this message to the user
// 	if (places.length === 0) {
// 			var zilch = $('<h4>').text("Uh oh.  It looks like there aren't any open places near you that have guac.");
// 			$('section.results').append(zilch);
// 	}

// 	// LOOP that will go through array being held in items above
// 	for (i=0; i < places.length; i++) {

// 		//create blank div
// 		var div = $('<div>').addClass('places');
// 		//get venue name
// 		var h3 = $('<h3>').text(places[i].venue.name);
// 		//get venue address
// 		var addrPrefix = "https://foursquare.com/v/" + places[i].venue.id;
// 		var addr = $('<a class="addr">').attr('href', addrPrefix).html('<i class="fa fa-home"></i> ' + places[i].venue.location.address);

// 		// if distance from current location is more than 1000m, convert it to km and attach different concatenation to add to page
// 		if (places[i].venue.location.distance > 1000) {
// 			var dist = $('<p class="dist">').text('You are '+ ((places[i].venue.location.distance/1000).toFixed(1)) + 'km away.');
// 		} else {
// 			var dist = $('<p class="dist">').text('You are ' + places[i].venue.location.distance + 'm away.');
// 		}

// 		//get rating of venue
// 		var rating = $('<p class="rating">').text('This place is rated ' + places[i].venue.rating + ' stars!');

// 		//venue photo
// 		var photoPrefix = places[i].venue.photos.groups[0].items[0];
// 		var photo = $('<img>').attr('src',photoPrefix.prefix + photoPrefix.height + photoPrefix.suffix);

// 		//put all of the variables into the div
// 		div.append(h3, photo, dist, rating, addr);
// 		//append that div to the results section of the html
// 		$('section.results').append(div);

// 		var price = places[i].venue.price;
// 		console.log(price);
// 	}
// } //end displayResults

// Document ready statement.
document.addEventListener("DOMContentLoaded", function(){
	console.log("Call init")
	guac.init();
} ) ;
