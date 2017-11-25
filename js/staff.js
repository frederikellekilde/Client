$(document).ready(() => {

    SDK.User.loadNav();
    const currentUser = SDK.User.current();
    const $orderList = $("#order-list");
    const $noOrdersContainer = $("#no-orders-container");
    const $ordersContainer = $("#orders-container");

    if (currentUser) {

        SDK.Order.findAll((err, orders) => {
            if (err) throw err;

            if (!orders.length) {
                $ordersContainer.hide();
            } else {
                $noOrdersContainer.hide();
            }

            function isOrderReady(order) {
                return order.isReady === false;
            }

            let unReadyOrders = orders.filter(isOrderReady);
            unReadyOrders.forEach((order) => {
                let $items = "";
                for (let i = 0; i < order.items.length; i++) {
                    $items += order.items[i].itemName + " " + order.items[i].itemPrice + " kr" + "<br>";
                }

                const orderHtml = `
                <div class="col-lg-4 books-container">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Id: ${order.orderId}</h3>
                        </div>
                        <div class="panel-body">
                            <div class="col-lg-8">
                                <dl>
                                    <dt>Ordre oprettet</dt>
                                    <dd>${order.orderTime}</dd>
                                    <dt>Varer</dt>
                                    <dd>${$items}</dd>
                                </dl>
                                <button class="btn btn-success orderReady-button" data-order-id="${order.orderId}">Ordre klar</button>
                            </div>
                        </div>
                    </div>
                </div>`;

                $orderList.append(orderHtml);

            });

            $(".orderReady-button").click(function () {
                const orderId = $(this).data("order-id");
                const order = orders.find((order) => order.orderId === orderId);
                SDK.Order.makeReady(order.orderId, (err) => {
                    if (err) throw err;
                    window.location.reload();
                });
            });
        })

    } else {
        window.location.href = "login.html";
    }

});
