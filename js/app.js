// SCRIPTS FOR UNOFFICIAL LEBANESE LIRA CURRENCY CONVERTER
// Coded by Ahmad Barclay. No rights reserved.
// For more info: github.com/bothness/lbp

// SET GLOBAL VARIABLES

// URL of CSV file containing unofficial and official LBP rates
var csvurl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbB3FUCo45T0XcPvODVZeLhECABwixfilwLGF3eG2Xj06GC86DlTkMTaKXJLSHniX6ZYPTjZZg6JqV/pub?gid=0&single=true&output=csv";
// Default foreign currency code
var fc = "USD"; // unofficial rate
var fcoff = "USDo"; // official rate


// CURRENCY CONVERSION FUNCTIONS

// Set listeners for user currency entry fields, to automatically update conversion when values are changed
var fcvalue = document.getElementById("fc");
var lbpvalue = document.getElementById("lbp");

fcvalue.addEventListener("change", function(){
	document.converter.lbp.value = (document.converter.fc.value * fcrate).toFixed(2);
  document.getElementById("lbpo").innerHTML = (document.converter.fc.value * fcrateo).toFixed(2);
});

lbpvalue.addEventListener("change", function(){
	document.converter.fc.value = (document.converter.lbp.value / fcrate).toFixed(2);
  document.getElementById("lbpo").innerHTML = (document.converter.lbp.value / (fcrate / fcrateo)).toFixed(2);
});

// Fill popular currency grid
var codes = ["USD","USDo","EUR","EURo","GBP","GBPo","TRY","TRYo","AED","AEDo","CAD","CADo"];

function dogrid() {
  for (var i = 0; i < codes.length; i++) {
    document.getElementById(codes[i]).innerHTML = parseFloat(todayrates[codes[i]]).toFixed(0);
  };
};

// CURRENCY SELECTOR

// Set listener for currency seletion dropdown, to automatically update fields & chart
var dropdown = document.getElementById("dropdown");

dropdown.addEventListener("change", function(){
	fc = dropdown.value;
  fcoff = fc + "o";
	fcname = dropdown.selectedOptions[0].label;
	fcrate = parseFloat(todayrates[fc]);
  fcrateo = parseFloat(todayrates[fcoff]);
  document.getElementById("fcname").innerHTML = fcname;
  document.getElementById("fcrate").innerHTML = fcrate.toFixed(2);
  document.getElementById("fcrateo").innerHTML = fcrateo.toFixed(2);
  document.getElementById("lbp").value = (document.getElementById("fc").value * fcrate).toFixed(2);
  document.getElementById("lbpo").innerHTML = (document.getElementById("fc").value * fcrateo).toFixed(2);
  document.fc = fc;
  document.fcoff = fcoff;
  document.fcname = fcname;
  document.fcrate = fcrate;
  doplot();
});


// FUNCTIONS TO PLOT RATE TREND CHART USING PLOT.LY
// Chart based on this Plot.ly example
// https://plot.ly/javascript/time-series/#time-series-with-rangeslider

// Function to call rows of data
function unpack(array, key) {
  return array.map(a => a[key]);
};

// Main function to plot and re-plot rates chart
function doplot() {

var data = [
  {
    type: "scatter",
    mode: "lines",
    name: "unofficial",
    x: dates,
    y: unpack(jsondata, fc),
    line: {color: '#17BECF'}
  },
  {
    type: "scatter",
    mode: "lines",
    name: "official",
    x: dates,
    y: unpack(jsondata, fcoff),
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
        {
          count: 3,
          label: '3 months',
          step: 'month',
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
    l: 50,
    r: 50,
    b: 20,
    t: 20,
    pad: 4
  },
  height: 300
};

Plotly.newPlot('myDiv', data, layout, {displayModeBar: false, responsive: true});
};


// GET DATA, SET VALUES, INITIALIZE APP

// read CSV file, convert to json format, get all of today's rates & set rate for default foreign currency
fetch(csvurl).then((response) => {
    return response.text();
})
.then((csvdata) => {
    window.jsondata = $.csv.toObjects(csvdata);
    window.todayrates = jsondata[jsondata.length - 1];
    window.fcrate = parseFloat(todayrates[fc]);
    window.fcrateo = parseFloat(todayrates[fcoff]);
    window.today = todayrates["Date"];
    window.dates = unpack(jsondata, "Date");
    document.getElementById("fcrate").innerHTML = fcrate.toFixed(2);
    document.getElementById("fcrateo").innerHTML = fcrateo.toFixed(2);
    document.getElementById("lbp").value = fcrate.toFixed(2);
    document.getElementById("lbpo").innerHTML = fcrateo.toFixed(2);
    document.getElementById("todaydate").innerHTML = today;
    doplot();
    dogrid();
    document.getElementById("loader").remove();
});
