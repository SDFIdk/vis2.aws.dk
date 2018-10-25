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

