$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});

const analyseDropdown = $("#analyse-dropdown");

const toggleDropdown = function (event) {
  event.preventDefault();

  // check if opened
  if (analyseDropdown.hasClass("is-active")) {
    // remove is-active class
    analyseDropdown.removeClass("is-active");
  } else {
    // set class name to is-active
    analyseDropdown.addClass("is-active");
  }
};

const getAnalyseSelection = function (event) {
  // figure out which element triggered the event
  const target = $(event.target);

  // get the id and text of the target
  const id = target.attr("id");
  const text = target.text();

  // set the button text to reflect the selected value
  $("#selected-analyse").text(text);
};

const onSubmit = function (event) {
  event.preventDefault();
  console.log("submit");
  const analyseSelected = $("#analyse-select").val();
  console.log(analyseSelected);
  // get the value of the selected type
  // get the value of the selected type
  // get the value of the selected type
  // get the value of the selected type
  // make API request
  // get response
  // render card with response
};

// add event listener for dropdown button
analyseDropdown.on("click", toggleDropdown);

// add event listener for selecting the dropdown value
$("#analyse-content").on("click", getAnalyseSelection);

$("#analyse-form").on("submit", onSubmit);
