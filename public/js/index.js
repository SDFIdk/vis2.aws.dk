"use strict";

var kort= require('dawa-kort')
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

  query.format= 'geojson';
  url.set('query',queryString.stringify(query));

  let urltext= url.toString();

  fetch(urltext).then( function(response) {
    response.json().then( function ( data ) {
      if (data.type === "FeatureCollection" && data.features.length === 0) return;
      let arr= url.pathname.split('/');
      let ressource= arr[1];
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

function danLabel(ressource, id, label) {
  let tekst= "<a target='_blank' href='https://dawa.aws.dk/" + ressource + "/" + id + "'>" + label + "</a>";
  return tekst;
}

function eachFeature(ressource) {
  return function (feature, layer) {
    switch (ressource) {
    case 'jordstykker':
      let kode= feature.properties.ejerlavkode;
      let nr= feature.properties.matrikelnr;
      layer.bindPopup(danLabel(ressource, kode + "/" + nr, "Jordstykke: " + kode + " " + nr));
      break;
    case 'sogne':
    case 'politikredse':
    case 'retskredse':
    case 'regioner':
    case 'opstillingskredse':
    case 'storkredse':
    case 'valglandsdele':
    case 'afstemningsområder':
    case 'menighedsrådsafstemningsområder':
    case 'kommuner':
      layer.bindPopup(danLabel(ressource, feature.properties.dagi_id, feature.properties.kode + " " + feature.properties.navn));
      break
    case 'supplerendebynavne':
      break;
    case 'supplerendebynavne2': 
      layer.bindPopup(danLabel(ressource, feature.properties.dagi_id, feature.properties.navn));
      break;    
    case 'postnumre':  
      layer.bindPopup(danLabel(ressource, feature.properties.nr, feature.properties.nr + " " + feature.properties.navn));
      break;
    case 'adresser': 
      layer.bindPopup(danLabel(ressource,feature.properties.id, feature.properties.vejnavn + " " + feature.properties.husnr + ", " + (feature.properties.supplerendebynavn?feature.properties.supplerendebynavn+", ":"") + feature.properties.postnr + " " + feature.properties.postnrnavn));
      break;
    case 'adgangsadresser': 
      layer.bindPopup(danLabel(ressource, feature.properties.id,feature.properties.vejnavn + " " + feature.properties.husnr + ", " + (feature.properties.supplerendebynavn?feature.properties.supplerendebynavn+", ":"") + feature.properties.postnr + " " + feature.properties.postnrnavn)); 
      var marker= L.circleMarker(L.latLng(feature.properties.vejpunkt_y, feature.properties.vejpunkt_x),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
      break;      
    case 'stednavne':  
      layer.bindPopup(danLabel(ressource, feature.properties.id, feature.properties.navn + '<br>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")"));
      break;    
    case 'stednavne2':  
      layer.bindPopup(danLabel(ressource, feature.properties.sted_id + "/" + feature.properties.navn, feature.properties.navn + '<br>(' +  feature.properties.sted_hovedtype  + ', ' + feature.properties.sted_undertype + ")"));    
      var marker= L.circleMarker(L.latLng(feature.properties.sted_visueltcenter_y, feature.properties.sted_visueltcenter_x)).addTo(map);
      break;    
    case 'navngivneveje':   
      layer.bindPopup(danLabel(ressource,feature.properties.id, feature.properties.navn));
      break;
    default:       
      if (feature.properties.visueltcenter_x && feature.properties.visueltcenter_y) {      
        var marker= L.circleMarker(L.latLng(feature.properties.visueltcenter_y, feature.properties.visueltcenter_x)).addTo(map);
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
      break;
    case 'sogne':
    case 'politikredse':
    case 'retskredse':
    case 'regioner':
    case 'opstillingskredse':
    case 'storkredse':
    case 'valglandsdele':
    case 'afstemningsområder':
    case 'menighedsrådsafstemningsområder':
    case 'kommuner':
      break
    case 'supplerendebynavne':
      break;
    case 'supplerendebynavne2': 
      break;    
    case 'postnumre':  
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
    case 'stednavne': 
    case 'stednavne2':  
      break;    
    case 'navngivneveje':   
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

