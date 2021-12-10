const API_KEY = 'zWmqowyEvzx8P8BQy7ky';
let datePicker = ['startDate', 'endDate'];
let responseAsJson;
let timeValue;
let leftCurrency = document.getElementById('have-currency');
let rightCurrency = document.getElementById('want-currency');
let placeHolderLeft = document.getElementById('placeholder-left');
let placeHolderRight = document.getElementById('placeholder-right');
let bitcoinData = { 'mid': mid, 'bid': bid, 'ask': ask };
let result = 0;
let operator = 'multiply';
let resultValueLeft = 'input-left';
let resultValueRight = 'input-right';
let settingStatus = false;
let myChart;
let statusChart = false;
const bitcoinLabels = [];
let capture = false;

function init() {
  loadCourse();
  setDates();
  setCurrentRates();
  calculateInit();
  initHistoricEvents();
}

async function loadCourse() {
  let today = new Date();
  let time = new Date();
  today.setDate(new Date().getDate() - 1);
  settingsDates(today);
  timeValue = time.toISOString().split('T')[1];
  let url = `https://data.nasdaq.com/api/v3/datasets/BITFINEX/BTCUSD?start_date=${datePicker['startDate']}&end_date=${datePicker['endDate']}&api_key=${API_KEY}`;
  let response = await fetch(url);
  responseAsJson = await response.json();
  console.log('JSON-Array geladen:', responseAsJson);
}

function settingsDates(today) {
  if (!settingStatus) {
    datePicker['startDate'] = today.toISOString().split('T')[0];
    datePicker['endDate'] = today.toISOString().split('T')[0];
  };
};

function setDates() {
  document.getElementById('date-exchange-rate').innerText = datePicker['endDate'];
  document.getElementById('refreshed-at-1').innerText = `
  Data refreshed at ${datePicker['endDate']}, ${timeValue}
  `;
  document.getElementById('refreshed-at-2').innerText = `
  Data refreshed at ${datePicker['endDate']}, ${timeValue}
  `;

  document.getElementById('start-date').value = datePicker['startDate'];
  document.getElementById('end-date').value = datePicker['startDate'];
};

async function setCurrentRates() {
  await loadCourse();
  let element = responseAsJson['dataset']['data'][0];
  [mid, bid, ask] = [element[3].toFixed(2), element[5].toFixed(2), element[6].toFixed(2)];
  document.getElementById('mid').innerHTML = `${mid} USD`;
  document.getElementById('bid').innerHTML = `${bid} USD`;
  document.getElementById('ask').innerHTML = `${ask} USD`;

}

function changeCurrencyOrder() {
  let leftCurrencyValue = document.getElementById('have-currency').innerText;

  if (leftCurrencyValue == 'BTC') {
    leftCurrency.innerHTML = 'USD';
    rightCurrency.innerHTML = 'BTC';
    placeHolderLeft.innerHTML = 'USD';
    placeHolderRight.innerHTML = 'BTC';
    operator = 'divide';
    resultValueRight = 'input-left';
    resultValueLeft = 'input-right';
    calculateLeft();
  } else {
    leftCurrency.innerHTML = 'BTC';
    rightCurrency.innerHTML = 'USD';
    placeHolderLeft.innerHTML = 'BTC';
    placeHolderRight.innerHTML = 'USD';
    operator = 'multiply';
    resultValueRight = 'input-right';
    resultValueLeft = 'input-left';
    calculateLeft();
  }
}

function calculateInit() {
  document.getElementById('input-left').addEventListener('keyup', calculateLeft);
}

function calculateLeft() {
  let inputLeftValue = +document.getElementById('input-left').value;
  calc(inputLeftValue, 'multiply');
};


function calc(input, operation) {
  let inputValue = responseAsJson['dataset']['data'][0][3];
  if (operation == operator) {
    result = input * inputValue;
    document.getElementById(resultValueRight).value = result;
  } else {
    result = input / inputValue;
    document.getElementById(resultValueLeft).value = result;
  }
}

function showLoadingAnimation() {
  document.getElementById('loadingContainer').classList.remove('d-none');
}

