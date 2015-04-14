$(document).ready(function() {
    $.ajax({
        url: 'http://api.hostip.info/get_json.php?position=true',
        dataType: 'html',
        success: function(data) {
            var position = $.parseJSON(data);
            $('#result').append('Estimated city: ' + position.city + '<br>Estimated LatLng: ' + position.lat + ', ' + position.lng);
        },
        error: function() {
            $('#result').append('geolocation not supported');
        }
    });
});