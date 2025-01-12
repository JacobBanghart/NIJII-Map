import { Point } from "ol/geom";
import "./style.css";
import { Feature, Map, Overlay, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import star from "./star.svg";
import homebase from "./homebase.svg";

let popupOpen = false;
(async () => {
  const request = await fetch("https://nijii.org/_functions/points");
  const results = await request.json();
  console.log(results);
  const popup = new Overlay({
    element: document.getElementById("popup"),
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  const points = [];
  results.forEach((row) => {
    points.push(
      new Feature({
        type: "icon",
        geometry: new Point(
          fromLonLat([
            row.address.location.longitude,
            row.address.location.latitude,
          ])
        ),
        title: row.popupTitle,
        icon: row.icon,
        content: row.popupContent,
      })
    );
  });
  const icons = {
    star: new Style({
      image: new Icon({
        anchor: [0.53, 0.65],
        src: star,
      }),
    }),
    homebase: new Style({
      image: new Icon({
        anchor: [0.53, 0.65],
        src: homebase,
      }),
    }),
  };
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [...points],
    }),
    style: (feature) => icons[feature.get("icon")],
  });

  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM({}),
      }),
    ],
    view: new View({
      // common use case leaves the box at about 
      // width 655 and height 540 in an iframe lets optimize for that
      // by centering the map on the US moving the center of the us up a bit
      // center: fromLonLat([-98.5795, 39.8283]),
      center: fromLonLat([-98.5795, 46]),
      // zoom on smaller devices does not zoom out it just crops so we need
      // to scale it on smaller devices target 280px width and 231px height
      zoom: calculateZoom(),
    }),
  });

  map.addLayer(vectorLayer);
  map.addOverlay(popup);
  // Handle map clicks to display popup
  map.on("singleclick", function (event) {
    // Get the clicked feature
    var feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
      return feature;
    });

    if (feature) {
      openPopup(feature, popup);
    } else {
      // If no feature is clicked, close the popup
      popup.setPosition(undefined);
      document.getElementById("popup-closer").blur();
      popupOpen = false;
    }
  });
  map.on("pointermove", function (event) {
    var feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
      return feature;
    });

    if (feature && !popupOpen) {
      // Change the cursor to a pointer when hovering over a feature
      map.getTargetElement().style.cursor = "pointer";
    } else {
      // Reset the cursor and hide the popup when not hovering over a feature
      map.getTargetElement().style.cursor = "";
    }
  });
  // Close the popup when the "x" is clicked
  var closer = document.getElementById("popup-closer");
  closer.onclick = function () {
    popup.setPosition(undefined);
    popupOpen = false;
    closer.blur();
    return false;
  };

  // open popup on map load
  let feature = points.find((i) => /nijii/.test(i.get("title").toLowerCase()));
  popupOpen = openPopup(feature, popup);
})();
function openPopup(feature, popup) {
  var coordinates = feature.getGeometry().getCoordinates();
  // Adjust this part depending on your data; here we're assuming the feature has a 'name' property
  var content = `<strong>${feature.get("title")}</strong><br>${feature.get(
    "content"
  )}`;

  // Set the popup content
  document.getElementById("popup-content").innerHTML = content;

  // Position the popup at the feature's coordinates
  popup.setPosition(coordinates);
  popupOpen = true;
}
function calculateZoom() {
  const width = window.innerWidth; // Get the current window width
  const zoom = 0.004 * width + 1.38;
  return Math.min(4, zoom); // Cap the zoom at 4
}
