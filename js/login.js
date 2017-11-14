$(document).ready(() => {

  SDK.User.loadNav();

  $("#login-button").click(() => {

    const username = $("#inputUsername").val();
    const password = $("#inputPassword").val();

    SDK.User.login(username, password, (err, data) => {
      if (err && err.xhr.status === 401) {
        $(".form-group").addClass("has-error");
      }
      else if (err){
        console.log("Bad stuff happened")
      } else {
        window.location.href = "my-page.html";
      }
    });

  });

});