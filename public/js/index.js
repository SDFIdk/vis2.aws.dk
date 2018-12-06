"use strict";

var kort= require('dawa-kort')
    , util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string');

var map;

function getMap() {
  return map;
}

var visData= function(url) {

  if (url.hostname === 'localhost') {
    url.set('host','vis.aws.dk:80'); 
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
  url.host= url.host.replace('vis',miljø);
  let arr= url.pathname.split('/');
  let ressource= arr[1];

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
      let style=  getDefaultStyle(ressource);
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
    tekst= "<a target='_blank' href='" + href + "'>" + label + "</a>";
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
      map.getPane("locationMarker").style.zIndex = 500;
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
      var marker= L.circleMarker(L.latLng(feature.properties.adgangsadresse.vejpunkt.koordinater[1], feature.properties.adgangsadresse.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
      break;
    case 'adgangsadresser':
      label= danLabel2(overskrift, feature.properties.href,util.formatAdgangsadresse(feature.properties)); 
      showPopup(vispopup, feature.properties.adgangspunkt.koordinater[0], feature.properties.adgangspunkt.koordinater[1], label);
      layer.bindPopup(label); 
      var marker= L.circleMarker(L.latLng(feature.properties.vejpunkt.koordinater[1], feature.properties.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
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

  let url= new URL(window.location.href);
  let query= queryString.parse(url.query);
  let korttype= query.kort;
  if (korttype) {
    options.baselayer= korttype;
  }

  fetch('/getticket').then(function (response) {
    response.text().then(function (ticket) {      
      map= kort.viskort('map', ticket, options);
      var center= kort.beregnCenter();
      map.setView(center,2);
      visData(url);
    });
  });  
}

main();