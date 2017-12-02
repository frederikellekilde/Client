$(document).ready(() => {

    SDK.User.loadNav();
    const currentUser = SDK.User.current();

    if(currentUser) {
        if (SDK.User.current().isPersonel) {

            $("#createItem-button").click((event) => {

                event.preventDefault();

                const itemName = $("#inputName").val();
                const itemDescription = $("#inputDescription").val();
                const itemPrice = $("#inputPrice").val();
                const itemUrl = $("#inputUrl").val();

                SDK.Item.create(itemName, itemDescription, itemPrice, itemUrl, (err, data) => {
                    if (err) {
                        $(".form-group").addClass("has-error");
                    }
                    else if (err) {
                        console.log("Error");
                        window.alert("Der skete en fejl");
                    } else {
                        window.alert("Produktet blev tilføjet");
                        location.reload();
                    }
                });

            });

        } else {
            window.location.href = "my-page.html";
        }
    }else {
        window.location.href = "login.html";
    }

});