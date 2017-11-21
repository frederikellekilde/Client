$(document).ready(() => {

  SDK.User.loadNav();
  const currentUser = SDK.User.current();
  const $basketTbody = $("#basket-tbody");


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
    if(err) throw err;
    orders.forEach(order => {

      for(let i = 0; i < order.items.length; i++) {

       $basketTbody.append(`
        <tr>
            <td>${order.orderId}</td>
            <td>${order.items[i].itemName}</td>
            <td>${order.items[i].itemPrice + " kr"}</td>
        </tr>
      `);
      }
    });
  });

  function parseOrderItems(items){
    return items.map(item => {
      return item.count + " x " + item.itemInfo.title
    }).join(", ");
  }

  function sumTotal(items){
    let total = 0;
    items.forEach(item => {
      total += item.count * item.itemInfo.price
    });
    return total;
  }

});