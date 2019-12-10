
const validator = (jobTitle, jobDescription, amountCharge) => {
  let status = true;
  if (jobTitle === '') {
    $("#jobTitle-error-div").show();
    status = false
  }
  if (jobDescription === '') {
    $("#jobDescription-error-div").show();
    status = false;
  }
  if (amountCharge === '') {
    $("#amountCharge-error-div").show();
    status = false;
  }
  return status;
};

const displayImage = (fileArray) => {
  const fileObject = fileArray[0];
  if (fileObject && fileArray) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      let img = $("<img/>").attr({ "src": dataUrl, "alt": "Profile Picture Freelance" }).addClass("profile-picture-div-image");
      $("#profilePicture-error-div").empty().append(img).show();
    }
    reader.onerror = (event) => {
      let para = $('<p class ="input error-div">Error: Unsuccessful Upload</p>');
      $("#profilePicture-error-div").empty().append(para).show();
    };
    reader.readAsDataURL(fileObject);
  }
};
const displayFileName = (event) => {
  let spanValue = $("#file-span").text();
  let fileName = event.target.value.split('\\').pop();
  if (fileName)
    $('#file-span').text(fileName);
  else
    $('#file-span').text(spanValue);
};
const uploadToCloud = (fileArray) => {
  const fileObject = fileArray[0];
  const upload_preset = 'ixwjmrnq';
  const uri = 'https://api.cloudinary.com/v1_1/okafor-chidimma/image/upload'
  const xhr = new XMLHttpRequest()
  const fd = new FormData()
  fd.append('file', fileObject)
  fd.append('upload_preset', upload_preset)
  xhr.open('POST', uri, true);
  xhr.onload = function () {
    response = JSON.parse(this.responseText);
    if (this.status === 200 && this.statusText === 'OK') {
      const userId = JSON.parse(localStorage.getItem('freelancerUserId'));
      const Authorization = localStorage.getItem('Authorization');
      const userType = localStorage.getItem('userType');
      uploadToDb(Authorization, userType, userId);
    } else {
      $("#error-div").show();
    }
  };
  xhr.send(fd)
}
const ajaxSuccess = function () {
  response = JSON.parse(this.responseText);
  localStorage.setItem("myProfilePix", response["secure_url"]);
}
const fileUpload = (event) => {
  const fileArray = $("#fileInput")[0].files;
  displayImage(fileArray);
  displayFileName(event);
}
const uploadToDb = (Authorization, userType, userId) => {
  const jobTitle = $.trim($("#jobTitle").val()).toUpperCase();
  const jobDescription = $.trim($("#jobDescription").val());
  const amountCharge = $.trim($("#amountCharge").val());
  const profilePicture = localStorage.getItem("myProfilePix");
  const answer = validator(jobTitle, jobDescription, amountCharge);
  let profileDetails = {};
  if (answer) {
    profileDetails = {
      userId,
      profilePicture,
      jobTitle,
      jobDescription,
      amountCharge,
      createdAt: moment(new Date()).format('MMMM Do YYYY')
    };
  }
  $.ajax({
    url: 'https://freelance-decagon.herokuapp.com/freelancers',
    headers: {
      'Authorization': 'Bearer ' + Authorization,
    },
    type: 'POST',
    dataType: 'json',
    data: profileDetails,
    success: function (data, textStatus, xhr) {
      $.ajax({
        url: 'https://freelance-decagon.herokuapp.com/users/' + userId,
        headers: {
          'Authorization': 'Bearer ' + Authorization,
        },
        type: 'PATCH',
        dataType: 'json',
        data: { hasProfile: true },
        success: function (data, textStatus, xhr) {
          localStorage.setItem('hasProfileStatus', 'true');
          $("#jobTitle,#jobDescription,#amountCharge").val('');
          $("#file-span").text("Upload Profile Picture");
          $("#profilePicture-error-div").empty();
          $("#createProfileButton").val("Create Profile")
          $("#success-div").show();
          setTimeout(() => {
            window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
          }, 5000);
        },
        error: function (xhr, textStatus, errorThrown) {
          $("#error-div").show();
          setTimeout(() => {
            window.location.href = 'create-profile.html';
          }, 5000);
        }
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      $("#error-div").show();
    }
  });
};
const submitCreateDetails = (event) => {
  event.preventDefault();
  $("#createProfileButton").val("Creating Your Profile ...")
  const fileArray = $("#fileInput")[0].files;
  uploadToCloud(fileArray);
};
$(document).ready(function () {
  const Authorization = localStorage.getItem('Authorization');
  const userType = localStorage.getItem('userType');
  if ((document.referrer.indexOf('profile.html?type=freelance') > -1) && userType === 'freelance' && Authorization !== '') {
    $("#amountCharge,#jobTitle,#jobDescription").focus(function () {
      $("#amountCharge-error-div,#jobTitle-error-div,#jobDescription-error-div,#profilePicture-error-div").hide();
    });
    $("#myProfile").attr({ "href": "profile.html?type=freelance" });
    $('#fileInput').change(fileUpload);
    $("#createProfileForm").on('submit', submitCreateDetails)
  } else {
    window.location.href = 'index.html';
  }
})
