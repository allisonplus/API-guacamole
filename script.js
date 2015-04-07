//Blank namespace
var guac = {
};

guac.clientId = 'M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5';
guac.clientSecret = 'YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU';


guac.init = function() {
	//What happens when you submit the form?
	$('.search').on('submit', function(e) {
		// Prevent the default
		e.preventDefault();
		// Take info from input and store it in variable
		guac.location = $('.location').val();
		console.log('We should eat some guacamole in ' + guac.location);
		// Run function with user entered location
		guac.getPlaces(guac.location);
		// $('.location').val();

	});
} // end .init

//=========
//AJAX CALL
//=========

// Function that will go and get information from the API
guac.getPlaces = function(place) {
	// Ajax response to gather data from API
	$.ajax( {

		// url : 'https://api.foursquare.com/v2/venues/explore?&v=20151010',
		// url : 'https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&client_id=M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5&client_secret=YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU&v=20151010',

		url : 'https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&client_id=' + guac.clientID + '&client_secret=' + guac.clientSecret + '&v=20151010',
		dataType : 'jsonp',
		type : 'GET',
		v : '20160806',
		// Parameters that need to go along with the request
		data : {
			// ll : '44.3,37.2',
			intent : 'browse',
			format :'jsonp',
			// v : '20151010',
			client_id : guac.clientId,
			client_secret : guac.clientSecret,
			// near : place,
			near : guac.location,
			radius : 1000,
			// limit : 10,
			query : 'guacamole'
			// openNow : true,
			// venuePhotos : '1'
		},
		success : function(result) {
			console.log(result);
			guac.displayPlaces(result);	
			
		}
	}); // end ajax
} // end .getPlaces

// Function that is used to display information in html

guac.displayPlaces = function(result) {

	//clear old results to find new ones??
	$(".results").html('');

	//create variable that holds path to data

	var places = result.response.groups[0].items;
	console.log(places);

	// create for loop that will loop through array being held in items above

	for (i=0; i < places.length; i++) {

		//create blank div
		var div = $('<div>').addClass('places clearfix');

		//get venue name
		var h3 = $('<h3>').text(places[i].venue.name);

		//get venue address

		//venue photo
		var photoPrefix = places[i].venue.photos.groups[0].items[0];
		var photo = $('<img>').attr('src',photoPrefix.prefix + photoPrefix.height + photoPrefix.suffix);

		//append that div to the results section
		$('.results').append(h3);
		$('.results').append(photo);


	}

}

// Document ready statement
$(function() {
	guac.init();
});