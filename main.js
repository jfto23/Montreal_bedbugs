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

  function getArrayNeighbourhoods() {
    let neighborhoods = [];
    d3.csv("quartierreferencehabitation.csv").then( data => {
      for (let i=0;i<data.length;i++) {
        neighborhoods.push(data[i].

      }


    });

    return neighborhoods
  }

  function buildLayers(data) {
    let circle;
    let circles = [];

    getArrayNeighbourhoods();


    for (let j=2011; j<2020; j++) {
      for (let i=0; i<data.length; i++) {
        //main layers
        if (data[i].DATE_DECLARATION.startsWith(j.toString())) {
          circle = L.circleMarker([data[i].LATITUDE, data[i].LONGITUDE], {
            color: "cyan",
            fillColor: "cyan",
            opacity: 0,
            fillOpacity: 0.15,
            radius: 10,
          });
          circles.push(circle);
        }

        //neighborhoods layers

        
      }

      mainLayers.push(L.layerGroup(circles));
      circles = [];
    }
    //2019 main layer testing
    mymap.addLayer(mainLayers[8]);

  }



    /*
    for (let select of document.querySelectorAll("select")) {
      select.onchange = (e) => {
      }
    }
    */


  d3.csv("declarations-exterminations-punaises-de-lit.csv").then( data => buildLayers(data))
})();

