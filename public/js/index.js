"use strict";

var kort= require('dawa-kort');

var map;

function getMap() {
  return map;
}

var options= {
  contextmenu: true,
  contextmenuWidth: 140,
  contextmenuItems: [
  {
    text: 'Adgangsadresse?',
    callback: kort.nærmesteAdgangsadresse(getMap)
  },
  {
    text: 'Vej?',
    callback: kort.nærmesteNavngivneVej(getMap)
  },
  {
    text: 'Hvor?',
    callback: kort.hvor(getMap)
  }
  ]
};


var parser = document.createElement('a');
parser.href = window.location.href;
if (parser.host.indexOf('localhost') === 0) {
  parser.host= 'vis.aws.dk:80'; 
}
let miljø= getQueryVariable('m');
if (!miljø) miljø= 'dawa';
parser.host= parser.host.replace('vis',miljø); 
var dataurl= parser.href; 

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0; i<vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}


function encode(url) {
  return (url.indexOf('%') === -1)?encodeURI(url):url;
}

var visData= function() {
  var options= {};
  options.data= {format: 'geojson'};
  options.url= encode(dataurl);
  options.dataType= "json";
  options.jsonp= false;
  $.ajax(options)
  .then( function ( data ) {
    if (data.type === "FeatureCollection" && data.features.length === 0) return
    //var style=  getDefaultStyle(data);
    var geojsonlayer= L.geoJson(data); //, {style: style, onEachFeature: eachFeature, pointToLayer: pointToLayer(style)});
    lag[dataurl]= geojsonlayer;
    geojsonlayer.addTo(map);
    map.fitBounds(geojsonlayer.getBounds());

    if (data.type !== 'Feature') {
      data= data.features[0];
    }
    if (data.properties.visueltcenter_x && data.properties.visueltcenter_y) {      
      var marker= L.circleMarker(L.latLng(data.properties.visueltcenter_y, data.properties.visueltcenter_x), {color: style.color, fillColor: style.color, stroke: true, fillOpacity: 1.0, radius: 2, weight: 2, opacity: 1.0}).addTo(map);
    }
         
    // L.control.search().addTo(map); 
    var zoom= map.getZoom();
    if (zoom >= 13) {
      map.setZoom(11);
    }
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    alert(jqXHR.responseText);
  });
}
  

function main() { 
  fetch('/getticket').then(function (response) {
    response.text().then(function (ticket) {      
      map= kort.viskort('map', ticket, options);
      var center= kort.beregnCenter();
      map.setView(center,2);
      visData();
    });
  });  
}

main();

