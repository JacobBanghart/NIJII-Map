import { collections } from "./CollectionSchemaReponses.mjs";
import { readFileSync } from "node:fs";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  Authorization:
    "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjY0YmRhZjIyLWJjNmEtNGMwNC1iM2Y2LWE4YmYzMGUxY2MwMFwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjgxYzRlMjFiLWY0YWUtNGMwYy04NGNjLTQ2YmZkYzlhMzM2N1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI2Yzk2OTRhYS04Nzc5LTRmMTQtOThjNi1iYzhjN2Y3MjQ1ZTRcIn19IiwiaWF0IjoxNzI0MTc2MDQyfQ.UdczMPOQhkHP7Wx1YZezgU3PEN1gRbinZ8oSTGtArnsEKeYuuvAZNWoKkaRwomm1iMFRwls-3a0YDuHd6mEb2RNVm7khLQe4me3zLR8un8iymGswLPhHiq87vcrYXjYkmlSLr9ouIE_2wwQyHQowHDMMr4nkcUzYXO2RZ7cJuhDEGzB1Sd_NOUzknC5YMHCvE1Q36jHCApg4QbWAioWMwaYrvrxlbmp9gP40sP4NCzXQOLYEO7OGYAdmPqcri8PH8mmgKPmnakx3Se-pElMHnCChLTmTCoUtzvZLNacHjb3WyW7ipZOUAu2LkZY778PMla9U9Xmh2Xlv2npS_xXpWg",
  "wix-site-id": "915c64bd-481e-4141-bbc9-eae1f1c4edcf",
  "wix-account-id": "6c9694aa-8779-4f14-98c6-bc8c7f7245e4",
};
const reservations = readFileSync(
  "./rawData/Federal_American_Indian_Reservations_v1_-6588254737828329119.geojson",
  "utf8"
);

const reservationsParsed = JSON.parse(reservations);

function postCollection(body) {
  return axios({
    method: "post",
    url: "https://www.wixapis.com/wix-data/v2/collections",
    headers,
    data: { collection: body },
  });
}

function postFeature(feature) {
  const id = generateId(feature.properties.NAME);

  return axios({
    method: "post",
    url: `https://www.wixapis.com/wix-data/v2/items`,
    headers,
    data: {
      dataCollectionId: "GeoJson",
      dataItem: {
        id: id,
        data: {
          _id: id,
          id: id,
          geoJson: feature,
        },
      },
    },
  });
}

(async () => {
  for (let item of collections) {
    console.log("posting collection", item.id);
    await postCollection(item);
    console.log("completed posting collection", item.id);
  }
  const errors = [];
  for (let i = 0; i < reservationsParsed.features.length; i++) {
    console.log(
      `posting feature ${i} of ${
        reservationsParsed.features.length
      }: ${generateId(reservationsParsed.features[i].properties.NAME)}`
    );
    try {
      await postFeature(reservationsParsed.features[i]);
    } catch (e) {
      console.log(JSON.stringify(e.response.data));
      errors.push({
        id: reservationsParsed.features[i].id,
        name: generateId(reservationsParsed.features[i].properties.NAME),
        error: e.response.data,
      });
    }
    console.log(
      `completed posting feature ${i} of ${reservationsParsed.features.length}`
    );
  }
  console.log(JSON.stringify(errors));
})();

function generateId(name) {
  return String(name).toLowerCase().replaceAll(" ", "_");
}
