$(document).ready(function () {
  let bookingUserId = 0;
  if (localStorage.getItem('userType') === 'user') {
    bookingUserId = JSON.parse(localStorage.getItem('regularUserId'));
  } else {
    bookingUserId = JSON.parse(localStorage.getItem('freelancerUserId'));
  }
  if (localStorage.getItem('userType') === 'freelance') {
    $("#signInUser").attr({ "href": "profile.html?type=freelance", "id": "myProfile" }).text("Profile");
    $("#joinUser").attr({ "href": "signout.html", "id": "signOut" }).text("Sign Out");
  }
  if ((localStorage.getItem('userType') === 'user')) {
    $("#signInUser").hide();
    $("#joinUser").text('Sign Out').attr({ "href": "./index.html", "id": "signOut" });
  }
  const createdAt = moment(new Date()).format('MMMM Do YYYY');
  const Authorization = localStorage.getItem('Authorization');
  let url = window.location.href;
  let params = url.split('?')[1].split('=');
  let id = parseInt(params[1], 10);
  $.ajax({
    url: 'https://freelance-decagon.herokuapp.com/freelancers/' + id,
    type: 'GET',
    dataType: 'json',
    success: function (data, textStatus, xhr) {
      const { userId, jobTitle, jobDescription, amountCharge, fullName, email, id } = data;
      let profilePicture = data.profilePicture || 'https://res.cloudinary.com/okafor-chidimma/image/upload/v1574962742/pttjstbba5yli2e0uaqe.webp';
      freeLanceDiv(profilePicture, fullName, email, jobTitle, jobDescription, amountCharge, userId, id, bookingUserId, createdAt, Authorization);
    },
    error: function (xhr, textStatus, errorThrown) {
      window.location.href = 'index.html';
    }
  });
});
const freeLanceDiv = (imageUrl, name, email, jobTitle, jobDescription, amountCharge, userId, freelanceId, bookerId, createdAt, Authorization) => {
  let divFirst = $("<div></div>").addClass("grid-container two-grid-column p100rl");
  let divSecond = $("<div></div>").addClass("profile-div");
  let img = $("<img/>").attr({ "src": imageUrl, "alt": "Profile Picture Freelance" }).addClass("img-profile");
  let divThird = $("<div></div>");
  let h4First = $("<h4></h4>").text("Name: ");
  let span1 = $("<span></span>").text(name);
  let h4Second = $("<h4></h4>").text("Email: ");
  let span2 = $("<span></span>").text(email);
  let h4Third = $("<h4></h4>").text("Job Title: ");
  let span3 = $("<span></span>").text(jobTitle);
  let h4Fourth = $("<h4></h4>").text("Job Description: ");
  let span4 = $("<span></span>").text(jobDescription);
  let h4Five = $("<h4></h4>").text("Amount For A Gig: ");
  let span5 = $("<span></span>").text(amountCharge);
  let divFourth = $("<div></div>");
  let para2 = $("<p></p>").addClass("flex-end m30");
  let button1 = $("<button></button>").addClass("button-property create-button-width").text("Book Now");
  button1.click(function () {
    bookFreelancer(userId, freelanceId, bookerId, createdAt, Authorization);
  });
  let infoDiv = $("<div></div>").addClass("full-width");
  let infoPara = $('<p class="text-center font-bold error-index-para" id="error-profile-para">Testing success message</p>');
  infoDiv.append(infoPara);
  para2.append(button1);
  divFourth.append(para2);
  divThird.append(h4First, span1, h4Second, span2, h4Third, span3, h4Fourth, span4, h4Five, span5);
  divSecond.append(img);
  divFirst.append(divSecond, divThird);
  $("#sign-in").append(divFirst, divFourth, infoDiv);
};
const bookFreelancer = (userId, freelanceId, bookerId, createdAt, Authorization) => {
  if (Authorization !== null) {
    if (Number(userId) === Number(bookerId)) {
      $("#error-profile-para").removeClass("booking-status").text("Error: You CANNOT Book Yourself For A Gig").show();
      return false;
    } else {
      const bookingDetails = {
        userId, freelanceId, bookerId, createdAt
      }
      $.ajax({
        url: 'https://freelance-decagon.herokuapp.com/bookings',
        headers: {
          'Authorization': 'Bearer ' + Authorization,
        },
        type: 'POST',
        dataType: 'json',
        data: bookingDetails,
        success: function (data, textStatus, xhr) {
          $("#error-profile-para").addClass("booking-status").text("Success: Your Booking Was Successful").show();
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 5000);
        },
        error: function (xhr, textStatus, errorThrown) {
          $("#error-profile-para").removeClass("booking-status").text("Error: Your Booking Was Not Successful, Try Logging In Again").show();
        }
      });
    }
  } else {
    $("#error-profile-para").removeClass("booking-status").text("Error: Must Be Logged In To Book").show();
  }
};