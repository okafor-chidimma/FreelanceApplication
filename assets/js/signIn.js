$(document).ready(function () {
  $("#email,#password").focus(function () {
    $("#email-error-div,#email-error-div-format,#password-error-div-format,#password-error-div,#error-div").hide();
  });
  $("#signInForm").on('submit', (function (event) {
    event.preventDefault();
    const email = $.trim($("#email").val().toLowerCase());
    const password = $.trim($("#password").val());
    const answer = validator(email, password);
    let userDetails = {};
    if (answer) {
      userDetails = {
        email,
        password
      };
    }
    $.ajax({
      url: 'https://freelance-decagon.herokuapp.com/login',
      type: 'POST',
      dataType: 'json',
      data: userDetails,
      success: function (data, textStatus, xhr) {
        $("#email,#password").val('');
        localStorage.setItem('Authorization', data.accessToken);
        $.ajax({
          url: 'https://freelance-decagon.herokuapp.com/users?email=' + email,
          headers: {
            'Authorization': 'Bearer ' + data.accessToken,
          },
          type: 'GET',
          dataType: 'json',
          success: function (data, textStatus, xhr) {
            const { userType, id, hasProfile, fullName, createdAt } = data[0];
            $("#signInButton").val('Logging In ...')
            setTimeout(() => {
              switch (userType) {
                case 'user':
                  localStorage.setItem('userType', userType);
                  localStorage.setItem('regularUserId', id);
                  window.location.href = 'index.html?type=' + encodeURIComponent(userType);
                  break;
                case 'freelance':
                  localStorage.setItem('freelancerUserId', id);
                  localStorage.setItem('hasProfileStatus', hasProfile);
                  localStorage.setItem('freelancerName', fullName);
                  localStorage.setItem('freelancerEmail', email);
                  localStorage.setItem('freelancerJoined', createdAt);
                  localStorage.setItem('userType', userType);
                  window.location.href = 'profile.html?type=' + encodeURIComponent(userType);
                  break;
                default:
                  break;
              }
            }, 3000);
          },
          error: function (xhr, textStatus, errorThrown) {
          }
        });
      },
      error: function (xhr, textStatus, errorThrown) {
        $("#error-div").show();
      }
    });
  }));
})

const validator = (email, password) => {
  let status = true;
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  return status;
};