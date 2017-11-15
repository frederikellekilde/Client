const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {

    let headers = {};
    if (options.headers) {
      Object.keys(options.headers).forEach((h) => {
        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
      });
    }

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: headers,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(options.data),
      success: (data, status, xhr) => {
        cb(null, data, status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
  Item: {
    addToBasket: (item) => {
      let basket = SDK.Storage.load("basket");

      //Has anything been added to the basket before?
      if (!basket) {
        return SDK.Storage.persist("basket", [{
          count: 1,
          item: item
        }]);
      }

      //Does the item already exist?
      let foundItem = basket.find(b => b.item.id === item.id);
      if (foundItem) {
        let i = basket.indexOf(foundItem);
        basket[i].count++;
      } else {
        basket.push({
          count: 1,
          item: item
        });
      }

      SDK.Storage.persist("basket", basket);
    },
    findAll: (cb) => {
      SDK.request({
        method: "GET",
        url: "/user/getItems",
        headers: {
          filter: {
            //include: ["authors"]
          }
        }
      }, cb);
    },
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/books",
        data: data,
        headers: {authorization: SDK.Storage.load("tokenId")}
      }, cb);
    }
  },
  Author: {
    findAll: (cb) => {
      SDK.request({method: "GET", url: "/authors"}, cb);
    }
  },
  Order: {
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/orders",
        data: data,
        headers: {authorization: SDK.Storage.load("tokenId")}
      }, cb);
    },
    findMine: (cb) => {
      SDK.request({
        method: "GET",
        url: "/orders/" + SDK.User.current().id + "/allorders",
        headers: {
          authorization: SDK.Storage.load("tokenId")
        }
      }, cb);
    }
  },
  User: {
    current: () => {
      return SDK.Storage.load("user");
    },
    logOut: (userId, token, cb) => {
      SDK.request({
          method: "POST",
          url: "/start/logout",
          headers: {authorization: }



      })
      SDK.Storage.remove("tokenId");
      SDK.Storage.remove("userId");
      SDK.Storage.remove("user");
      window.location.href = "index.html";
    },
    login: (username, password, cb) => {
      SDK.request({
        data: {
          username: username,
          password: password
        },
        url: "/start/login",
        method: "POST"
      }, (err, data) => {

        //On login-error
        if (err) return cb(err);
        SDK.Storage.persist("tokenId", data.id);
        SDK.Storage.persist("userId", data.userId);
        SDK.Storage.persist("user", data.user);
          //localStorage.setItem("test", data);
          //localStorage.getItem("test");
        cb(null, data);

      });
    },
    loadNav: (cb) => {
      $("#nav-container").load("nav.html", () => {
        const currentUser = SDK.User.current();
        if (currentUser) {
          $(".navbar-right").html(`
            <li><a href="my-page.html">Mine ordrer</a></li>
            <li><a href="#" id="logout-link">Log ud</a></li>
          `);
        } else {
          $(".navbar-right").html(`
            <li><a href="login.html">Log ind<span class="sr-only">(current)</span></a></li>
          `);
        }
        $("#logout-link").click(() => SDK.User.logOut());
        cb && cb();
      });
    }
  },
  Storage: {
    prefix: "BookStoreSDK",
    persist: (key, value) => {
      window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
      const val = window.localStorage.getItem(SDK.Storage.prefix + key);
      try {
        return JSON.parse(val);
      }
      catch (e) {
        return val;
      }
    },
    remove: (key) => {
      window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
  }
};