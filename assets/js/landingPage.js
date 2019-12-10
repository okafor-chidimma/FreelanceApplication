
$(document).ready(function () {
  if ((window.location.href.indexOf('?type=user')) > -1 || (localStorage.getItem('userType') === 'user')) {
    $("#signInUser").hide();
    $("#joinUser").text('Sign Out').attr({ "href": "signout.html", "id": "signOut" });
  }
  if (localStorage.getItem('userType') === 'freelance') {
    $("#signInUser").attr({ "href": "profile.html?type=freelance", "id": "myProfile" }).text("Profile");
    $("#joinUser").attr({ "href": "signout.html", "id": "signOut" }).text("Sign Out");
  }
  if ((document.referrer.indexOf('profile.html?type=freelance') > -1)) {
    let error = "";
    if (localStorage.getItem('errorProfileFreelance') !== '' && (localStorage.getItem('userId') === null)) {
      error = localStorage.getItem('errorProfileFreelance')
      $("#error-index-profile-para").text(error).show();
    }
    if (localStorage.getItem('errorProfileFreelanceLogIn') !== '' && (localStorage.getItem('userId') === null)) {
      error = localStorage.getItem('errorProfileFreelanceLogIn')
      $("#error-index-profile-para").text(error).show();
    }
  }
  $.ajax({
    url: 'https://freelance-decagon.herokuapp.com/freelancers',
    type: 'GET',
    dataType: 'json',
    success: function (data, textStatus, xhr) {
      createFreelancer(data);
    },
    error: function (xhr, textStatus, errorThrown) {
    }
  });
});

const createFreelancer = (arrFreelancers) => {
  if (arrFreelancers.length > 0) {
    const parentDiv = $(".four-grid-column");
    arrFreelancers.forEach((freelancer, index) => {
      if (index === 7) {
        let viewmore = createViewMoreDiv();
        parentDiv.append(viewmore);
      }
      if (index > 6) {
        return;
      }
      const { id } = freelancer
      let profilePicture = freelancer.profilePicture || 'https://res.cloudinary.com/okafor-chidimma/image/upload/v1574962742/pttjstbba5yli2e0uaqe.webp';
      let jobTitle = freelancer.jobTitle || 'No Occupation';
      let newDiv = createFreelancerDiv(profilePicture, jobTitle, id);
      parentDiv.append(newDiv);
    });
  }else{
    $("#allFreelancers,#allFreelanceSection").hide();
  }

};
const createFreelancerDiv = (imageUrl, occupation, freelanceId) => {
  let divFirst = $("<div></div>").addClass("img-writeup");
  let divImage = $("<div></div>").addClass("img").css("background-image", "url(" + imageUrl + ")");
  let divThird = $("<div></div>");
  let divFourth = $("<div></div>").addClass("img-buttons space-between");
  let para1 = $("<p></p>").addClass("img-occupation").text("" + occupation);
  let para2 = $("<p></p>").addClass("m0");
  let button1 = $("<button></button>").addClass("button-property no-radius occupation-button").text("Expand");

  button1.click(function () {
    window.location.href = 'single-freelance.html?id=' + encodeURIComponent(freelanceId);
  });
  para2.append(button1);
  divFourth.append(para1, para2);
  divThird.append(divFourth);
  divFirst.prepend(divImage).append(divThird);
  return divFirst;
};

const createViewMoreDiv = () => {
  let divFirst = $("<div></div>").addClass("img-writeup");
  let divParent = $("<div></div>").addClass("view-more-div-parent flex-center");

  let button1 = $("<button></button>").addClass("button-property").text("View More");
  button1.click(function () {
    window.location.href = 'freelancer.html';
  });
  divParent.append(button1);
  divFirst.append(divParent);
  return divFirst
};