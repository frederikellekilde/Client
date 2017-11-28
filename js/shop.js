$(document).ready(() => {

  SDK.User.loadNav();
  const currentUser = SDK.User.current();
  const $itemList = $("#item-list");

  if(currentUser) {
      if (!SDK.User.current().isPersonel) {

          SDK.Item.findAll((err, items) => {
              items.forEach((item) => {

                  const itemHtml = `
                  <div class="col-lg-4 item-container">
                      <div class="panel panel-default">
                          <div class="panel-heading">
                              <h3 class="panel-title">${item.itemName}</h3>
                          </div>
                          <div class="panel-body">
                              <div class="col-lg-8">
                                <img src="${item.itemUrl}"/>
                              </div>
                              <div class="col-lg-4">
                                <dl>
                                  <dt>Beskrivelse</dt>
                                  <dd>${item.itemDescription}</dd>
                                </dl>
                              </div>
                          </div>
                          <div class="panel-footer">
                              <div class="row">
                                  <div class="col-lg-4 price-label">
                                      <p><span class="price-amount">${item.itemPrice} kr.</span></p>
                                  </div>
                                  <div class="col-lg-8 text-right">
                                      <button class="btn btn-success addToBasket-button" data-item-id="${item.itemId}">Læg i kurv</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>`;

                  $itemList.append(itemHtml);

                  });

                  $(".addToBasket-button").click(function () {
                      const itemId = $(this).data("item-id");
                      const item = items.find((item) => item.itemId === itemId);
                      SDK.Item.addToBasket(item);
                      $("#purchase-modal").modal("toggle");
                  });

              });

              $("#purchase-modal").on("show.bs.modal", () => {
                  const basket = SDK.Storage.load("basket");
                  const $modalTBody = $("#modal-tbody");
                  let total = 0;
                  $modalTBody.empty();
                  basket.forEach((entry) => {
                      let subtotal = entry.item.itemPrice * entry.count;
                      total += subtotal;
                      $modalTBody.append(`
                        <tr>
                            <td>
                               <img src="${entry.item.itemUrl}" height="60"/>
                            </td>
                            <td>${entry.item.itemName}</td>
                            <td>
                            <button class="btn btn-default remove-icon" data-item-id="${entry.item.itemId}">
                            <span class="glyphicon glyphicon-minus"></span>
                            </button>                           
                            ${entry.count}
                            <button class="btn btn-default add-icon" data-item-id="${entry.item.itemId}">
                            <span class="glyphicon glyphicon-plus"></span>
                            </button>
                            </td>
                            <td>${entry.item.itemPrice} kr.</td>
                            <td>${subtotal} kr.</td>
                            <td>
                            <button class="btn btn-default remove-icon" data-item-id="${entry.item.itemId}">
                                <span class="glyphicon glyphicon-remove"></span>
                            </button>
                            </td>
                         </tr>
                    `);
                  });

                  $modalTBody.append(`
                  <tr>
                    <td colspan="3"></td>
                    <td><b>Total</b></td>
                    <td>${total} kr.</td>
                    <td></td>
                  </tr>
            `);

              $(".remove-icon").click(function () {
                  const itemId = $(this).data("item-id");
                  SDK.Item.removeFromBasket(itemId);
                  $("#purchase-modal").modal("show");

              });

              $(".add-icon").click(function () {
                  const itemId = $(this).data("item-id");
                  const item = items.find((item) => item.itemId === itemId);
                  SDK.Item.addToBasket(item);
                  location.reload();
              });

          });

      } else {
          window.location.href = "staff.html";
      }
  } else {
      window.location.href = "login.html";
  }

});