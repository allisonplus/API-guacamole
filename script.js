//Blank namespace
var guac = {
};

guac.init = function() {
guac.clientId = 'M01QAACEECGNTWIG3C3GEC5BEX3SNLI2EZ4SJ0WHVQEY3ZA5';
guac.clientSecret = 'YKEJGAP4EJ12E4QR1ZZ3K5WR0W0AZSPDZCOEXKYX3TISEMRU';

	//What happens when you submit the form?
	$('.search').on('submit', function(e) {
		// Prevent the default
		e.preventDefault();
		// Take info from input and store it in variable
		guac.location = $('.location').val();
		console.log('We should eat some guacamole in ' + guac.location);
		// Run function with user entered location
		guac.getData(guac.location);
		// $('.location').val();

	});
} // end .init

//=========
//AJAX CALL
//=========

// Function that will go and get information from the API
guac.getData = function(place) {
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
			near : place,
			radius : 1000,
			// limit : 10,
			query : 'guacamole',
			openNow : true,
			venuePhotos : '1'
		},
		success : function(result) {
			console.log(result);
			console.log("The eagle has landed plus" + result);
			// Display data that has come back using another function
		}
	}); // end ajax
} // end .getData

// Function that is used to display information in html

guac.display = function(result) {

	var guacResults = result.response.groups[0].items[0].venue.name;
	console.log(guacResults);
}


// Document ready statement
$(function() {
	guac.init();
});