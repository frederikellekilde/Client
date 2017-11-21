$(document).ready(() => {

    SDK.User.loadNav();

    $("#createUser-button").click((event) => {

        event.preventDefault();

        const username = $("#newInputUsername").val();
        const password = $("#newInputPassword").val();

        SDK.User.create(username, password, (err, data) => {
            if (err) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("Error")

            } else {
                window.location.href = "login.html";
            }
        });

    });

});