// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime){
  return new Date(epochTime*1000);
}

// convert time to human-readable format YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime){
  var epochDate = new Date(epochToJsDate(epochTime));
  var dateTime = epochDate.getFullYear() + "/" +
    ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
    ("00" + epochDate.getDate()).slice(-2) + " " +
    ("00" + epochDate.getHours()).slice(-2) + ":" +
    ("00" + epochDate.getMinutes()).slice(-2) + ":" +
    ("00" + epochDate.getSeconds()).slice(-2);

  return dateTime;
}

// function to plot values on charts
function plotValues(chart, timestamp, value){
  var x = epochToJsDate(timestamp).getTime();
  var y = Number (value);
  if(chart.series[0].data.length > 40) {
    chart.series[0].addPoint([x, y], true, true, true);
  } else {
    chart.series[0].addPoint([x, y], true, false, true);
  }
}

// DOM elements
const deleteButtonElement = document.getElementById("delete-button");
const deleteModalElement = document.getElementById("delete-modal");
const deleteDataFormElement = document.querySelector("#delete-data-form");
const viewDataButtonElement = document.getElementById("view-data-button");
const hideDataButtonElement = document.getElementById("hide-data-button");
const tableContainerElement = document.querySelector("#table-container");
const chartsRangeInputElement = document.getElementById("charts-range");
const loadDataButtonElement = document.getElementById("load-data");
const cardsCheckboxElement = document.querySelector(
  "input[name=cards-checkbox]"
);
const gaugesCheckboxElement = document.querySelector(
  "input[name=gauges-checkbox]"
);
const chartsCheckboxElement = document.querySelector(
  "input[name=charts-checkbox]"
);

// DOM elements for sensor readings
const cardsReadingsElement = document.querySelector("#cards-div");
const gaugesReadingsElement = document.querySelector("#gauges-div");
const chartsDivElement = document.querySelector("#charts-div");
const tempElement = document.getElementById("reading-temperature");
const humElement = document.getElementById("reading-soil-moisture");
const valveElement = document.getElementById("reading-fuzzy-value");
const updateElement = document.getElementById("lastUpdate");

// Database Paths
var dbPath = "logs/sensors";
var chartPath = "logs/charts/range";

// Database References
const dbRef = firebase.database().ref(dbPath);
var chartRef = firebase.database().ref(chartPath);

// Cache untuk data yang telah dimuat sebelumnya
var cachedData = [];

// Function untuk memuat data dari database
function loadDataFromDatabase(callback) {
  dbRef
    .limitToLast(10) // Batasi jumlah data yang dimuat
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var data = childSnapshot.val();
        cachedData.unshift(data); // Tambahkan data baru ke awal array (data terbaru pertama)
      });
      callback(cachedData); // Panggil callback dengan data yang dimuat
    })
    .catch((error) => {
      console.error("Error loading data: ", error);
    });
}

// Function untuk menampilkan data dari cache
function displayDataFromCache(data) {
  // Tampilkan data dari cache di UI
  data.forEach((item) => {
    // Lakukan sesuatu dengan setiap item data (contoh: tampilkan di tabel atau grafik)
  });
}

// Function untuk menampilkan data dari database (dengan cache)
function loadDataWithCache() {
  if (cachedData.length > 0) {
    // Jika data sudah ada di cache, tampilkan dari cache
    displayDataFromCache(cachedData);
  } else {
    // Jika cache kosong, muat data dari database
    loadDataFromDatabase(displayDataFromCache);
  }
}

// Panggil function loadDataWithCache() untuk memuat data
loadDataWithCache();

//CHARTS
// Number of readings to plot on charts
// var chartRange = 0;
// // Get number of readings to plot saved on database (runs when the page first loads and whenever there's a change in the database)
// chartRef.once("value", (snapshot) => {
//   var totalData = snapshot.numChildren();
//   // Tetapkan total data ke chartRange
//   chartRange = totalData;
//   // Buat grafik dengan total data yang tersedia
//   chartT = createTemperatureChart();
//   chartH = createHumidityChart();
//   chartV = createValveChart();
//   // Update grafik dengan data terbaru
//   dbRef.on("child_added", (snapshot) => {
//     var jsonData = snapshot.toJSON();
//     var temperature = jsonData.temperature;
//     var soilMoisture = jsonData.soil_moisture;
//     var fuzzyValue = jsonData.fuzzy_value;
//     var timestamp = jsonData.timestamp;
//     plotValues(chartT, timestamp, temperature);
//     plotValues(chartH, timestamp, soilMoisture);
//     plotValues(chartV, timestamp, fuzzyValue);
//   });
// });

  // CHARTS
    // Number of readings to plot on charts
    var chartRange = 0;
    // Get number of readings to plot saved on database (runs when the page first loads and whenever there's a change in the database)
    chartRef.on('value', snapshot =>{
      chartRange = Number(snapshot.val());
      console.log(chartRange);
      // Delete all data from charts to update with new values when a new range is selected
      chartT.destroy();
      chartH.destroy();
      chartV.destroy();
      // Render new charts to display new range of data
      chartT = createTemperatureChart();
      chartH = createHumidityChart();
      chartV = createValveChart();
      // Update the charts with the new range
      // Get the latest readings and plot them on charts (the number of plotted readings corresponds to the chartRange value)
      dbRef.orderByKey().limitToLast(chartRange).on('child_added', snapshot =>{
        // Save values on variables
        var jsonData = snapshot.toJSON();
            var temperature = jsonData.temperature;
            var soilMoisture = jsonData.soil_moisture;
            var fuzzyValue = jsonData.fuzzy_value;
            var timestamp = jsonData.timestamp;
        // Plot the values on the charts
        plotValues(chartT, timestamp, temperature);
        plotValues(chartH, timestamp, soilMoisture);
        plotValues(chartV, timestamp, fuzzyValue);
      });
    });

