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
let form = 'multiply';
let resultValueLeft = 'input-left';
let resultValueRight = 'input-right';

function init() {
  loadCourse();
  setDates();
  setCurrentRates();
  calculateInit();
}

async function loadCourse() {
  let today = new Date();
  let time = new Date();
  today.setDate(new Date().getDate() - 1);
  datePicker['startDate'] = today.toISOString().split('T')[0];
  datePicker['endDate'] = today.toISOString().split('T')[0];
  timeValue = time.toISOString().split('T')[1];
  let url = `https://data.nasdaq.com/api/v3/datasets/BITFINEX/BTCUSD?start_date=${datePicker['startDate']}&end_date=${datePicker['endDate']}&api_key=${API_KEY}`;
  let response = await fetch(url);
  responseAsJson = await response.json();
  console.log('JSON-Array geladen:', responseAsJson);
}

function setDates() {
  document.getElementById('date-exchange-rate').innerText = datePicker['endDate'];
  document.getElementById('refreshed-at-1').innerText = `
  Data refreshed at ${datePicker['endDate']}, ${timeValue}
  `;
  document.getElementById('refreshed-at-2').innerText = `
  Data refreshed at ${datePicker['endDate']}, ${timeValue}
  `;
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
    form = 'divide';
    resultValueRight = 'input-left';
    resultValueLeft = 'input-right';
    changeInputValues();
  } else {
    leftCurrency.innerHTML = 'BTC';
    rightCurrency.innerHTML = 'USD';
    placeHolderLeft.innerHTML = 'BTC';
    placeHolderRight.innerHTML = 'USD';
    form = 'multiply';
    resultValueRight = 'input-right';
    resultValueLeft = 'input-left';
    changeInputValues();
  }
}

function changeInputValues() {
  let changeInput1 = +document.getElementById('input-left').value;
  let changeInput2 = +document.getElementById('input-right').value;
  document.getElementById('input-right').value = changeInput1;
  document.getElementById('input-left').value = changeInput2;
}

function calculateInit() {
  document.getElementById('input-left').addEventListener('keyup', calculateLeft);
  document.getElementById('input-right').addEventListener('keyup', calculateRight);
}

function calculateLeft() {
  let inputLeftValue = +document.getElementById('input-left').value;
  calc(inputLeftValue, 'multiply');
};

function calculateRight() {
  let inputRightValue = +document.getElementById('input-right').value;
  calc(inputRightValue, 'divide');
}

function calc(input, operation) {
  let inputValue = responseAsJson['dataset']['data'][0][3];
  if (operation == form) {
    result = input * inputValue;
    document.getElementById(resultValueRight).value = result;
  } else {
    result = input / inputValue;
    document.getElementById(resultValueLeft).value = result;
  }
}
