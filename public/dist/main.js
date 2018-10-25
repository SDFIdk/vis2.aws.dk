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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var kort= __webpack_require__(2);

var map;

function getMap() {
  return map;
}

var options= {
  contextmenu: true,
  contextmenuWidth: 140,
  contextmenuItems: [
  // {
  //   text: 'Koordinater?',
  //   callback: visKoordinater
  // },
  {
    text: 'Adgangsadresse?',
    callback: kort.nærmesteAdgangsadresse(getMap)
  },
  {
    text: 'Bygning?',
    callback: kort.nærmesteBygning(getMap)
  },
  {
    text: 'Vej?',
    callback: kort.nærmesteNavngivneVej(getMap)
  },
  {
    text: 'Hvor?',
    callback: kort.hvor(getMap)
  }
  // {
  //   text: 'Kommune?',
  //   callback: visKommune
  // }, '-',{
  //   text: 'Centrer kort her',
  //   callback: centerMap
  // }
  ]
};


if (navigator.geolocation) {
  options.contextmenuItems.push(
    {
      text: 'Placering?',
      callback: 
        function () {
          function success(position) {
            map.setView(L.latLng(position.coords.latitude, position.coords.longitude),12);
          };
          function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
          }      
          navigator.geolocation.getCurrentPosition(success,error);
        }
    }
  )
};

function main() { 
  fetch('/getticket').then(function (response) {
    response.text().then(function (ticket) {      
      map= kort.viskort('map', ticket, options);
      var center= kort.beregnCenter();
      map.setView(center,2);
    });
  });  
}

main();



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dawautil= __webpack_require__(3)
  , URLSearchParams = __webpack_require__(0)  
  , dawaois= __webpack_require__(5);

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
		return L.tileLayer.wms('https://kortforsyningen.kms.dk/service', 
			{
				format: 'image/png',
				maxZoom: 14,
				minZoom: 2,
				ticket: ticket,
				servicename: service,
	  		attribution: 'Data</a> fra <a href="http://dawa.aws.dk">DAWA</a> | Map data &copy;  <a href="http://sdfe.dk">SDFE</a>',
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

	var adressekort = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4/wms', {
      transparent: true,
      layers: 'adgangsadresser',
      format: 'image/png',
      continuousWorld: true
    });
  var vejpunktkort = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4/wms', {
      transparent: true,
      layers: 'vejpunkter',
      format: 'image/png',
      continuousWorld: true
    });
  var vejpunktlinjekort = L.tileLayer.wms('https://kort.aws.dk/geoserver/aws4/wms', {
      transparent: true,
      layers: 'vejpunktlinjer',
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
    "Vejpunktlinjer": vejpunktlinjekort
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
    fetch(dawautil.danUrl("https://dawa.aws.dk/adgangsadresser/reverse",{x: e.latlng.lng, y: e.latlng.lat, medtagugyldige: true}))
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
      var popup= marker.bindPopup(L.popup().setContent("<a target='_blank' href='https://dawa.aws.dk/adgangsadresser?id="+adgangsadresse.id+"'>" + dawautil.formatAdgangsadresse(adgangsadresse) + "</a>"),{autoPan: true});
      if (adgangsadresse.vejpunkt) {
        var vx= adgangsadresse.vejpunkt.koordinater[1]
          , vy= adgangsadresse.vejpunkt.koordinater[0];
        var vpmarker= L.circleMarker(L.latLng(vx, vy), {color: 'blue', fillColor: 'blue', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(getMap());//defaultpointstyle);
        vpmarker.bindPopup(L.popup().setContent("<a target='_blank' href='https://dawa.aws.dk/adgangsadresser?id="+adgangsadresse.id+"'>" + dawautil.formatAdgangsadresse(adgangsadresse) + "</a>"),{autoPan: true});
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
      var popup= marker.bindPopup(L.popup().setContent("<a target='_blank' href='" + url + "'>" + dawaois.anvendelseskoder[bygning.BYG_ANVEND_KODE] + " fra " + bygning.OPFOERELSE_AAR + "</a>"),{autoPan: true});
      
      getMap().setView(punkt,12);
      popup.openPopup();
    //  map.fitBounds(geojsonlayer.getBounds());
    });
  };
};

exports.nærmesteVejstykke= function(getMap) {
  return function(e) {
    fetch(dawautil.danUrl("https://dawa.aws.dk/vejstykker/reverse",{format: 'geojson', x: e.latlng.lng, y: e.latlng.lat}))
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
      var popup= layer.bindPopup("<a target='_blank' href='https://dawa.aws.dk/vejstykker?kode="+vejstykke.properties.kode+"&kommunekode="+vejstykke.properties.kommunekode+"'>" + vejstykke.properties.navn + " (" + vejstykke.properties.kode + ")" + "</a>");
      popup.openPopup();
    });
  };
};

