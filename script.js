document.addEventListener("DOMContentLoaded", () => {
    const liveLocationDisplay = document.getElementById('locationDisplay');
    const getLiveLocationBtn = document.getElementById("getLiveLocation");
    const weeklyDataDisplay = document.getElementById('weeklyData');
    const clearWeeklyDataBtn = document.getElementById("clearWeeklyData");
    const API_KEY = '6ea32e83ed9c455e95a4d56632ecc13e' //Replace with your OpenCage Key


    // fetch Live location
    getLiveLocationBtn.addEventListener('click', () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { longitude, latitude } = position.coords;
                // const location = `Latitude: ${latitude},Longitude : ${longitude}`;

                //reverse geocode to get teh address
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results && data.results.length > 0) {
                            const location = data.results[0].formatted; //get the formatted address
                            

                            // Update display
                            liveLocationDisplay.textContent = `Location : ${location}`;

                            // store location in localStorage
                            storeLocation(location);
                        }else{
                            liveLocationDisplay.textContent = `Error : could not retrieve address`;
                        }
                        
                    })
                    .catch(error => {
                        liveLocationDisplay.textContent =`Error : ${error.message}`;
                    })


                }, (error) => {
                    liveLocationDisplay.textContent = `Error : ${error.message}`;
                })

        } else {
            alert("Geolocation is not supported by your browser");
        }

    })

    // store location data in localStorage

    function storeLocation(location) {
        let storedData = JSON.parse(localStorage.getItem('weeklyData')) || [];

        // Only store the latest 7 entries (for the week)

        if (storedData.length > 7) {
            storedData.shift();
        }

        storedData.push({
            date: new Date().toLocaleString(),
            location: location

        })

        localStorage.setItem('weeklyData', JSON.stringify(storedData));
        displayWeeklyData();
    }

    // display stored weekly Data
    function displayWeeklyData() {
        const storedData = JSON.parse(localStorage.getItem('weeklyData')) || [];
        weeklyDataDisplay.innerHTML = storedData.length ? storedData.map(data => `<p>${data.date}: ${data.location}</p>`).join('') : 'no data available';
    }

    // clear weekly data
    clearWeeklyDataBtn.addEventListener('click', () => {
        localStorage.removeItem('weeklyData');
        displayWeeklyData();
    })


    // Initialize on page load
    displayWeeklyData();

})

