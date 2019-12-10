$(document).ready(function () {
  let path_url = window.location.origin;
  if ((localStorage.getItem('userType') === 'user')) {
    $("#signInUser").hide();
    $("#joinUser").text('Sign Out').attr({ "href": "signout.html", "id": "signOut" });
  }

  if (localStorage.getItem('userType') === 'freelance') {
    $("#signInUser").attr({ "href": "profile.html?type=freelance", "id": "myProfile" }).text("Profile");
    $("#joinUser").attr({ "href": "signout.html", "id": "signOut" }).text("Sign Out");
  }
  $.ajax({
    url: 'http://localhost:3000/freelancers',
    type: 'GET',
    dataType: 'json',
    success: function (data, textStatus, xhr) {
      createFreelancer(data);
    },
    error: function (xhr, textStatus, errorThrown) {
    }
  });
})
const createFreelancer = (arrFreelancers) => {
  const parentDiv = $(".four-grid-column");
  arrFreelancers.forEach((freelancer) => {
    const { id } = freelancer
    let profilePicture = freelancer.profilePicture || 'https://res.cloudinary.com/okafor-chidimma/image/upload/v1574962742/pttjstbba5yli2e0uaqe.webp';
    let jobTitle = freelancer.jobTitle || 'No Occupation';
    let newDiv = createFreelancerDiv(profilePicture, jobTitle, id);
    parentDiv.append(newDiv);
  });
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
