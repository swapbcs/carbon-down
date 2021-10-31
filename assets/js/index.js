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

var sortVehicles = function (a, b) {
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
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
    },
    body: JSON.stringify(data),
  });
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
$("#analyse-select").change(onEmissionCategoryChange);

// When the submit button is clicked
$("#analyse-form").on("submit", calculateCarbonEmission);

$("#flight-from-to-container").css("display", "block");
$("#vehicle-selection-container").css("display", "none");


// Flight processing

const processFlightEmission = async function () {
  const from = $("#flight-from-input").val();
  const to = $("#flight-to-input").val();
  const passengers = $("#flight-passenger-dropdown").val();
  const flightData = {
    "type": "flight",
    "passengers": passengers,
    "legs": [
        {
            "departure_airport": from,
            "destination_airport": to
        }
    ]
}
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

