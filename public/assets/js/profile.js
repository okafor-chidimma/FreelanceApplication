$(document).ready(function () {
  const userId = JSON.parse(localStorage.getItem('freelancerUserId'));
  const hasProfile = JSON.parse(localStorage.getItem('hasProfileStatus'));
  const fullName = localStorage.getItem('freelancerName');
  const email = localStorage.getItem('freelancerEmail');
  const createdAt = localStorage.getItem('freelancerJoined');
  const Authorization = localStorage.getItem('Authorization');
  const userType = localStorage.getItem('userType');


  if ((window.location.href.indexOf('?type=freelance') > -1) && (userId) && hasProfile !== null) {
    $("#myProfile").attr({ "href": "profile.html?type=freelance" });
    let path_url = window.location.origin;
    let imageUrl = "https://res.cloudinary.com/okafor-chidimma/image/upload/v1574962742/pttjstbba5yli2e0uaqe.webp";
    let jobTitle = "No Title Yet";
    let jobDescription = "None yet";
    let amountCharge = "#0";
    if (!hasProfile) {
      createProfileDiv(imageUrl, fullName, email, jobTitle, jobDescription, amountCharge, createdAt, hasProfile);
      createBookers([]);
    } else {
      $.ajax({
        url: 'http://localhost:3000/freelancers?userId=' + parseInt(userId, 10),
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
          imageUrl = data[0].profilePicture || imageUrl;
          jobDescription = data[0].jobDescription;
          jobTitle = data[0].jobTitle;
          amountCharge = data[0].amountCharge;
          let freelanceId = Number(data[0].id);
          localStorage.setItem('freelanceId', freelanceId);
          createProfileDiv(imageUrl, fullName, email, jobTitle, jobDescription, amountCharge, createdAt, hasProfile, freelanceId, Authorization, userId, userType);
          $.ajax({
            url: 'http://localhost:3000/users/' + parseInt(userId, 10) + '/bookings',
            headers: {
              'Authorization': 'Bearer ' + Authorization,
            },
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
              localStorage.setItem('myBookers', JSON.stringify(data));
              imageUrl = "https://res.cloudinary.com/okafor-chidimma/image/upload/v1574962742/pttjstbba5yli2e0uaqe.webp";
              createBookers(data, imageUrl);
            },
            error: function (xhr, textStatus, errorThrown) {
              createBookers([], '', 'error');
            }
          });

        },
        error: function (xhr, textStatus, errorThrown) {
          localStorage.clear();
          localStorage.setItem('errorProfileFreelanceLogIn', 'Error Getting Profile: Log In Again')
          window.location.href = 'index.html';
        }
      });

    }
  } else {
    localStorage.clear();
    localStorage.setItem('errorProfileFreelance', 'Unauthorized: Try Logging In')
    window.location.href = 'index.html';


  }
})
const createProfileDiv = (imageUrl, name, email, jobTitle, jobDescription, amountCharge, createdAt, hasProfileStatus, freelanceId, Authorization, userId, userType) => {
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
  let h4Six = $("<h4></h4>").text("You Joined On: ");
  let span6 = $("<span></span>").text(createdAt);
  let divFourth = $("<div></div>");
  let para1 = $("<p></p>").addClass("flex-end m30");
  let button1 = $("<button></button>").addClass("button-property create-button-width").text("Create Profile");
  let divFifth = $("<div></div>").addClass("flex-end m30");
  let divSix = $("<div></div>").addClass("profile-div__width");
  let button2 = $("<button></button>").addClass("button-property mr30 profile-button__width").text("Edit Profile");
  let divSeven = $("<div></div>").addClass("profile-div__width");
  let button3 = $("<button></button>").addClass("button-property profile-button__width").text("Delete Profile");
  let infoPara = $('<p class="m0 text-center font-bold error-index-para" id="profile-status"></p>');
  let infoDiv = $("<div></div>").addClass("full-width");
  button1.click(function () {
    window.location.href = 'create-profile.html';
  });
  button2.click(function () {
    window.location.href = 'edit-profile.html';
  });
  button3.click(function () {
    deleteProfile(freelanceId, Authorization, userId, userType);
  });
  infoDiv.append(infoPara);
  divSeven.append(button3);
  divSix.append(button2);
  divFifth.append(divSix, divSeven);
  para1.append(button1);
  divFourth.append(para1);
  divThird.append(h4First, span1, h4Second, span2, h4Third, span3, h4Fourth, span4, h4Five, span5, h4Six, span6);
  divSecond.append(img);
  divFirst.append(divSecond, divThird);
  
  let divToShow = hasProfileStatus ? divFifth : divFourth
  $("#sign-in").append(divFirst, divToShow, infoDiv);
};

const createBookers = (arrBookers, profilePicture, error = '') => {
  const parentDiv = $(".four-grid-column");
  if (arrBookers.length > 0) {
    arrBookers.forEach((booker) => {
      const { id, fullName } = booker
      let newDiv = createBookerDiv(profilePicture, fullName, id);
      parentDiv.append(newDiv);
    });
  } else if (error !== '') {
    $("#booker_header").hide();
    parentDiv.before('<p class ="text-center font-bold error-booker-para">Error: Session Expired, Try Logging In Again</p>').show();
  }
  else {
    $("#booker_header").hide();
    parentDiv.before('<p class ="text-center font-bold error-booker-para">You Have No Bookers Yet</p>').show();
  }

};
const createBookerDiv = (imageUrl, name, bookerId) => {
  let divFirst = $("<div></div>").addClass("img-writeup");
  let divImage = $("<div></div>").addClass("img").css("background-image", "url(" + imageUrl + ")");
  let divThird = $("<div></div>");
  let divFourth = $("<div></div>").addClass("img-buttons space-between");
  let para1 = $("<p></p>").addClass("img-occupation").text("" + name);
  let para2 = $("<p></p>").addClass("m0");
  let button1 = $("<button></button>").addClass("button-property no-radius occupation-button").text("Expand");

  button1.click(function () {
    window.location.href = 'single-booker.html?id=' + encodeURIComponent(bookerId);
  });
  para2.append(button1);
  divFourth.append(para1, para2);
  divThird.append(divFourth);
  divFirst.prepend(divImage).append(divThird);
  return divFirst;
};

const deleteProfile = (freelanceId, Authorization, userId, userType) => {
  $.ajax({
    url: 'http://localhost:3000/freelancers/' + freelanceId,
    headers: {
      'Authorization': 'Bearer ' + Authorization,
    },
    type: 'DELETE',
    dataType: 'json',
    success: function (data, textStatus, xhr) {
      $.ajax({
        url: 'http://localhost:3000/users/' + userId,
        headers: {
          'Authorization': 'Bearer ' + Authorization,
        },
        type: 'PATCH',
        dataType: 'json',
        data: { hasProfile: false },
        success: function (data, textStatus, xhr) {
          localStorage.setItem('hasProfileStatus', 'false');
          $("#profile-status").css({ "background": "green" }).text('Profile Successfully Deleted').show();
          setTimeout(() => {
            window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
          }, 5000);
        },
        error: function (xhr, textStatus, errorThrown) {
          $("#profile-status").css({"background":"red"}).text('Error Deleting Profile').show();
          setTimeout(() => {
            window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
          }, 5000);
         ;
        }
      });

    },
    error: function (xhr, textStatus, errorThrown) {
      $("#profile-status").css({ "background": "red" }).text('Error: You Can ONLY Delete Your Profile').show();
      setTimeout(() => {
        window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
      }, 5000);
    }
  });
};