// Update database with new range (input field)
chartsRangeInputElement.onchange = () => {
  chartRef.set(chartsRangeInputElement.value);
};

//CHECKBOXES
// Checbox (cards for sensor readings)
cardsCheckboxElement.addEventListener("change", (e) => {
  if (cardsCheckboxElement.checked) {
    cardsReadingsElement.style.display = "block";
  } else {
    cardsReadingsElement.style.display = "none";
  }
});
// Checbox (gauges for sensor readings)
// gaugesCheckboxElement.addEventListener("change", (e) => {
//   if (gaugesCheckboxElement.checked) {
//     gaugesReadingsElement.style.display = "block";
//   } else {
//     gaugesReadingsElement.style.display = "none";
//   }
// });
// Checbox (charta for sensor readings)
chartsCheckboxElement.addEventListener("change", (e) => {
  if (chartsCheckboxElement.checked) {
    chartsDivElement.style.display = "block";
  } else {
    chartsDivElement.style.display = "none";
  }
});

dbRef
  .orderByKey()
  .limitToLast(1)
  .on("child_added", (snapshot) => {
    var jsonData = snapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
    var temperature = Number(jsonData.temperature).toFixed(2);
    var soilMoisture = Number(jsonData.soil_moisture).toFixed(2);
    var fuzzyValue = jsonData.fuzzy_value;
    var timestamp = jsonData.timestamp;
    // Update DOM elements
    tempElement.innerHTML = temperature;
    humElement.innerHTML = soilMoisture;
    valveElement.innerHTML = secondsToMinutesAndSeconds(fuzzyValue);
    updateElement.innerHTML = epochToDateTime(timestamp);
  });

// dbRef
//   .orderByKey()
//   .limitToLast(1)
//   .on("child_added", (snapshot) => {
//     var jsonData = snapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
//     var temperature = jsonData.temperature;
//     var soilMoisture = jsonData.soil_moisture;
//     var fuzzyValue = jsonData.fuzzy_value;
//     var timestamp = jsonData.timestamp;
//     // Update DOM elements
//     var gaugeT = createTemperatureGauge();
//     var gaugeH = createHumidityGauge();
//     // var gaugeV = createValveGauge();
//     gaugeT.draw();
//     gaugeH.draw();
//     // gaugeV.draw();
//     gaugeT.value = temperature;
//     gaugeH.value = soilMoisture;
//     // gaugeV.value = fuzzyValue;
//     updateElement.innerHTML = epochToDateTime(timestamp);
//   });

// DELETE DATA
// Add event listener to open modal when click on "Delete Data" button
deleteButtonElement.addEventListener("click", (e) => {
  console.log("Remove data");
  e.preventDefault;
  deleteModalElement.style.display = "block";
});

// Add event listener when delete form is submited
deleteDataFormElement.addEventListener("submit", (e) => {
  // delete data (readings)
  dbRef.remove();
});

// TABLE
var lastReadingTimestamp; //saves last timestamp displayed on the table
// Function that creates the table with the first 100 readings
function createTable() {
  // Empty the table first
  $("#tbody").empty();

  // Append all data to the table
  var firstRun = true;
  dbRef
    .orderByKey()
    .limitToLast(5)
    .on("child_added", function (snapshot) {
      if (snapshot.exists()) {
        var jsonData = snapshot.toJSON();
        console.log(jsonData);
        var temperature = Number(jsonData.temperature).toFixed(2);
        var humidity = Number(jsonData.soil_moisture).toFixed(2);
        var fuzzyValue = jsonData.fuzzy_value;
        var timestamp = jsonData.timestamp;
        var content = "";
        content += "<tr>";
        content += "<td>" + epochToDateTime(timestamp) + "</td>";
        content += "<td>" + temperature + "</td>";
        content += "<td>" + humidity + "</td>";
        content += "<td>" + secondsToMinutesAndSeconds(fuzzyValue) + "</td>";
        content += "</tr>";
        $("#tbody").prepend(content);
        // Save lastReadingTimestamp --> corresponds to the first timestamp on the returned snapshot data
        if (firstRun) {
          lastReadingTimestamp = timestamp;
          firstRun = false;
          console.log(lastReadingTimestamp);
        }
      }
    });
}

