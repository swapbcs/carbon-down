// when you want to style this, copy and paste it into the html file for easiness
// once done, add the newly styled component back here
const vehicleContainer = `
<div id="vehicle-selection-container">
  <div class="columns">
    <p class="column is-flex-grow-0">Distance</p>
      <input
        class="input is-normal column"
        type="text"
        id = "distance-input"
        placeholder="Normal input"
      />
    <p class="column is-flex-grow-0">kilometers</p>
  </div>
</div>
`;

const vehicleModelContainer = `
<div id="vehicle-model-selection-container">
`;

$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  renderFlightFormElements();
  // renderVehicleFormElements();
});

const getVehicleMakes = async () => {
  try {
    const response = await fetch(
      "https://www.carboninterface.com/api/v1/vehicle_makes",
      {
        headers: {
          Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {}
};

const getVehicleModel = async (vehicleMakeId) => {
  try {
    const response = await fetch(
      `https://www.carboninterface.com/api/v1/vehicle_makes/${vehicleMakeId}/vehicle_models/`,
      {
        headers: {
          Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
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

const onEmissionCategoryChange = async (event) => {
  event.preventDefault();
  // Clean-up the previous emissioin values
  $("#emission-output").text("");
  const analyseSelected = $("#analyse-select").val();
  if (analyseSelected === "vehicles") {
    $("#vehicle-selection-container").css("display", "block");
    $("#flight-from-to-container").css("display", "none");
    const vehicleMakesList = await getVehicleMakes();
    const vehicleMakeOptions = vehicleMakesList
      .sort(sortVehicles)
      .map((vehicleMake) => {
        return `<option class="vehicle-option" value=${vehicleMake.data.id} selected>${vehicleMake.data.attributes.name}</option>`;
      });

    const vehicleMakeDropdown = `
    <div class="select my-5">
      <p>Vehicle Make</p>
      <select id="vehicle-make-select" class="vehicle-make-class">
        ${vehicleMakeOptions}
      </select>
    </div>
    `;
    //Remove the existing vechicle selection container
    $("#vehicle-selection-container").remove();
    $("#vehicle-model-selection-container").remove();
    $("#analyse-form").append(vehicleContainer);
    $("#vehicle-selection-container").append(vehicleMakeDropdown);

    // target the id in the dropdown list
    $("#vehicle-make-select").change(async (event) => {
      event.preventDefault();
      var selectedVehicle = event.target.value;
      const vehicleModelList = await getVehicleModel(selectedVehicle);
      // map through the response and create a list item/option for each item (same as the make list)
      const vehicleModelOptions = vehicleModelList
        // .sort(sortVehicles)
        .map((vehicleModel) => {
          return `<option class="vehicle-option" value=${vehicleModel.data.id} selected>${vehicleModel.data.attributes.name} ${vehicleModel.data.attributes.year}</option>`;
        });

      const vehicleModelDropdown = `
      <div class="select">
      <p>Vehicle Models</p>
      <select id="vehicle-model-select" class="vehicle-make-class">
        ${vehicleModelOptions}
      </select>
    </div>
    <div class="columns is-centered">
      <div class="column is-flex-grow-0">
        <button
          class="
            button
            is-centered is-danger
            has-text-light
            is-medium is-rounded
          "
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
      `;
      $("#vehicle-model-selection-container").remove();
      $("#analyse-form").append(vehicleModelContainer);
      $("#vehicle-model-selection-container").append(vehicleModelDropdown);
    });

    // console.log(vehicleMakesList);
  } else if (analyseSelected === "flights") {
    // get list of airport
    $("#vehicle-selection-container").css("display", "none");
    $("#vehicle-model-selection-container").css("display", "none");
    $("#flight-from-to-container").css("display", "block");
  }
  // render card with response
};

// Following code is taken from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
async function getEmissionData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch();
  return response.json(); // parses JSON response into native JavaScript objects
}

const calculateCarbonEmission = async function (event) {
  event.preventDefault();
  // calculate carbon emission based on the input
  const distance = $("#distance-input").val();
  if (distance == "") {
    // If distance value is not given, use 0.
    // TODO: show error message when user does thats
    distance = 0;
  }
  const carModel = $("#vehicle-model-select").val();

  // Call carbon API to get the carbon emission
  const vehicleData = {
    type: "vehicle",
    distance_unit: "km",
    distance_value: distance,
    vehicle_model_id: carModel,
  };
  await getEmissionEstimate(vehicleData);
};

// When vehicle/flight dropdown is changed
// $("#analyse-select").change(onEmissionCategoryChange);

// When the submit button is clicked
// $("#analyse-form").on("submit", calculateCarbonEmission);

$("#flight-from-to-container").css("display", "block");
$("#vehicle-selection-container").css("display", "none");

// ---------------------------------
// Flight processing
// ---------------------------------

// const airportOptionList = iatas
//   .filter((iata) => iata.name != null)
//   .sort(sortIatas)
//   .map(
//     (airportIataObj) =>
//       `<option class="vehicle-option" value=${airportIataObj.iata} selected>${airportIataObj.name} (${airportIataObj.iata})</option>`
//   );
$("#flight-from-dropdown").empty(); // Remove the existing options
// $("#flight-from-dropdown").append(airportOptionList);
$("#flight-to-dropdown").empty(); // Remove the existing options
// $("#flight-to-dropdown").append(airportOptionList);

const processFlightEmission = async function () {
  const from = $("#flight-from-dropdown").val();
  const to = $("#flight-to-dropdown").val();
  const passengers = $("#flight-passenger-dropdown").val();
  const flightData = {
    type: "flight",
    passengers: passengers,
    legs: [
      {
        departure_airport: from,
        destination_airport: to,
      },
    ],
  };
  await getEmissionEstimate(flightData);
};

$("#flight-submit-btn").click(processFlightEmission);

async function getEmissionEstimate(vehicleData) {
  var emissionResponse = await getEmissionData(
    "https://www.carboninterface.com/api/v1/estimates",
    vehicleData
  );

  // Output the the emission data on screen
  $("#emission-output").text(
    `You caused emission of: ${emissionResponse.data.attributes.carbon_kg} kg of carbon`
  );
}

// Refactored Code

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
  return `<div class="column">
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

  // get vehicle model options
  const vehicleModelOptions = getVehicleModelOptions(vehicleModels);

  // render vehicle model
  const vehicleModelsDropDown = renderVehicleModel(vehicleModelOptions);

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
  }
};

// add event listener for select change
$("#analyse-select").on("change", handleAnalyseSelect);

// add event listener for form submission
$("#analyse-form").on("submit", handleFormSubmit);
