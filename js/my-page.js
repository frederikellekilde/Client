$(document).ready(() => {

  SDK.User.loadNav();
  const currentUser = SDK.User.current();
  const $basketTbody = $("#basket-tbody");

  if(currentUser) {

      $(".page-header").html(`
        <h1>Hi, ${currentUser.username}</h1>
  `);

      $(".profile-info").html(`
    <dl>
        <dt>Username</dt>
        <dd>${currentUser.username}</dd>
        <dt>ID</dt>
        <dd>${currentUser.user_id}</dd>
     </dl>
  `);


      SDK.Order.findMine((err, orders) => {
          if (err) throw err;
          orders.forEach(order => {

              for (let i = 0; i < order.items.length; i++) {

                  let orderStatus = "";
                  if (order.isReady === true) {
                      orderStatus = "Klar til afhentning";
                  } else {
                      orderStatus = "Ikke klar"
                  }

                  $basketTbody.append(`
                  <tr>
                  <td>${order.orderId}</td>
                  <td>${order.items[i].itemName}</td>
                  <td>${order.items[i].itemPrice + " kr"}</td>
                  <td>${orderStatus}</td>
                  </tr>
                `);
              }
          });
      });

  } else {
    window.location.href = "login.html";
  }

});