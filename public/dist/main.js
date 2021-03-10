/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dawautil= __webpack_require__(1)
  , URLSearchParams = __webpack_require__(2)  
  , dawaois= __webpack_require__(7);

proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs'
  ]
]);

// var maxBounds= [
//   [57.751949, 15.193240],
//   [54.559132, 8.074720]
// ];

var maxBounds= [
  [58.4744, 17.5575],
  [53.015, 2.47833]
];

exports.maxBounds= maxBounds;

exports.beregnCenter= function() {
  var x= (maxBounds[0][0]-maxBounds[1][0])/2+maxBounds[1][0]+0.5,
      y= (maxBounds[0][1]-maxBounds[1][1])/2+maxBounds[1][1];
  return L.latLng(x,y);
};

exports.viskort = function(id,ticket,options) {
	var crs = new L.Proj.CRS('EPSG:25832',
    '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', 
    {
        resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1]
    }
  );

  if (typeof options === 'undefined') {
    options= {};
  }
  options.crs= crs;
  options.minZoom= 2;
  options.maxZoom= 14;
  options.maxBounds= maxBounds;

  var map = new L.Map(id, options);

  function danKort(service,layer,styles,transparent) {
		return L.tileLayer.wms('https://api.dataforsyningen.dk/service', 
			{
				format: 'image/png',
				maxZoom: 14,
				minZoom: 2,
				ticket: ticket,
				servicename: service,
	  		attribution: 'Data</a> fra <a href="https://api.dataforsyningen.dk">DAWA</a> | Map data &copy;  <a href="https://sdfe.dk">SDFE</a>',
	  		layers: layer,
	  		styles: styles,
	  		transparent: transparent,
	  		tiled: false
	 		}
 		);
	}

 	var skaermkort= danKort('topo_skaermkort', 'dtk_skaermkort', 'default', false)
    , skaermkortdaempet= danKort('topo_skaermkort', 'dtk_skaermkort_daempet', 'default', false)
    //, skaermkortgraa= danKort('topo_skaermkort', 'dtk_skaermkort_graa', 'default', false)
 		, ortofoto= danKort('orto_foraar', 'orto_foraar', 'default', false)
 	//	, quickortofoto= danKort('orto_foraar_temp', 'quickorto_2017_10cm', 'default', false)
    , historisk1842til1899= danKort('topo20_hoeje_maalebordsblade', 'dtk_hoeje_maalebordsblade', 'default', false)
    , historisk1928til1940= danKort('topo20_lave_maalebordsblade', 'dtk_lave_maalebordsblade', 'default', false)
 		, matrikelkort= danKort('mat', 'Centroide,MatrikelSkel,OptagetVej','sorte_centroider,sorte_skel,default','true')
 		, postnrkort= danKort('dagi', 'postdistrikt', 'default','true')
 		, kommunekort= danKort('dagi', 'kommune', 'default','true');

  var adressekort = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4_wms/wms', {
      transparent: true,
      layers: 'adgangsadresser',
      format: 'image/png',
      continuousWorld: true
    });
  var vejpunktkort = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4_wms/wms', {
      transparent: true,
      layers: 'vejpunkter',
      format: 'image/png',
      continuousWorld: true
    });
  var vejpunktlinjekort = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4_wms/wms', {
      transparent: true,
      layers: 'vejpunktlinjer',
      format: 'image/png',
      continuousWorld: true
    }); 
  var vejnavnelinjer = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4_wms/wms', {
      transparent: true,
      layers: 'vejnavnelinjer',
      format: 'image/png',
      continuousWorld: true
    });
  var vejnavneomraader = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4_wms/wms', {
      transparent: true,
      layers: 'vejnavneomraader',
      format: 'image/png',
      continuousWorld: true
    });
  var vejtilslutningspunkter = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4_wms/wms', {
      transparent: true,
      layers: 'vejtilslutningspunkter',
      format: 'image/png',
      continuousWorld: true
    });

 	 var baselayers = {
    "Skærmkort": skaermkort,
    "Skærmkort - dæmpet": skaermkortdaempet,
   // "Skærmkort - gråt": skaermkortgraa,
    "Ortofoto": ortofoto,
   // "Quick ortofoto": quickortofoto,
    "Historisk 1842-1899": historisk1842til1899,
    "Historisk 1928-1940": historisk1928til1940
  };

  var overlays = {
   	"Matrikler": matrikelkort,
   	"Kommuner": kommunekort,
   	"Postnumre": postnrkort,
    "Adresser": adressekort,
    "Vejpunkter": vejpunktkort,
    "Vejpunktlinjer": vejpunktlinjekort,
    "Vejnavnelinjer": vejnavnelinjer,
    "Vejnavneområder": vejnavneomraader,
    "Vejtilslutningspunkter": vejtilslutningspunkter
  };


  if (typeof options.baselayer === 'undefined') {
    options.baselayer= "Skærmkort";
  }
  baselayers[options.baselayer].addTo(map);


  L.control.layers(baselayers, overlays, {position: 'bottomleft'}).addTo(map);
  //L.control.search().addTo(map);

  map.on('baselayerchange', function (e) {
    if (e.name === 'Skærmkort' ||
    		e.name === "Skærmkort - dæmpet" ||
        e.name === "Historisk 1842-1899"||
        e.name === "Historisk 1928-1940") {
        matrikelkort.setParams({
            styles: 'sorte_centroider,sorte_skel,default'
        });
        postnrkort.setParams({
            styles: 'default'
        });
        kommunekort.setParams({
            styles: 'default'
        });
    } else if (e.name === 'Flyfoto') {
        matrikelkort.setParams({
            styles: 'gule_centroider,gule_skel,Gul_OptagetVej,default'
        });
        postnrkort.setParams({
            styles: 'yellow'
        });
        kommunekort.setParams({
            styles: 'yellow'
        });
    }
  });

	map.fitBounds(maxBounds);
  //map.panTo(new L.LatLng(40.737, -73.923));

	return map;
};

exports.etrs89towgs84= function(x,y) {
	  return proj4('EPSG:25832','EPSG:4326', {x:x, y:y});  
};

exports.geojsontowgs84= function(geojson) {
  return L.Proj.geoJson(geojson);
};


