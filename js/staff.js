$(document).ready(() => {

    SDK.User.loadNav();
    const currentUser = SDK.User.current();
    const $orderList = $("#order-list");

    SDK.Order.findAll((err, orders) => {
        if (err) throw err;
/*
        function isOrderReady(order) {
            return order.isReady === false;
        }

        let unReadyOrders = orders.filter(isOrderReady);

        */

        orders.forEach((order) => {
            let $items = "";
            for (let i = 0; i < order.items.length; i++) {
                $items += order.items[i].itemName + " " + order.items[i].itemPrice + " kr" + "<br>";
            }

            console.log(order);

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
                            <button class="btn btn-success orderReady-button" data-item-id="${order.orderId}">Ordre klar</button>
                        </div>
                    </div>
                </div>
            </div>`;

            $orderList.append(orderHtml);

        });


    });

});
