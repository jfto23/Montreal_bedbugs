(function() {
  let mymap;
  let mainLayers = [];
  let neigbourLayers = [];
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

    //2019 main layer testing
    mymap.addLayer(boroughLayers[5]);


  }



    /*
    for (let select of document.querySelectorAll("select")) {
      select.onchange = (e) => {
      }
    }
    */


  d3.csv("declarations-exterminations-punaises-de-lit.csv").then( data => buildLayers(data))
})();

