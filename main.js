const MainApp = (function() {
  let mymap;
  let mainLayers = [];
  let boroughLayers = [];
	let currentYear = new Date().getFullYear();
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

    const data = await d3.csv("./boroughs.csv");
    for (let i=0;i<data.length;i++) {
      boroughs.push({ NOM_ARROND: data[i].NOM_ARROND, LATITUDE: data[i].LATITUDE, LONGITUDE:data[i].LONGITUDE });
    }

    return boroughs
  }


  async function buildLayers(data) {

		let boroughCount = [];
		let boroughMarkers = [];
		let mainMarkers = [];

		for (let year=2011; year <= currentYear; year++) {
			mainMarkers.push([]);
			boroughCount.push({});
			boroughMarkers.push([]);
		}

		let boroughs = await getArrayBoroughs();
		for (let yearCount of boroughCount) {
			for (let borough of boroughs) {
				yearCount[borough.NOM_ARROND] = 0;
			}
		}

		for (let i=0; i<data.length;i++) {
			mainMarker = L.circleMarker([data[i].LATITUDE, data[i].LONGITUDE], {
				color: "cyan",
				fillColor: "cyan",
				opacity: 0,
				fillOpacity: 0.15,
				radius: 10,
			});

			let index = parseInt(data[i].DATE_DECLARATION.slice(0,4))-2011;
			mainMarkers[index].push(mainMarker)

			//borouhlayers
			boroughCount[index][data[i].NOM_ARROND] += 1;
		}

		for (let dict of boroughCount) {
			for (let borough in dict) {
				boroughs.forEach( element => {
					if (element.NOM_ARROND === borough) {
						let boroughMarker = L.circleMarker([element.LATITUDE, element.LONGITUDE], {
							color: "cyan",
							fillColor: "cyan",
							opacity: 0,
							fillOpacity: 0.5,
							radius: Math.sqrt(dict[borough])*5
						}).bindPopup(borough + ": " + dict[borough]);

						boroughMarkers[boroughCount.indexOf(dict)].push(boroughMarker);
					}

				});
			}
		}
		boroughMarkers.forEach( element => {
			boroughLayers.push(L.layerGroup(element));
		});

		mainMarkers.forEach( element => {
			mainLayers.push(L.layerGroup(element));

		});

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

	(function makeSelect() {

		for (let year=2011; year <= currentYear; year++) {
			let option = document.createElement("option");
			option.text = year;
			option.value = year;

			document.getElementById("year").appendChild(option)
		}
	})();

	d3.csv("./declarations-exterminations-punaises-de-lit.csv").then( data => buildLayers(data))

  return {
    changeLayer,
    toggleSideBar
  }
})();

