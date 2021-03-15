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
	  		attribution: 'Data</a> fra <a href="https://dawadocs.dataforsyningen.dk">DAWA</a> | Map data &copy;  <a href="https://sdfe.dk">SDFE</a>',
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

function multi() { 
  
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

  let lag= JSON.parse(query.lag);
  console.log(lag);

  fetch('/getticket').then(function (response) {
    response.text().then(function (ticket) {      
      vis.setMap(kort.viskort('map', ticket, options));
      var center= kort.beregnCenter();
      vis.getMap().setView(center,2);
      vis.visLag(lag);
    });
  });  
}

multi();

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
    , queryString = __webpack_require__(5);

var map= null;

exports.setMap= function (m) {
  map= m;
}

exports.getMap= function () {
  return map;
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
  //  url.host= url.host.replace('vis',miljø);
  // let arr= url.pathname.split('/');
  // let ressource= arr[1];
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
    tekst= "<a href='" + href.replace('api','info') + "'>" + label + "</a>";
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
      layer.bindPopup(danLabel2(overskrift, feature.properties.href, feature.properties.kode + " " + feature.properties.navn)); 
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
    case 'steder':  
    case 'stednavne': 
    case 'stednavne2':
      style.color= "green";
      style.fillColor= 'green';  
      break;    
    case 'navngivneveje':
    case 'vejstykker':
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
    zindex= 560;  
    break;
  default:
    break;
  }
  return zindex;
}


/***/ })
/******/ ]);