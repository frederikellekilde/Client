$(document).ready(() => {

  SDK.User.loadNav();
  const $itemList = $("#item-list");

  SDK.Item.findAll((err,items) => {
      items.forEach((item) => {

        const itemHtml = `
          <div class="col-lg-4 book-container">
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
                              <p>Kr. <span class="price-amount">${item.itemPrice}</span></p>
                          </div>
                          <div class="col-lg-8 text-right">
                              <button class="btn btn-success purchase-button" data-item-id="${item.itemId}">Add to basket</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>`;

          $itemList.append(itemHtml);

      });

      $(".purchase-button"). click(function() {
        $("#purchase-modal").modal("toggle");
        const itemId = $(this).data("item-id");
        const item = items.find((item) => item.id === itemId);
        SDK.Item.addToBasket(item);
      });

  });

    $("#purchase-modal").on("shown.bs.modal", () => {
      const basket = SDK.Storage.load("basket");
      const $modalTBody = $("#modal-tbody");
      $modalTBody.html("");
      basket.forEach((entry) => {
          $modalTBody.append(`
            <tr>
                <td>
                    <!--<img src="$//{entry.item.imgUrl}" height="60"/> -->
                </td>
                <td>${entry.items.itemName}</td>
                <td>${entry.count}</td>
                <td>kr. ${entry.items.itemPrice}</td>
                <td>kr. 0</td>
            </tr>
          `);
        });

    });

});