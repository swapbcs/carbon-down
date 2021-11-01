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
        Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
      },
    }
  );

  // construct option elements

  const vehicleMakeOptions = data.sort(sortVehicles).map((vehicleMake) => {
    return `<option class="vehicle-option" value=${vehicleMake.data.id} selected>${vehicleMake.data.attributes.name}</option>`;
  });

  // return options
  return vehicleMakeOptions;
};

const getVehicleModelOptions = function (data) {
  const vehicleModelOptions = data.map((vehicleModel) => {
    return `<option class="vehicle-option" value=${vehicleModel.data.id} selected>${vehicleModel.data.attributes.name} ${vehicleModel.data.attributes.year}</option>`;
  });

  return vehicleModelOptions;
};

// function to sort iatas alphabetically
const sortIatas = function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
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
        `<option class="vehicle-option" value=${airportIataObj.iata} selected>${airportIataObj.name} (${airportIataObj.iata})</option>`
    );

  return iataOptions;
};

// function to render from airport
const renderFromDropdown = function (options) {
  return `<div class="column is-one-third">
    <p class="is-size-4 pb-4 has-text-centered">From</p>
    <div class="select is-info is-hovered">
      <select id="flight-from-dropdown">${options}</select>
    </div>
  </div>`;
};

// function to render to airport
const renderToDropdown = function (options) {
  return `<div class="column is-one-third">
    <p class="is-size-4 pb-4 has-text-centered">To</p>
    <div class="select is-info is-hovered">
      <select id="flight-to-dropdown">${options}</select>
    </div>
  </div>`;
};

const renderPassengers = function () {
  return `<div class="column is-one-third">
    <p class="is-size-4 pb-4 pl-6">Passengers</p>
    <div class="select is-info pl-6">
      <select
        id="flight-passenger-dropdown"
        class="select is-medium pl-6 is-hovered"
      >
        <option value="1" selected>1</option>
        <option value="2" selected>2</option>
        <option value="3" selected>3</option>
        <option value="4" selected>4</option>
        <option value="5" selected>5</option>
        <option value="6" selected>6</option>
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
  return `<div class="column">
    <div class="select is-info is-hovered">
      <select id="vehicle-make">${options}</select>
    </div>
  </div>`;
};

const renderVehicleModel = function (options) {
  return `<div class="column" id="vehicle-models-dropdown">
    <div class="select is-info is-hovered">
      <select id="vehicle-model">${options}</select>
    </div>
  </div>`;
};

const renderDistance = function () {
  return `<div class="column">
    <div class="is-info is-hovered">
      <input
        class="input"
        type="number"
        id="vehicle-distance"
        placeholder="Distance (km)"
      />
    </div>
  </div>`;
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
  const card = `<div class="card">
    <div class="card-content">
      <div class="content">
        <div class="is-size-3">${data.data.attributes.vehicle_make} - ${data.data.attributes.vehicle_model} (${data.data.attributes.vehicle_year})</div>
        <hr />
        <div class="is-size-4 my-2">Carbon Emissions</div>
        <div class="my-4">
          <div class="is-size-5 p-2">${data.data.attributes.carbon_g} grams</div>
          <div class="is-size-5 p-2">${data.data.attributes.carbon_lb} pounds</div>
          <div class="is-size-5 p-2">${data.data.attributes.carbon_kg} kilograms</div>
          <div class="is-size-5 p-2">${data.data.attributes.carbon_mt} metric tonnes</div>
        </div>
      </div>
      <div>
        <button
          class="button is-success is-medium is-rounded card-footer-item"
          id="save-to-plan-btn"
        >
          Save To Plan
        </button>
      </div>
    </div>
  </div>`;

  // empty parent
  $("#carbon-card-container").empty();

  // append to parent
  $("#carbon-card-container").append(card);
};

const renderFlightCarbonCard = function (data) {
  // construct card
  const card = `<div class="card">
    <div class="card-content">
      <div class="content">
        <div class="is-size-3">${data.data.attributes.legs[0].departure_airport} -> ${data.data.attributes.legs[0].destination_airport}</div>
        <div class="is-size-5">
          <i class="fas fa-users"></i>
          <span class="ml-3">${data.data.attributes.passengers} passengers</span>
        </div>
        <hr />
        <div class="is-size-4 my-2">Carbon Emissions</div>
        <div class="my-4">
          <div class="is-size-5 p-2">${data.data.attributes.carbon_g} grams</div>
          <div class="is-size-5 p-2">${data.data.attributes.carbon_lb} pounds</div>
          <div class="is-size-5 p-2">${data.data.attributes.carbon_kg} kilograms</div>
          <div class="is-size-5 p-2">${data.data.attributes.carbon_mt} metric tonnes</div>
        </div>
      </div>
      <div>
        <button
          class="button is-success is-medium is-rounded card-footer-item"
          id="save-to-plan-btn"
        >
          Save To Plan
        </button>
      </div>
    </div>
  </div>`;

  // empty parent
  $("#carbon-card-container").empty();

  // append to parent
  $("#carbon-card-container").append(card);
};

const handleVehicleMakeChange = async function () {
  // get vehicle make id from selection
  const vehicleMakeId = $("#vehicle-make").val();

  // get data for vehicle id
  const vehicleModels = await getDataFromApi(
    `https://www.carboninterface.com/api/v1/vehicle_makes/${vehicleMakeId}/vehicle_models/`,
    {
      headers: {
        Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
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
    renderFlightFormElements();
  }

  // if user selects vehicles render the vehicle form elements
  if (userSelection === "vehicles") {
    // remove previous form elements
    $("#dynamic-form-content").empty();
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
          Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
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
          Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
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
