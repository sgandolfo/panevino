//Declare all global variables
const element = document.querySelector('.date');
const numVisitors = $("#visitors");
const warningMsg = $(".warning-message");
const btnReservations = $("#btn-reservation");
const btnBack = $(".btn-back");
const today = new Date();
let selectedDate = "";

console.log(today);

//initialize emailJS
emailjs.init("user_Q3BWUAeFZsN5oE01gkJxb");

// Initialize all input of date type.
const options = {
	lang: "nl",
	showHeader: false,
	weekStart: 1,
	minuteSteps: 1,
	disabledWeekDays: [0],
	validateLabel: "OK",
	startDate: today,
	minDate: today
};

const calendars = bulmaCalendar.attach('[type="DateTime"]', options);

if (element) {
	//Stores the selected date in a global variable called "selectedDate" 
	element.bulmaCalendar.on('select', datepicker => selectedDate = datepicker.data.value());
	//Validated whether the selected reservation date is >24h later than today's date. If not a warningmessage is displayed
	element.bulmaCalendar.on('hide', () => reservationAllowed(selectedDate));
}

//Validate email address format and show helper to tell use the email address that was submitted is invalid
$("#user_email").on("change", function(){
	if (!valid($(this).val())) {
		$(".bad-email").removeClass("visible")
		$(".bad-email-warning").removeClass("visible")
	} else {
		$(".bad-email").addClass("visible")
		$(".bad-email-warning").addClass("visible")
	}
})

//Add text message to ask visitors to specify the exact number of people of 9+ is selected in the dropdown

numVisitors.change(() => (event.target.value === "9+") ? warningMsg.removeClass("visible") : warningMsg.addClass("visible"));

//Link the reservation form to EmailJS to send mail from the reservation form

btnReservations.click(() => {

	const reservatieData = {
		user_name: $("#user_name").val(),
		user_email: $("#user_email").val(),
		number_persons: $("#visitors").val(),
		reservation_data: selectedDate,
		text: $("#text").val()
	};

	emailjs.send("default_service", "reservaties_nl", reservatieData)
	.then(function(response){
		$("#reservations").addClass("visible");
		$(".reservation-success").removeClass("visible");
	})
	.catch(function(err){
		console.log(err);
	});

	btnReservations.addClass("is-loading");

});

//Show success page to user when form has been submitted
btnBack.click(() => {
	resetForm();
});

document.addEventListener('DOMContentLoaded', () => {

	// Get all "navbar-burger" elements
	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {
  
	  // Add a click event on each of them
	  $navbarBurgers.forEach( el => {
		el.addEventListener('click', (e) => {

			//prevent page from reloading when navbar burger is being clicked
			e.preventDefault();

			//Ensure that text color changes to default gray when burger is being clicked to open and reverts back when burger is being closed
			document.querySelectorAll("a.navbar-item,a.has-text-white,a.navbar-link").forEach(function(navbarItem){
				if(navbarItem.classList.contains("has-text-white")){
					navbarItem.classList.remove("has-text-white");
				} else if(!navbarItem.classList.contains("has-text-white") && !navbarItem.classList.contains("burger-color-keep")) {
					navbarItem.classList.add("has-text-white");
				}
			});

		  // Get the target from the "data-target" attribute
		  const target = el.dataset.target;
		  const $target = document.getElementById(target);
  
		  // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
		  el.classList.toggle('is-active');
		  $target.classList.toggle('is-active');
  
		});
	  });
	}
});

//helper function to get the tabs functionality working and show different content based on user selection
function openTab(evt, tabName) {
	var i, x, tablinks;
	x = document.getElementsByClassName("content-tab");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tab");
	for (i = 0; i < x.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" is-active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " is-active";
}

//helper function to validate mail address format
const valid = mail => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
		return true;
	} else {
		return false;
	}
}

const resetForm = () => {
	$("#reservations").removeClass("visible");
	$(".reservation-success").addClass("visible");
	btnReservations.removeClass("is-loading");
	location.reload();
}

const reservationAllowed = (date) => {
	const reservationDateWarningMessage = $(".reservation-warning-message");

	const todayStr = today.getDate().toString().padStart(2,"0") + "/" + (today.getMonth() + 1).toString().padStart(2,"0") + "/" + today.getFullYear();
	const reservationDateStr = date.slice(0,10);
	console.log(`Today's date is ${todayStr} and the reservartion day is ${reservationDateStr}`);

	if (todayStr === reservationDateStr) {
		reservationDateWarningMessage.removeClass("visible")
	} else {
		reservationDateWarningMessage.addClass("visible")
	}
}
