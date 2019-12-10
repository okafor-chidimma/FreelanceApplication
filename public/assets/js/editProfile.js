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
  const Authorization = localStorage.getItem('Authorization');
  const userType = localStorage.getItem('userType');
  if (localStorage.getItem("myProfilePix") !== $("#file-span").text()) {
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
        localStorage.setItem("myProfilePix", response["secure_url"]);
        uploadToDb(Authorization, userType);
      } else {
        $("#error-div").show();
      }
    };
    xhr.send(fd);
  } else {
    uploadToDb(Authorization, userType);
  }
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

const populateInputFields = ({ jobTitle, jobDescription, amountCharge, profilePicture, id }) => {
  $("#jobTitle").val(jobTitle);
  $("#jobDescription").val(jobDescription);
  $("#amountCharge").val(amountCharge);
  $("#file-span").text(profilePicture);
  let img = $("<img/>").attr({ "src": profilePicture, "alt": "Profile Picture Freelance" }).addClass("profile-picture-div-image");
  $("#profilePicture-error-div").empty().append(img).show();
  $("#freelanceId").val(Number(id));
  localStorage.setItem("myProfilePix", profilePicture);

};
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

const formatNumber = () => {
  $("#amountCharge").val().toString().match(/^0/)
  $("#amountCharge-error-div").text('Amount cannot start with 0').show();
  // return parseInt(amountCharge, 10)
};
const uploadToDb = (Authorization, userType) => {
  const jobTitle = $.trim($("#jobTitle").val()).toUpperCase();
  const jobDescription = $.trim($("#jobDescription").val());
  const amountCharge = $.trim($("#amountCharge").val());
  const profilePicture = localStorage.getItem("myProfilePix");
  const freelanceId = Number($.trim($("#freelanceId").val()));
  localStorage.setItem('freelanceId', freelanceId);
  const answer = validator(jobTitle, jobDescription, amountCharge);
  let profileDetails = {};
  if (answer) {
    profileDetails = {
      profilePicture,
      jobTitle,
      jobDescription,
      amountCharge
    };
  }
  $.ajax({
    url: 'http://localhost:3000/freelancers/' + freelanceId,
    headers: {
      'Authorization': 'Bearer ' + Authorization,
    },
    type: 'PATCH',
    dataType: 'json',
    data: profileDetails,
    success: function (data, textStatus, xhr) {
      $("#jobTitle,#jobDescription,#amountCharge").val('');
      $("#file-span").text("Upload Profile Picture");
      $("#profilePicture-error-div").empty();
      $("#updateProfileButton").val("Update Profile")
      $("#success-div").show();
      setTimeout(() => {
        window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
      }, 5000);
    },
    error: function (xhr, textStatus, errorThrown) {
      $("#error-div").show();
      setTimeout(() => {
        window.location.href = 'edit-profile.html';
      }, 5000);
    }
  });
}
const submitDetails = (event) => {
  event.preventDefault();
  $("#updateProfileButton").val("Updating Your Profile ...")
  const fileArray = $("#fileInput")[0].files;
  uploadToCloud(fileArray);
};

$(document).ready(function () {
  const userId = JSON.parse(localStorage.getItem('freelancerUserId'));
  const Authorization = localStorage.getItem('Authorization');
  const userType = localStorage.getItem('userType');
  if ((document.referrer.indexOf('profile.html?type=freelance') > -1) && userType === 'freelance' && Authorization !== '') {
    $("#amountCharge,#jobTitle,#jobDescription").focus(function () {
      $("#amountCharge-error-div,#jobTitle-error-div,#jobDescription-error-div,#profilePicture-error-div").hide();
    });
    $("#myProfile").attr({ "href": "profile.html?type=freelance" });
    $('#fileInput').change(fileUpload);
    $("#amountCharge").change(formatNumber);
    $.ajax({
      url: 'http://localhost:3000/freelancers?userId=' + userId,
      type: 'GET',
      dataType: 'json',
      success: function (data, textStatus, xhr) {
        populateInputFields(data[0]);
      },
      error: function (xhr, textStatus, errorThrown) {
        window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
      }
    });
    $("#editProfileForm").on('submit', submitDetails)
  } else {
    window.location.href = 'index.html';
  }
});