var map = L.map("map", { zoomControl: true }).setView([-30.5595, 22.9375], 6); // Centered on South Africa
map.zoomControl.setPosition("topright"); // Position the zoom control

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 10,
}).addTo(map);

// Dummy data for weather stations
var weatherStations = [
  {
    name: "CT-AWS",
    Synop_Number: 68999,
    latitude: -33.9787,
    longitude: 18.5998,
    status: "online",
  },
  {
    name: "Ele_Manual",
    latitude: -31.9545,
    longitude: 18.4736,
    status: "offline",
  },
  {
    name: "ARS",
    latitude: -34.3527,
    longitude: 18.488,
    status: "online",
  }
];

var markers = [];



/// Create markers for each station and add to the map
weatherStations.forEach(function (station) {
    var color = station.status === "online" ? "green" : "red";
    var markerIcon = L.icon({
      iconUrl: "img/location.png", // Replace with the URL of your red location icon image
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  
    if (station.status === "online") {
      markerIcon.options.iconUrl = "img/location-green.png"; // Replace with the URL of your online location icon image
    } else {
      markerIcon.options.iconUrl = "img/location.png"; // Replace with the URL of your offline location icon image (green color)
    }
  
    var marker = L.marker([station.latitude, station.longitude], {
      icon: markerIcon,
    }).addTo(map);
  
    var tooltipContent =
      "<strong>" +
      station.name +
      "</strong><br>Status: " +
      station.status +
      "<br>Latitude: " +
      station.latitude +
      "<br>Longitude: " +
      station.longitude;
    marker.bindTooltip(tooltipContent, { permanent: false, direction: "top" });
  
    markers.push({ marker: marker, status: station.status });
  });
var legend = L.control({ position: "topright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML +=
    '<span class="online"><i style="background: green"></i> Online</span><br>';
  div.innerHTML +=
    '<span class="offline"><i style="background: red"></i> Offline</span><br>';
  div.innerHTML +=
    '<span class="all"><i style="background: gray"></i> Show All</span>';
  return div;
};

legend.addTo(map);

// Function to filter the visibility of markers
function filterMarkers(status) {
  markers.forEach(function (stationMarker) {
    if (status === "all" || stationMarker.status === status) {
      stationMarker.marker.addTo(map);
    } else {
      stationMarker.marker.removeFrom(map);
    }
  });
}

// Click event listeners for legend items
document.addEventListener("click", function (e) {
  if (
    e.target &&
    e.target.parentElement.className.indexOf("online") !== -1
  ) {
    filterMarkers("online");
  } else if (
    e.target &&
    e.target.parentElement.className.indexOf("offline") !== -1
  ) {
    filterMarkers("offline");
  } else if (
    e.target &&
    e.target.parentElement.className.indexOf("all") !== -1
  ) {
    filterMarkers("all");
  }
});