$(document).ready(function () {

    
    $.ajaxPrefilter("json script", function (options) {
        options.crossDomain = true;
    });

    const sunriseSunsetApiBaseUrl = "https://api.sunrisesunset.io/json";

    
    function CustomError(message) {
        this.name = 'CustomError';
        this.message = message || '';
        var error = new Error(this.message);
        error.name = this.name;
        this.stack = error.stack;
    }
    CustomError.prototype = Object.create(Error.prototype);

    $('#getCurrentLocationDataButton').click(() => {


        try {
            
            getLocation().then(currentLocationLatLongPair => {
                console.log(currentLocationLatLongPair);

                
                const queryString = $.param(currentLocationLatLongPair);

               
                
                let url = `${sunriseSunsetApiBaseUrl}?${queryString}`;
                
                getDataFromAPI(url).then(resultJson => {
                    
                    displaySunriseSunsetData(resultJson.results, $('#result-container'), "Today's Info", null);
                }).catch(error => {
                    
                    console.error('An error occurred while fetching data:', error.message);
                });

                let urlForTomorrow = `${url}&date=${getTomorrowDate()}`;
                getDataFromAPI(urlForTomorrow).then(resultJson => {
                    
                    displaySunriseSunsetData(resultJson.results, $('#result-container-tomorrow'), "Tomorrow's Info", null);
                }).catch(error => {
                    
                    console.error('An error occurred while fetching data:', error.message);
                });

            
            }).catch(error => {
                
                console.error('An error occurred:', error.message);
            }).finally(() => {
                console.log('Operation completed');
            });
        } catch (error) {
            
            console.error('An error occurred:', error.message);
        }
    });


    function getTomorrowDate() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
    
        
        var year = tomorrow.getFullYear();
        var month = ('0' + (tomorrow.getMonth() + 1)).slice(-2);
        var day = ('0' + tomorrow.getDate()).slice(-2);
    
        
        var formattedDate = `${year}-${month}-${day}`;
    
        return formattedDate;
    }


    function displaySunriseSunsetData(data, resultContainer, heading, dis_name) {
        
        resultContainer.empty();
    
        
        var sunriseSunsetDataDiv = $('<div>').addClass('mt-4');
    
        
        var closeButton = $('<button>')
            .addClass('btn btn-danger close-btn')
            .text('Close')
            .click(function () {
                resultContainer.empty(); 
            });
    
        
        var headingElement = $('<h2>').addClass('mb-4 d-flex justify-content-between align-items-center').text(heading);
        
        
        headingElement.append(closeButton);

        var info = $('<p>')
        if (dis_name !== null)
        {
           info.text(dis_name);
        }
    
        
        var table = $('<table>').addClass('table table-bordered');
        var tbody = $('<tbody>');
    
        
        var keysToDisplay = [
            "sunrise",
            "sunset",
            "dawn",
            "dusk",
            "solar_noon",
            "day_length",
            "timezone"
        ];
    
        
        keysToDisplay.forEach(key => {
            var row = $('<tr>');
            var labelCell = $('<th>').text(formatKeyLabel(key));
            var valueCell = $('<td>').text(data[key]);
            row.append(labelCell, valueCell);
            tbody.append(row);
        });
    
        
        table.append(tbody);
    
        
        sunriseSunsetDataDiv.append(headingElement).append(info).append(table);
    
        
        resultContainer.append(sunriseSunsetDataDiv);
    }
    
    
    
    
    function formatKeyLabel(key) {
        return key.replace(/_/g, ' ').replace(/\b\w/g, firstChar => firstChar.toUpperCase());
    }

    function closeResultContainer() {
        $('#result-container').empty();
    }

    function closeResultContainerTomorrow() {
        $('#result-container-tomorrow').empty();
    }



    
    function getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;
                    resolve({ lat, lng });
                }, error => {
                    reject(new CustomError('Failed to fetch current location info'));
                });
            } else {
                reject(new CustomError('Geolocation is not supported'));
            }
        });
    }

    function getDataFromAPI(url) {
        return axios.get(url)
            .then(response => {
                console.log('Data:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error; 
            });
    }






$('#searchLocationButton').click(function () {
    var location = $('#locationInput').val();
    if (location) {
        
        geocodeLocation(location);
    }else {
        // Show error message if the location input is empty
        $('#error-message').text('Please enter a location.').show();
        // Optionally, you can hide the error message after a few seconds
        setTimeout(function () {
            $('#error-message').hide().text('');
        }, 3000); // Hide the error message after 3 seconds (3000 milliseconds)
    }
});

function geocodeLocation(location) {
    
    var geocodeUrl = 'https://geocode.maps.co/search?q=' + encodeURIComponent(location);

    axios.get(geocodeUrl)
        .then(response => {
            
            var geocodeData = response.data;
            if (geocodeData.length === 0) {
                console.error('No results found for the entered location.');
                // Display an error message indicating no results were found
                $('#error-message').text('No results found for the entered location.').show();
                // Optionally, hide the error message after a few seconds
                setTimeout(function () {
                    $('#error-message').hide().text('');
                }, 3000); // Hide the error message after 3 seconds (3000 milliseconds)
                return;
            }
            
            displaySearchResults(geocodeData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displaySearchResults(results) {

    let searchContainer = $('#search-result-container')
    
    searchContainer.empty();

    
    var searchResultsDiv = $('<div>').addClass('mt-4');

    var closeButton = $('<button>')
    .addClass('btn btn-danger close-btn')
    .text('Close')
    .click(function () {
        searchContainer.empty(); 
    });

    
    var heading = $('<h2>').addClass('mb-4 d-flex justify-content-between align-items-center').text('Search Results');
    
    heading.append(closeButton);
    
    searchResultsDiv.append(heading);

    
    var resultListGroup = $('<ul>').addClass('list-group');

    
    results.forEach(result => {
        
        var lat = result.lat;
        var lon = result.lon;
        var dis_name = result.display_name;

        
        var listItem = $('<li>').addClass('list-group-item list-group-item-action d-flex justify-content-between align-items-center').text(result.display_name);

        
        listItem.click(function () {
            
            handleResultClick(lat, lon, dis_name);
        });

        
        resultListGroup.append(listItem);
    });


    searchResultsDiv.append(resultListGroup);

    
    searchContainer.append(searchResultsDiv);
}


function handleResultClick(lat, lon, dis_name) {
    
    console.log(`Clicked on result with Lat: ${lat}, Lon: ${lon}`);
    const queryString = `lat=${lat}&lng=${lon}`;

    
    
    let url = `${sunriseSunsetApiBaseUrl}?${queryString}`;
    
    getDataFromAPI(url).then(resultJson => {
        
        displaySunriseSunsetData(resultJson.results, $('#result-container-search'), "Today's Info", dis_name);
    }).catch(error => {
        
        console.error('An error occurred while fetching data:', error.message);
    });

    let urlForTomorrow = `${url}&date=${getTomorrowDate()}`;
    getDataFromAPI(urlForTomorrow).then(resultJson => {
        
        displaySunriseSunsetData(resultJson.results, $('#result-container-search-tomorrow'), "Tomorrow's Info", dis_name);
    }).catch(error => {
        
        console.error('An error occurred while fetching data:', error.message);
    });
   
}

});