// append readings to table (after pressing More results... button)
function appendToTable() {
  var dataList = []; // saves list of readings returned by the snapshot (oldest-->newest)
  var reversedList = []; // the same as previous, but reversed (newest--> oldest)
  console.log("APEND");
  dbRef
    .orderByKey()
    .limitToLast(5)
    .endAt(lastReadingTimestamp.toString())
    .once("value", function (snapshot) {
      // convert the snapshot to JSON
      if (snapshot.exists()) {
        snapshot.forEach((element) => {
          var jsonData = element.toJSON();
          dataList.push(jsonData); // create a list with all data
        });
        lastReadingTimestamp = dataList[0].timestamp; //oldest timestamp corresponds to the first on the list (oldest --> newest)
        reversedList = dataList.reverse(); // reverse the order of the list (newest data --> oldest data)

        var firstTime = true;
        // loop through all elements of the list and append to table (newest elements first)
        reversedList.forEach((element) => {
          if (firstTime) {
            // ignore first reading (it's already on the table from the previous query)
            firstTime = false;
          } else {
            var temperature = Number(element.temperature).toFixed(2);
            var humidity = Number(element.soil_moisture).toFixed(2);
            var fuzzyValue = element.fuzzy_value;
            var timestamp = element.timestamp;
            var content = "";
            content += "<tr>";
            content += "<td>" + epochToDateTime(timestamp) + "</td>";
            content += "<td>" + temperature + "</td>";
            content += "<td>" + humidity + "</td>";
            content +=
              "<td>" + secondsToMinutesAndSeconds(fuzzyValue) + "</td>";
            content += "</tr>";
            $("#tbody").append(content);
          }
        });
      }
    });
}

var firstViewAllData = true; // Flag untuk menandai apakah "view all data" pertama kali dibuka

viewDataButtonElement.addEventListener("click", (e) => {
  // Toggle DOM elements
  tableContainerElement.style.display = "block";
  viewDataButtonElement.style.display = "none";
  hideDataButtonElement.style.display = "inline-block";
  loadDataButtonElement.style.display = "inline-block";

  if (firstViewAllData) {
    createTable(); // Panggil createTable() hanya saat pertama kali "view all data" dibuka
    firstViewAllData = false; // Set flag menjadi false agar tidak memanggil createTable() lagi
  }
});

loadDataButtonElement.addEventListener("click", (e) => {
  appendToTable();
});

hideDataButtonElement.addEventListener("click", (e) => {
  tableContainerElement.style.display = "none";
  viewDataButtonElement.style.display = "inline-block";
  hideDataButtonElement.style.display = "none";
});

// Database Path for Relay Status
var relayStatusPath = "relay/status";

// Database Reference for Relay Status
var relayStatusRef = firebase.database().ref(relayStatusPath);

function updateRelayStatus(status) {
  var relayStatus = document.getElementById("relay-status");

  // Jika nilai status adalah 0, set status ke "Mati"
  if (status === 0) {
    relayStatus.innerText = "Mati";
  } else if (status > 0) {
    // Jika nilai status lebih besar dari 0, set status ke "Hidup"
    relayStatus.innerText = "Hidup";
  } else {
    // Handle other cases if needed
    relayStatus.innerText = "Status Tidak Dikenal";
  }
}

// Memanggil fungsi updateRelayStatus dengan nilai valve terbaru
dbRef
  .orderByKey()
  .limitToLast(1)
  .on("child_added", (snapshot) => {
    var jsonData = snapshot.toJSON();
    var fuzzyValue = jsonData.fuzzy_value;
    updateRelayStatus(fuzzyValue);
  });

// Event listener for changes in relay status
relayStatusRef.on("value", (snapshot) => {
  var relaySwitch = document.getElementById("relay-switch");
  // Update the relay switch position based on the status in Firebase
  relaySwitch.checked = snapshot.val();
});

// Function to convert seconds to minutes and seconds format (MM:SS)
function secondsToMinutesAndSeconds(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

function downloadAllData() {
  // Header sesuai dengan data di Firebase
  var headers = ["Timestamp", "Temp (C)", "Hum (%)", "Valve (Menit)"];
  var data = [];
  data.push(headers);

  // Ambil data dari database Firebase
  dbRef.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var rowData = childSnapshot.val();
        var rowArray = [];

        // Urutkan nilai sesuai dengan header
        rowArray.push(epochToDateTime(rowData.timestamp));
        rowArray.push(rowData.temperature);
        rowArray.push(rowData.soil_moisture);
        rowArray.push(rowData.fuzzy_value);

        // Tambahkan baris data ke dalam data array
        data.push(rowArray);
      });

      // Buat CSV content dengan menambahkan judul dan data
      var csvContent = "";
      data.forEach(function(rowArray) {
        var row = rowArray.join(",");
        csvContent += row + "\r\n";
      });

      // Buat elemen <a> untuk unduhan
      var link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
      link.download = "sensor_data.csv";

      // Sisipkan elemen <a> ke dalam dokumen
      document.body.appendChild(link);

      // Klik link untuk memulai unduhan
      link.click();

      // Hapus elemen <a> setelah unduhan selesai
      document.body.removeChild(link);
    })
    .catch(function(error) {
      console.error("Error downloading data: ", error);
    });
}