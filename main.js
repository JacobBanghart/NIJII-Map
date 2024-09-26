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
import snowflake from "./snowflake.svg";

(async () => {
  let popupOpen = false;
  const request = await fetch(
    "https://jacobmbanghart.wixsite.com/kittens/_functions/multiply"
  );
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
    snowflake: new Style({
      image: new Icon({
        anchor: [0.53, 0.65],
        src: snowflake,
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
      center: fromLonLat([-98.5795, 39.8282]),
      zoom: 4,
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
})();
