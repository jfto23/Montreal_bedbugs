const MainApp = (function() {
  let mymap;
  let mainLayers = [];
  let boroughLayers = [];

  // init map
  (function() {
    mymap = L.map('mapid')
    mymap.setView([45.5017,-73.5673],11.5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mymap);
  })();

  async function getArrayBoroughs() {
    let boroughs = [];

    const data = await d3.csv("boroughs.csv");
    for (let i=0;i<data.length;i++) {
      boroughs.push({ NOM_ARROND: data[i].NOM_ARROND, LATITUDE: data[i].LATITUDE, LONGITUDE:data[i].LONGITUDE, count: 0 });
    }

    return boroughs
  }

  async function buildLayers(data) {
    let mainMarker;
    let mainMarkers = [];

    let boroughMarker;
    let boroughMarkers =[];
    let boroughs = await getArrayBoroughs();

    for (let j=2011; j<2020; j++) {
      for (let i=0; i<data.length; i++) {
        //main layers
        if (data[i].DATE_DECLARATION.startsWith(j.toString())) {
          mainMarker = L.circleMarker([data[i].LATITUDE, data[i].LONGITUDE], {
            color: "cyan",
            fillColor: "cyan",
            opacity: 0,
            fillOpacity: 0.15,
            radius: 10,
          });
          mainMarkers.push(mainMarker);
        }

        //boroughs layers
        boroughs.forEach( borough => {
          if (data[i].NOM_ARROND === borough.NOM_ARROND && data[i].DATE_DECLARATION.startsWith(j.toString())) {
            borough.count += 1;
          }
        });

      }

      for (let borough of boroughs) {
        boroughMarker = L.circleMarker([borough.LATITUDE, borough.LONGITUDE], {
          color: "cyan",
          fillColor: "cyan",
          opacity: 0,
          fillOpacity: 0.5,
          radius: Math.sqrt(borough.count)*5
        }).bindPopup(borough.NOM_ARROND + ": " + borough.count);

        boroughMarkers.push(boroughMarker);
        borough.count = 0;
      }

      mainLayers.push(L.layerGroup(mainMarkers));
      mainMarkers = [];

      boroughLayers.push(L.layerGroup(boroughMarkers));
      boroughMarkers= [];
    }

    mymap.addLayer(mainLayers[0]);
  }

  function removeLayers() {

    boroughLayers.forEach((element) => {
      if (mymap.hasLayer(element)) {
        mymap.removeLayer(element)
      }
    });

    mainLayers.forEach((element) => {
      if (mymap.hasLayer(element)) {
        mymap.removeLayer(element)
      }
    });
  }

  function changeLayer() {
    removeLayers();

    let yearSelect = document.getElementById("year");
    let index = yearSelect.selectedIndex;

    let typeSelect = document.getElementById("type");
    let currentType = typeSelect.options[typeSelect.selectedIndex];

    if (currentType.value === "all") {
      mymap.addLayer(mainLayers[index])
    }
    else {
      mymap.addLayer(boroughLayers[index])
    }
  }

  function toggleSideBar() {
    let btn = document.querySelector("button")
    if (btn.textContent === "Hide") {
      document.querySelector(".container").style.gridTemplateColumns = "1fr"
      btn.innerHTML = "Show"
      mymap.invalidateSize();
    }
    else {
      document.querySelector(".container").style.gridTemplateColumns = "9fr 1fr"
      btn.innerHTML = "Hide"
      mymap.invalidateSize();
    }

  }


  d3.csv("declarations-exterminations-punaises-de-lit.csv").then( data => buildLayers(data))

  return {
    changeLayer,
    toggleSideBar
  }
})();

