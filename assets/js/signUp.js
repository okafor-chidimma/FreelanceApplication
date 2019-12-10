$(document).ready(function () {
  $("#email,#password,#fullName").focus(function () {
    $("#email-error-div,#email-error-div-format,#password-error-div-format,#password-error-div,#full-name-error-div,#user-type-error-div").hide();
  });
  $("#signUpForm").on('submit', (function (event) {
    event.preventDefault();
    const email = $.trim($("#email").val()).toLowerCase();
    const password = $.trim($("#password").val());
    const fullName = $.trim($("#fullName").val());
    const userType = $.trim($("#userType").val());
    const answer = validator(fullName, email, password, userType);
    let userDetails = {};
    if (answer) {
      userDetails = {
        email,
        password,
        fullName,
        hasProfile: false,
        userType,
        createdAt: moment(new Date()).format('MMMM Do YYYY')
      };
    }
    $("#signUpButton").val('Signing You Up ...');
    $.ajax({
      url: 'https://freelance-decagon.herokuapp.com/signup',
      type: 'POST',
      dataType: 'json',
      data: userDetails,
      success: function (data, textStatus, xhr) {
        $("#email,#password,#fullName").val('');
        $("#signUpButton").val("Join Us")
        localStorage.setItem('Authorization', 'Bearer ' + data.accessToken);
        $("#success-div").show();
        setTimeout(() => {
          window.location.href = 'signin.html';
        }, 5000);
      },
      error: function (xhr, textStatus, errorThrown) {
        $("#error-div").show();
      }
    });
  }));
});

const validator = (fullName, email, password, userType) => {
  let status = true;
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (fullName === '') {
    $("#full-name-error-div").show();
    status = false;
  }
  if (email === '') {
    $("#email-error-div").show();
    status = false;
  }
  if (!validEmail.test(String(email).toLowerCase())) {
    $("#email-error-div-format").show();
    status = false;
  }
  if (password === '') {
    $("#password-error-div").show();
    status = false;
  }
  if (password.length < 8) {
    $("#password-error-div-format").show()
    status = false;
  }
  if (userType === '') {
    $("#user-type-error-div").show()
    status = false;
  }
  return status;
};