var list = [];
var lineString = new H.geo.LineString();
/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map displays an alert box containing the latitude and longitude
 * of the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */

 function addMarkersToMap(map) {
    var len = list.length;

    //show save button
    if (len>0) {
      var x = document.getElementById("btn-save");
      x.style.display = "block";
    }

    for (var i = 0; i <len; i++) {
        var coord = list[i];
    
    }
    var latVal = coord.lat;
    var lngVal = coord.lng;
    lineString.pushPoint({lat:latVal, lng:lngVal});

    //Draw marker
    //var parisMarker = new H.map.Marker({lat:latVal, lng:lngVal});
    //map.addObject(parisMarker);


    //Draw line on map
    map.addObject(new H.map.Polyline(
      lineString, { style: { lineWidth: 4 }}
    ));
}


function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {

    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    logEvent('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));

      //Add coordinate to aaray list
      list.push(coord);
      
      //Draw marker or line on map
      addMarkersToMap(map);
  });
  
  console.log(list);
}



/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
// Platform service created for map
var platform = new H.service.Platform({
  apikey: window.apikey
});

// create default layer  
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 26.157072983262452, lng: 32.717246547345674},
  zoom: 3,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create custom logging facilities
// showing lat lng values on map
var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = '<li class="log-entry">Try clicking on the map</li>';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(str) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}


setUpClickListener(map);


//hide and show form
document.getElementById("btn-save").addEventListener("click", showForm);

function showForm(){
  var x = document.getElementById("my-form");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}