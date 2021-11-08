const getDataFromApi = async function (url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
};

const getVehicleMakeOptions = async () => {
  // get data from API
  const data = await getDataFromApi(
    "https://www.carboninterface.com/api/v1/vehicle_makes",
    {
      headers: {
        Authorization: "Bearer Kp3Os6R725QjjSpSXGlXHw",
      },
    }
  );

  // construct option elements

  const vehicleMakeOptions = data.sort(sortVehicles).map((vehicleMake) => {
    return `<option class="vehicle-option" value=${vehicleMake.data.id}>${vehicleMake.data.attributes.name}</option>`;
  });

  // return options
  return vehicleMakeOptions;
};

function doesMatchExists(searchVehicle, index, allVehicles) {
  // This function returns false if the duplicate is present

  // Get the vechile name+model number to look for a match
  let searchName =
    searchVehicle.data.attributes.name +
    " " +
    searchVehicle.data.attributes.year;

  // Check if a matching element exists before the current element
  // because we want to accept the first occurrance but not the next
  for (let i = 0; i < index; i++) {
    let currName =
      allVehicles[i].data.attributes.name +
      " " +
      allVehicles[i].data.attributes.year;
    if (currName === searchName) {
      return false;
    }
  }
  return true;
}

const getVehicleModelOptions = function (data) {
  const vehicleModelOptions = data
    .filter((v, index) => doesMatchExists(v, index, data))
    .map((vehicleModel) => {
      return `<option class="vehicle-option" value=${vehicleModel.data.id}>${vehicleModel.data.attributes.name} ${vehicleModel.data.attributes.year}</option>`;
    });

  return vehicleModelOptions;
};

// function to sort iatas alphabetically
const sortIatas = function (a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
};

const sortVehicles = function (a, b) {
  if (a.data.attributes.name < b.data.attributes.name) {
    return -1;
  }
  if (a.data.attributes.name > b.data.attributes.name) {
    return 1;
  }
  return 0;
};

// function to get all iata options
const getIataOptions = function () {
  const iataOptions = iatas
    .filter((iata) => iata.name !== null)
    .sort(sortIatas)
    .map(
      (airportIataObj) =>
        `<option class="vehicle-option" value=${airportIataObj.iata}>${airportIataObj.name} (${airportIataObj.iata})</option>`
    );

  return iataOptions;
};

// function to render from airport
const renderFromDropdown = function (options) {
  return `<div class="column is-two-fifths">
    <p class="is-size-4 pb-4 has-text-centered">From</p>
    <div class="select is-info is-hovered">
      <select id="flight-from-dropdown">${options}</select>
    </div>
  </div>`;
};

// function to render to airport
const renderToDropdown = function (options) {
  return `<div class="column is-two-fifths">
    <p class="is-size-4 pb-4 has-text-centered">To</p>
    <div class="select is-info is-hovered">
      <select id="flight-to-dropdown">${options}</select>
    </div>
  </div>`;
};

const renderPassengers = function () {
  return `<div class="column is-one-fifth">
    <p class="is-size-4 pb-4 pl-6">Passengers</p>
    <div class="select is-info pl-6">
      <select
        id="flight-passenger-dropdown"
        class="select is-medium pl-6 is-hovered"
      >
        <option value="6" selected>6</option>
        <option value="5" selected>5</option>
        <option value="4" selected>4</option>
        <option value="3" selected>3</option>
        <option value="2" selected>2</option>
        <option value="1" selected>1</option>
      </select>
    </div>
  </div>`;
};

// function to render the flight form elements
const renderFlightFormElements = function () {
  // get the parent element
  const dynamicDivElement = $("#dynamic-form-content");

  // get options for to and from
  const options = getIataOptions();

  // append form elements to parent
  dynamicDivElement.append(`<div class="columns is-centered">
    ${renderFromDropdown(options)}
    ${renderToDropdown(options)}
    ${renderPassengers()}
  </div>`);
};

const renderVehicleMake = function (options) {
  return `<div class="column is-narrow">
  <p class="is-size-4 pb-4 has-text-centered">Brand</p>
    <div class="select is-info is-hovered">
      <select id="vehicle-make">${options}</select>
    </div>
  </div>`;
};

const renderVehicleModel = function (options) {
  return `<div class="column is-narrow id="vehicle-models-dropdown">
  <p class="is-size-4 pb-4">Model</p>
    <div class="select is-info is-hovered">
      <select id="vehicle-model">${options}</select>
    </div>
  </div>`;
};

