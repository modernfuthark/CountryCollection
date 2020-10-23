#!/usr/bin/node

const endpoint = 'https://restcountries.eu/rest/v2';

// Searching variables
let searchNames = []; //Set later
let searchmod = "Alpha"; //Default
const searchurls = {
  'Alpha': 'alpha',
  'Country name': 'name'
}

function gatherSearchData() {
  $.ajax({
        url: 'https://restcountries.eu/rest/v2/all',
        type: 'GET',
        async: false,
        success: function(data) {
            for (let i = 0; i <= data.length; i++) {
              searchNames.push(data[i]['name']);
            }
        }
     });
  console.log(searchNames)
}

function updateData(data) {
  console.log('Data length: ' + data.length)
  console.log(data)
  $('.searchbar .results').empty()
  if (data.length == 1) { //Direct search
    data = data[0];
  }
  // Probably move above into the ajax's success, and call this function to update all page data
  $('.info_countryName').text(`${data.name}`);
  $('#flagbkgn').attr('src', `${data.flag}`);
}

function test_SearchDisplay(input) {
  const results = []
  $('.searchbar .results').empty();
  for (let i = 0; i < searchNames.length; i++) {
    const v = searchNames[i];
    if (v.toUpperCase().includes($(this).val().toUpperCase())) {
      //console.log(v);
      results.push(v);
      $('.searchbar .results').append(`<li id="searchres">${v}</li`);
    }
  }
  if (results.length == 1) {
    console.log('Direct search')
  }
}

function requestData(v) {
  console.log('clicc')
    //const v = $(this).val();
    console.log(v);
    if (v != '') {
      let url = `${endpoint}/${searchurls[searchmod]}/${v}`

      $.ajax({
        type: 'GET',
        url: url,
        success: updateData, // Results B^)
        error: function () { // Got no results
          $('.info_countryName').text('Error 404!');
        }
      });
  } else { // Input is empty, probably dont change anything from last request
    $('.info_countryName').text('Empty input')
  }
}

$('document').ready(function () {
  gatherSearchData();

  $('.searchbar').on('keypress', 'input', test_SearchDisplay);
  //$('.searchbar').on('keypress', 'input', requestData); // Goes through the searching / HTTP GET process

  $('.dropdown-content p').click(function(_) { // Change searching mode
    searchmod = $(this).text();
    $('#searchmode').text(endpoint + '/' + searchurls[searchmod]);
  });

  $('.results').on('click', '#searchres', function() {
    requestData($(this).text());
  });
});
