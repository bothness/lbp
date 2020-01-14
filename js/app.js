// SCRIPTS FOR UNOFFICIAL LEBANESE LIRA CURRENCY CONVERTER
// Coded by Ahmad Barclay. No rights reserved.

// SET GLOBAL VARIABLES

// URL of CSV file containing unofficial and official LBP rates
var csvurl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbB3FUCo45T0XcPvODVZeLhECABwixfilwLGF3eG2Xj06GC86DlTkMTaKXJLSHniX6ZYPTjZZg6JqV/pub?gid=0&single=true&output=csv";
// Today's date in yyyy-mm-dd format
var today = new Date().toISOString().split('T')[0];
// Default foreign currency
var fc = "USD";
var fcoff = "USDo";


// INITIALIZE VALUES

// read CSV file, convert to json format, get all of today's rates & set rate for default foreign currency
fetch(csvurl).then((response) => {
    return response.text();
})
.then((csvdata) => {
    window.jsondata = $.csv.toObjects(csvdata);
    window.todayrates = jsondata[jsondata.length - 1];
    window.fcrate = parseFloat(todayrates[fc]);
    window.today = todayrates["Date"];
    document.getElementById("fcrate").innerHTML = fcrate.toFixed(2);
    document.getElementById("lbp").value = fcrate.toFixed(2);
    document.getElementById("todaydate").innerHTML = today;
});


// CURRENCY CONVERSION FUNCTIONS

// Set listeners for user currency entry fields, to automatically update conversion when values are changed
var fcvalue = document.getElementById("fc");
var lbpvalue = document.getElementById("lbp");

fcvalue.addEventListener("change", function(){
	document.converter.lbp.value = (document.converter.fc.value * fcrate).toFixed(2);
});

lbpvalue.addEventListener("change", function(){
	document.converter.fc.value = (document.converter.lbp.value / fcrate).toFixed(2);
});


// CURRENCY SELECTOR

// Set listener for currency seletion dropdown, to automatically update fields & chart
var dropdown = document.getElementById("dropdown");

dropdown.addEventListener("change", function(){
	fc = dropdown.value;
  fcoff = fc + "o";
	fcname = dropdown.selectedOptions[0].label;
	fcrate = parseFloat(todayrates[fc]);
    document.getElementById("fcname").innerHTML = fcname;
    document.getElementById("fcrate").innerHTML = fcrate.toFixed(2);
    document.getElementById("lbp").value = (document.getElementById("fc").value * fcrate).toFixed(2);
    document.fc = fc;
    document.fcoff = fcoff;
    document.fcname = fcname;
    document.fcrate = fcrate;
    doplot();
});


// FUNCTION TO PLOT RATE TREND CHART USING PLOT.LY
// Based on this Plot.ly example
// https://plot.ly/javascript/time-series/#time-series-with-rangeslider

var doplot = function() {

Plotly.d3.csv(csvurl, function(err, rows){
  function unpack(rows, key) {
  	return rows.map(function(row) { return row[key]; });
  }

var data = [
  {
    type: "scatter",
    mode: "lines",
    name: "unofficial",
    x: unpack(rows, 'Date'),
    y: unpack(rows, fc),
    line: {color: '#17BECF'}
  },
  {
    type: "scatter",
    mode: "lines",
    name: "official",
    x: unpack(rows, 'Date'),
    y: unpack(rows, fcoff),
    line: {color: '#7F7F7F'}
  }
];

var layout = {
	xaxis: {
    autorange: true,
    range: ['2019-11-06', today],
    rangeselector: {buttons: [
        {
          count: 7,
          label: '7 days',
          step: 'day',
          stepmode: 'backward'
        },
        {
          count: 28,
          label: '28 days',
          step: 'day',
          stepmode: 'backward'
        },
        {step: 'all'}
      ]},
    rangeslider: {range: ['2019-11-06', today]},
    type: 'date'
  },
  yaxis: {
    autorange: true,
    type: 'linear'
  },
  margin: {
    l: 40,
    r: 40,
    b: 20,
    t: 20,
    pad: 4
  },
  height: 300
};

Plotly.newPlot('myDiv', data, layout, {displayModeBar: false, responsive: true});
});

};


// INITIAL CALL OF PLOT FUNCTION

doplot();