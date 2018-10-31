"use strict";

var kort= require('dawa-kort')
    , util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string');

var map;

function getMap() {
  return map;
}

var visData= function() {

  let url= new URL(window.location.href);
  if (url.hostname === 'localhost') {
    url.set('host','vis.aws.dk:80'); 
  }

  let query= queryString.parse(url.query);

  let miljø= query.m;
  if (!miljø) miljø= 'dawa';
  url.host= url.host.replace('vis',miljø);
  let arr= url.pathname.split('/');
  let ressource= arr[1];

  query.format= 'geojson';
  query.geometri= 'begge'; // af hensyn til navngivne vejes vejnavneområder
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
      let style=  getDefaultStyle(ressource);
      var geojsonlayer= L.geoJson(data, {style: style, onEachFeature: eachFeature(ressource), pointToLayer: pointToLayer}); 
      geojsonlayer.addTo(map);
      map.fitBounds(geojsonlayer.getBounds());
       
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

function danLabel2(href, label) {
  let tekst= "<a target='_blank' href='" + href + "'>" + label + "</a>";
  return tekst;
}

function danLabel(ressource, id, label) {
  let tekst= "<a target='_blank' href='https://dawa.aws.dk/" + ressource + "/" + id + "'>" + label + "</a>";
  return tekst;
}

function visVisueltCenter(x,y) {
  var marker= L.circleMarker(L.latLng(y, x),{color: 'black', fill: true, fillcolor: 'black', fillOpacity: 1.0, radius: 2}).addTo(map);
}

function eachFeature(ressource) {
  return function (feature, layer) {
    switch (ressource) {
    case 'ejerlav':
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.navn + " (" + feature.properties.kode + ")"));
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break;
    case 'jordstykker':
      let kode= feature.properties.ejerlav.kode;
      let navn= feature.properties.ejerlav.navn;
      let nr= feature.properties.matrikelnr;
      layer.bindPopup(danLabel2(feature.properties.href, nr + " " + navn + " (" + kode + ")"));
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
     break;
    case 'sogne':
    case 'politikredse':
    case 'retskredse':
    case 'regioner':
    case 'kommuner':
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.kode + " " + feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]);
      break;
    case 'afstemningsomraader': 
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.nummer + " " + feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]);
      var marker= L.circleMarker(L.latLng(feature.properties.afstemningssted.adgangsadresse.koordinater[1], feature.properties.afstemningssted.adgangsadresse.koordinater[0]),{color: 'red', fill: true, fillcolor: 'red', fillOpacity: 1.0, radius: 5}).addTo(map);      
      marker.bindPopup(danLabel2(feature.properties.afstemningssted.adgangsadresse.href, feature.properties.afstemningssted.adgangsadresse.adressebetegnelse)); 
      break;
    case 'menighedsraadsafstemningsomraader':
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.nummer + " " + feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]);
      break;      
    case 'opstillingskredse':
    case 'storkredse':
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.nummer + " " + feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break; 
    case 'valglandsdele':
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.bogstav + " " + feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break;      
    case 'supplerendebynavne2': 
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break;    
    case 'postnumre':  
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.nr + " " + feature.properties.navn)); 
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break;
    case 'adresser': 
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.adressebetegnelse));
      var marker= L.circleMarker(L.latLng(feature.properties.adgangsadresse.vejpunkt.koordinater[1], feature.properties.adgangsadresse.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
      break;
    case 'adgangsadresser': 
      layer.bindPopup(danLabel2(feature.properties.href,util.formatAdgangsadresse(feature.properties))); 
      var marker= L.circleMarker(L.latLng(feature.properties.vejpunkt.koordinater[1], feature.properties.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
      break;      
    case 'stednavne':  
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.navn + '<br>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")"));
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break;    
    case 'stednavne2':  
      layer.bindPopup(danLabel2(feature.properties.sted.href, feature.properties.navn + '<br>(' +  feature.properties.sted.hovedtype  + ', ' + feature.properties.sted.undertype + ")"));    
      visVisueltCenter(feature.properties.sted.visueltcenter[0], feature.properties.sted_visueltcenter[1]); 
      break;      
    case 'steder':  
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.primærtnavn + '<br>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")"));    
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      break;    
    case 'navngivneveje':   
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.navn));
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
      if (feature.properties.beliggenhed.vejtilslutningspunkter) {
        let punkter= feature.properties.beliggenhed.vejtilslutningspunkter.coordinates;
        for (var i= 0; i<punkter.length;i++) {
           var marker= L.circleMarker(L.latLng(punkter[i][1], punkter[i][0]), {color: 'blue', fillColor: 'blue', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(map);
        }
      }
      break;
    case 'vejstykker':    
      layer.bindPopup(danLabel2(feature.properties.href, feature.properties.kode + " " + feature.properties.navn)); 
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


function getDefaultStyle(ressource) {
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
    case 'postnumre': 
      style.color= "green";
      style.fillColor= 'green'; 
      break;
    case 'adresser':
    case 'adgangsadresser':
      style.color= "red";
      style.opacity= 1.0;
      style.weight= 1;
      style.fill= true;
      style.fillColor= 'red';
      style.fillOpacity= 1.0;
      style.radius= 5; 
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

function main() { 
  
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