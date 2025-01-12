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

// common use case leaves the box cut off at the top
// width 655 and height 540 in an iframe lets optimize for that
// by centering the map on the US moving the center of the us up a bit
// center: fromLonLat([-98.5795, 39.8283]),
const US_CENTER_COORDINATES = [-98.5795, 46];
const ZOOM_CAP = 4;
const ZOOM_SCALE_FACTOR = 0.004;
const ZOOM_OFFSET = 1.38;

let popupOpen = false;

(async () => {
  const points = await fetchPoints();
  const popup = createPopup();
  const map = initializeMap(popup, points);

  map.on("singleclick", (event) => handleMapClick(event, map, popup));
  map.on("pointermove", (event) => handlePointerMove(event, map));

  document.getElementById("popup-closer").onclick = () => closePopup(popup);

  const initialFeature = points.find((i) => /nijii/.test(i.get("title").toLowerCase()));
  popupOpen = openPopup(initialFeature, popup);
})();

async function fetchPoints() {
  const response = await fetch("https://nijii.org/_functions/points");
  const results = await response.json();
  return results.map((row) => createFeature(row));
}

function createFeature(row) {
  return new Feature({
    type: "icon",
    geometry: new Point(fromLonLat([row.address.location.longitude, row.address.location.latitude])),
    title: row.popupTitle,
    icon: row.icon,
    content: row.popupContent,
  });
}

function createPopup() {
  return new Overlay({
    element: document.getElementById("popup"),
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });
}

function initializeMap(popup, points) {
  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      createVectorLayer(points),
    ],
    view: new View({
      center: fromLonLat(US_CENTER_COORDINATES),
      zoom: calculateZoom(),
    }),
  });

  map.addOverlay(popup);
  return map;
}

function createVectorLayer(points) {
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

  return new VectorLayer({
    source: new VectorSource({
      features: points,
    }),
    style: (feature) => icons[feature.get("icon")],
  });
}

function handleMapClick(event, map, popup) {
  const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

  if (feature) {
    openPopup(feature, popup);
  } else {
    closePopup(popup);
  }
}

function handlePointerMove(event, map) {
  const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

  if (feature && !popupOpen) {
    map.getTargetElement().style.cursor = "pointer";
  } else {
    map.getTargetElement().style.cursor = "";
  }
}

function closePopup(popup) {
  popup.setPosition(undefined);
  popupOpen = false;
  document.getElementById("popup-closer").blur();
  return false;
}

function openPopup(feature, popup) {
  const coordinates = feature.getGeometry().getCoordinates();
  const content = `<strong>${feature.get("title")}</strong><br>${feature.get("content")}`;

  document.getElementById("popup-content").innerHTML = content;
  popup.setPosition(coordinates);
  popupOpen = true;
}

// zoom on smaller devices does not zoom out it just crops so we need
// to scale it on smaller devices target 280px width and 231px height
function calculateZoom() {
  const width = window.innerWidth;
  const zoom = ZOOM_SCALE_FACTOR * width + ZOOM_OFFSET;
  return Math.min(ZOOM_CAP, zoom);
}