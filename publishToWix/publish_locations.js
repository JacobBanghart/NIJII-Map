const apiKey = "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjY0YmRhZjIyLWJjNmEtNGMwNC1iM2Y2LWE4YmYzMGUxY2MwMFwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjgxYzRlMjFiLWY0YWUtNGMwYy04NGNjLTQ2YmZkYzlhMzM2N1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI2Yzk2OTRhYS04Nzc5LTRmMTQtOThjNi1iYzhjN2Y3MjQ1ZTRcIn19IiwiaWF0IjoxNzI0MTc2MDQyfQ.UdczMPOQhkHP7Wx1YZezgU3PEN1gRbinZ8oSTGtArnsEKeYuuvAZNWoKkaRwomm1iMFRwls-3a0YDuHd6mEb2RNVm7khLQe4me3zLR8un8iymGswLPhHiq87vcrYXjYkmlSLr9ouIE_2wwQyHQowHDMMr4nkcUzYXO2RZ7cJuhDEGzB1Sd_NOUzknC5YMHCvE1Q36jHCApg4QbWAioWMwaYrvrxlbmp9gP40sP4NCzXQOLYEO7OGYAdmPqcri8PH8mmgKPmnakx3Se-pElMHnCChLTmTCoUtzvZLNacHjb3WyW7ipZOUAu2LkZY778PMla9U9Xmh2Xlv2npS_xXpWg";
const headers = {
  "Content-Type": "application/json",
  Authorization: apiKey,
};

function iconCollection() {
    return axios({
      method: "post",
      url: '"https://www.wixapis.com/wix-data/v2/collections"',
      headers,
      body: {
        id: "locations",
        displayName: "Locations",
        fields: [
          { key: "id", displayName: "id", type: "TEXT" },
          { key: '' }
        ],
        permissions: {
          insert: "ADMIN",
          update: "ADMIN",
          remove: "ADMIN",
          read: "ANYONE",
        },
      },
    });
  }
  

function locationCollection() {
  return axios({
    method: "post",
    url: '"https://www.wixapis.com/wix-data/v2/collections"',
    headers,
    body: {
      id: "locations",
      displayName: "Locations",
      fields: [
        { key: "id", displayName: "id", type: "TEXT" },
        { key: "lat", displayName: "Latitude", type: "NUMBER" },
        { key: "long", displayName: "Longitude", type: "NUMBER" },
        { key: "icon", displayName: "Icon", type: "TEXT" },
      ],
      permissions: {
        insert: "ADMIN",
        update: "ADMIN",
        remove: "ADMIN",
        read: "ANYONE",
      },
    },
  });
}
