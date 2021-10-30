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
    const response = await fetch(`https://www.carboninterface.com/api/v1/vehicle_make/${vehicleMakeId}/vehicle_models`,

    )
    return response
  } catch (error) {}
}

const onSubmit = async (event) => {
  event.preventDefault();
  const analyseSelected = $("#analyse-select").val();
  if (analyseSelected === "vehicles") {
    const vehicleMakesList = await getVehicleMakes();
    const vehicleMakeOptions = vehicleMakesList.map((vehicleMake) => {
      return `<option class="make-option" value=${vehicleMake.data.id} selected>${vehicleMake.data.attributes.name}</option>`;
    });

    const vehicleMakeDropdown = `
    <div class="select">
      <p>Vehicle Make</p>
      <select id="vehicle-make-select">
        ${vehicleMakeOptions}
      </select>
    </div>
    `;
    $("#analyse-form").append(vehicleContainer);
    $("#vehicle-selection-container").append(vehicleMakeDropdown);
    $(".make-option").on("click", (event)=> {console.log($(this).value())})

    console.log(vehicleMakesList);
  } else if (analyseSelected === "flights") {
    // get list of airport
  }
  // render card with response
};

$("#analyse-form").on("submit", onSubmit);
