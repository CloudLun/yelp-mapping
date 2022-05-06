let map = new L.map("map", { zoomControl: false }).setView([40.73, -73.9], 13);
let marker;
const popup = L.popup();
const markers = L.layerGroup().addTo(map);
const subwayLines = L.layerGroup().addTo(map);
const subwayStations = L.layerGroup().addTo(map);
const subwayStationsBuffer = L.layerGroup().addTo(map);
const bufferChoice = document.querySelector("#bufferChoice");

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{userName}/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    maxZoom: 15,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    userName: "cloudlun",
    id: "cl2eq8ceb000a15o06rah6zx5",
    accessToken:
      "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw",
  }
).addTo(map);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

d3.json("../Data/Subway Stations.geojson").then((stations) => {
  subway_stations = L.geoJSON(stations, {
    pointToLayer: createCircleMarker,
  });
  subwayStations.addLayer(subway_stations);

  let stationPositions;
  let Bufferedstation;
  let BufferedstationLayer;
  let toggle = false;

  stationPositions = stations.features.map((g) => {
    return g.geometry.coordinates;
  });

  d3.select("#bufferChoice").on("click", (choice) => {
    if (!toggle) {
      stationPositions.map((p) => {
        Bufferedstation = turf.buffer(turf.point(p), 0.3, {
          units: "miles",
        });
        BufferedstationLayer = L.geoJson(Bufferedstation);
        BufferedstationLayer.setStyle({
          fillColor: "#86bbd8",
          color: "#86bbd8",
          weight:1,
        });
        BufferedstationLayer.addTo(subwayStationsBuffer);
        BufferedstationLayer.bringToBack();
      });
    } else {
      subwayStationsBuffer.clearLayers(BufferedstationLayer);
      bufferChoice.checked = false;
    }
    toggle = !toggle;
  });
});

d3.json("../Data/Subway Lines.geojson").then((lines) => {
  subway_lines = L.geoJSON(lines, {
    // pane: "SUB",
    style: function (feature) {
      switch (feature.properties.rt_symbol) {
        case "1":
          return { color: "#BD0026", weight: 1 };
        case "2":
          return { color: "#BD0026", weight: 1 };
        case "3":
          return { color: "#BD0026", weight: 1 };
        case "4":
          return { color: "#008000", weight: 1 };
        case "5":
          return { color: "#008000", weight: 1 };
        case "6":
          return { color: "#008000", weight: 1 };
        case "7":
          return { color: "#710B37", weight: 1 };
        case "A":
          return { color: "#0057E7", weight: 1 };
        case "C":
          return { color: "#0057E7", weight: 1 };
        case "E":
          return { color: "#0057E7", weight: 1 };
        case "D":
          return { color: "#F37735", weight: 1 };
        case "B":
          return { color: "#F37735", weight: 1 };
        case "F":
          return { color: "#F37735", weight: 1 };
        case "M":
          return { color: "#F37735", weight: 1 };
        case "N":
          return { color: "#FFDD00", weight: 1 };
        case "Q":
          return { color: "#FFDD00", weight: 1 };
        case "R":
          return { color: "#FFDD00", weight: 1 };
        case "W":
          return { color: "#FFDD00", weight: 1 };
        case "L":
          return { color: "#808080", weight: 1 };
        case "S":
          return { color: "#808080", weight: 1 };
        case "G":
          return { color: "#6CBE45", weight: 1 };
        case "J":
          return { color: "#8D5524", weight: 1 };
        case "Z":
          return { color: "#8D5524", weight: 1 };
      }
    },
  });
  subwayLines.addLayer(subway_lines);
});

// Yelp Restaurants Markers
function addMarker(markerData) {
  marker = L.circleMarker([markerData["latitude"], markerData["longitude"]], {
    color: markerColor(markerData["price"]),
    weight: 2,
    fillOpacity: 0.8,
  });
  marker.setRadius(4);
  marker.bringToFront();
  markers.addLayer(marker);
  // marker.bindPopup(popup).openPopup()
}
function updateData(data) {
  markers.clearLayers();
  for (let i = 0; i < data.length; i++) {
    addMarker(data[i]);
  }
}
function markerColor(p) {
  return p === "$"
    ? "#ffd2aa"
    : p === "$$"
    ? "#ffbf69"
    : p === "$$$"
    ? "#ff9843"
    : "#e56903";
}

