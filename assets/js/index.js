// when you want to style this, copy and paste it into the html file for easiness
// once done, add the newly styled component back here
const vehicleContainer = `
<div id="vehicle-selection-container">
<div>
    <p>Distance</p>
      <input
        class="input is-normal"
        type="text"
        placeholder="Normal input"
      />
    <p>kilometers</p>
  </div>
</div>
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
      `https://www.carboninterface.com/api/v1/vehicle_make/${vehicleMakeId}/vehicle_models/`,
      {
        headers: {
          Authorization: "Bearer OYudcQZQdsg9HqyGFQ",
        },
      }
    );

    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const onSubmit = async (event) => {
  event.preventDefault();
  const analyseSelected = $("#analyse-select").val();
  if (analyseSelected === "vehicles") {
    const vehicleMakesList = await getVehicleMakes();
    const vehicleMakeOptions = vehicleMakesList.map((vehicleMake) => {
      return `<option class="vehicle-option" value=${vehicleMake.data.id} selected>${vehicleMake.data.attributes.name}</option>`;
    });

    const vehicleMakeDropdown = `
    <div class="select">
      <p>Vehicle Make</p>
      <select id="vehicle-make-select" class="vehicle-make-class">
        ${vehicleMakeOptions}
      </select>
    </div>
    `;
    $("#analyse-form").append(vehicleContainer);
    $("#vehicle-selection-container").append(vehicleMakeDropdown);

    // target the id in the dropdown list
    $(".vehicle-make-class").on("click", (event) => {
      $(event.target).on("click", async (event) => {
        // THE LOWER REQUEST does not work, brings back 404

        // const vehicleModelList = await getVehicleModel(event.target.value);
        // console.log(vehicleModelList);
        console.log(event.target.value);

        // map through the response and create a list item/option for each item (same as the make list)
      });
    });

    console.log(vehicleMakesList);
  } else if (analyseSelected === "flights") {
    // get list of airport
  }
  // render card with response
};

$("#analyse-form").on("submit", onSubmit);
