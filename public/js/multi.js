"use strict";

var kort= require('dawa-kort')
    , URL = require('url-parse')
    , queryString = require('query-string')
    , vis= require('./vis.js');

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