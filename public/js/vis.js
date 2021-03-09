"use strict";

var kort= require('dawa-kort')
    , util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string')
    , bbr= require('./bbrkodelister.js');

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