// Subway Stations Markers
function createCircleMarker(feature, latlng) {
  let options = {
    radius: 2.5,
    fillColor: "#cccccc",
    color: "#cccccc",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };
  return L.circleMarker(latlng, options);
}

d3.csv("../Data/0417_Yelp_New York.csv").then((data) => {
  data.forEach((d) => {
    d["latitude"] = +d["latitude"];
    d["longitude"] = +d["longitude"];
    d["rating"] = +d["rating"];
  });

  for (let i = 0; i < data.length; i++) {
    addMarker(data[i]);
  }

  let ratings = data
    .map((d) => {
      return d.rating;
    })
    .sort()
    .filter(function (v, i, arr) {
      return i === 0 || arr[i - 1] != v;
    });

  d3.select("#selectRating")
    .selectAll("option")
    .data(ratings)
    .enter()
    .append("option")
    .attr("value", (d) => {
      return d;
    })
    .text((d) => {
      return d;
    });

  let currentRatingsData = data;
  let currentPriceData = data;
  let currentData = data;
  let selectionValue;
  let clickValue;
  let originalRatings = data.map((d) => d.rating);
  let originalPrice = data.map((d) => d.price);
  let filteredRatings = currentRatingsData.map((d) => d.rating);
  let filteredPrice = currentPriceData.map((d) => d.price);

  function filterHandler(data, cate, value) {
    if (value !== "All") {
      currentData = data.filter((d) => {
        return d[cate] == value;
      });
    } else {
      currentData = data;
    }
  }

  d3.select("#selectRating").on("change", function () {
    selectionValue = this.value;
    // console.log(selectionValue);
    if (
      filteredRatings.length === originalRatings.length &&
      filteredPrice.length === originalPrice.length
    ) {
      // console.log("a");
      filterHandler(currentRatingsData, "rating", selectionValue);
      currentRatingsData = currentData;
      filteredRatings = currentRatingsData.map((d) => d.rating);
      return updateData(currentData);
    }
    if (
      filteredRatings.length !== originalRatings.length &&
      filteredPrice.length === originalPrice.length
    ) {
      // console.log("b");
      filterHandler(data, "rating", selectionValue);
      currentRatingsData = currentData;
      filteredRatings = currentRatingsData.map((d) => d.rating);
      return updateData(currentData);
    }
    if (
      filteredRatings.length === originalRatings.length &&
      filteredPrice.length !== originalPrice.length
    ) {
      // console.log("c");
      filterHandler(currentPriceData, "rating", selectionValue);
      currentRatingsData = currentData;
      filteredRatings = currentRatingsData.map((d) => d.rating);
      return updateData(currentData);
    }
    if (
      filteredRatings.length !== originalRatings.length &&
      filteredPrice.length !== originalPrice.length
    ) {
      // console.log("d");
      filterHandler(data, "rating", selectionValue);
      filterHandler(currentData, "price", clickValue);
      currentRatingsData = currentData;
      filteredRatings = currentRatingsData.map((d) => d.rating);
      return updateData(currentData);
    }
  });

  d3.selectAll("#contactChoice").on("click", function () {
    clickValue = this.value;
    if (
      filteredRatings.length === originalRatings.length &&
      filteredPrice.length === originalPrice.length
    ) {
      // console.log("e");
      filterHandler(currentPriceData, "price", clickValue);
      currentPriceData = currentData;
      filteredPrice = currentPriceData.map((d) => d.price);
      return updateData(currentData);
    }
    if (
      filteredRatings.length !== originalRatings.length &&
      filteredPrice.length === originalPrice.length
    ) {
      // console.log("f");
      filterHandler(currentRatingsData, "price", clickValue);
      currentPriceData = currentData;
      filteredPrice = currentPriceData.map((d) => d.price);
      return updateData(currentData);
    }
    if (
      filteredRatings.length === originalRatings.length &&
      filteredPrice.length !== originalPrice.length
    ) {
      // console.log("g");
      filterHandler(data, "price", clickValue);
      currentPriceData = currentData;
      filteredPrice = currentPriceData.map((d) => d.price);
      return updateData(currentData);
    }
    if (
      filteredRatings.length !== originalRatings.length &&
      filteredPrice.length !== originalPrice.length
    ) {
      // console.log("h");
      filterHandler(data, "rating", selectionValue);
      filterHandler(currentData, "price", clickValue);
      currentPriceData = currentData;
      filteredPrice = currentPriceData.map((d) => d.price);
      return updateData(currentData);
    }
    updateData(currentData);
  });
});