function hideLoadingAnimation() {
  document.getElementById('loadingContainer').classList.add('d-none');
}

function initHistoricEvents() {
  document.getElementById('buttonHistoricRate').addEventListener('click', loadHistoricTable);
  document.getElementById('headerChart').addEventListener('click', showChart);
  document.getElementById('headerTable').addEventListener('click', showTable);
  document.getElementById('chartImage').addEventListener('click', fullScreenChart);
}

function setHistoricDates() {
  document.getElementById('historic-container').classList.remove('d-none');
  datePicker['startDate'] = document.getElementById('start-date').value;
  datePicker['endDate'] = document.getElementById('end-date').value;
  settingStatus = true;
}

async function loadHistoricTable() {
  setHistoricDates();
  showLoadingAnimation();
  await loadCourse();
  renderHistoricTable();
  hideLoadingAnimation();
  loadLabels();
  setChartSetup();
}

function renderHistoricTable() {
  document.getElementById('table-section').innerText = '';
  responseAsJson['dataset']['data'].forEach(e => {
    document
      .getElementById('table-section')
      .insertAdjacentHTML('beforeend', `<tr><td>${e[0]}</td><td>${e[3].toFixed(2)}</td><td>${e[5].toFixed(2)}</td><td>${e[6].toFixed(2)}</td></tr>`);
  });
};

function showChart() {
  document.getElementById('chart-section').classList.remove('d-none');
  document.getElementById('table-section-header').classList.add('d-none');
  document.getElementById('headerTable').classList.add('headerStyle');
  document.getElementById('headerChart').classList.remove('headerStyle');
};

function showTable() {
  document.getElementById('chart-section').classList.add('d-none');
  document.getElementById('table-section-header').classList.remove('d-none');
  document.getElementById('headerTable').classList.remove('headerStyle');
  document.getElementById('headerChart').classList.add('headerStyle');
}

function loadLabels() {
  let labelsArray = [];
  labelsArray = responseAsJson['dataset']['data'];
  bitcoinLabels.length = 0;
  labelsArray.forEach(e => {
    bitcoinLabels.push(e[0]);
  });
}

function setChartSetup() {

  const labels = bitcoinLabels;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Mid',
        backgroundColor: 'rgb(0, 173, 136)',
        borderColor: 'rgb(0, 173, 136)',
        data: [],
      },
      {
        label: 'Bid',
        backgroundColor: 'rgb(0, 162, 255)',
        borderColor: 'rgb(0, 162, 255)',
        data: [],
      },
      {
        label: 'Ask',
        backgroundColor: 'rgb(131, 238, 44)',
        borderColor: 'rgb(131, 238, 44)',
        data: [],
      },
    ],
  }

  responseAsJson['dataset']['data'].forEach(element => {
    data['datasets'][0]['data'].push(element[3]);
    data['datasets'][1]['data'].push(element[5]);
    data['datasets'][2]['data'].push(element[6]);
  });

  setChartConfig(data);
};

function setChartConfig(data) {
  const config = {
    type: 'line',
    data: data,
    options: {
      elements: { point: { pointRadius: 1.5 }, line: { borderWidth: 1 } },
      scales: { x: { reverse: true }, y: { title: { display: true, text: 'USD' } } },
      layout: {
        padding: {
          left: 5,
          right: 30,
          top: 0,
          bottom: 0,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Course BTC / USD ',
          font: { size: 16 },
        },
      },
    },
  };

  loadChart(config);
}

function loadChart(config) {

  if (statusChart) {
    myChart.destroy();
    statusChart = false;
  }

  Chart.defaults.color = '#fff';
  Chart.defaults.borderColor = '#444';
  myChart = new Chart(document.getElementById('myChart'),
  config
  );
  statusChart = true;
};

function fullScreenChart(){
  if(!capture){
    document.getElementById('chart-section').classList.add('full-screen-mode');
    document.getElementById('chartImage').src = './img/compress.svg';
    capture = true;
  } else {
    document.getElementById('chart-section').classList.remove('full-screen-mode');
    document.getElementById('chartImage').src = './img/expand.svg';
    capture = false;
  }
  
};
