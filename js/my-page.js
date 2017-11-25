$(document).ready(() => {

  SDK.User.loadNav();
  const currentUser = SDK.User.current();
  const $basketTbody = $("#basket-tbody");
  const $noOrdersContainer = $("#no-orders-container");
  const $ordersContainer = $("#orders-container");

  if(currentUser) {
      if (!SDK.User.current().isPersonel) {

          $(".page-header").html(`
        <h1>Velkommen ${currentUser.username}</h1>
      `);

          SDK.Order.findMine((err, orders) => {
              if (err) throw err;

              if (!orders.length) {
                  $ordersContainer.hide();
              } else {
                  $noOrdersContainer.hide();
              }

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
          window.location.href = "staff.html"
      }
  } else {
    window.location.href = "login.html";
  }



});