exports.nærmesteAdgangsadresse= function(getMap) {
  return function(e) {
    fetch(dawautil.danUrl("https://api.dataforsyningen.dk/adgangsadresser/reverse",{x: e.latlng.lng, y: e.latlng.lat, medtagugyldige: true}))
    .catch(function (error) {
      alert(error.message);
    })
    .then(function(response) {
      if (response.status >=400 && response.status <= 499) {
        response.json().then(function (object) {
          alert(object.type + ': ' + object.title);
        });
      }
      else if (response.status >= 200 && response.status <=299 ){
        return response.json();
      }
    }) 
    .then( function ( adgangsadresse ) { 

      var x= adgangsadresse.adgangspunkt.koordinater[1]
        , y= adgangsadresse.adgangspunkt.koordinater[0];
      var marker= L.circleMarker(L.latLng(x, y), {color: 'red', fillColor: 'red', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(getMap());//defaultpointstyle);
      var popup= marker.bindPopup(L.popup().setContent("<a href='https://info.dataforsyningen.dk/adgangsadresser?id="+adgangsadresse.id+"'>" + dawautil.formatAdgangsadresse(adgangsadresse) + "</a>"),{autoPan: true});
      if (adgangsadresse.vejpunkt) {
        var vx= adgangsadresse.vejpunkt.koordinater[1]
          , vy= adgangsadresse.vejpunkt.koordinater[0];
        var vpmarker= L.circleMarker(L.latLng(vx, vy), {color: 'blue', fillColor: 'blue', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(getMap());//defaultpointstyle);
        vpmarker.bindPopup(L.popup().setContent("<a href='https://info.dataforsyningen.dk/adgangsadresser?id="+adgangsadresse.id+"'>" + dawautil.formatAdgangsadresse(adgangsadresse) + "</a>"),{autoPan: true});
      }

      getMap().setView(L.latLng(x, y),12);
      popup.openPopup();

    });
  };
};

exports.nærmesteBygning= function(getMap) {
  return function(e) {
    var params = new URLSearchParams();
    params.set('format','json');
    params.set('x', e.latlng.lng);
    params.set('y', e.latlng.lat);
    params.set('medtagugyldige', true);
    var url= '/oisbygninger?'+params.toString();
    fetch(url)
    .catch(function (error) {
      alert(error.message);
    })
    .then(function(response) {
      if (response.status >=400 && response.status <= 499) {
        response.text().then(function (text) {
          alert(text);
        });
      }
      else if (response.status >= 200 && response.status <=299 ){
        return response.json();
      }
    }) 
    .then( function ( bygninger ) {
      var bygning= bygninger[0];
      var punkt=  L.latLng(bygning.bygningspunkt.koordinater[1], bygning.bygningspunkt.koordinater[0]);
      var marker= L.circleMarker(punkt, {color: 'blue', fillColor: 'blue', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(getMap());//defaultpointstyle);
      var popup= marker.bindPopup(L.popup().setContent("<a href='" + url.replace('api','info') + "'>" + dawaois.anvendelseskoder[bygning.BYG_ANVEND_KODE] + " fra " + bygning.OPFOERELSE_AAR + "</a>"),{autoPan: true});
      
      getMap().setView(punkt,12);
      popup.openPopup();
    //  map.fitBounds(geojsonlayer.getBounds());
    });
  };
};

exports.nærmesteVejstykke= function(getMap) {
  return function(e) {
    fetch(dawautil.danUrl("https://api.dataforsyningen.dk/vejstykker/reverse",{format: 'geojson', x: e.latlng.lng, y: e.latlng.lat}))
    .catch(function (error) {
      alert(error.message);
    })
    .then(function(response) {
      if (response.status >=400 && response.status <= 499) {
        response.json().then(function (object) {
          alert(object.type + ': ' + object.title);
        });
      }
      else if (response.status >= 200 && response.status <=299 ){
        return response.json();
      }
    }) 
    .then( function ( vejstykke ) { 
      var layer= L.geoJSON(vejstykke).addTo(getMap());
      var popup= layer.bindPopup("<a href='https://info.dataforsyningen.dk/vejstykker?kode="+vejstykke.properties.kode+"&kommunekode="+vejstykke.properties.kommunekode+"'>" + vejstykke.properties.navn + " (" + vejstykke.properties.kode + ")" + "</a>");
      popup.openPopup();
    });
  };
};

exports.nærmesteNavngivneVej= function(getMap) {
  return function(e) {
    fetch(dawautil.danUrl("https://api.dataforsyningen.dk/navngivneveje",{format: 'geojson', geometri: 'begge', x: e.latlng.lng, y: e.latlng.lat}))
    .catch(function (error) {
      alert(error.message);
    })
    .then(function(response) {
      if (response.status >=400 && response.status <= 499) {
        response.json().then(function (object) {
          alert(object.type + ': ' + object.title);
        });
      }
      else if (response.status >= 200 && response.status <=299 ){
        return response.json();
      }
    }) 
    .then( function ( navngivenveje ) {       
      var navngivenvej= navngivenveje.features[0];
      var layer= L.geoJSON(navngivenvej).addTo(getMap());
      var popup= layer.bindPopup("<a href='https://info.dataforsyningen.dk/navngivneveje?id="+navngivenvej.properties.id+"'>" + navngivenvej.properties.navn + "</a>");
      popup.openPopup();
    });
  };
};

exports.hvor= function(getMap) {
  return function(e) {
    var antal= 0;
    var promises= [];

    // jordstykke
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/jordstykker/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatjordstykke;
    antal++;

    // sogn
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/sogne/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Sogn", 'sogne');
    antal++;

    // postnummer
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/postnumre/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatpostnummer;
    antal++;

    // kommune
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/kommuner/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Kommune", 'kommuner');
    antal++;

    // region
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/regioner/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Region",'regioner');
    antal++;

    // retskreds
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/retskredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Retskreds", 'retskredse');
    antal++;

    // politikreds
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/politikredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Politikreds", 'politikredse');
    antal++;

    // opstillingskreds
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/opstillingskredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Opstillingskreds", 'opstillingskredse');
    antal++;

    // storkreds
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/storkredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatstorkreds;
    antal++;

    // stednavne
    promises.push(fetch(dawautil.danUrl("https://api.dataforsyningen.dk/stednavne",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatstednavne;
    antal++;

    Promise.all(promises) 
    .catch(function (error) {
      alert(error.message);
    })
    .then(function(responses) {      
      for (var i= responses.length-1; i>=0; i--) {
        if (responses[i].ok) {
          responses[i]= responses[i].json();
        }
        else {
          responses.splice(i, 1);
          promises.splice(i, 1);
        }
      }
      return Promise.all(responses);
    })
    .then(function(data) {
      if (data.length === 0) return;
      let tekst= '<small><ul>';
      for(let i=0; i<data.length; i++) {
        tekst= tekst + promises[i].format(data[i]);
      } 
      tekst= tekst + "</ul></small>";     
      var punkt=  e.latlng;
      var popup = L.popup()
      .setLatLng(punkt)
      .setContent(tekst)
      .openOn(getMap());
    });
  };
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatpostnummer(data) {
  return "<li>Postnummer: <a href='https://info.dataforsyningen.dk/postnumre/"+data.nr+"'>" +  data.nr + " " + data.navn + "</a></li>";
}

function formatstorkreds(data) {
  return "<li>Storkreds: <a href='https://info.dataforsyningen.dk/storkredse/"+data.nummer+"'>" + data.navn + " (" + data.nummer + ")" + "</a></li>";
}

function formatjordstykke(data) {
  return "<li>Jordstykke: <a href='https://info.dataforsyningen.dk/jordstykker/"+data.ejerlav.kode+"/"+data.matrikelnr+"'>" + (data.ejerlav.navn?data.ejerlav.navn+" ":"") + data.ejerlav.kode + " " +data.matrikelnr + "</a></li>";
}

function formatstednavne(data) {
  let tekst= '';
  for (var i= 0; i<data.length;i++) {
    tekst= tekst + "<li>" + capitalizeFirstLetter(data[i].undertype)+": <a href='https://info.dataforsyningen.dk/stednavne/"+data[i].id+"'>" + data[i].navn + "</a></li>";
  }
  return tekst;
}

function formatdata(titel,id) {
  return function (data) { return "<li>" + titel + ": <a href='https://info.dataforsyningen.dk/"+id+"/"+data.kode+"'>" + data.navn + " (" + data.kode + ")" + "</a></li>";};
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var URLSearchParams = __webpack_require__(2);

exports.corssupported= function () {
  return "withCredentials" in (new XMLHttpRequest());
}

function formatAa(vejnavn,husnr,supplerendebynavn,postnr,postnrnavn,enlinje) {
	let separator= (enlinje || typeof enlinje != 'undefined')?", ":"<br/>";
	supplerendebynavn= supplerendebynavn?separator + supplerendebynavn:"";
	return vejnavn + " " + husnr + supplerendebynavn + separator + postnr + " " + postnrnavn
}

exports.formatAdgangsadresse= function (record, enlinje) {
	if (record.vejstykke) {
		return formatAa(record.vejstykke.navn, record.husnr, record.supplerendebynavn, record.postnummer.nr, record.postnummer.navn, enlinje);
	}
	else {
		return formatAa(record.vejnavn, record.husnr, record.supplerendebynavn, record.postnr, record.postnrnavn, enlinje);
	}	
}

exports.formatAdresse= function (mini, enlinje) {
	let separator= (enlinje || typeof enlinje != 'undefined')?", ":"<br/>";
	let etagedør= (mini.etage?", "+mini.etage+".":"") + (mini.dør?" "+mini.dør:"");

	let supplerendebynavn= mini.supplerendebynavn?separator + mini.supplerendebynavn:"";
	return mini.vejnavn + " " + mini.husnr + etagedør + supplerendebynavn + separator + mini.postnr + " " + mini.postnrnavn
}

exports.danUrl= function (path, query) { 
  var params = new URLSearchParams();
  Object.keys(query).forEach(function(key) {params.set(key, query[key])});
  return path + "?" + params.toString();
}

exports.getQueryVariable= function (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0; i<vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
Copyright (C) 2015 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


function URLSearchParams(query) {
  var
    index, key, value,
    pairs, i, length,
    dict = Object.create(null)
  ;
  this[secret] = dict;
  if (!query) return;
  if (typeof query === 'string') {
    if (query.charAt(0) === '?') {
      query = query.slice(1);
    }
    for (
      pairs = query.split('&'),
      i = 0,
      length = pairs.length; i < length; i++
    ) {
      value = pairs[i];
      index = value.indexOf('=');
      if (-1 < index) {
        appendTo(
          dict,
          decode(value.slice(0, index)),
          decode(value.slice(index + 1))
        );
      } else if (value.length){
        appendTo(
          dict,
          decode(value),
          ''
        );
      }
    }
  } else {
    if (isArray(query)) {
      for (
        i = 0,
        length = query.length; i < length; i++
      ) {
        value = query[i];
        appendTo(dict, value[0], value[1]);
      }
    } else {
      for (key in query) {
         appendTo(dict, key, query[key]);
      }
    }
  }
}

var
  isArray = Array.isArray,
  URLSearchParamsProto = URLSearchParams.prototype,
  find = /[!'\(\)~]|%20|%00/g,
  plus = /\+/g,
  replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  },
  replacer = function (match) {
    return replace[match];
  },
  iterable = isIterable(),
  secret = '__URLSearchParams__:' + Math.random()
;

function appendTo(dict, name, value) {
  if (name in dict) {
    dict[name].push('' + value);
  } else {
    dict[name] = isArray(value) ? value : ['' + value];
  }
}

function decode(str) {
  return decodeURIComponent(str.replace(plus, ' '));
}

function encode(str) {
  return encodeURIComponent(str).replace(find, replacer);
}

function isIterable() {
  try {
    return !!Symbol.iterator;
  } catch(error) {
    return false;
  }
}

URLSearchParamsProto.append = function append(name, value) {
  appendTo(this[secret], name, value);
};

URLSearchParamsProto.delete = function del(name) {
  delete this[secret][name];
};

URLSearchParamsProto.get = function get(name) {
  var dict = this[secret];
  return name in dict ? dict[name][0] : null;
};

URLSearchParamsProto.getAll = function getAll(name) {
  var dict = this[secret];
  return name in dict ? dict[name].slice(0) : [];
};

URLSearchParamsProto.has = function has(name) {
  return name in this[secret];
};

URLSearchParamsProto.set = function set(name, value) {
  this[secret][name] = ['' + value];
};

URLSearchParamsProto.forEach = function forEach(callback, thisArg) {
  var dict = this[secret];
  Object.getOwnPropertyNames(dict).forEach(function(name) {
    dict[name].forEach(function(value) {
      callback.call(thisArg, value, name, this);
    }, this);
  }, this);
};

URLSearchParamsProto.keys = function keys() {
  var items = [];
  this.forEach(function(value, name) { items.push(name); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

URLSearchParamsProto.values = function values() {
  var items = [];
  this.forEach(function(value) { items.push(value); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

URLSearchParamsProto.entries = function entries() {
  var items = [];
  this.forEach(function(value, name) { items.push([name, value]); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

if (iterable) {
  URLSearchParamsProto[Symbol.iterator] = URLSearchParamsProto.entries;
}

/*
URLSearchParamsProto.toBody = function() {
  return new Blob(
    [this.toString()],
    {type: 'application/x-www-form-urlencoded'}
  );
};
*/

URLSearchParamsProto.toJSON = function toJSON() {
  return {};
};

URLSearchParamsProto.toString = function toString() {
  var dict = this[secret], query = [], i, key, name, value;
  for (key in dict) {
    name = encode(key);
    for (
      i = 0,
      value = dict[key];
      i < value.length; i++
    ) {
      query.push(name + '=' + encode(value[i]));
    }
  }
  return query.join('&');
};

module.exports = global.URLSearchParams || URLSearchParams;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var required = __webpack_require__(8)
  , qs = __webpack_require__(9)
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var location = global && global.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.qs = qs;

module.exports = Url;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(10);
var objectAssign = __webpack_require__(11);
var decodeComponent = __webpack_require__(12);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

function extract(str) {
	var queryStart = str.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return str.slice(queryStart + 1);
}

function parse(str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^[?#&]/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeComponent(val);

		formatter(decodeComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	if (opts.sort === false) {
		opts.sort = function () {};
	}

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort(opts.sort).map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

exports.parseUrl = function (str, opts) {
	return {
		url: str.split('?')[0] || '',
		query: parse(extract(str), opts)
	};
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var kort= __webpack_require__(0)
    , URL = __webpack_require__(4)
    , queryString = __webpack_require__(5)
    , vis= __webpack_require__(13);

function main() { 
  
  var options= {
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [
    {
      text: 'Adgangsadresse?',
      callback: kort.nærmesteAdgangsadresse(vis.getMap)
    },
    {
      text: 'Vej?',
      callback: kort.nærmesteNavngivneVej(vis.getMap)
    },
    {
      text: 'Hvor?',
      callback: kort.hvor(vis.getMap)
    }
    ]
  };

  let url= new URL(window.location.href);
  let query= queryString.parse(url.query);
  let korttype= query.kort;
  if (korttype) {
    options.baselayer= korttype;
  }

  fetch('/getticket').then(function (response) {
    response.text().then(function (ticket) {      
      vis.setMap(kort.viskort('map', ticket, options));
      var center= kort.beregnCenter();
      vis.getMap().setView(center,2);
      vis.visData(url);
    });
  });  
}

main();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anvendelseskoder= {};
function initanvendelseskoder() {
anvendelseskoder[110]= "Stuehus til landbrugsejendom";
anvendelseskoder[120]= "Fritliggende eenfamilieshus (parcelhus)";
anvendelseskoder[130]= "Række-, kæde-, eller dobbelthus (lodret adskillelse mellem enhederne)";
anvendelseskoder[140]= "Etageboligbebyggelse (flerfamiliehus, herunder to-familiehus (vandret adskillelse mellem enhederne)";
anvendelseskoder[150]= "Kollegium";
anvendelseskoder[160]= "Døgninstitution (plejehjem, alderdomshjem, børne- eller ungdomshjem)";
anvendelseskoder[190]= "Anden bygning til helårsbeboelse";
anvendelseskoder[210]= "Bygning til erhvervsmæssig produktion vedrørende landbrug, gartneri, råstofudvinding o. lign";
anvendelseskoder[220]= "Bygning til erhvervsmæssig produktion vedrørende industri, håndværk m.v. (fabrik, værksted o. lign.)";
anvendelseskoder[230]= "El-, gas-, vand- eller varmeværk, forbrændingsanstalt m.v.";
anvendelseskoder[290]= "Anden bygning til landbrug, industri etc.";
anvendelseskoder[310]= "Transport- og garageanlæg (fragtmandshal, lufthavnsbygning, banegårdsbygning, parkeringshus). Garage med plads til et eller to køretøjer registreres med anvendelseskode 910";
anvendelseskoder[320]= "Bygning til kontor, handel, lager, herunder offentlig administration";
anvendelseskoder[330]= "Bygning til hotel, restaurant, vaskeri, frisør og anden servicevirksomhed";
anvendelseskoder[390]= "Anden bygning til transport, handel etc.";
anvendelseskoder[410]= "Bygning til biograf, teater, erhvervsmæssig udstilling, bibliotek, museum, kirke o. lign.";
anvendelseskoder[420]= "Bygning til undervisning og forskning (skole, gymnasium, forskningslaboratorium o. lign.)";
anvendelseskoder[430]= "Bygning til hospital, sygehjem, fødeklinik o. lign.";
anvendelseskoder[440]= "Bygning til daginstitution";
anvendelseskoder[490]= "Bygning til anden institution, herunder kaserne, fængsel o. lign.";
anvendelseskoder[510]= "Sommerhus";
anvendelseskoder[520]= "Bygning til ferieformål m.v., bortset fra sommerhus (feriekoloni, vandrehjem o. lign.)";
anvendelseskoder[530]= "Bygning i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.)";
anvendelseskoder[540]= "Kolonihavehus";
anvendelseskoder[590]= "Anden bygning til fritidsformål";
anvendelseskoder[910]= "Garage med plads til et eller to køretøjer";
anvendelseskoder[920]= "Carport";
anvendelseskoder[930]= "Udhus";
}
initanvendelseskoder();
exports.anvendelseskoder= anvendelseskoder;


var klassifikationskoder= {};
function initklassifikationskoder() {
klassifikationskoder[1110]= "Tank (Produkt på væskeform)";
klassifikationskoder[1120]= "Silo (Produkt på fast form)";
klassifikationskoder[1130]= "Gasbeholder (Produkt på gasform)";
klassifikationskoder[1140]= "Affaldsbeholder";
klassifikationskoder[1210]= "Vindmølle (elproducerende)";
klassifikationskoder[1220]= "Slanger til jordvarme";
klassifikationskoder[1230]= "Solvarme-/ solcelleanlæg";
klassifikationskoder[1240]= "Nødstrømsforsyningsanlæg";
klassifikationskoder[1250]= "Transformerstation";
klassifikationskoder[1260]= "Elskab";
klassifikationskoder[1265]= "Naturgasfyr";
klassifikationskoder[1270]= "Andet energiproducerende eller - distribuerende anlæg";
klassifikationskoder[1310]= "Vandtårn";
klassifikationskoder[1320]= "Pumpestation";
klassifikationskoder[1330]= "Swimmingpool";
klassifikationskoder[1340]= "Private rensningsanlæg f.eks. pileanlæg, nedsivningsanlæg";
klassifikationskoder[1350]= "Offentlige rensningsanlæg";
klassifikationskoder[1360]= "Regnvandsanlæg";
klassifikationskoder[1905]= "Legeplads";
klassifikationskoder[1910]= "Teknikhus";
klassifikationskoder[1915]= "Døgnpostboks";
klassifikationskoder[1920]= "Køleanlæg (herunder aircondition)";
klassifikationskoder[1925]= "Kunstværk (springvand, mindesmærker m.v.)";
klassifikationskoder[1930]= "Sirene / mast med sirene";
klassifikationskoder[1935]= "Skilt";
klassifikationskoder[1940]= "Antenne / mast fx tv, radio- og telekommunikation";
klassifikationskoder[1945]= "Dambrug";
klassifikationskoder[1950]= "Møddingsanlæg";
klassifikationskoder[1955]= "Andet teknisk anlæg";
}
initklassifikationskoder();
exports.klassifikationskoder= klassifikationskoder;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    if (key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(value));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var kort= __webpack_require__(0)
    , util = __webpack_require__(1)
    , URL = __webpack_require__(4)
    , queryString = __webpack_require__(5)
    , bbr= __webpack_require__(14);

var map= null;

exports.setMap= function (m) {
  map= m;
}

exports.getMap= function () {
  return map;
}


function getRessource(url) {
  url= new URL(url);
  let arr= url.pathname.split('/');
  let ressource= arr[1].toLowerCase();
  console.log(arr);
  console.log(ressource);
  if (ressource === 'bbr') {
    ressource= ressource + '/' + arr[2].toLowerCase();
  }
  console.log(ressource);
  return ressource;
}

exports.visData= function(url) {

  if (url.hostname === 'localhost') {
    url.set('host','vis.dataforsyningen.dk:80'); 
  }

  let query= queryString.parse(url.query);

  let overskrift= query.overskrift;
  let vispopup= query.vispopup;

  let host= query.host;
  if (host) {
    url.set('host',host);
  } 

  let miljø= query.m;
  if (!miljø) miljø= 'dawa';
  //url.host= url.host.replace('vis',miljø);
  url.host = 'api.dataforsyningen.dk';
  let ressource= getRessource(url);

  query.format= 'geojson';
  if (ressource === 'navngivneveje') query.geometri= 'begge'; 
  if (nestet(ressource)) {
    query.struktur= 'nestet';
  }
  else {
    delete query.struktur;
  }
  url.set('query',queryString.stringify(query));

  let urltext= url.toString();

  fetch(urltext).then( function(response) {
    response.json().then( function ( data ) {
      if (data.type === "FeatureCollection" && data.features.length === 0) return;
      let style=  getDefaultStyle(ressource, false);
      var geojsonlayer= L.geoJson(data, {style: style, onEachFeature: eachFeature(ressource,overskrift,vispopup), pointToLayer: pointToLayer}); 
      geojsonlayer.addTo(map);
      map.fitBounds(geojsonlayer.getBounds());
       
      var zoom= map.getZoom();
      if (zoom >= 13) {
        map.setZoom(11);
      }
    });
  });
}

exports.visLag= function(lag) {

  let svar= [];
  for (var i= 0; i<lag.length; i++) {

    let ressource= lag[i].ressource;
    if (!map.getPane(ressource)) {
      map.createPane(ressource);
      map.getPane(ressource).style.zIndex= getzindex(ressource);
    }
    let url= new URL('https://vis.dataforsyningen.dk/'+ressource);

    let query= lag[i].parametre;

    let overskrift= query.overskrift;
    let vispopup= query.vispopup;

    let host= query.host;
    if (host) {
      url.set('host',host);
    } 

    let miljø= query.m;
    if (!miljø) miljø= 'dawa';
    //url.host= url.host.replace('vis',miljø);
	url.host = 'api.dataforsyningen.dk';
    let arr= url.pathname.split('/');

    query.format= 'geojson';
    if (ressource === 'navngivneveje') query.geometri= 'begge';
    query.struktur= 'nestet';
    url.set('query',queryString.stringify(query));

    let urltext= url.toString();

    svar.push(fetch(urltext));
  }

  Promise.all(svar).then( function(responses) {
    for (let i= 0; i<responses.length; i++) {
      responses[i]= responses[i].json();
    }
    Promise.all(responses).then( function ( data ) {
      let layers= [];
      for (let j= 0; j<data.length; j++) {
        if (data[j].type === "FeatureCollection" && data[j].features.length === 0) return;
        let style=  getDefaultStyle(lag[j].ressource, true);
        var geojsonlayer= L.geoJson(data[j], {style: style, pane: lag[j].ressource, onEachFeature: eachFeature(lag[j].ressource,lag[j].parametre.overskrift,lag[j].parametre.vispopup), pointToLayer: pointToLayer});
        geojsonlayer.addTo(map);
        layers.push(geojsonlayer);
      };

      map.fitBounds(L.featureGroup(layers).getBounds());
       
      var zoom= map.getZoom();
      if (zoom >= 13) {
        map.setZoom(11);
      }
    });
  }); 
}

function nestet(ressource) {
  let erNestet= false
  switch (ressource) {
  default:  
    erNestet=true;
  }
  return erNestet;
}

function danLabel2(overskrift, href, label) {
  let tekst= "";
  if (overskrift) {
    tekst= overskrift + "<br/>" + label;
  } 
  else {
    tekst= "<a href='" + href.replace('dawa','info') + "'>" + label + "</a>";
  }
  return tekst;
}

function visVisueltCenter(x,y,r) {
  var marker= L.circleMarker(L.latLng(y, x),{color: 'black', fill: true, fillcolor: 'black', fillOpacity: 1.0, radius: r}).addTo(map);
}

function showPopup(vis,x,y,label) {
  if (vis) {
    var popup = L.popup()
      .setLatLng(L.latLng(y,x))
      .setContent(label)
      .openOn(map); 
  }
}

function eachFeature(ressource, overskrift, vispopup) {
  return function (feature, layer) {
    let label= "";
    switch (ressource) {
    case 'ejerlav':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" + feature.properties.kode + ")");
      layer.bindPopup(label);
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      break;
    case 'jordstykker':
      let kode= feature.properties.ejerlav.kode;
      let navn= feature.properties.ejerlav.navn;
      let nr= feature.properties.matrikelnr;
      label= danLabel2(overskrift, feature.properties.href, nr + " " + navn + " (" + kode + ")");
      layer.bindPopup(label);
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
     break;
    case 'sogne':
    case 'politikredse':
    case 'retskredse':
    case 'regioner':
    case 'kommuner':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.kode + ")");
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
      break;
    case 'afstemningsomraader': 
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      map.createPane("locationMarker");
      map.getPane("locationMarker").style.zIndex = getzindex('adgangsadresser');
      var marker= L.circleMarker(L.latLng(feature.properties.afstemningssted.adgangsadresse.koordinater[1], feature.properties.afstemningssted.adgangsadresse.koordinater[0]),{color: 'red', fill: true, fillcolor: 'red', fillOpacity: 1.0, radius: 3,  pane: "locationMarker" }).addTo(map);      
      marker.bindPopup(danLabel2(overskrift, feature.properties.afstemningssted.adgangsadresse.href, feature.properties.afstemningssted.navn + "<br/>" + feature.properties.afstemningssted.adgangsadresse.adressebetegnelse.replace(',','<br/>'))); 
      break;
    case 'menighedsraadsafstemningsomraader':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.nummer + ")");
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      break;      
    case 'opstillingskredse':
    case 'storkredse':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.nummer + ")");
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      break; 
    case 'valglandsdele':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.bogstav + ")");
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
      break;      
    case 'supplerendebynavne2': 
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      break;          
    case 'landsdele': 
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      break;    
    case 'postnumre': 
      label= danLabel2(overskrift, feature.properties.href, feature.properties.nr + " " + feature.properties.navn); 
      layer.bindPopup(label); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      break;
    case 'adresser': 
      label= danLabel2(overskrift, feature.properties.href, feature.properties.adressebetegnelse.replace(',','<br/>'));
      showPopup(vispopup, feature.properties.adgangsadresse.adgangspunkt.koordinater[0], feature.properties.adgangsadresse.adgangspunkt.koordinater[1], label);
      layer.bindPopup(label);
      L.circleMarker(L.latLng(feature.properties.adgangsadresse.vejpunkt.koordinater[1], feature.properties.adgangsadresse.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
      break;
    case 'adgangsadresser':      
      label= danLabel2(overskrift, feature.properties.href,util.formatAdgangsadresse(feature.properties)); 
      showPopup(vispopup, feature.properties.adgangspunkt.koordinater[0], feature.properties.adgangspunkt.koordinater[1], label);
      layer.bindPopup(label); 
      L.circleMarker(L.latLng(feature.properties.vejpunkt.koordinater[1], feature.properties.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
      break;      
    case 'stednavne':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + '<br/>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")");  
      layer.bindPopup(label);
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
      break;    
    case 'stednavne2':
      label= danLabel2(overskrift, feature.properties.sted.href, feature.properties.navn + '<br>(' +  feature.properties.sted.hovedtype  + ', ' + feature.properties.sted.undertype + ")");  
      layer.bindPopup(label);    
      visVisueltCenter(feature.properties.sted.visueltcenter[0], feature.properties.sted.visueltcenter[1], 1);
      showPopup(vispopup, feature.properties.sted.visueltcenter[0], feature.properties.sted.visueltcenter[1], label);  
      break;      
    case 'steder':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.primærtnavn + '<br>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")");  
      layer.bindPopup(label);    
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);  
      break;    
    case 'navngivneveje':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);   
      layer.bindPopup(label);
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 3); 
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
      if (feature.properties.beliggenhed.vejtilslutningspunkter) {
        let punkter= feature.properties.beliggenhed.vejtilslutningspunkter.coordinates;
        for (var i= 0; i<punkter.length;i++) {
           var marker= L.circleMarker(L.latLng(punkter[i][1], punkter[i][0]), {color: 'blue', fillColor: 'blue', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(map);
        }
      }
      break;
    case 'vejstykker':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.kode + " " + feature.properties.navn)    
      layer.bindPopup(label);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
      break;
    case 'vejnavnpostnummerrelationer':
      label= danLabel2(overskrift, feature.properties.href, feature.properties.betegnelse);     
      layer.bindPopup(label);
      showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);  
      break;
    case 'bbr/tekniskeanlaeg':      
      label= danLabel2(overskrift, feature.properties.href,bbr.getKlassifikation(feature.properties.tek020Klassifikation) + ' fra ' + feature.properties.tek024Etableringsår); 
      showPopup(vispopup, feature.properties.tek109Koordinat.coordinates[0], feature.properties.tek109Koordinat.coordinates[1], label);
      layer.bindPopup(label); 
     break;     
    case 'bbr/bygninger':      
      label= danLabel2(overskrift, feature.properties.href,bbr.getBygAnvendelse(feature.properties.byg021BygningensAnvendelse) + ' fra ' + feature.properties.byg026Opførelsesår); 
      showPopup(vispopup, feature.properties.byg404Koordinat.coordinates[0], feature.properties.byg404Koordinat.coordinates[1], label);
      layer.bindPopup(label); 
     break;     
    default:       
      if (feature.properties.visueltcenter_x && feature.properties.visueltcenter_y) {      
        visVisueltCenter(feature.properties.visueltcenter_x, feature.properties.visueltcenter_y); 
      }      
      if (feature.properties.visueltcenter) {      
        visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      }
    }
    layer.on('contextmenu', function(e) {map.contextmenu.showAt(e.latlng)}); 
  }
}

function pointToLayer(geoJsonPoint, latlng) {
  return L.circleMarker(latlng);
} 

var adressestyle= {
  color: "red",
  opacity: 1.0,
  weight: 1,
  fill: true,
  fillColor: 'red',
  fillOpacity: 1.0,
  radius: 5
}

var tekniskanlægstyle= {
  color: "black",
  opacity: 1.0,
  weight: 1,
  fill: true,
  fillColor: 'black',
  fillOpacity: 1.0,
  radius: 5
}

var bygningstyle= {
  color: "green",
  opacity: 1.0,
  weight: 1,
  fill: true,
  fillColor: 'green',
  fillOpacity: 1.0,
  radius: 5
}

function getDefaultStyle(ressource, withpane) {
  return function (feature) {
    let style= {};
    switch (ressource) {
    case 'jordstykker':
    case 'ejerlav':
      style.color= "green";
      style.fillColor= 'green';
      break;
    case 'sogne':
    case 'politikredse':
    case 'retskredse':
    case 'regioner':
    case 'opstillingskredse':
    case 'storkredse':
    case 'valglandsdele':
    case 'afstemningsomraader':
    case 'menighedsraadsafstemningsomraader':
    case 'kommuner':
      style.color= "green";
      style.fillColor= 'green';
      break
    case 'supplerendebynavne':
      style.color= "green";
      style.fillColor= 'green';
      break;
    case 'supplerendebynavne2': 
      style.color= "green";
      style.fillColor= 'green';
      break;    
    case 'landsdele': 
      style.color= "green";
      style.fillColor= 'green';
      break;    
    case 'postnumre': 
      style.color= "green";
      style.fillColor= 'green'; 
      break;
    case 'adresser':
    case 'adgangsadresser':
      if (withpane) {
        adressestyle.pane= ressource;
      }
      style= adressestyle;
      break; 
    case 'bbr/tekniskeanlaeg':   
      style= tekniskanlægstyle;
      break;
    case 'bbr/bygninger':   
      style= bygningstyle;
      break;
    case 'steder':  
    case 'stednavne': 
    case 'stednavne2':
      style.color= "green";
      style.fillColor= 'green';  
      break;    
    case 'navngivneveje':
    case 'vejstykker':
    case 'vejnavnpostnummerrelationer': 
      style.color= "blue";
      style.fillColor= 'blue';   
      break;
    default:
      break;
    }
    return style;
  }
}

function getzindex(ressource) {
  let zindex= 501;
  switch (ressource) {
  case 'jordstykker':
  case 'ejerlav':
    zindex=530;
    break;
  case 'sogne':
  case 'politikredse':
  case 'retskredse':
  case 'regioner':
  case 'landsdele':
  case 'opstillingskredse':
  case 'storkredse':
  case 'valglandsdele':
  case 'afstemningsomraader':
  case 'menighedsraadsafstemningsomraader':
  case 'kommuner':
    zindex= 510;
    break
  case 'supplerendebynavne2':
  case 'supplerendebynavne':
    zindex= 520;
    break; 
  case 'postnumre':
    zindex= 510; 
    break;
  case 'adresser':
  case 'adgangsadresser':
    zindex= 570;
    break;      
  case 'steder':  
  case 'stednavne': 
  case 'stednavne2':
    zindex= 515;  
    break;    
  case 'navngivneveje':
  case 'vejstykker':
  case 'vejnavnpostnummerrelationer': 
    zindex= 560;  
    break;
  default:
    break;
  }
  return zindex;
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getAdresseRolle"] = getAdresseRolle;
/* harmony export (immutable) */ __webpack_exports__["getAdressestatus"] = getAdressestatus;
/* harmony export (immutable) */ __webpack_exports__["getAfloebsforhold"] = getAfloebsforhold;
/* harmony export (immutable) */ __webpack_exports__["getAfvigendeEtager"] = getAfvigendeEtager;
/* harmony export (immutable) */ __webpack_exports__["getArealtype"] = getArealtype;
/* harmony export (immutable) */ __webpack_exports__["getArtskode"] = getArtskode;
/* harmony export (immutable) */ __webpack_exports__["getAsbestholdigtMateriale"] = getAsbestholdigtMateriale;
/* harmony export (immutable) */ __webpack_exports__["getBadeforhold"] = getBadeforhold;
/* harmony export (immutable) */ __webpack_exports__["getBBRMessageAarsagskode"] = getBBRMessageAarsagskode;
/* harmony export (immutable) */ __webpack_exports__["getBBRMessageNiveau"] = getBBRMessageNiveau;
/* harmony export (immutable) */ __webpack_exports__["getBBRMessageType"] = getBBRMessageType;
/* harmony export (immutable) */ __webpack_exports__["getBeregningsprincipForArealAfCarport"] = getBeregningsprincipForArealAfCarport;
/* harmony export (immutable) */ __webpack_exports__["getBoligtype"] = getBoligtype;
/* harmony export (immutable) */ __webpack_exports__["getBygAfloebsforhold"] = getBygAfloebsforhold;
/* harmony export (immutable) */ __webpack_exports__["getBygAnvendelse"] = getBygAnvendelse;
/* harmony export (immutable) */ __webpack_exports__["getByggesagskode"] = getByggesagskode;
/* harmony export (immutable) */ __webpack_exports__["getByggeskadeforsikringsselskab"] = getByggeskadeforsikringsselskab;
/* harmony export (immutable) */ __webpack_exports__["getBygherreForhold"] = getBygherreForhold;
/* harmony export (immutable) */ __webpack_exports__["getBygningSortering"] = getBygningSortering;
/* harmony export (immutable) */ __webpack_exports__["getBygSupplerendeVarme"] = getBygSupplerendeVarme;
/* harmony export (immutable) */ __webpack_exports__["getBygVandforsyning"] = getBygVandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getBygVarmeinstallation"] = getBygVarmeinstallation;
/* harmony export (immutable) */ __webpack_exports__["getDispensationFritagelseIftKollektivVarmeforsyning"] = getDispensationFritagelseIftKollektivVarmeforsyning;
/* harmony export (immutable) */ __webpack_exports__["getDriftstatus"] = getDriftstatus;
/* harmony export (immutable) */ __webpack_exports__["getEjendomstype"] = getEjendomstype;
/* harmony export (immutable) */ __webpack_exports__["getEjerforholdskode"] = getEjerforholdskode;
/* harmony export (immutable) */ __webpack_exports__["getElevator"] = getElevator;
/* harmony export (immutable) */ __webpack_exports__["getEnergiforsyning"] = getEnergiforsyning;
/* harmony export (immutable) */ __webpack_exports__["getEnhAnvendelse"] = getEnhAnvendelse;
/* harmony export (immutable) */ __webpack_exports__["getEnhedHvorSkalEnhedVises"] = getEnhedHvorSkalEnhedVises;
/* harmony export (immutable) */ __webpack_exports__["getEnhedSortering"] = getEnhedSortering;
/* harmony export (immutable) */ __webpack_exports__["getEnhSupplerendeVarme"] = getEnhSupplerendeVarme;
/* harmony export (immutable) */ __webpack_exports__["getEnhVarmeinstallation"] = getEnhVarmeinstallation;
/* harmony export (immutable) */ __webpack_exports__["getEtageSortering"] = getEtageSortering;
/* harmony export (immutable) */ __webpack_exports__["getEtageType"] = getEtageType;
/* harmony export (immutable) */ __webpack_exports__["getFordelingsnoegle"] = getFordelingsnoegle;
/* harmony export (immutable) */ __webpack_exports__["getForretningsHaendelse"] = getForretningsHaendelse;
/* harmony export (immutable) */ __webpack_exports__["getForretningsOmraade"] = getForretningsOmraade;
/* harmony export (immutable) */ __webpack_exports__["getForretningsProcess"] = getForretningsProcess;
/* harmony export (immutable) */ __webpack_exports__["getForretningsProcessUI"] = getForretningsProcessUI;
/* harmony export (immutable) */ __webpack_exports__["getForretningsProcessUIBygningEnhed"] = getForretningsProcessUIBygningEnhed;
/* harmony export (immutable) */ __webpack_exports__["getFredning"] = getFredning;
/* harmony export (immutable) */ __webpack_exports__["getGodkendtTomBolig"] = getGodkendtTomBolig;
/* harmony export (immutable) */ __webpack_exports__["getGruAfloebsforhold"] = getGruAfloebsforhold;
/* harmony export (immutable) */ __webpack_exports__["getGrundSortering"] = getGrundSortering;
/* harmony export (immutable) */ __webpack_exports__["getGrundViewType"] = getGrundViewType;
/* harmony export (immutable) */ __webpack_exports__["getGruVandforsyning"] = getGruVandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getGulvbelaegning"] = getGulvbelaegning;
/* harmony export (immutable) */ __webpack_exports__["getHenvendelserDirekteIndberetning"] = getHenvendelserDirekteIndberetning;
/* harmony export (immutable) */ __webpack_exports__["getHusnummerRolle"] = getHusnummerRolle;
/* harmony export (immutable) */ __webpack_exports__["getHusnummerType"] = getHusnummerType;
/* harmony export (immutable) */ __webpack_exports__["getIndberetningRolle"] = getIndberetningRolle;
/* harmony export (immutable) */ __webpack_exports__["getIndhold"] = getIndhold;
/* harmony export (immutable) */ __webpack_exports__["getKilde"] = getKilde;
/* harmony export (immutable) */ __webpack_exports__["getKildeTilKoordinatsaet"] = getKildeTilKoordinatsaet;
/* harmony export (immutable) */ __webpack_exports__["getKildeTilOplysninger"] = getKildeTilOplysninger;
/* harmony export (immutable) */ __webpack_exports__["getKlassifikation"] = getKlassifikation;
/* harmony export (immutable) */ __webpack_exports__["getKodeForMereEndEnLejlighed"] = getKodeForMereEndEnLejlighed;
/* harmony export (immutable) */ __webpack_exports__["getKoekkenforhold"] = getKoekkenforhold;
/* harmony export (immutable) */ __webpack_exports__["getKommuneFelterNiveau"] = getKommuneFelterNiveau;
/* harmony export (immutable) */ __webpack_exports__["getKommunekode"] = getKommunekode;
/* harmony export (immutable) */ __webpack_exports__["getKondemneretBoligenhed"] = getKondemneretBoligenhed;
/* harmony export (immutable) */ __webpack_exports__["getKonstruktion"] = getKonstruktion;
/* harmony export (immutable) */ __webpack_exports__["getKonstruktionsforhold"] = getKonstruktionsforhold;
/* harmony export (immutable) */ __webpack_exports__["getKoordinatsystem"] = getKoordinatsystem;
/* harmony export (immutable) */ __webpack_exports__["getKvalitetAfKoordinatsaet"] = getKvalitetAfKoordinatsaet;
/* harmony export (immutable) */ __webpack_exports__["getLivscyklus"] = getLivscyklus;
/* harmony export (immutable) */ __webpack_exports__["getLovligAnvendelse"] = getLovligAnvendelse;
/* harmony export (immutable) */ __webpack_exports__["getMateriale"] = getMateriale;
/* harmony export (immutable) */ __webpack_exports__["getMedlemsskabAfSplidevandforsyning"] = getMedlemsskabAfSplidevandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getMidlertidigOprettelseEllerFuldfoersel"] = getMidlertidigOprettelseEllerFuldfoersel;
/* harmony export (immutable) */ __webpack_exports__["getNiveau"] = getNiveau;
/* harmony export (immutable) */ __webpack_exports__["getNiveauType"] = getNiveauType;
/* harmony export (immutable) */ __webpack_exports__["getOffentligStoette"] = getOffentligStoette;
/* harmony export (immutable) */ __webpack_exports__["getOmfattetAfByggeskadeforsikring"] = getOmfattetAfByggeskadeforsikring;
/* harmony export (immutable) */ __webpack_exports__["getOpgangSortering"] = getOpgangSortering;
/* harmony export (immutable) */ __webpack_exports__["getOpvarmningsmiddel"] = getOpvarmningsmiddel;
/* harmony export (immutable) */ __webpack_exports__["getOversvoemmelsesselvrisiko"] = getOversvoemmelsesselvrisiko;
/* harmony export (immutable) */ __webpack_exports__["getPaaSoeTerritorie"] = getPaaSoeTerritorie;
/* harmony export (immutable) */ __webpack_exports__["getPlacering"] = getPlacering;
/* harmony export (immutable) */ __webpack_exports__["getPlaceringAfCursor"] = getPlaceringAfCursor;
/* harmony export (immutable) */ __webpack_exports__["getRensningspaabud"] = getRensningspaabud;
/* harmony export (immutable) */ __webpack_exports__["getSagsniveau"] = getSagsniveau;
/* harmony export (immutable) */ __webpack_exports__["getSagstype"] = getSagstype;
/* harmony export (immutable) */ __webpack_exports__["getSikkerhedsklassifikation"] = getSikkerhedsklassifikation;
/* harmony export (immutable) */ __webpack_exports__["getSloejfning"] = getSloejfning;
/* harmony export (immutable) */ __webpack_exports__["getStandardSoegniveau"] = getStandardSoegniveau;
/* harmony export (immutable) */ __webpack_exports__["getStartside"] = getStartside;
/* harmony export (immutable) */ __webpack_exports__["getStoerrelsesklasse"] = getStoerrelsesklasse;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeAnvendelseskode"] = getSupplerendeAnvendelseskode;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeIndvendigKorrosionsbeskyttelse"] = getSupplerendeIndvendigKorrosionsbeskyttelse;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeOplysningerOmKoordinatsaet"] = getSupplerendeOplysningerOmKoordinatsaet;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeVarme"] = getSupplerendeVarme;
/* harmony export (immutable) */ __webpack_exports__["getTagdaekningsmateriale"] = getTagdaekningsmateriale;
/* harmony export (immutable) */ __webpack_exports__["getTekniskAnlaegBygningSortering"] = getTekniskAnlaegBygningSortering;
/* harmony export (immutable) */ __webpack_exports__["getTekniskAnlaegEnhedSortering"] = getTekniskAnlaegEnhedSortering;
/* harmony export (immutable) */ __webpack_exports__["getTekniskAnlaegMatrikelSortering"] = getTekniskAnlaegMatrikelSortering;
/* harmony export (immutable) */ __webpack_exports__["getTilladelsesart"] = getTilladelsesart;
/* harmony export (immutable) */ __webpack_exports__["getTilladelseTilAlternativBortskaffelseEllerAfledning"] = getTilladelseTilAlternativBortskaffelseEllerAfledning;
/* harmony export (immutable) */ __webpack_exports__["getTilladelseTilUdtraeden"] = getTilladelseTilUdtraeden;
/* harmony export (immutable) */ __webpack_exports__["getToiletforhold"] = getToiletforhold;
/* harmony export (immutable) */ __webpack_exports__["getTypeAfVaegge"] = getTypeAfVaegge;
/* harmony export (immutable) */ __webpack_exports__["getUdledningstilladelse"] = getUdledningstilladelse;
/* harmony export (immutable) */ __webpack_exports__["getUdlejningsforhold"] = getUdlejningsforhold;
/* harmony export (immutable) */ __webpack_exports__["getUdskrivningsmatrikel"] = getUdskrivningsmatrikel;
/* harmony export (immutable) */ __webpack_exports__["getVandforsyning"] = getVandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getVarmeinstallation"] = getVarmeinstallation;
/* harmony export (immutable) */ __webpack_exports__["getYdervaeggenesMateriale"] = getYdervaeggenesMateriale;

function getAdresseRolle(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Fastsat til denne";
		break;
	case 1:
		navn= "Kun vejledende";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAdressestatus(kode) {
	switch (kode) { 
	case 0:
		navn= "Har husnummer (adresse)";
		break;
	case 1:
		navn= "Markeret til at få husnummer (adresse)";
		break;
	case 2:
		navn= "Uden husnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAfloebsforhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Fælleskloakeret: spildevand + tag- og overfladevand";
		break;
	case 2:
		navn= "Fælleskloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 3:
		navn= "Fælleskloakeret: spildevand";
		break;
	case 4:
		navn= "Fælleskloakeret: tag- og overfladevand";
		break;
	case 5:
		navn= "Separatkloakeret: spildevand + tag- og overfladevand";
		break;
	case 6:
		navn= "Separatkloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 7:
		navn= "Separatkloakeret: spildevand";
		break;
	case 8:
		navn= "Separatkloakeret: tag- og overfladevand";
		break;
	case 9:
		navn= "Spildevandskloakeret: Spildevand";
		break;
	case 10:
		navn= "Afløb til spildevandsforsyningens renseanlæg";
		break;
	case 11:
		navn= "Afløb til fællesprivat spildevandsanlæg";
		break;
	case 12:
		navn= "Afløb til fællesprivat kloakledning med tilslutning til spv. renseanlæg";
		break;
	case 20:
		navn= "Afløb til samletank";
		break;
	case 21:
		navn= "Afløb til samletank for toiletvand og mek. rensning af øvr. spildevand";
		break;
	case 29:
		navn= "Mekanisk rensning med nedsivningsanlæg med tilladelse";
		break;
	case 30:
		navn= "Mekanisk rensning med nedsivningsanlæg (tilladelse ikke påkrævet)";
		break;
	case 31:
		navn= "Mekanisk rensning med privat udledn. dir. til vandløb, sø eller hav";
		break;
	case 32:
		navn= "Mekanisk og biologisk rensning (ældre anlæg uden renseklasse)";
		break;
	case 70:
		navn= "Udledning uden rensning direkte til vandløb, søer eller havet";
		break;
	case 75:
		navn= "Blandet afløbsforhold på ejendommen (er specificeret på bygningen)";
		break;
	case 80:
		navn= "Anden type afløb";
		break;
	case 90:
		navn= "Ingen udledning";
		break;
	case 101:
		navn= "SOP: Minirenseanlæg med direkte udledning";
		break;
	case 102:
		navn= "SOP: Minirenseanlæg med udledning til markdræn";
		break;
	case 103:
		navn= "SOP: Minirenseanlæg med nedsivning i faskine";
		break;
	case 104:
		navn= "SOP: Nedsivning til sivedræn";
		break;
	case 105:
		navn= "SOP: Samletank";
		break;
	case 106:
		navn= "SOP: Pileanlæg med nedsivning (uden membran)";
		break;
	case 107:
		navn= "SOP: Pileanlæg uden udledning (med membran)";
		break;
	case 108:
		navn= "SOP: Beplantede filteranlæg med nedsivning i faskine";
		break;
	case 109:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og direkte udledning";
		break;
	case 110:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og udledning til markdræn";
		break;
	case 190:
		navn= "SOP: Andet";
		break;
	case 201:
		navn= "SO: Biologisk sandfilter med direkte udledning";
		break;
	case 202:
		navn= "SO: Biologisk sandfilter med udledning til markdræn";
		break;
	case 203:
		navn= "SO: Minirensanlæg med direkte udledning";
		break;
	case 204:
		navn= "SO: Minirenseanlæg med udledning til markdræn";
		break;
	case 205:
		navn= "SO: Beplantede filteranlæg med direkte udledning";
		break;
	case 206:
		navn= "SO: Beplantede filteranlæg med udledning til markdræn";
		break;
	case 290:
		navn= "SO: Andet";
		break;
	case 301:
		navn= "OP: Minirenseanlæg med direkte udledning";
		break;
	case 302:
		navn= "OP: Minirenseanlæg med udledning til markdræn";
		break;
	case 390:
		navn= "OP: Andet";
		break;
	case 401:
		navn= "O: Rodzoneanlæg med direkte udledning";
		break;
	case 402:
		navn= "O: Rodzoneanlæg med udledning til markdræn";
		break;
	case 403:
		navn= "O: Minirenseanlæg med direkte udledning";
		break;
	case 404:
		navn= "O: Minirenseanlæg med udledning til markdræn";
		break;
	case 490:
		navn= "O: Andet";
		break;
	case 501:
		navn= "Øvrige renseløsninger: Mekanisk med direkte udledning";
		break;
	case 502:
		navn= "Øvrige renseløsninger: Mekanisk med udledning til markdræn";
		break;
	case 503:
		navn= "Øvrige renseløsninger: Ældre nedsivningsanlæg med nedsivning til sivebrønd";
		break;
	case 504:
		navn= "Øvrige renseløsninger: Udledning til jordoverfladen";
		break;
	case 505:
		navn= "Øvrige renseløsninger: Urenset";
		break;
	case 590:
		navn= "Øvrige renseløsninger: Andet";
		break;
	case 601:
		navn= "Anden type afløb (større end 30 PE med egen udledning)";
		break;
	case 701:
		navn= "Intet afløb";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAfvigendeEtager(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Bygningen har ikke afvigende etager";
		break;
	case 10:
		navn= "Bygningen har afvigende etager";
		break;
	case 11:
		navn= "Bygningen indeholder hems";
		break;
	case 12:
		navn= "Bygningen indeholder dobbelt højt rum";
		break;
	case 13:
		navn= "Bygningen indeholder indskudt etage";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getArealtype(kode) {
	switch (kode) { 
	case 1:
		navn= "Type 1";
		break;
	case 2:
		navn= "Type 2";
		break;
	case 3:
		navn= "Type 3";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getArtskode(kode) {
	switch (kode) { 
	case 0:
		navn= "Vigtigste matrikelnummer på ejendommen (normalt med evt. bygning)";
		break;
	case 1:
		navn= "Andre matrikelnumre på ejendommen";
		break;
	case 2:
		navn= "Kode for ejerlejlighed";
		break;
	case 3:
		navn= "Bygning på matrikelnummer (på lejet grund)";
		break;
	case 4:
		navn= "Del af matrikelnummer (parcel) – [kan være fælleslod]";
		break;
	case 5:
		navn= "Umatrikuleret areal";
		break;
	case 6:
		navn= "Umatrikuleret havneareal";
		break;
	case 7:
		navn= "Umatrikuleret jernbaneareal";
		break;
	case 8:
		navn= "Bygning på umatrikuleret areal";
		break;
	case 9:
		navn= "Bygning på umatrikuleret havneareal";
		break;
	case 10:
		navn= "Bygning på umatrikuleret jernbaneareal";
		break;
	case 20:
		navn= "Andet afgivet areal, f. eks. lejet grund";
		break;
	case 21:
		navn= "Tilskyllet";
		break;
	case 22:
		navn= "Bortskyllet";
		break;
	case 23:
		navn= "Eksproprieret til";
		break;
	case 24:
		navn= "Eksproprieret fra";
		break;
	case 25:
		navn= "Dokumenteret arealafvigelse tillagt";
		break;
	case 26:
		navn= "Dokumenteret arealafvigelse afgivet";
		break;
	case 27:
		navn= "Tillagt ved jordfordeling";
		break;
	case 28:
		navn= "Afgivet ved jordfordeling";
		break;
	case 30:
		navn= "(Foreløbig) Vigtigste matrikelnummer på ejendommen (normalt med evt. bygning)";
		break;
	case 31:
		navn= "(Foreløbig) Andre matrikelnumre på ejendommen";
		break;
	case 32:
		navn= "(Foreløbig) Kode for ejerlejlighed";
		break;
	case 33:
		navn= "(Foreløbig) Bygning på matrikelnummer (på lejet grund)";
		break;
	case 34:
		navn= "(Foreløbig) Del af matrikelnummer (parcel)";
		break;
	case 35:
		navn= "(Foreløbig) Umatrikuleret areal";
		break;
	case 36:
		navn= "(Foreløbig) Umatrikuleret havneareal";
		break;
	case 37:
		navn= "(Foreløbig) Umatrikuleret jernbaneareal";
		break;
	case 38:
		navn= "(Foreløbig) Bygning på umatrikuleret havneareal";
		break;
	case 39:
		navn= "(Foreløbig) Bygning på umatrikuleret havneareal";
		break;
	case 40:
		navn= "(Foreløbig) Bygning på umatrikuleret jernbaneareal";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAsbestholdigtMateriale(kode) {
	let navn= "";
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Asbestholdigt ydervægsmateriale";
		break;
	case 2:
		navn= "Asbestholdigt tagdækningsmateriale";
		break;
	case 3:
		navn= "Asbestholdigt ydervægs- og tagdækningsmateriale";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBadeforhold(kode) {
	let navn= '';
	switch (kode) { 
	case "C":
		navn= "Adgang til badeværelse";
		break;
	case "D":
		navn= "Hverken badeværelse eller adgang til badeværelse";
		break;
	case "V":
		navn= "Badeværelser i enheden";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBBRMessageAarsagskode(kode) {
	switch (kode) { 
	case 20:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af ejerskifte.";
		break;
	case 30:
		navn= "Denne BBR-Meddelelse er udskrevet efter rekvisition.";
		break;
	case 31:
		navn= "Denne BBR-Andelsboligudskrift er udskrevet på grund af rekvisition.";
		break;
	case 40:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af afsluttet byggesag.";
		break;
	case 41:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af indflytning.";
		break;
	case 45:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af ændring uden byggesag.";
		break;
	case 46:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af opdeling af lejligheder.";
		break;
	case 47:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af sammenlægning af lejligheder.";
		break;
	case 48:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af opdeling/ændret opdeling i ejerlejligheder.";
		break;
	case 50:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af, at kommunen har foretaget rettelser af registreringen i BBR. ";
		break;
	case 51:
		navn= "De har til kommunen anmeldt et byggeri som ikke er færdigmeldt. Denne BBR-Meddelelse udskrives… ";
		break;
	case 70:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af matrikulære ændringer.";
		break;
	case 80:
		navn= "Denne BBR-Meddelelse er udskrevet fordi ejer selv eller andre har rettet, slettet eller tilføjet… ";
		break;
	case 81:
		navn= "Denne BBR-Meddelelse er udskrevet fordi skatteforvaltningen har rettet, slettet eller tilføjet… ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBBRMessageNiveau(kode) {
	switch (kode) { 
	case 0:
		navn= "Ejendom";
		break;
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "Enhed";
		break;
	case 4:
		navn= "Teknisk Anlæg";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBBRMessageType(kode) {
	switch (kode) { 
	case 0:
		navn= "BBR-Meddelelse";
		break;
	case 1:
		navn= "Registerudskrift";
		break;
	case 2:
		navn= "Andelsboligudskrift";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBeregningsprincipForArealAfCarport(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Carportareal er målt efter tagflade";
		break;
	case 2:
		navn= "Carportarealet er målt ½ meter inde på åbne sider";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBoligtype(kode) {
	let navn= '';
	//kode= parseInt(kode);
	switch (kode) { 
	case "E":
		navn= "Andet (bl.a. institutioner og erhverv)";
		break;
	case '1':
		navn= "Egentlig beboelseslejlighed (boligenhed med eget køkken)";
		break;
	case '2':
		navn= "Blandet erhverv og bolig med eget køkken";
		break;
	case '3':
		navn= "Enkeltværelse (boligenhed med fast kogeinstallation, fælles køkken eller intet køkken).";
		break;
	case '4':
		navn= "Fællesbolig eller fælleshusholdning";
		break;
	case '5':
		navn= "Sommer-/fritidsbolig";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygAfloebsforhold(kode) {
	switch (kode) { 
	case 1:
		navn= "Fælleskloakeret: spildevand + tag- og overfladevand";
		break;
	case 2:
		navn= "Fælleskloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 3:
		navn= "Fælleskloakeret: spildevand";
		break;
	case 4:
		navn= "Fælleskloakeret: tag- og overfladevand";
		break;
	case 5:
		navn= "Separatkloakeret: spildevand + tag- og overfladevand";
		break;
	case 6:
		navn= "Separatkloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 7:
		navn= "Separatkloakeret: spildevand";
		break;
	case 8:
		navn= "Separatkloakeret: tag- og overfladevand";
		break;
	case 9:
		navn= "Spildevandskloakeret: Spildevand";
		break;
	case 10:
		navn= "Afløb til spildevandsforsyningens renseanlæg";
		break;
	case 11:
		navn= "Afløb til fællesprivat spildevandsanlæg";
		break;
	case 12:
		navn= "Afløb til fællesprivat kloakledning med tilslutning til spv. renseanlæg";
		break;
	case 20:
		navn= "Afløb til samletank";
		break;
	case 21:
		navn= "Afløb til samletank for toiletvand og mek. rensning af øvr. spildevand";
		break;
	case 29:
		navn= "Mekanisk rensning med nedsivningsanlæg med tilladelse";
		break;
	case 30:
		navn= "Mekanisk rensning med nedsivningsanlæg (tilladelse ikke påkrævet)";
		break;
	case 31:
		navn= "Mekanisk rensning med privat udledn. dir. til vandløb, sø eller hav";
		break;
	case 32:
		navn= "Mekanisk og biologisk rensning (ældre anlæg uden renseklasse)";
		break;
	case 70:
		navn= "Udledning uden rensning direkte til vandløb, søer eller havet";
		break;
	case 75:
		navn= "Blandet afløbsforhold på ejendommen (er specificeret på bygningen)";
		break;
	case 80:
		navn= "Anden type afløb";
		break;
	case 90:
		navn= "Ingen udledning";
		break;
	case 101:
		navn= "SOP: Minirenseanlæg med direkte udledning";
		break;
	case 102:
		navn= "SOP: Minirenseanlæg med udledning til markdræn";
		break;
	case 103:
		navn= "SOP: Minirenseanlæg med nedsivning i faskine";
		break;
	case 104:
		navn= "SOP: Nedsivning til sivedræn";
		break;
	case 105:
		navn= "SOP: Samletank";
		break;
	case 106:
		navn= "SOP: Pileanlæg med nedsivning (uden membran)";
		break;
	case 107:
		navn= "SOP: Pileanlæg uden udledning (med membran)";
		break;
	case 108:
		navn= "SOP: Beplantede filteranlæg med nedsivning i faskine";
		break;
	case 109:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og direkte udledning";
		break;
	case 110:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og udledning til markdræn";
		break;
	case 190:
		navn= "SOP: Andet";
		break;
	case 201:
		navn= "SO: Biologisk sandfilter med direkte udledning";
		break;
	case 202:
		navn= "SO: Biologisk sandfilter med udledning til markdræn";
		break;
	case 203:
		navn= "SO: Minirensanlæg med direkte udledning";
		break;
	case 204:
		navn= "SO: Minirenseanlæg med udledning til markdræn";
		break;
	case 205:
		navn= "SO: Beplantede filteranlæg med direkte udledning";
		break;
	case 206:
		navn= "SO: Beplantede filteranlæg med udledning til markdræn";
		break;
	case 290:
		navn= "SO: Andet";
		break;
	case 301:
		navn= "OP: Minirenseanlæg med direkte udledning";
		break;
	case 302:
		navn= "OP: Minirenseanlæg med udledning til markdræn";
		break;
	case 390:
		navn= "OP: Andet";
		break;
	case 401:
		navn= "O: Rodzoneanlæg med direkte udledning";
		break;
	case 402:
		navn= "O: Rodzoneanlæg med udledning til markdræn";
		break;
	case 403:
		navn= "O: Minirenseanlæg med direkte udledning";
		break;
	case 404:
		navn= "O: Minirenseanlæg med udledning til markdræn";
		break;
	case 490:
		navn= "O: Andet";
		break;
	case 501:
		navn= "Øvrige renseløsninger: Mekanisk med direkte udledning";
		break;
	case 502:
		navn= "Øvrige renseløsninger: Mekanisk med udledning til markdræn";
		break;
	case 503:
		navn= "Øvrige renseløsninger: Ældre nedsivningsanlæg med nedsivning til sivebrønd";
		break;
	case 504:
		navn= "Øvrige renseløsninger: Udledning til jordoverfladen";
		break;
	case 505:
		navn= "Øvrige renseløsninger: Urenset";
		break;
	case 590:
		navn= "Øvrige renseløsninger: Andet";
		break;
	case 601:
		navn= "Anden type afløb (større end 30 PE med egen udledning)";
		break;
	case 701:
		navn= "Intet afløb";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygAnvendelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 110:
		navn= "Stuehus til landbrugsejendom";
		break;
	case 120:
		navn= "Fritliggende enfamilieshus (parcelhus)";
		break;
	case 121:
		navn= "Sammenbygget enfamiliehus";
		break;
	case 130:
		navn= "(UDFASES) Række-, kæde-, eller dobbelthus (lodret adskillelse mellem enhederne).";
		break;
	case 131:
		navn= "Række- og kædehus";
		break;
	case 132:
		navn= "Dobbelthus";
		break;
	case 140:
		navn= "Etagebolig-bygning, flerfamiliehus eller to-familiehus";
		break;
	case 150:
		navn= "Kollegium";
		break;
	case 160:
		navn= "Boligbygning til døgninstitution";
		break;
	case 185:
		navn= "Anneks i tilknytning til helårsbolig.";
		break;
	case 190:
		navn= "Anden bygning til helårsbeboelse";
		break;
	case 210:
		navn= "(UDFASES) Bygning til erhvervsmæssig produktion vedrørende landbrug, gartneri, råstofudvinding o. lign ";
		break;
	case 211:
		navn= "Stald til svin";
		break;
	case 212:
		navn= "Stald til kvæg, får mv.";
		break;
	case 213:
		navn= "Stald til fjerkræ";
		break;
	case 214:
		navn= "Minkhal";
		break;
	case 215:
		navn= "Væksthus";
		break;
	case 216:
		navn= "Lade til foder, afgrøder mv.";
		break;
	case 217:
		navn= "Maskinhus, garage mv.";
		break;
	case 218:
		navn= "Lade til halm, hø mv.";
		break;
	case 219:
		navn= "Anden bygning til landbrug mv.";
		break;
	case 220:
		navn= "(UDFASES) Bygning til erhvervsmæssig produktion vedrørende industri, håndværk m.v. (fabrik, værksted o.lign.) ";
		break;
	case 221:
		navn= "Bygning til industri med integreret produktionsapparat";
		break;
	case 222:
		navn= "Bygning til industri uden integreret produktionsapparat";
		break;
	case 223:
		navn= "Værksted";
		break;
	case 229:
		navn= "Anden bygning til produktion";
		break;
	case 230:
		navn= "(UDFASES) El-, gas-, vand- eller varmeværk, forbrændingsanstalt m.v.";
		break;
	case 231:
		navn= "Bygning til energiproduktion";
		break;
	case 232:
		navn= "Bygning til forsyning- og energidistribution";
		break;
	case 233:
		navn= "Bygning til vandforsyning";
		break;
	case 234:
		navn= "Bygning til håndtering af affald og spildevand";
		break;
	case 239:
		navn= "Anden bygning til energiproduktion og -distribution";
		break;
	case 290:
		navn= "(UDFASES) Anden bygning til landbrug, industri etc.";
		break;
	case 310:
		navn= "(UDFASES) Transport- og garageanlæg (fragtmandshal, lufthavnsbygning, banegårdsbygning, parkeringshus). Garage med plads til et eller to køretøjer registreres med anvendelseskode 910 ";
		break;
	case 311:
		navn= "Bygning til jernbane- og busdrift";
		break;
	case 312:
		navn= "Bygning til luftfart";
		break;
	case 313:
		navn= "Bygning til parkering- og transportanlæg";
		break;
	case 314:
		navn= "Bygning til parkering af flere end to køretøjer i tilknytning til boliger";
		break;
	case 315:
		navn= "Havneanlæg";
		break;
	case 319:
		navn= "Andet transportanlæg";
		break;
	case 320:
		navn= "(UDFASES) Bygning til kontor, handel, lager, herunder offentlig administration";
		break;
	case 321:
		navn= "Bygning til kontor";
		break;
	case 322:
		navn= "Bygning til detailhandel";
		break;
	case 323:
		navn= "Bygning til lager";
		break;
	case 324:
		navn= "Butikscenter";
		break;
	case 325:
		navn= "Tankstation";
		break;
	case 329:
		navn= "Anden bygning til kontor, handel og lager";
		break;
	case 330:
		navn= "(UDFASES) Bygning til hotel, restaurant, vaskeri, frisør og anden servicevirksomhed";
		break;
	case 331:
		navn= "Hotel, kro eller konferencecenter med overnatning";
		break;
	case 332:
		navn= "Bed & breakfast mv.";
		break;
	case 333:
		navn= "Restaurant, café og konferencecenter uden overnatning";
		break;
	case 334:
		navn= "Privat servicevirksomhed som frisør, vaskeri, netcafé mv.";
		break;
	case 339:
		navn= "Anden bygning til serviceerhverv";
		break;
	case 390:
		navn= "(UDFASES) Anden bygning til transport, handel etc";
		break;
	case 410:
		navn= "(UDFASES) Bygning til biograf, teater, erhvervsmæssig udstilling, bibliotek, museum, kirke o. lign. ";
		break;
	case 411:
		navn= "Biograf, teater, koncertsted mv.";
		break;
	case 412:
		navn= "Museum";
		break;
	case 413:
		navn= "Bibliotek";
		break;
	case 414:
		navn= "Kirke eller anden bygning til trosudøvelse for statsanerkendte trossamfund";
		break;
	case 415:
		navn= "Forsamlingshus";
		break;
	case 416:
		navn= "Forlystelsespark";
		break;
	case 419:
		navn= "Anden bygning til kulturelle formål";
		break;
	case 420:
		navn= "(UDFASES) Bygning til undervisning og forskning (skole, gymnasium, forskningslabratorium o.lign.). ";
		break;
	case 421:
		navn= "Grundskole";
		break;
	case 422:
		navn= "Universitet";
		break;
	case 429:
		navn= "Anden bygning til undervisning og forskning";
		break;
	case 430:
		navn= "(UDFASES) Bygning til hospital, sygehjem, fødeklinik o. lign.";
		break;
	case 431:
		navn= "Hospital og sygehus";
		break;
	case 432:
		navn= "Hospice, behandlingshjem mv.";
		break;
	case 433:
		navn= "Sundhedscenter, lægehus, fødeklinik mv.";
		break;
	case 439:
		navn= "Anden bygning til sundhedsformål";
		break;
	case 440:
		navn= "(UDFASES) Bygning til daginstitution";
		break;
	case 441:
		navn= "Daginstitution";
		break;
	case 442:
		navn= "Servicefunktion på døgninstitution";
		break;
	case 443:
		navn= "Kaserne";
		break;
	case 444:
		navn= "Fængsel, arresthus mv.";
		break;
	case 449:
		navn= "Anden bygning til institutionsformål";
		break;
	case 490:
		navn= "(UDFASES) Bygning til anden institution, herunder kaserne, fængsel o. lign.";
		break;
	case 510:
		navn= "Sommerhus";
		break;
	case 520:
		navn= "(UDFASES) Bygning til feriekoloni, vandrehjem o.lign. bortset fra sommerhus";
		break;
	case 521:
		navn= "Feriecenter, center til campingplads mv.";
		break;
	case 522:
		navn= "Bygning med ferielejligheder til erhvervsmæssig udlejning";
		break;
	case 523:
		navn= "Bygning med ferielejligheder til eget brug";
		break;
	case 529:
		navn= "Anden bygning til ferieformål";
		break;
	case 530:
		navn= "(UDFASES) Bygning i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.) ";
		break;
	case 531:
		navn= "Klubhus i forbindelse med fritid og idræt";
		break;
	case 532:
		navn= "Svømmehal";
		break;
	case 533:
		navn= "Idrætshal";
		break;
	case 534:
		navn= "Tribune i forbindelse med stadion";
		break;
	case 535:
		navn= "Rideskole";
		break;
	case 539:
		navn= "Anden bygning til idrætformål";
		break;
	case 540:
		navn= "Kolonihavehus";
		break;
	case 585:
		navn= "Anneks i tilknytning til fritids- og sommerhus";
		break;
	case 590:
		navn= "Anden bygning til fritidsformål";
		break;
	case 910:
		navn= "Garage (med plads til et eller to køretøjer)";
		break;
	case 920:
		navn= "Carport";
		break;
	case 930:
		navn= "Udhus";
		break;
	case 940:
		navn= "Drivhus";
		break;
	case 950:
		navn= "Fritliggende overdækning";
		break;
	case 960:
		navn= "Fritliggende udestue";
		break;
	case 970:
		navn= "Tiloversbleven landbrugsbygning";
		break;
	case 990:
		navn= "Faldefærdig bygning";
		break;
	case 999:
		navn= "Ukendt bygning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getByggesagskode(kode) {
	switch (kode) { 
	case 1:
		navn= "BR - Tilladelsessag uden ibrugtagningstilladelse";
		break;
	case 2:
		navn= "BR - Anmeldelsessag (garager, carporte, udhuse og nedrivning)";
		break;
	case 3:
		navn= "BR - Tilladelsessag med ibrugtagningstilladelse";
		break;
	case 4:
		navn= "BR - Tilladelsessag landbrugsbygning";
		break;
	case 5:
		navn= "BR - Anmeldelsessag (øvrige)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getByggeskadeforsikringsselskab(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ingen byggeskadeforsikring";
		break;
	case 1:
		navn= "Tryg";
		break;
	case 2:
		navn= "Topdanmark";
		break;
	case 4:
		navn= "Codan";
		break;
	case 5:
		navn= "If Forsikring";
		break;
	case 6:
		navn= "Alm. Brand";
		break;
	case 7:
		navn= "Danske Forsikring";
		break;
	case 8:
		navn= "Caplloyd A/S";
		break;
	case 10:
		navn= "Købstædernes Forsikring";
		break;
	case 11:
		navn= "ALKA";
		break;
	case 12:
		navn= "Frida Forsikring Agentur";
		break;
	case 13:
		navn= "NemForsikring";
		break;
	case 14:
		navn= "AXA";
		break;
	case 15:
		navn= "Husejernes Forsikring";
		break;
	case 16:
		navn= "Garbo";
		break;
	case 17:
		navn= "Marsh og McLennan Agency A/S";
		break;
	case 18:
		navn= "First Marine";
		break;
	case 99:
		navn= "Ingen forsikring på grund af dispensation";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygherreForhold(kode) {
	switch (kode) { 
	case 10:
		navn= "Privatpersoner eller interessentskab";
		break;
	case 20:
		navn= "Alment boligselskab";
		break;
	case 30:
		navn= "Aktie-, anpart- eller andet selskab (undtagen interessent­skab)";
		break;
	case 40:
		navn= "Forening, legat eller selvejende institution";
		break;
	case 41:
		navn= "Privat andelsboligforening";
		break;
	case 50:
		navn= "Den kommune, hvori ejendommen er beliggende";
		break;
	case 60:
		navn= "Anden primærkommune";
		break;
	case 70:
		navn= "Region";
		break;
	case 80:
		navn= "Staten";
		break;
	case 90:
		navn= "Andet, herunder moderejendomme for bebyggelser, der er op­delt i ejerlejligheder samt ejendomme, der ejes af flere ka­te­gorier af ejere ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygningSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygnings nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Anvendelseskode (samt som klartekst i tooltip)";
		break;
	case 9:
		navn= "Sagsnummer";
		break;
	case 10:
		navn= "Opførelsesår";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygSupplerendeVarme(kode) {
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Varmepumpeanlæg";
		break;
	case 2:
		navn= "Ovne til fast brændsel (brændeovn o. lign.)";
		break;
	case 3:
		navn= "Ovne til flydende brændsel";
		break;
	case 4:
		navn= "Solpaneler";
		break;
	case 5:
		navn= "Pejs";
		break;
	case 6:
		navn= "Gasradiator";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 10:
		navn= "Biogasanlæg";
		break;
	case 80:
		navn= "Andet";
		break;
	case 90:
		navn= "Bygningen har ingen supplerende varme";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygVandforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Alment vandforsyningsanlæg (tidligere offentligt)";
		break;
	case 2:
		navn= "Privat, alment vandforsyningsanlæg";
		break;
	case 3:
		navn= "Enkeltindvindingsanlæg (egen boring til 1 eller 2 ejendomme)";
		break;
	case 4:
		navn= "Brønd";
		break;
	case 6:
		navn= "Ikke alment vandforsyningsanlæg (forsyner < 10 ejendomme)";
		break;
	case 7:
		navn= "Blandet vandforsyning";
		break;
	case 9:
		navn= "Ingen vandforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygVarmeinstallation(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Fjernvarme/blokvarme (radiatorsystemer el. varmluftanlæg)";
		break;
	case 2:
		navn= "Centralvarme fra eget anlæg, et-kammer fyr";
		break;
	case 3:
		navn= "Ovne (kakkelovne, kamin, brændeovne o.l.)";
		break;
	case 5:
		navn= "Varmepumpe";
		break;
	case 6:
		navn= "Centralvarme med to fyringsenheder (fast og olie eller gas)";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 8:
		navn= "Gasradiator";
		break;
	case 9:
		navn= "Ingen varmeinstallation";
		break;
	case 99:
		navn= "Blandet (Kræver specifikation på enhedsniveau)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getDispensationFritagelseIftKollektivVarmeforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Dispensation er tidsbegrænset";
		break;
	case 2:
		navn= "Dispensationen er ikke tidsbegrænset";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getDriftstatus(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "I drift";
		break;
	case 2:
		navn= "Ikke i drift";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEjendomstype(kode) {
	switch (kode) { 
	case 1:
		navn= "Matrikuleret Areal";
		break;
	case 2:
		navn= "BPFG";
		break;
	case 3:
		navn= "Ejerlejlighed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEjerforholdskode(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 10:
		navn= "Privatpersoner eller interessentskab";
		break;
	case 20:
		navn= "Alment boligselskab";
		break;
	case 30:
		navn= "Aktie-, anpart- eller andet selskab (undtagen interessent­skab)";
		break;
	case 40:
		navn= "Forening, legat eller selvejende institution";
		break;
	case 41:
		navn= "Privat andelsboligforening";
		break;
	case 50:
		navn= "Den kommune, hvori ejendommen er beliggende";
		break;
	case 60:
		navn= "Anden primærkommune";
		break;
	case 70:
		navn= "Region";
		break;
	case 80:
		navn= "Staten";
		break;
	case 90:
		navn= "Andet, herunder moderejendomme for bebyggelser, der er opdelt i ejerlejligheder samt ejendomme, der ejes af flere kategorier af ejere ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getElevator(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Der er ikke elevator i opgangen/bygningen";
		break;
	case 1:
		navn= "Der findes person- eller vareelevator i opgangen/bygningen";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnergiforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Gas fra værk";
		break;
	case 2:
		navn= "230 V el fra værk";
		break;
	case 3:
		navn= "400 V el fra værk";
		break;
	case 4:
		navn= "Både 230 V el og gas fra værk";
		break;
	case 5:
		navn= "Både 400 V el og gas fra værk";
		break;
	case 6:
		navn= "Hverken el eller gas fra værk";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhAnvendelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 110:
		navn= "Stuehus til landbrugsejendom";
		break;
	case 120:
		navn= "Fritliggende enfamilieshus (parcelhus).";
		break;
	case 121:
		navn= "Sammenbygget enfamiliehus";
		break;
	case 130:
		navn= "(UDFASES) Række-, kæde- eller dobbelthus (lodret adskillelse mellem enhederne).";
		break;
	case 131:
		navn= "Række- og kædehus";
		break;
	case 132:
		navn= "Dobbelthus";
		break;
	case 140:
		navn= "Bolig i etageejendom, flerfamiliehus eller to-familiehus";
		break;
	case 150:
		navn= "Kollegiebolig";
		break;
	case 160:
		navn= "Bolig i døgninstitution";
		break;
	case 185:
		navn= "Anneks i tilknytning til helårsbolig";
		break;
	case 190:
		navn= "Anden enhed til helårsbeboelse";
		break;
	case 210:
		navn= "(UDFASES) Erhvervsmæssig produktion vedrørende landbrug, skovbrug, gartneri, råstofudvinding og lign. ";
		break;
	case 211:
		navn= "Stald til svin";
		break;
	case 212:
		navn= "Stald til kvæg, får mv.";
		break;
	case 213:
		navn= "Stald til fjerkræ";
		break;
	case 214:
		navn= "Minkhal";
		break;
	case 215:
		navn= "Væksthus";
		break;
	case 216:
		navn= "Lade til foder, afgrøder mv.";
		break;
	case 217:
		navn= "Maskinhus, garage mv.";
		break;
	case 218:
		navn= "Lade til halm, hø mv.";
		break;
	case 219:
		navn= "Anden enhed til landbrug mv.";
		break;
	case 220:
		navn= "(UDFASES) Erhvervsmæssig produktion vedrørende industri, håndværk m.v. (fabrik, værksted o. lign.) ";
		break;
	case 221:
		navn= "Enhed til industri med integreret produktionsapparat";
		break;
	case 222:
		navn= "Enhed til industri uden integreret produktionsapparat";
		break;
	case 223:
		navn= "Værksted";
		break;
	case 229:
		navn= "Anden enhed til produktion";
		break;
	case 230:
		navn= "(UDFASES) El-, gas-, vand- eller varmeværk, forbrændingsanstalt o. lign.";
		break;
	case 231:
		navn= "Enhed til energiproduktion";
		break;
	case 232:
		navn= "Enhed til forsyning- og energidistribution";
		break;
	case 233:
		navn= "Enhed til vandforsyning";
		break;
	case 234:
		navn= "Enhed til håndtering af affald og spildevand";
		break;
	case 239:
		navn= "Anden enhed til energiproduktion og -distribution";
		break;
	case 290:
		navn= "(UDFASES) Anden enhed til produktion og lager i forbindelse med landbrug, industri o. lign. ";
		break;
	case 310:
		navn= "(UDFASES) Transport- og garageanlæg (fragtmandshal, lufthavnsbygning,banegårdsbygning o. lign.) ";
		break;
	case 311:
		navn= "Enhed til jernbane- og busdrift";
		break;
	case 312:
		navn= "Enhed til luftfart";
		break;
	case 313:
		navn= "Enhed til parkerings- og transportanlæg";
		break;
	case 314:
		navn= "Enhed til parkering af flere end to køretøjer i tilknytning til boliger";
		break;
	case 315:
		navn= "Havneanlæg";
		break;
	case 319:
		navn= "Andet transportanlæg";
		break;
	case 320:
		navn= "(UDFASES) Engroshandel og lager.";
		break;
	case 321:
		navn= "Enhed til kontor";
		break;
	case 322:
		navn= "Enhed til detailhandel";
		break;
	case 323:
		navn= "Enhed til lager";
		break;
	case 324:
		navn= "Butikscenter";
		break;
	case 325:
		navn= "Tankstation";
		break;
	case 329:
		navn= "Anden enhed til kontor, handel og lager";
		break;
	case 330:
		navn= "(UDFASES) Detailhandel m.v.";
		break;
	case 331:
		navn= "Hotel, kro eller konferencecenter med overnatning";
		break;
	case 332:
		navn= "Bed & breakfast mv.";
		break;
	case 333:
		navn= "Restaurant, café og konferencecenter uden overnatning";
		break;
	case 334:
		navn= "Privat servicevirksomhed som frisør, vaskeri, netcafé mv.";
		break;
	case 339:
		navn= "Anden enhed til serviceerhverv";
		break;
	case 340:
		navn= "(UDFASES) Pengeinstitut, forsikringsvirksomhed m.v.";
		break;
	case 350:
		navn= "(UDFASES) Kontor og liberale erhverv bortset fra offentlig administration (kontorer for advokater, rådgivende ingeniører, klinikker o.lign.) ";
		break;
	case 360:
		navn= "(UDFASES) Offentlig administration.";
		break;
	case 370:
		navn= "(UDFASES) Hotel, restauration, vaskeri, frisør og anden servicevirksomhed.";
		break;
	case 390:
		navn= "(UDFASES) Anden enhed til handel, transport etc.";
		break;
	case 410:
		navn= "(UDFASES) Biograf, teater, erhvervsmæssig udstilling m.v.";
		break;
	case 411:
		navn= "Biograf, teater, koncertsted mv.";
		break;
	case 412:
		navn= "Museum";
		break;
	case 413:
		navn= "Bibliotek";
		break;
	case 414:
		navn= "Kirke eller anden enhed til trosudøvelse for statsanerkendte trossamfund";
		break;
	case 415:
		navn= "Forsamlingshus";
		break;
	case 416:
		navn= "Forlystelsespark";
		break;
	case 419:
		navn= "Anden enhed til kulturelle formål";
		break;
	case 420:
		navn= "(UDFASES) Bibliotek, museum, kirke o. lign.";
		break;
	case 421:
		navn= "Grundskole";
		break;
	case 422:
		navn= "Universitet";
		break;
	case 429:
		navn= "Anden enhed til undervisning og forskning";
		break;
	case 430:
		navn= "(UDFASES) Undervisning og forskning (skole, gymnasium, forskningslaboratorium).";
		break;
	case 431:
		navn= "Hospital og sygehus";
		break;
	case 432:
		navn= "Hospice, behandlingshjem mv.";
		break;
	case 433:
		navn= "Sundhedscenter, lægehus, fødeklinik mv.";
		break;
	case 439:
		navn= "Anden enhed til sundhedsformål";
		break;
	case 440:
		navn= "(UDFASES) Hospital, fødeklinik o. lign.";
		break;
	case 441:
		navn= "Daginstitution";
		break;
	case 442:
		navn= "Servicefunktion på døgninstitution";
		break;
	case 443:
		navn= "Kaserne";
		break;
	case 444:
		navn= "Fængsel, arresthus mv.";
		break;
	case 449:
		navn= "Anden enhed til institutionsformål";
		break;
	case 450:
		navn= "(UDFASES) Daginstitution.";
		break;
	case 490:
		navn= "(UDFASES) Anden institution, herunder kaserne, fængsel m.v.";
		break;
	case 510:
		navn= "Sommerhus.";
		break;
	case 520:
		navn= "(UDFASES) Enhed til feriekoloni, vandrehjem o.lign. bortset fra sommerhus";
		break;
	case 521:
		navn= "Feriecenter, center til campingplads mv.";
		break;
	case 522:
		navn= "Ferielejlighed til erhvervsmæssig udlejning";
		break;
	case 523:
		navn= "Ferielejlighed til eget brug";
		break;
	case 529:
		navn= "Anden enhed til ferieformål";
		break;
	case 530:
		navn= "(UDFASES) Enhed i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.). ";
		break;
	case 531:
		navn= "Klubhus i forbindelse med fritid- og idræt";
		break;
	case 532:
		navn= "Svømmehal";
		break;
	case 533:
		navn= "Idrætshal";
		break;
	case 534:
		navn= "Tribune i forbindelse med stadion";
		break;
	case 535:
		navn= "Rideskole";
		break;
	case 539:
		navn= "Anden enhed til idrætsformål";
		break;
	case 540:
		navn= "Kolonihavehus";
		break;
	case 585:
		navn= "Anneks i tilknytning til fritids- og sommerhus";
		break;
	case 590:
		navn= "Anden enhed til fritidsformål";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhedHvorSkalEnhedVises(kode) {
	switch (kode) { 
	case 0:
		navn= "Vis Enheder under Opgange";
		break;
	case 1:
		navn= "Vis Enheder under Etager";
		break;
	case 2:
		navn= "Vis Enheder under både Opgange og Etager";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhedSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygnings nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Etage";
		break;
	case 5:
		navn= "Side/dør";
		break;
	case 6:
		navn= "Postnummer";
		break;
	case 7:
		navn= "Postdistrikt";
		break;
	case 8:
		navn= "Anvendelseskode (samt som klartekst i tooltip)";
		break;
	case 10:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhSupplerendeVarme(kode) {
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Varmepumpeanlæg";
		break;
	case 2:
		navn= "Ovne til fast brændsel (brændeovn o. lign.)";
		break;
	case 3:
		navn= "Ovne til flydende brændsel";
		break;
	case 4:
		navn= "Solpaneler";
		break;
	case 5:
		navn= "Pejs";
		break;
	case 6:
		navn= "Gasradiator";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 10:
		navn= "Biogasanlæg";
		break;
	case 80:
		navn= "Andet";
		break;
	case 90:
		navn= "Bygningen har ingen supplerende varme";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhVarmeinstallation(kode) {
	switch (kode) { 
	case 1:
		navn= "Fjernvarme/blokvarme (radiatorsystemer el. varmluftanlæg)";
		break;
	case 2:
		navn= "Centralvarme fra eget anlæg, et-kammer fyr";
		break;
	case 3:
		navn= "Ovne (kakkelovne, kamin, brændeovne o.l.)";
		break;
	case 5:
		navn= "Varmepumpe";
		break;
	case 6:
		navn= "Centralvarme med to fyringsenheder (fast og olie eller gas)";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 8:
		navn= "Gasradiator";
		break;
	case 9:
		navn= "Ingen varmeinstallation";
		break;
	case 99:
		navn= "Blandet (Kræver specifikation på enhedsniveau)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEtageSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Etagebetegnelse";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEtageType(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke tagetage";
		break;
	case 1:
		navn= "Tagetage";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getFordelingsnoegle(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Manuel fordeling";
		break;
	case 2:
		navn= "Ligelig fordeling";
		break;
	case 3:
		navn= "Institutions fordeling";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsHaendelse(kode) {
	switch (kode) { 
	case "BUH":
		navn= "Bygning uden Husnummer";
		break;
	case "BYG":
		navn= "Bygning";
		break;
	case "ENH":
		navn= "Enhed";
		break;
	case "GRU":
		navn= "Grund";
		break;
	case "SAG":
		navn= "BBR-sag";
		break;
	case "TEK":
		navn= "Teknisk Anlæg";
		break;
	case "TUH":
		navn= "Teknisk Anlæg uden Husnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsOmraade(kode) {
	switch (kode) { 
	case "BBR":
		navn= "54.15.05.05";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsProcess(kode) {
	switch (kode) { 
	case 0:
		navn= "Ikke angivet";
		break;
	case 1:
		navn= "Oprettet grundet nybyggeri";
		break;
	case 2:
		navn= "Opdateret grundet til/ombygning";
		break;
	case 3:
		navn= "Opdateret grundet nedrivning";
		break;
	case 4:
		navn= "Fejlrettelse af faktiske fejlregistreringer og udeladelser";
		break;
	case 5:
		navn= "Faktisk udført ændring uden byggesagsbehandling";
		break;
	case 6:
		navn= "Opdeling af enheder";
		break;
	case 7:
		navn= "Sammenlægning af enheder";
		break;
	case 8:
		navn= "Opdateret som følge af digital indberetning fra borger mm.";
		break;
	case 9:
		navn= "Opdateret som følge af digital indberetning fra SKAT";
		break;
	case 10:
		navn= "Anmeldelsessag";
		break;
	case 11:
		navn= "Tilladelsessag";
		break;
	case 12:
		navn= "Opdateret grundet ændring i grunddataregister: Matriklen";
		break;
	case 13:
		navn= "Opdateret grundet ændring i grunddataregister: DAR";
		break;
	case 14:
		navn= "Opdateret grundet ændring i grunddataregister: Ejerfortegnelsen";
		break;
	case 15:
		navn= "Opdateret grundet ændring i grunddataregister: Ejendomsbeliggenhedsregisteret";
		break;
	case 16:
		navn= "Automatisk lukning af anmeldelsessag";
		break;
	case 17:
		navn= "Flytning af underliggende elementer på matrikel (Matrikulær ændring)";
		break;
	case 18:
		navn= "Fordelingsareal af fordelingsareal";
		break;
	case 19:
		navn= "Opdateret grundet ændret Sikkerhedsklassificering";
		break;
	case 20:
		navn= "Fremdatering af indflytning";
		break;
	case 21:
		navn= "Opdatering af indberetning";
		break;
	case 22:
		navn= "ESR Event Processering";
		break;
	case 23:
		navn= "AWS Event Processering";
		break;
	case 24:
		navn= "Indberetnings services";
		break;
	case 25:
		navn= "SKATServices";
		break;
	case 26:
		navn= "EnergiindberetningProcessering";
		break;
	case 27:
		navn= "EJDbATilknytningHusnummerService";
		break;
	case 28:
		navn= "BPFG Tilknyttet gennem Ajorføring hos MU";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsProcessUI(kode) {
	switch (kode) { 
	case 4:
		navn= "Fejlrettelse af faktiske fejlregistreringer og udeladelser";
		break;
	case 5:
		navn= "Faktisk udført ændring uden byggesagsbehandling";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsProcessUIBygningEnhed(kode) {
	switch (kode) { 
	case 4:
		navn= "Fejlrettelse af faktiske fejlregistreringer og udeladelser";
		break;
	case 5:
		navn= "Faktisk udført ændring uden byggesagsbehandling";
		break;
	case 6:
		navn= "Opdeling af enheder";
		break;
	case 7:
		navn= "Sammenlægning af enheder";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getFredning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Bygningen fredet iht. bygningsfredningsloven";
		break;
	case 2:
		navn= "Som 1, men med tinglyste bevaringsbestemmelser jf. lovens §15";
		break;
	case 3:
		navn= "Tinglyst bevaringsdeklaration, men bygningen ikke fredet";
		break;
	case 4:
		navn= "På bygningens middelalderlige bygningsdele er der tinglyst fredningsbestemmelser";
		break;
	case 5:
		navn= "Bygningen indeholder middelalderlige bygningsdele";
		break;
	case 6:
		navn= "Bygningen og dens umiddelbare omgivelser fredet iht. bygningsfredningsloven";
		break;
	case 7:
		navn= "Som 6, men med tinglyst bevaringsdeklaration";
		break;
	case 8:
		navn= "Bygningen bevaringsværdig";
		break;
	case 9:
		navn= "Bygningen medtaget i registrant, bevaringsplan mm.";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGodkendtTomBolig(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Krav om persontilmelding";
		break;
	case 100:
		navn= "Bolig uden krav om persontilmelding";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGruAfloebsforhold(kode) {
	switch (kode) { 
	case 1:
		navn= "Fælleskloakeret: spildevand + tag- og overfladevand";
		break;
	case 2:
		navn= "Fælleskloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 3:
		navn= "Fælleskloakeret: spildevand";
		break;
	case 4:
		navn= "Fælleskloakeret: tag- og overfladevand";
		break;
	case 5:
		navn= "Separatkloakeret: spildevand + tag- og overfladevand";
		break;
	case 6:
		navn= "Separatkloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 7:
		navn= "Separatkloakeret: spildevand";
		break;
	case 8:
		navn= "Separatkloakeret: tag- og overfladevand";
		break;
	case 9:
		navn= "Spildevandskloakeret: Spildevand";
		break;
	case 10:
		navn= "Afløb til spildevandsforsyningens renseanlæg";
		break;
	case 11:
		navn= "Afløb til fællesprivat spildevandsanlæg";
		break;
	case 12:
		navn= "Afløb til fællesprivat kloakledning med tilslutning til spv. renseanlæg";
		break;
	case 20:
		navn= "Afløb til samletank";
		break;
	case 21:
		navn= "Afløb til samletank for toiletvand og mek. rensning af øvr. spildevand";
		break;
	case 29:
		navn= "Mekanisk rensning med nedsivningsanlæg med tilladelse";
		break;
	case 30:
		navn= "Mekanisk rensning med nedsivningsanlæg (tilladelse ikke påkrævet)";
		break;
	case 31:
		navn= "Mekanisk rensning med privat udledn. dir. til vandløb, sø eller hav";
		break;
	case 32:
		navn= "Mekanisk og biologisk rensning (ældre anlæg uden renseklasse)";
		break;
	case 70:
		navn= "Udledning uden rensning direkte til vandløb, søer eller havet";
		break;
	case 75:
		navn= "Blandet afløbsforhold på ejendommen (er specificeret på bygningen)";
		break;
	case 80:
		navn= "Anden type afløb";
		break;
	case 90:
		navn= "Ingen udledning";
		break;
	case 101:
		navn= "SOP: Minirenseanlæg med direkte udledning";
		break;
	case 102:
		navn= "SOP: Minirenseanlæg med udledning til markdræn";
		break;
	case 103:
		navn= "SOP: Minirenseanlæg med nedsivning i faskine";
		break;
	case 104:
		navn= "SOP: Nedsivning til sivedræn";
		break;
	case 105:
		navn= "SOP: Samletank";
		break;
	case 106:
		navn= "SOP: Pileanlæg med nedsivning (uden membran)";
		break;
	case 107:
		navn= "SOP: Pileanlæg uden udledning (med membran)";
		break;
	case 108:
		navn= "SOP: Beplantede filteranlæg med nedsivning i faskine";
		break;
	case 109:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og direkte udledning";
		break;
	case 110:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og udledning til markdræn";
		break;
	case 190:
		navn= "SOP: Andet";
		break;
	case 201:
		navn= "SO: Biologisk sandfilter med direkte udledning";
		break;
	case 202:
		navn= "SO: Biologisk sandfilter med udledning til markdræn";
		break;
	case 203:
		navn= "SO: Minirensanlæg med direkte udledning";
		break;
	case 204:
		navn= "SO: Minirenseanlæg med udledning til markdræn";
		break;
	case 205:
		navn= "SO: Beplantede filteranlæg med direkte udledning";
		break;
	case 206:
		navn= "SO: Beplantede filteranlæg med udledning til markdræn";
		break;
	case 290:
		navn= "SO: Andet";
		break;
	case 301:
		navn= "OP: Minirenseanlæg med direkte udledning";
		break;
	case 302:
		navn= "OP: Minirenseanlæg med udledning til markdræn";
		break;
	case 390:
		navn= "OP: Andet";
		break;
	case 401:
		navn= "O: Rodzoneanlæg med direkte udledning";
		break;
	case 402:
		navn= "O: Rodzoneanlæg med udledning til markdræn";
		break;
	case 403:
		navn= "O: Minirenseanlæg med direkte udledning";
		break;
	case 404:
		navn= "O: Minirenseanlæg med udledning til markdræn";
		break;
	case 490:
		navn= "O: Andet";
		break;
	case 501:
		navn= "Øvrige renseløsninger: Mekanisk med direkte udledning";
		break;
	case 502:
		navn= "Øvrige renseløsninger: Mekanisk med udledning til markdræn";
		break;
	case 503:
		navn= "Øvrige renseløsninger: Ældre nedsivningsanlæg med nedsivning til sivebrønd";
		break;
	case 504:
		navn= "Øvrige renseløsninger: Udledning til jordoverfladen";
		break;
	case 505:
		navn= "Øvrige renseløsninger: Urenset";
		break;
	case 590:
		navn= "Øvrige renseløsninger: Andet";
		break;
	case 601:
		navn= "Anden type afløb (større end 30 PE med egen udledning)";
		break;
	case 701:
		navn= "Intet afløb";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGrundSortering(kode) {
	switch (kode) { 
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Ejerforholdskode (samt som klartekst i tooltip)";
		break;
	case 7:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGrundViewType(kode) {
	switch (kode) { 
	case 0:
		navn= "Stamdata";
		break;
	case 1:
		navn= "Grundoplysninger";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGruVandforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Alment vandforsyningsanlæg (tidligere offentligt)";
		break;
	case 2:
		navn= "Privat, alment vandforsyningsanlæg";
		break;
	case 3:
		navn= "Enkeltindvindingsanlæg (egen boring til 1 eller 2 ejendomme)";
		break;
	case 4:
		navn= "Brønd";
		break;
	case 6:
		navn= "Ikke alment vandforsyningsanlæg (forsyner < 10 ejendomme)";
		break;
	case 7:
		navn= "Blandet vandforsyning";
		break;
	case 9:
		navn= "Ingen vandforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGulvbelaegning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Beton";
		break;
	case 2:
		navn= "Andet";
		break;
	case 3:
		navn= "Ingen";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getHenvendelserDirekteIndberetning(kode) {
	switch (kode) { 
	case 0:
		navn= "Ingen";
		break;
	case 1:
		navn= "Få";
		break;
	case 2:
		navn= "Mange";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getHusnummerRolle(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Fastsat til denne";
		break;
	case 1:
		navn= "Kun vejledende";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getHusnummerType(kode) {
	switch (kode) { 
	case 2:
		navn= "Lige husnr.";
		break;
	case 3:
		navn= "Ulige husnr.";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getIndberetningRolle(kode) {
	switch (kode) { 
	case 0:
		navn= "Alle";
		break;
	case 1:
		navn= "BBR Erhvervsservice SKAT";
		break;
	case 2:
		navn= "Ejer";
		break;
	case 3:
		navn= "Repræsentant for ejer";
		break;
	case 4:
		navn= "Lejer";
		break;
	case 5:
		navn= "Administrator";
		break;
	case 6:
		navn= "Callcenter medarbejder";
		break;
	case 7:
		navn= "Andet";
		break;
	case 8:
		navn= "Landinspektør";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getIndhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 10:
		navn= "Mineralske olieprodukter (Olietankbekendtgørelsens §6, stk. 1 nr. 13)";
		break;
	case 11:
		navn= "Fuelolie (”tung fuelolie” - kræver opvarmning)";
		break;
	case 12:
		navn= "Fyringsgasolie";
		break;
	case 13:
		navn= "Autogasolie (Dieselolie)";
		break;
	case 14:
		navn= "Benzin";
		break;
	case 20:
		navn= "Biobrændstoffer (Organiske olieprodukter som f.eks. rapsolie, bioethanol m.v.)";
		break;
	case 30:
		navn= "Affaldsprodukter";
		break;
	case 31:
		navn= "Oliebaserede affaldsprodukter (Spildolie)";
		break;
	case 40:
		navn= "Gylle";
		break;
	case 50:
		navn= "Ajle, ensilagesaft, mælkerumsvand eller møddingvand";
		break;
	case 60:
		navn= "Øvrige stoffer, produkter og materialer der kan forurene grundvand, jord og undergrund (§ 19) ";
		break;
	case 70:
		navn= "Korn";
		break;
	case 99:
		navn= "Andet (f.eks. foderstoffer m.v)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKilde(kode) {
	switch (kode) { 
	case 0:
		navn= "Alle";
		break;
	case 1:
		navn= "Ret BBR";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKildeTilKoordinatsaet(kode) {
	let navn= '';
	switch (kode) { 
	case "E":
		navn= "Ejer";
		break;
	case "K":
		navn= "Kommune";
		break;
	case "L":
		navn= "Landinspektør";
		break;
	case "M":
		navn= "Maskinelt dannet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKildeTilOplysninger(kode) {
	let navn= "";
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Oplyst af ejer (eller dennes repræsentant)";
		break;
	case 2:
		navn= "Oplyst af teknisk forvaltning";
		break;
	case 3:
		navn= "Oplyst af andre (lukket for indberetning)";
		break;
	case 4:
		navn= "Maskinelt oprettet";
		break;
	case 5:
		navn= "Oplyst og kontrolleret af teknisk forvaltning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKlassifikation(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1110:
		navn= "Tank (Produkt på væskeform)";
		break;
	case 1120:
		navn= "Silo (Produkt på fast form)";
		break;
	case 1130:
		navn= "Gasbeholder (Produkt på gasform)";
		break;
	case 1140:
		navn= "Affaldsbeholder";
		break;
	case 1210:
		navn= "Vindmølle (elproducerende)";
		break;
	case 1220:
		navn= "Slanger til jordvarme";
		break;
	case 1230:
		navn= "Solvarme-/ solcelleanlæg";
		break;
	case 1240:
		navn= "Nødstrømsforsyningsanlæg";
		break;
	case 1250:
		navn= "Transformerstation";
		break;
	case 1260:
		navn= "Elskab";
		break;
	case 1265:
		navn= "Naturgasfyr";
		break;
	case 1270:
		navn= "Andet energiproducerende eller - distribuerende anlæg";
		break;
	case 1275:
		navn= "Halmfyr";
		break;
	case 1280:
		navn= "Biogasanlæg";
		break;
	case 1310:
		navn= "Vandtårn";
		break;
	case 1320:
		navn= "Pumpestation";
		break;
	case 1330:
		navn= "Swimmingpool";
		break;
	case 1340:
		navn= "Private rensningsanlæg f.eks. pileanlæg, nedsivningsanlæg";
		break;
	case 1350:
		navn= "Offentlige rensningsanlæg";
		break;
	case 1360:
		navn= "Regnvandsanlæg";
		break;
	case 1905:
		navn= "Legeplads";
		break;
	case 1910:
		navn= "Teknikhus";
		break;
	case 1915:
		navn= "Døgnpostboks";
		break;
	case 1920:
		navn= "Køleanlæg (herunder aircondition)";
		break;
	case 1925:
		navn= "Kunstværk (springvand, mindesmærker m.v.)";
		break;
	case 1930:
		navn= "Sirene / mast med sirene";
		break;
	case 1935:
		navn= "Skilt";
		break;
	case 1940:
		navn= "Antenne / mast fx tv, radio- og telekommunikation";
		break;
	case 1945:
		navn= "Dambrug";
		break;
	case 1950:
		navn= "Møddingsanlæg";
		break;
	case 1955:
		navn= "Andet teknisk anlæg";
		break;
	case 1960:
		navn= "Ensilageanlæg";
		break;
	case 1965:
		navn= "Planlager";
		break;
	case 1970:
		navn= "Fortidsminde, historisk ruin";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKodeForMereEndEnLejlighed(kode) {
	switch (kode) { 
	case "E":
		navn= "En enhed";
		break;
	case "M":
		navn= "Mere end 1 enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKoekkenforhold(kode) {
	let navn= '';
	switch (kode) { 
	case "E":
		navn= "Eget køkken (med afløb og kogeinstallation)";
		break;
	case "F":
		navn= "Adgang til fælles køkken";
		break;
	case "G":
		navn= "Fast kogeinstallation i værelse eller på gang";
		break;
	case "H":
		navn= "Ingen fast kogeinstallation";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKommuneFelterNiveau(kode) {
	switch (kode) { 
	case 0:
		navn= "Grund";
		break;
	case 1:
		navn= "Bygning";
		break;
	case 2:
		navn= "Opgang";
		break;
	case 3:
		navn= "Etage";
		break;
	case 4:
		navn= "Enhed";
		break;
	case 5:
		navn= "Teknisk Anlæg";
		break;
	case 6:
		navn= "Fordelingsareal";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKommunekode(kode) {
	switch (kode) { 
	case 101:
		navn= "Københavns Kommune";
		break;
	case 147:
		navn= "Frederiksberg Kommune";
		break;
	case 151:
		navn= "Ballerup Kommune";
		break;
	case 153:
		navn= "Brøndby Kommune";
		break;
	case 155:
		navn= "Dragør Kommune";
		break;
	case 157:
		navn= "Gentofte Kommune";
		break;
	case 159:
		navn= "Gladsaxe Kommune";
		break;
	case 161:
		navn= "Glostrup Kommune";
		break;
	case 163:
		navn= "Herlev Kommune";
		break;
	case 165:
		navn= "Albertslund Kommune";
		break;
	case 167:
		navn= "Hvidovre Kommune";
		break;
	case 169:
		navn= "Høje Taastrup Kommune";
		break;
	case 173:
		navn= "Lyngby-Taarbæk Kommune";
		break;
	case 175:
		navn= "Rødovre Kommune";
		break;
	case 183:
		navn= "Ishøj Kommune";
		break;
	case 185:
		navn= "Tårnby Kommune";
		break;
	case 187:
		navn= "Vallensbæk Kommune";
		break;
	case 190:
		navn= "Furesø Kommune";
		break;
	case 201:
		navn= "Allerød Kommune";
		break;
	case 210:
		navn= "Fredensborg Kommune";
		break;
	case 217:
		navn= "Helsingør Kommune";
		break;
	case 219:
		navn= "Hillerød Kommune";
		break;
	case 223:
		navn= "Hørsholm Kommune";
		break;
	case 230:
		navn= "Rudersdal Kommune";
		break;
	case 240:
		navn= "Egedal Kommune";
		break;
	case 250:
		navn= "Frederikssund Kommune";
		break;
	case 253:
		navn= "Greve Kommune";
		break;
	case 259:
		navn= "Køge Kommune";
		break;
	case 260:
		navn= "Halsnæs Kommune";
		break;
	case 265:
		navn= "Roskilde Kommune";
		break;
	case 269:
		navn= "Solrød Kommune";
		break;
	case 270:
		navn= "Gribskov Kommune";
		break;
	case 306:
		navn= "Odsherred Kommune";
		break;
	case 316:
		navn= "Holbæk Kommune";
		break;
	case 320:
		navn= "Faxe Kommune";
		break;
	case 326:
		navn= "Kalundborg Kommune";
		break;
	case 329:
		navn= "Ringsted Kommune";
		break;
	case 330:
		navn= "Slagelse Kommune";
		break;
	case 336:
		navn= "Stevns Kommune";
		break;
	case 340:
		navn= "Sorø Kommune";
		break;
	case 350:
		navn= "Lejre Kommune";
		break;
	case 360:
		navn= "Lolland Kommune";
		break;
	case 370:
		navn= "Næstved Kommune";
		break;
	case 376:
		navn= "Guldborgsund Kommune";
		break;
	case 390:
		navn= "Vordingborg Kommune";
		break;
	case 400:
		navn= "Bornholms Regionskommune";
		break;
	case 410:
		navn= "Middelfart Kommune";
		break;
	case 420:
		navn= "Assens Kommune";
		break;
	case 430:
		navn= "Faaborg-Midtfyn Kommune";
		break;
	case 440:
		navn= "Kerteminde Kommune";
		break;
	case 450:
		navn= "Nyborg Kommune";
		break;
	case 461:
		navn= "Odense Kommune";
		break;
	case 479:
		navn= "Svendborg Kommune";
		break;
	case 480:
		navn= "Nordfyns Kommune";
		break;
	case 482:
		navn= "Langeland Kommune";
		break;
	case 492:
		navn= "Ærø Kommune";
		break;
	case 510:
		navn= "Haderslev Kommune";
		break;
	case 530:
		navn= "Billund Kommune";
		break;
	case 540:
		navn= "Sønderborg Kommune";
		break;
	case 550:
		navn= "Tønder Kommune";
		break;
	case 561:
		navn= "Esbjerg Kommune";
		break;
	case 563:
		navn= "Fanø Kommune";
		break;
	case 573:
		navn= "Varde Kommune";
		break;
	case 575:
		navn= "Vejen Kommune";
		break;
	case 580:
		navn= "Aabenraa Kommune";
		break;
	case 607:
		navn= "Fredericia Kommune";
		break;
	case 615:
		navn= "Horsens Kommune";
		break;
	case 621:
		navn= "Kolding Kommune";
		break;
	case 630:
		navn= "Vejle Kommune";
		break;
	case 657:
		navn= "Herning Kommune";
		break;
	case 661:
		navn= "Holstebro Kommune";
		break;
	case 665:
		navn= "Lemvig Kommune";
		break;
	case 671:
		navn= "Struer Kommune";
		break;
	case 706:
		navn= "Syddjurs Kommune";
		break;
	case 707:
		navn= "Norddjurs Kommune";
		break;
	case 710:
		navn= "Favrskov Kommune";
		break;
	case 727:
		navn= "Odder Kommune";
		break;
	case 730:
		navn= "Randers Kommune";
		break;
	case 740:
		navn= "Silkeborg Kommune";
		break;
	case 741:
		navn= "Samsø Kommune";
		break;
	case 746:
		navn= "Skanderborg Kommune";
		break;
	case 751:
		navn= "Aarhus Kommune";
		break;
	case 756:
		navn= "Ikast-Brande Kommune";
		break;
	case 760:
		navn= "Ringkøbing-Skjern Kommune";
		break;
	case 766:
		navn= "Hedensted Kommune";
		break;
	case 773:
		navn= "Morsø Kommune";
		break;
	case 779:
		navn= "Skive Kommune";
		break;
	case 787:
		navn= "Thisted Kommune";
		break;
	case 791:
		navn= "Viborg Kommune";
		break;
	case 810:
		navn= "Brønderslev Kommune";
		break;
	case 813:
		navn= "Frederikshavn Kommune";
		break;
	case 820:
		navn= "Vesthimmerlands Kommune";
		break;
	case 825:
		navn= "Læsø Kommune";
		break;
	case 840:
		navn= "Rebild Kommune";
		break;
	case 846:
		navn= "Mariagerfjord Kommune";
		break;
	case 849:
		navn= "Jammerbugt Kommune";
		break;
	case 851:
		navn= "Aalborg Kommune";
		break;
	case 860:
		navn= "Hjørring Kommune";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKondemneretBoligenhed(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke kondemneret boligenhed";
		break;
	case 1:
		navn= "Kondemneret boligenhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKonstruktion(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Åben konstruktion";
		break;
	case 2:
		navn= "Lukket konstruktion";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKonstruktionsforhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Bygningen har jernbetonskelet";
		break;
	case 2:
		navn= "Bygningen har ikke jernbetonskelet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKoordinatsystem(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "System 34";
		break;
	case 2:
		navn= "System 45";
		break;
	case 3:
		navn= "KP2000 (System 2000)";
		break;
	case 4:
		navn= "UTM ED50";
		break;
	case 5:
		navn= "UTM Euref89 (WGS 84)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKvalitetAfKoordinatsaet(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Sikker geokodning";
		break;
	case 2:
		navn= "Næsten sikker";
		break;
	case 3:
		navn= "Usikker geokodning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getLivscyklus(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Start";
		break;
	case 2:
		navn= "Projekteret";
		break;
	case 3:
		navn= "Under opførsel";
		break;
	case 4:
		navn= "Sagsgrund";
		break;
	case 5:
		navn= "Oprettet";
		break;
	case 6:
		navn= "Opført";
		break;
	case 7:
		navn= "Gældende";
		break;
	case 8:
		navn= "Godkendt";
		break;
	case 9:
		navn= "Afsluttet";
		break;
	case 10:
		navn= "Slettet";
		break;
	case 11:
		navn= "Fejlregistreret";
		break;
	case 12:
		navn= "Midlertidig Afsluttet";
		break;
	case 13:
		navn= "Delvis Afsluttet";
		break;
	case 14:
		navn= "Henlagt";
		break;
	case 15:
		navn= "Modtaget";
		break;
	case 16:
		navn= "UnderBehandling";
		break;
	case 17:
		navn= "Afvist";
		break;
	case 18:
		navn= "Udført";
		break;
	case 19:
		navn= "Foreløbig";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getLovligAnvendelse(kode) {
	let navn= '';
	switch (kode) { 
	case "A":
		navn= "Gammelt helårshus eller ikke-personlig disp. til helårsbeboelse";
		break;
	case "B":
		navn= "Personlig, tidsbegrænset dispensation til helårsbeboelse";
		break;
	case "C":
		navn= "Personlig, ikke-tidsbegrænset dispensation til helårsbeboelse";
		break;
	case "D":
		navn= "Personlig, ikke-tidsbegrænset ret til helårsbeboelse for pensionister";
		break;
	case "E":
		navn= "Dispensation til afvikling af ulovlig helårsbeboelse";
		break;
	case "I":
		navn= "Ikke relevant for denne enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getMateriale(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Plast";
		break;
	case 2:
		navn= "Stål";
		break;
	case 3:
		navn= "Plasttank med udvendig stålvæg";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getMedlemsskabAfSplidevandforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Ikke medlemskab af spildevandsforsyning";
		break;
	case 2:
		navn= "Medlemskab af spildevandsforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getMidlertidigOprettelseEllerFuldfoersel(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygningen er ikke midlertidig oprettet";
		break;
	case 1:
		navn= "Bygningen er midlertidig oprettet, nybyggeri";
		break;
	case 2:
		navn= "Bygningen er midlertidig fuldført, nybyggeri";
		break;
	case 3:
		navn= "Bygningen er midlertidig oprettet, om-/tilbygning";
		break;
	case 4:
		navn= "Bygningen er midlertidig fuldført, om-/tilbygning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getNiveau(kode) {
	switch (kode) { 
	case "UMAT":
		navn= "Umatrikuleret";
		break;
	case "ALL":
		navn= "Alle";
		break;
	case "BYG":
		navn= "Bygning";
		break;
	case "EJD":
		navn= "Ejendom";
		break;
	case "ENH":
		navn= "Enhed";
		break;
	case "GRU":
		navn= "Grund";
		break;
	case "SAG":
		navn= "Byggesag";
		break;
	case "TEK":
		navn= "Teknisk Anlæg";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getNiveauType(kode) {
	switch (kode) { 
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "TekniskAnlaeg";
		break;
	case 4:
		navn= "Etage";
		break;
	case 5:
		navn= "Opgang";
		break;
	case 6:
		navn= "Enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOffentligStoette(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ingen offentlig støtte";
		break;
	case 10:
		navn= "Almen familiebolig";
		break;
	case 15:
		navn= "Støttet privat udlejningsbolig";
		break;
	case 20:
		navn= "Støttet privat andelsbolig";
		break;
	case 25:
		navn= "Almen ungdomsbolig";
		break;
	case 30:
		navn= "Støttet privat ungdomsbolig";
		break;
	case 40:
		navn= "Almen ældrebolig";
		break;
	case 42:
		navn= "Almen plejebolig";
		break;
	case 80:
		navn= "Serviceareal";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOmfattetAfByggeskadeforsikring(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Bygningen er ikke omfattet af byggeskadeforsikring";
		break;
	case 10:
		navn= "Bygningen er omfattet af byggeskadeforsikring";
		break;
	case 11:
		navn= "Bygningen er opført som selvbyg";
		break;
	case 12:
		navn= "Udlejningsejendom";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOpgangSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Vejkode";
		break;
	case 1:
		navn= "Vejnavn";
		break;
	case 2:
		navn= "Husnummer";
		break;
	case 3:
		navn= "Postnummer";
		break;
	case 4:
		navn= "Postdistrikt";
		break;
	case 5:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOpvarmningsmiddel(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Elektricitet";
		break;
	case 2:
		navn= "Gasværksgas";
		break;
	case 3:
		navn= "Flydende brændsel (olie, petroleum, flaskegas)";
		break;
	case 4:
		navn= "Fast brændsel (kul, koks, brænde mm.)";
		break;
	case 6:
		navn= "Halm";
		break;
	case 7:
		navn= "Naturgas";
		break;
	case 9:
		navn= "Andet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOversvoemmelsesselvrisiko(kode) {
	let navn= '';
	kode=parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ingen udbetalt erstatning fra Stormrådet";
		break;
	case 1:
		navn= "Bygningens selvrisiko er forhøjet til trin 1";
		break;
	case 2:
		navn= "Bygningens selvrisiko er forhøjet til trin 2";
		break;
	case 3:
		navn= "Stormrådet har registreret udbetalt erstatning fra stormflod (siden 2012) og oversvømmelse fra søer og vandløb (siden 2010). Læs mere om stormflods- og oversvømmelsesordningerne på www.stormraadet.dk ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getPaaSoeTerritorie(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke på søterritorie";
		break;
	case 1:
		navn= "På søterritorie";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getPlacering(kode) {
	switch (kode) { 
	case 0:
		navn= "Ukendt";
		break;
	case 1:
		navn= "Nedgravet/underjordisk";
		break;
	case 2:
		navn= "Over terræn, udendørs";
		break;
	case 3:
		navn= "Indendørs";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getPlaceringAfCursor(kode) {
	switch (kode) { 
	case 0:
		navn= "Vejkode";
		break;
	case 1:
		navn= "Vejnavn";
		break;
	case 2:
		navn= "Matrikel";
		break;
	case 4:
		navn= "Ejendomsnummer";
		break;
	case 5:
		navn= "BFE";
		break;
	case 6:
		navn= "Kviksøgning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getRensningspaabud(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Rensning ok. Intet påbud";
		break;
	case 2:
		navn= "Rensning skal forbedres til SOP";
		break;
	case 3:
		navn= "Rensning skal forbedres til SO";
		break;
	case 4:
		navn= "Rensning skal forbedres til OP";
		break;
	case 5:
		navn= "Rensning skal forbedres til O";
		break;
	case 6:
		navn= "Skal tilsluttes spildevandsforsyningsselskab";
		break;
	case 7:
		navn= "Skal tilsluttes separatkloakering";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSagsniveau(kode) {
	switch (kode) { 
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "TekniskAnlaeg";
		break;
	case 4:
		navn= "Etage";
		break;
	case 5:
		navn= "Opgang";
		break;
	case 6:
		navn= "Enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSagstype(kode) {
	switch (kode) { 
	case 0:
		navn= "Sag på grund";
		break;
	case 1:
		navn= "Nybyggeri";
		break;
	case 2:
		navn= "Til/ombygning";
		break;
	case 31:
		navn= "Nedrivning (delvis)";
		break;
	case 32:
		navn= "Nedrivning (hel)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSikkerhedsklassifikation(kode) {
	switch (kode) { 
	case 0:
		navn= "Er ikke omfattet af sikkerhedshensyn, jfr. afsnit 7";
		break;
	case 1:
		navn= "Er beskyttet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSloejfning(kode) {
	switch (kode) { 
	case 1:
		navn= "Tanken er afblændet";
		break;
	case 2:
		navn= "Tanken er tømt og afblændet";
		break;
	case 3:
		navn= "Tanken er tømt, afblændet og opfyldt";
		break;
	case 4:
		navn= "Tanken er tømt, afblændet og påfyldningsstuds samt udluftningsrør afmonteret";
		break;
	case 10:
		navn= "Jordvarmeslangerne er sløjfet/taget ud af drift";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getStandardSoegniveau(kode) {
	switch (kode) { 
	case 0:
		navn= "Alle";
		break;
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "Enhed";
		break;
	case 4:
		navn= "Teknisk Anlæg";
		break;
	case 5:
		navn= "Byggesag";
		break;
	case 6:
		navn= "Ejendom";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getStartside(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygning & bolig";
		break;
	case 1:
		navn= "Indbakke";
		break;
	case 2:
		navn= "Hændelseslog";
		break;
	case 3:
		navn= "Rapport";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getStoerrelsesklasse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Under 6.000 l";
		break;
	case 2:
		navn= "6.000 l - 100.000 l";
		break;
	case 3:
		navn= "Over 100.000 l";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeAnvendelseskode(kode) {
	switch (kode) { 
	case 210:
		navn= "Bygning til erhvervsmæssig produktion vedrørende landbrug, gartneri, råstofudvinding o. lign ";
		break;
	case 220:
		navn= "Bygning til erhvervsmæssig produktion vedrørende industri, håndværk m.v.";
		break;
	case 230:
		navn= "El-, gas-, vand- eller varmeværk, forbrændingsanstalt m.v.";
		break;
	case 290:
		navn= "Anden bygning til landbrug, industri etc.";
		break;
	case 310:
		navn= "Transport- og garageanlæg (fragtmandshal, lufthavnsbygning, banegårdsbygning, parkeringshus). Garage med plads til et eller to køretøjer registreres med anvendelseskode 910 ";
		break;
	case 320:
		navn= "Bygning til kontor, handel, lager, herunder offentlig administration";
		break;
	case 330:
		navn= "Bygning til hotel, restaurant, vaskeri, frisør og anden servicevirksomhed";
		break;
	case 390:
		navn= "Anden bygning til transport, handel etc";
		break;
	case 410:
		navn= "Bygning til biograf, teater, erhvervsmæssig udstilling, bibliotek, museum, kirke o. lign. ";
		break;
	case 420:
		navn= "Bygning til undervisning og forskning.";
		break;
	case 430:
		navn= "Bygning til hospital, sygehjem, fødeklinik o. lign.";
		break;
	case 440:
		navn= "Bygning til daginstitution";
		break;
	case 490:
		navn= "Bygning til anden institution, herunder kaserne, fængsel o. lign.";
		break;
	case 520:
		navn= "Bygning til ferieformål m.v., bortset fra sommerhus (feriekoloni, vandrehjem o. lign.)";
		break;
	case 530:
		navn= "Bygning i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.)";
		break;
	case 590:
		navn= "Anden bygning til fritidsformål";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeIndvendigKorrosionsbeskyttelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Glasfiberbelægning";
		break;
	case 2:
		navn= "Organisk belægning";
		break;
	case 3:
		navn= "Anoder";
		break;
	case 4:
		navn= "zinkstøvmaling";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeOplysningerOmKoordinatsaet(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 11:
		navn= "Koordinatsæt ligger i bygningen/anlægget (over jorden)";
		break;
	case 12:
		navn= "Koordinatsæt ligger i bygningen/anlægget (under jorden)";
		break;
	case 21:
		navn= "Koordinatsæt ligger i bygningen/anlægget (over jorden)";
		break;
	case 22:
		navn= "Koordinatsæt ligger i bygningen/anlægget (under jorden)";
		break;
	case 31:
		navn= "Koordinatsæt ligger på matriklen";
		break;
	case 32:
		navn= "Ukendt";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeVarme(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Varmepumpeanlæg";
		break;
	case 2:
		navn= "Ovne til fast brændsel (brændeovn o. lign.)";
		break;
	case 3:
		navn= "Ovne til flydende brændsel";
		break;
	case 4:
		navn= "Solpaneler";
		break;
	case 5:
		navn= "Pejs";
		break;
	case 6:
		navn= "Gasradiator";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 10:
		navn= "Biogasanlæg";
		break;
	case 80:
		navn= "Andet";
		break;
	case 90:
		navn= "Bygningen har ingen supplerende varme";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTagdaekningsmateriale(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Built-up";
		break;
	case 2:
		navn= "Tagpap (med taghældning)";
		break;
	case 3:
		navn= "Fibercement, herunder asbest (bølge- eller skifer-eternit)";
		break;
	case 4:
		navn= "Cementsten";
		break;
	case 5:
		navn= "Tegl";
		break;
	case 6:
		navn= "Metalplader (bølgeblik, aluminium, o.lign.)";
		break;
	case 7:
		navn= "Stråtag";
		break;
	case 10:
		navn= "Fibercement (asbestfri)";
		break;
	case 11:
		navn= "PVC";
		break;
	case 12:
		navn= "Glas";
		break;
	case 20:
		navn= "Grønne tage";
		break;
	case 80:
		navn= "Ingen";
		break;
	case 90:
		navn= "Andet materiale";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTekniskAnlaegBygningSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Teknisk anlægs nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Klassifikation (samt som klartekst i tool tip)";
		break;
	case 9:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTekniskAnlaegEnhedSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Teknisk anlægs nummer";
		break;
	case 1:
		navn= "Klassifikation (samt som klartekst i tool tip)";
		break;
	case 4:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTekniskAnlaegMatrikelSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Teknisk anlægs nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Klassifikation (samt som klartekst i tool tip)";
		break;
	case 9:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTilladelsesart(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Upersonlig tilladelse uden tidsbegrænsning";
		break;
	case 2:
		navn= "Personlig tilladelse uden tidsbegrænsning";
		break;
	case 3:
		navn= "Upersonlig tilladelse med tidsbegrænsing";
		break;
	case 4:
		navn= "Personlig tilladelse med tidsbegrænsing";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTilladelseTilAlternativBortskaffelseEllerAfledning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Tilladelse meddelt";
		break;
	case 2:
		navn= "Tilladelse bortfaldet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTilladelseTilUdtraeden(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Tilladelse meddelt";
		break;
	case 2:
		navn= "Tilladelse bortfaldet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getToiletforhold(kode) {
	let navn= '';
	switch (kode) { 
	case "A":
		navn= "Vandskyllende toilet udenfor enheden";
		break;
	case "B":
		navn= "Anden type toilet udenfor enheden eller intet toilet i forbindelse med enheden";
		break;
	case "T":
		navn= "Vandskyllende toiletter i bolig- eller erhvervsenheden";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTypeAfVaegge(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Enkeltvægget";
		break;
	case 2:
		navn= "Dobbeltvægget";
		break;
	case 3:
		navn= "Dobbeltvægget med overvågning";
		break;
	case 4:
		navn= "Overjordisk anlæg, hele anlægget er tilgængeligt for udvendig visuel inspektion";
		break;
	case 5:
		navn= "Tanke som er installeret før 1970, udvendig korrosionsbeskyttet bitumenbelægning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getUdledningstilladelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Udledningstilladelse mangler";
		break;
	case 2:
		navn= "Renseanlæg etableret før 1974, derfor ikke behov for tilladelse";
		break;
	case 3:
		navn= "Udledningstilladelse til enkeltprivat renseanlæg";
		break;
	case 4:
		navn= "Udledningstilladelse til fællesprivat renseanlæg";
		break;
	case 5:
		navn= "Der foreligger ingen kendt tilladelse";
		break;
	case 6:
		navn= "Der foreligger tilladelse";
		break;
	case 7:
		navn= "Tilladelsesforhold er oplyst på bygningsniveau";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getUdlejningsforhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Udlejet";
		break;
	case 2:
		navn= "Benyttet af ejeren";
		break;
	case 3:
		navn= "Ikke benyttet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getUdskrivningsmatrikel(kode) {
	switch (kode) { 
	case "J":
		navn= "Ja";
		break;
	case "M":
		navn= "Midlertidig";
		break;
	case "N":
		navn= "Nej";
		break;
	case "X":
		navn= "Slettet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getVandforsyning(kode) {
	switch (kode) { 
	case 1:
		navn= "Alment vandforsyningsanlæg (tidligere offentligt)";
		break;
	case 2:
		navn= "Privat, alment vandforsyningsanlæg";
		break;
	case 3:
		navn= "Enkeltindvindingsanlæg (egen boring til 1 eller 2 ejendomme)";
		break;
	case 4:
		navn= "Brønd";
		break;
	case 6:
		navn= "Ikke alment vandforsyningsanlæg (forsyner < 10 ejendomme)";
		break;
	case 7:
		navn= "Blandet vandforsyning";
		break;
	case 9:
		navn= "Ingen vandforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getVarmeinstallation(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Fjernvarme/blokvarme (radiatorsystemer el. varmluftanlæg)";
		break;
	case 2:
		navn= "Centralvarme fra eget anlæg, et-kammer fyr";
		break;
	case 3:
		navn= "Ovne (kakkelovne, kamin, brændeovne o.l.)";
		break;
	case 5:
		navn= "Varmepumpe";
		break;
	case 6:
		navn= "Centralvarme med to fyringsenheder (fast og olie eller gas)";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 8:
		navn= "Gasradiator";
		break;
	case 9:
		navn= "Ingen varmeinstallation";
		break;
	case 99:
		navn= "Blandet (Kræver specifikation på enhedsniveau)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getYdervaeggenesMateriale(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Mursten (tegl, kalksten, cementsten)";
		break;
	case 2:
		navn= "Letbeton (lette bloksten, gasbeton)";
		break;
	case 3:
		navn= "Plader af fibercement, herunder asbest (eternit el. lign.)";
		break;
	case 4:
		navn= "Bindingsværk (med udvendigt synligt træværk)";
		break;
	case 5:
		navn= "Træbeklædning";
		break;
	case 6:
		navn= "Betonelementer (etagehøje betonelementer)";
		break;
	case 8:
		navn= "Metalplader";
		break;
	case 10:
		navn= "Plader af fibercement (asbestfri)";
		break;
	case 11:
		navn= "PVC";
		break;
	case 12:
		navn= "Glas";
		break;
	case 80:
		navn= "Ingen";
		break;
	case 90:
		navn= "Andet materiale";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}


/***/ })
/******/ ]);