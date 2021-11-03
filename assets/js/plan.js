const getEmissionDataFromStorage = function () {
  // Retrieves the emission data from localStorage
  let emissionData = localStorage.getItem("emissionData");
  if (emissionData === null) {
    //  we are storing the data for the first time
    emissionData = {
      flights: [],
      vehicles: [],
    };
  } else {
    // Convert string to json
    emissionData = JSON.parse(emissionData);
  }
  return emissionData;
};

const renderFlightCarbonCard = function (emissionData) {
  let flightsData = emissionData.flights;

  for (let i = 0; i < flightsData.length; i++) {
    // construct card
    const card = `<div class="column">
        <div class="card">
        <div class="card-content">
        <div class="content">
            <div class="is-size-3">${flightsData[i].departure_airport} -> ${flightsData[i].destination_airport}</div>
            <div class="is-size-5">
            <i class="fas fa-users"></i>
            <span class="ml-3">${flightsData[i].passengers} passengers</span>
            </div>
            <hr />
            <div class="is-size-4 my-2">Carbon Emissions</div>
            <div class="my-4">
           
            <div class="is-size-5 p-2">${flightsData[i].carbon_lb} pounds</div>
            <div class="is-size-5 p-2">${flightsData[i].carbon_kg} kilograms</div>
      
            </div>
        </div>

        </div>
    </div>
  </div>`;

    // append to parent
    $("#flight-card-container").append(card);
  }
};

const renderVehicleCarbonCard = function (emissionData) {
  let vehiclesData = emissionData.vehicles;
  for (let i = 0; i < vehiclesData.length; i++) {
    const card = `<div class="card">
    <div class="card-content">
    <div class="content">
    <div class="is-size-3">${vehiclesData[i].vehicle_make} - ${vehiclesData[i].vehicle_model} (${vehiclesData[i].vehicle_year})</div>
    <hr />
    <div class="is-size-4 my-2">Carbon Emissions</div>
    <div class="my-4">
   
    <div class="is-size-5 p-2">${vehiclesData[i].carbon_lb} pounds</div>
    <div class="is-size-5 p-2">${vehiclesData[i].carbon_kg} kilograms</div>
 
    </div>
    </div>
    
    </div>
    </div>`;

    // append to parent
    $("#vehicle-card-container").append(card);
  }
};

let emissionData = getEmissionDataFromStorage();
renderFlightCarbonCard(emissionData);
renderVehicleCarbonCard(emissionData);
