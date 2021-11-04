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
        <div class="card has-background-danger-light mb-6">
        <div class="card-content">
        <div class="content has-text-centered">
            <div class="is-size-3">${flightsData[i].departure_airport} -> ${
      flightsData[i].destination_airport
    }</div>
            <div class="is-size-5">
            <i class="fas fa-users"></i>
            <span class="ml-3">${flightsData[i].passengers} passengers</span>
            </div>
            <hr />
            <div class="is-size-3 has-text-info">Carbon Emissions</div>
            <div class="my-4">
           
            <div class="is-size-5 p-2">${flightsData[i].carbon_lb} pounds</div>
            <div class="has-text-info is-size-3 p-2">${
              flightsData[i].carbon_kg
            } kilograms</div>
            <div class="title is-size-4 p-2 has-text-danger">You would need ${Math.floor(
              flightsData[i].carbon_kg / 22
            )} trees and a whole year <br /> to offset your emissions!</div>
            </div>
            <button data-type="flights" data-id="${
              flightsData[i].id
            }" class=" delete-plan button is-centered is-danger has-text-lightis-medium is-rounded">Delete</button>
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
    const card = `<div class="card has-background-danger-light mb-6">
    <div class="card-content">
    <div class="content has-text-centered">
    <div class="is-size-3">${vehiclesData[i].vehicle_make} - ${
      vehiclesData[i].vehicle_model
    } (${vehiclesData[i].vehicle_year})</div>
    <hr />
    <div class="has-text-info is-size-3">Carbon Emissions</div>
    <div class="my-4">
   
    <div class="is-size-5 p-2">${vehiclesData[i].carbon_lb} pounds</div>
    <div class="has-text-info is-size-3 p-2">${
      vehiclesData[i].carbon_kg
    } kilograms</div>
    <div class="title is-size-4 p-2 has-text-danger">You would need ${Math.ceil(
      vehiclesData[i].carbon_kg / 22
    )} tree(s) and a whole year <br /> to offset your emissions!</div>
 
    </div>
    <button data-type="vehicles" data-id="${
      vehiclesData[i].id
    }" class=" delete-plan button is-centered is-danger has-text-lightis-medium is-rounded">Delete</button>
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

// adds event listener on delete button for cards, deletes data from local storage accordingly
$("main").on("click", ".delete-plan", function (event) {
  let id = $(event.target).data("id");
  console.log($(event.target).data("type"));
  console.log(id);
  if ($(event.target).data("type") === "vehicles") {
    emissionData.vehicles = emissionData.vehicles.filter(
      (vehicle) => vehicle.id != id
    );
  } else {
    emissionData.flights = emissionData.flights.filter(
      (flight) => flight.id != id
    );
  }
  localStorage.setItem("emissionData", JSON.stringify(emissionData));
  $(this).parent().parent().remove();
});
