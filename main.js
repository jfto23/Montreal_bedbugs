(function() {
  let mymap;

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


  function drawCircles(data) {
    let circle;
    let currentYear;
    let overlayMaps= {};
    let circles = [];
    for (let j=2011; j<2020; j++) {
      for (let i=0; i<data.length; i++) {
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
      }

      currentYear = L.layerGroup(circles);
      overlayMaps[j.toString()] = currentYear;
      circles = [];
    }
    L.control.layers(overlayMaps).addTo(mymap);
    mymap.addLayer(currentYear);
  }

  d3.csv("declarations-exterminations-punaises-de-lit.csv").then( data => drawCircles(data,"2019"))
})();

