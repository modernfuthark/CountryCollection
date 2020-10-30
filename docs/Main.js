#!/usr/bin/node

// Base URLS
const endpoint = 'https://restcountries.eu/rest/v2';
const mapsApiUrl = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCz5aeUcSAeVm_93qgq4paYsz_xoJb4YW0';

// Searching variables and caches
const searchNames = []; // Gets set later
const searchAlphas = [];
let searchmod = 'Country name'; // Default
const searchurls = {
  'Alpha': 'alpha',
  'Country name': 'name'
};

// Exchange rate cache
let exchangeRates = [];
let symbol = '';

function gatherSearchData () {
  $.ajax({
    url: 'https://restcountries.eu/rest/v2/all',
    type: 'GET',
    async: false,
    success: function (data) {
      data.forEach(function (country) {
        searchNames.push(country.name);
        searchAlphas.push(country.alpha3Code);
      })
    }
  });

  $.ajax({
    url: 'https://api.exchangerate.host/latest?base=USD',
    type: 'GET',
    async: false,
    success: function (data) {
      exchangeRates = data;
    }
  });
}

function updateData (data) {
  $('.searchbar .results').empty();
  if (searchmod === 'Country name') { data = data[0] }
  // Data is given as an array of json values, select first
  // Data array can contain more than 1 JSON, only seen this if you select "Congo" in the search results

  // Prepair elements
  $('.initialInfo').remove(); // Remove initial information div
  $('.infodiv').css('visibility', 'visible'); // Show country information div
  symbol = data.currencies[0].code // Set currency symbol for the exchanger
  exchanger(true);


  // Info display
  $('#flagbkgn').attr('src', `${data.flag}`);
  $('.infodiv iframe').attr('src', `${mapsApiUrl}&q=${data.name}`);
  $('#info_countryName').text(`${data.name}`);
  $('#info_countryCapital').text(`Capital: ${data.capital}`);
  $('#info_countryPopulation').text(`Population: ${(data.population).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`); // Fancy comma regex from Elias Zamaria
  $('#info_countryTimeZone').text(`Timezones: ${data.timezones}`);
  $('#info_Languages ul').empty();
  data.languages.forEach(function (v) {
    const url = `https://omniglot.com/writing/${v.name.toLowerCase()}.htm`;
    $('#info_Languages ul').append(`<li><a href="${url}" target="_blank">${v.name}</a></li>`);
  });
}

function SearchDisplay () {
  $('.searchbar .results').empty(); // Clear old results
  if (searchmod === 'Country name') { // Determines the search array to parse through, either full names or Alpha3 codes
    for (let i = 0; i < searchNames.length; i++) {
      const v = searchNames[i];
      if (v.toUpperCase().includes($(this).val().toUpperCase())) { // Compare input and v in uppercase to avoid case sensitivity
        $('.searchbar .results').append(`<li id="searchres">${v}</li`);
      }
    }
  } else if (searchmod === 'Alpha') {
    for (let i = 0; i < searchAlphas.length; i++) {
      const v = searchAlphas[i];
      if (v.toUpperCase().includes($(this).val().toUpperCase())) { // Compare input and v in uppercase to avoid case sensitivity
        $('.searchbar .results').append(`<li id="searchres">${v}</li`);
      }
    }
  }
}

function exchanger(override) {
  const USD = 1;
  if (!override) {
    USD = $(this).val();
  }
  $('.exchanger .rateOutput').text(`${(USD * exchangeRates.rates[symbol]).toFixed(2)} ${symbol}`);
}

function requestData (v) {
  if (v !== '') {
    const url = `${endpoint}/${searchurls[searchmod]}/${v}`;

    $.ajax({
      type: 'GET',
      url: url,
      success: updateData, // Got results, updateData function is called
      error: function () { // Got no results
        $('.info_countryName').text('Error 404!');
      }
    });
  } else { // Input is empty, probably dont change anything from last request
    $('.info_countryName').text('Empty input');
  }
}

$('document').ready(function () {
  gatherSearchData(); // When document is ready, query APIs to cache responces

  // Live updates for the search results display
  $('.searchbar').on('keydown', 'input', SearchDisplay);

  // Updates searching mode via dropdown menu
  $('.dropdown-content p').click(function (_) {
    searchmod = $(this).text();
    $('.dropdown button').text(`Search via ${searchmod}`)
  });

  // Search result event listener
  $('.results').on('click', '#searchres', function () {
    requestData($(this).text());
  });

  // Exchange rate event listener
  $('.exchanger').on('keydown', 'input', exchanger);
});