const renderDistance = function () {
  return `<div class="column is-narrow">
  <p class="is-size-4 pb-4 has-text-centered">Distance</p>
    <div>
      <input
        class="input is-medium is-info is-hovered"
        type="number"
        id="vehicle-distance"
        placeholder="Distance (km)"
      />
    </div>
  </div>
  `;
};

// function to render the vehicle form elements
const renderVehicleFormElements = async function () {
  // get the parent element
  const dynamicDivElement = $("#dynamic-form-content");

  // get options for to and from
  const vehicleMakeOptions = await getVehicleMakeOptions();

  dynamicDivElement.append(`<div class="columns is-centered" id="vehicle-form-elements">
    ${renderDistance()}
    ${renderVehicleMake(vehicleMakeOptions)}
  </div>`);

  // add event listener to change of vehicle make
  $("#vehicle-make").on("change", handleVehicleMakeChange);
};

const renderVehicleCarbonCard = function (data) {
  const card = `<div class="columns is-centered">
  <div class="card has-background-danger-light mb-6">
    <div class="card-content">
      <div class="content has-text-centered">
        <div class="is-size-3">${data.data.attributes.vehicle_make} - ${
    data.data.attributes.vehicle_model
  } (${data.data.attributes.vehicle_year})</div>
        <hr />
        <div class="has-text-info is-size-3">Carbon Emissions</div>
        <div class="my-4">
        
          <div class="is-size-5 p-2">${
            data.data.attributes.carbon_lb
          } pounds</div>
          <div class="has-text-info is-size-3 p-2">${
            data.data.attributes.carbon_kg
          } kilograms</div>
          <div class="title is-size-4 p-2 has-text-danger">You would need ${Math.ceil(
            data.data.attributes.carbon_kg / 22
          )} tree(s) and a whole year <br /> to offset your emissions!</div>
        </div>
      </div>
      <div>
        <div class="columns is-centered">
          <div class="column is-flex-grow-0">
            <button class="delete-card button is-danger is-medium is-rounded card-footer-item is-size-4">Delete</button>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-flex-grow-0">
            <button
            class="button is-info is-medium is-rounded card-footer-item is-size-4"
            id="save-to-plan-btn"
            >
            Save To Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>`;

  // empty parent
  $("#carbon-card-container").empty();

  // append to parent
  $("#carbon-card-container").append(card);

  currentEmissionData = data.data;

  $("#save-to-plan-btn").on("click", savePlanToLocalStorageVehicle);
};

let currentEmissionData = null;

const renderFlightCarbonCard = function (data) {
  // construct card
  const card = `<div class="columns is-centered">
    <div class="card has-background-danger-light mb-6">
    <div class="card-content">
      <div class="content has-text-centered">
        <div class="is-size-3">${
          data.data.attributes.legs[0].departure_airport
        } <i class="fas fa-arrow-alt-circle-right"></i> ${data.data.attributes.legs[0].destination_airport}</div>
        <div class="is-size-5">
          <i class="fas fa-users"></i>
          <span class="ml-3">${
            data.data.attributes.passengers
          } passengers</span>
        </div>
        <hr />
        <div class="has-text-info is-size-3">Carbon Emissions</div>
        <div class="my-4">
         
          <div class="is-size-5 p-2">${
            data.data.attributes.carbon_lb
          } pounds</div>
          <div class="has-text-info is-size-3 p-2">${
            data.data.attributes.carbon_kg
          } kilograms</div>
          <div class="title is-size-4 p-2 has-text-danger">You would need ${Math.floor(
            data.data.attributes.carbon_kg / 22
          )} trees and a whole year <br /> to offset your emissions!</div>
         
        </div>
      </div>
        <div class="columns is-centered">
          <div class="column is-flex-grow-0">
            <button class="delete-card button is-danger is-medium is-rounded card-footer-item is-size-4">Delete</button>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-flex-grow-0">
            <button
            class="button is-info is-medium is-rounded card-footer-item is-size-4"
            id="save-to-plan-btn"
            >
            Save To Plan
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>`;

  // empty parent
  $("#carbon-card-container").empty();

  // append to parent
  $("#carbon-card-container").append(card);

  currentEmissionData = data.data;

  $("#save-to-plan-btn").on("click", savePlanToLocalStorageFlight);
};

const handleVehicleMakeChange = async function () {
  // get vehicle make id from selection
  const vehicleMakeId = $("#vehicle-make").val();

  // get data for vehicle id
  const vehicleModels = await getDataFromApi(
    `https://www.carboninterface.com/api/v1/vehicle_makes/${vehicleMakeId}/vehicle_models/`,
    {
      headers: {
        Authorization: "Bearer Kp3Os6R725QjjSpSXGlXHw",
      },
    }
  );

  // TODO: remove duplicate vehicle models from API data

  // get vehicle model options
  const vehicleModelOptions = getVehicleModelOptions(vehicleModels);

  // render vehicle model
  const vehicleModelsDropDown = renderVehicleModel(vehicleModelOptions);

  // remove models if it exists
  $("#vehicle-models-dropdown").remove();

  $("#vehicle-form-elements").append(vehicleModelsDropDown);
};

