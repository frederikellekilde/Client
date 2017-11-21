$(document).ready(() => {

  SDK.User.loadNav();

  $("#login-button").click((event) => {

    event.preventDefault();

    const username = $("#inputUsername").val();
    const password = $("#inputPassword").val();

    SDK.User.login(username, password, (err, data) => {
      if (err) {
        $(".form-group").addClass("has-error");
      }
      else if (err){
        console.log("Bad stuff happened")

      } else {
          loadUser();
      }
    });

  });

  loadUser = () => {
    if(SDK.User.current().isPersonel) {
        window.location.href = "staff.html";
    } else {
        window.location.href = "my-page.html";
    }

  }

});