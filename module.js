let map;

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(39.8097343, -98.5556199),
    zoom: 5,
    mapId: "TRIBES_MAP",
  });

  const iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
  const icons = {
    star: {
        icon: "star-svgrepo-com.svg",
    }
  };
  const locations = [
    {
      position: new google.maps.LatLng(43.02720939984191, -112.4333469669332),
      type: "star",
    },
  ];

  for (let i = 0; i < locations.length; i++) {
    const iconImage = document.createElement("img");

    iconImage.src = icons[locations[i].type].icon;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: locations[i].position,
      // content: iconImage,
    });
  }

  map.data.loadGeoJson('fortHall.geojson');
  map.data.setStyle({
    fillColor: '#FFCCCC',
    strokeColor: 'red',
    strokeWeight: 2,
    strokeOpacity: 0.5
  })
}

initMap();