exports.nærmesteNavngivneVej= function(getMap) {
  return function(e) {
    fetch(dawautil.danUrl("https://dawa.aws.dk/navngivneveje",{format: 'geojson', geometri: 'begge', x: e.latlng.lng, y: e.latlng.lat}))
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
      var popup= layer.bindPopup("<a target='_blank' href='https://dawa.aws.dk/navngivneveje?id="+navngivenvej.properties.id+"'>" + navngivenvej.properties.navn + "</a>");
      popup.openPopup();
    });
  };
};

exports.hvor= function(getMap) {
  return function(e) {
    var antal= 0;
    var promises= [];

    // jordstykke
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/jordstykker/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatjordstykke;
    antal++;

    // sogn
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/sogne/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Sogn", 'sogne');
    antal++;

    // postnummer
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/postnumre/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatpostnummer;
    antal++;

    // kommune
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/kommuner/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Kommune", 'kommuner');
    antal++;

    // region
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/regioner/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Region",'regioner');
    antal++;

    // retskreds
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/retskredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Retskreds", 'retskredse');
    antal++;

    // politikreds
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/politikredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Politikreds", 'politikredse');
    antal++;

    // opstillingskreds
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/opstillingskredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatdata("Opstillingskreds", 'opstillingskredse');
    antal++;

    // storkreds
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/storkredse/reverse",{x: e.latlng.lng, y: e.latlng.lat})));
    promises[antal].format= formatstorkreds;
    antal++;

    // stednavne
    promises.push(fetch(dawautil.danUrl("https://dawa.aws.dk/stednavne",{x: e.latlng.lng, y: e.latlng.lat})));
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
  return "<li>Postnummer: <a target='_blank' href='https://dawa.aws.dk/postnumre/"+data.nr+"'>" +  data.nr + " " + data.navn + "</a></li>";
}

function formatstorkreds(data) {
  return "<li>Storkreds: <a target='_blank' href='https://dawa.aws.dk/storkredse/"+data.nummer+"'>" + data.navn + " (" + data.nummer + ")" + "</a></li>";
}

function formatjordstykke(data) {
  return "<li>Jordstykke: <a target='_blank' href='https://dawa.aws.dk/jordstykker/"+data.ejerlav.kode+"/"+data.matrikelnr+"'>" + (data.ejerlav.navn?data.ejerlav.navn+" ":"") + data.ejerlav.kode + " " +data.matrikelnr + "</a></li>";
}

function formatstednavne(data) {
  let tekst= '';
  for (var i= 0; i<data.length;i++) {
    tekst= tekst + "<li>" + capitalizeFirstLetter(data[i].undertype)+": <a target='_blank' href='https://dawa.aws.dk/stednavne/"+data[i].id+"'>" + data[i].navn + "</a></li>";
  }
  return tekst;
}

function formatdata(titel,id) {
  return function (data) { return "<li>" + titel + ": <a target='_blank' href='https://dawa.aws.dk/"+id+"/"+data.kode+"'>" + data.navn + " (" + data.kode + ")" + "</a></li>";};
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var URLSearchParams = __webpack_require__(0);

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
/* 4 */
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
/* 5 */
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

/***/ })
/******/ ]);