// callback function to handle analyse select
const handleAnalyseSelect = function () {
  // get the user selection (flights, vehicles)
  const userSelection = $("#analyse-select").val();

  // if user selects flights render the flight form elements
  if (userSelection === "flights") {
    // remove previous form elements
    $("#dynamic-form-content").empty();
    $("#carbon-card-container").empty();
    renderFlightFormElements();
  }

  // if user selects vehicles render the vehicle form elements
  if (userSelection === "vehicles") {
    // remove previous form elements
    $("#dynamic-form-content").empty();
    $("#carbon-card-container").empty();
    renderVehicleFormElements();
  }
};

const handleFormSubmit = async function (event) {
  event.preventDefault();

  // get the form values
  const userSelection = $("#analyse-select").val();

  // if flights
  if (userSelection === "flights") {
    const fromAirport = $("#flight-from-dropdown").val();
    const toAirport = $("#flight-to-dropdown").val();
    const passengers = $("#flight-passenger-dropdown").val();

    // get data from api
    const data = await getDataFromApi(
      "https://www.carboninterface.com/api/v1/estimates",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Kp3Os6R725QjjSpSXGlXHw",
        },
        body: JSON.stringify({
          type: "flight",
          passengers: passengers,
          legs: [
            {
              departure_airport: fromAirport,
              destination_airport: toAirport,
            },
          ],
        }),
      }
    );

    console.log(data);

    // render card on page
    renderFlightCarbonCard(data);
  }

  // if vehicles
  if (userSelection === "vehicles") {
    const distance = $("#vehicle-distance").val();
    const vehicleModel = $("#vehicle-model").val();

    const data = await getDataFromApi(
      "https://www.carboninterface.com/api/v1/estimates",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Kp3Os6R725QjjSpSXGlXHw",
        },
        body: JSON.stringify({
          type: "vehicle",
          distance_unit: "km",
          distance_value: distance,
          vehicle_model_id: vehicleModel,
        }),
      }
    );

    console.log(data);

    // render card on page
    renderVehicleCarbonCard(data);
  }
};

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

const savePlanToLocalStorageFlight = function () {
  $("#save-to-plan-btn").off("click");
  // save the data into local storage
  let emissionData = getEmissionDataFromStorage();
  let currentFlightPlan = {
    departure_airport: currentEmissionData.attributes.legs[0].departure_airport,
    destination_airport:
      currentEmissionData.attributes.legs[0].destination_airport,
    passengers: currentEmissionData.attributes.passengers,
    carbon_g: currentEmissionData.attributes.carbon_g,
    carbon_mt: currentEmissionData.attributes.carbon_mt,
    carbon_lb: currentEmissionData.attributes.carbon_lb,
    carbon_kg: currentEmissionData.attributes.carbon_kg,
    id: "" + Math.random(),
  };

  emissionData.flights.push(currentFlightPlan);

  // store the emission data back in localStorage
  localStorage.setItem("emissionData", JSON.stringify(emissionData));
};

const savePlanToLocalStorageVehicle = function (event) {
  $("#save-to-plan-btn").off("click");
  // save the data into local storage
  event.preventDefault();
  let emissionData = getEmissionDataFromStorage();
  let currentVehiclePlan = {
    vehicle_make: currentEmissionData.attributes.vehicle_make,
    vehicle_model: currentEmissionData.attributes.vehicle_model,
    vehicle_year: currentEmissionData.attributes.vehicle_year,
    distance: 100,
    carbon_g: currentEmissionData.attributes.carbon_g,
    carbon_mt: currentEmissionData.attributes.carbon_mt,
    carbon_lb: currentEmissionData.attributes.carbon_lb,
    carbon_kg: currentEmissionData.attributes.carbon_kg,
    id: "" + Math.random(),
  };

  emissionData.vehicles.push(currentVehiclePlan);

  // store the emission data back in localStorage
  localStorage.setItem("emissionData", JSON.stringify(emissionData));
};

$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  renderFlightFormElements();

  // add event listener for select change
  $("#analyse-select").on("change", handleAnalyseSelect);

  // add event listener for form submission
  $("#analyse-form").on("submit", handleFormSubmit);
});

$("main").on("click", ".delete-card", function (event) {
  $("#carbon-card-container").empty();
});
