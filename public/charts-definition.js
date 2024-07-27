// Create the charts when the web page loads
window.addEventListener("load", onload);

function onload(event) {
  chartT = createTemperatureChart();
  chartH = createHumidityChart();
  chartV = createValveChart();

}

// Create Temperature Chart
function createTemperatureChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-temperature',
      type: 'spline' 
    },
    series: [
      {
        name: 'Temperature'
      }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Temperature °C' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

// Create Humidity Chart
function createHumidityChart(){
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-humidity',
      type: 'spline'  
    },
    series: [{
      name: 'Kelembaban Tanah'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#50b8b4' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Humidity (%)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

function createValveChart() {
  var chart = Highcharts.chart("chart-valve", {
    chart: {
      type: "spline",
    },
    series: [
      {
        name: "Selenoid Valve",
      },
    ],
    title: {
      text: undefined,
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        second: "%H:%M:%S",
      },
    },
    yAxis: {
      title: {
        text: "Valve (detik)",
      },
    },
    credits: {
      enabled: false,
    },
  });
  return chart;
}
