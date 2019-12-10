$(document).ready(function () {
  if ((document.referrer.indexOf('profile.html?type=freelance') > -1)) {
    let url = window.location.href;
    let params = url.split('?')[1].split('=');
    let id = parseInt(params[1], 10);
    const userId = JSON.parse(localStorage.getItem('freelancerUserId'));
    const myBookers = JSON.parse(localStorage.getItem('myBookers'));
    const Authorization = localStorage.getItem('Authorization');
    $.ajax({
      url: 'https://freelance-decagon.herokuapp.com/bookings/' + id,
      headers: {
        'Authorization': 'Bearer ' + Authorization,
      },
      type: 'GET',
      dataType: 'json',
      success: function (data, textStatus, xhr) {
        const { id } = data;
        let profilePicture = data.profilePicture || 'https://res.cloudinary.com/okafor-chidimma/image/upload/v1574962742/pttjstbba5yli2e0uaqe.webp';
        findBookerDetails(myBookers, id, profilePicture)
      },
      error: function (xhr, textStatus, errorThrown) {
        localStorage.clear();
        localStorage.setItem('errorProfileFreelance', 'Error: Internal Server, Try Again')
        window.location.href = 'index.html';
      }
    });

  } else {
    localStorage.clear();
    localStorage.setItem('errorProfileFreelance', 'Unauthorized: Try again Later')
    window.location.href = 'index.html';
  }
})

const bookerDiv = (imageUrl, { fullName, email, createdAt }) => {
  let divFirst = $("<div></div>").addClass("grid-container two-grid-column p100rl");
  let divSecond = $("<div></div>").addClass("profile-div");
  let img = $("<img/>").attr({ "src": imageUrl, "alt": "Profile Picture Freelance" }).addClass("img-profile");
  let divThird = $("<div></div>");
  let h4First = $("<h4></h4>").text("Name: ");
  let span1 = $("<span></span>").text(fullName);
  let h4Second = $("<h4></h4>").text("Email: ");
  let span2 = $("<span></span>").text(email);
  let h4Third = $("<h4></h4>").text("Day Of Booking: ");
  let span3 = $("<span></span>").text(createdAt);
  divThird.append(h4First, span1, h4Second, span2, h4Third, span3);
  divSecond.append(img);
  divFirst.append(divSecond, divThird);
  $("#sign-in").append(divFirst);
};

const findBookerDetails = (arrBookers, bookerId, profilePicture = '') => {
  let mainBookerDet;
  if (arrBookers.length > 0) {
    const bookerDetArr = arrBookers.filter((bookerObj) => bookerObj.id === bookerId);
    const [bookerDetObj] = bookerDetArr;
    const { fullName, email, createdAt } = bookerDetObj
    mainBookerDet = {
      fullName,
      email,
      createdAt
    }
  }
  bookerDiv(profilePicture, mainBookerDet);
};