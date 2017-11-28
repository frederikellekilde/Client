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
            let foundItem = basket.find(i => i.item.itemId === item.itemId);
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

        addOneToBasket: (itemId) => {
            let basket = SDK.Storage.load("basket");
            for (let i = 0; i<basket.length; i++){
                if (basket[i].item.itemId === itemId){
                    if (basket[i].count > 0){
                        basket[i].count++;
                    }
                    else{
                        basket.splice(i, 1);
                    }
                }
            }
            SDK.Storage.persist("basket", basket);
        },

        removeFromBasket: (itemId) => {
            let basket = SDK.Storage.load("basket");
            for (let i = 0; i<basket.length; i++){
                if (basket[i].item.itemId === itemId){
                    if (basket[i].count > 1){
                        basket[i].count--;
                    }
                    else{
                        basket.splice(i, 1);
                    }
                }
            }
            SDK.Storage.persist("basket", basket);
        },

        removeItemFromBasket: (itemId) => {
            let basket = SDK.Storage.load("basket");
            for (let i = 0; i<basket.length; i++){
                if (basket[i].item.itemId === itemId){
                    if (basket[i].count > 1){
                        basket.splice(i, 1);
                    }
                }
            }
            SDK.Storage.persist("basket", basket);
        },

        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems",
                headers: {
                    authorization: "Bearer " + SDK.User.current().token
                }
            }, cb);
        },
    },

    Order: {
        create: (items, cb) => {
            SDK.request({
                method: "POST",
                url: "/user/createOrder",
                data:
                    {
                        User_userId: SDK.User.current().user_id,
                        items: items
                    },
                headers: {
                    authorization: "Bearer " + SDK.User.current().token
                }
            }, (err, data) => {
                if (err) return cb(err);
                cb(null, data);
            })
        },

        findMine: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getOrdersById/" + SDK.User.current().user_id,
                headers: {
                    authorization: "Bearer " + SDK.User.current().token
                }
            }, cb);
        },

        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/staff/getOrders",
                headers: {
                    authorization: "Bearer " + SDK.User.current().token
                }
            }, cb);
        },

        makeReady: (orderId, cb) => {
            SDK.request({
                method: "POST",
                url: "/staff/makeReady/" + orderId,
                data: {
                    orderId: orderId
                },
                headers: {
                    authorization: "Bearer " + SDK.User.current().token
                }
            }, (err, data) => {
                if (err) return cb(err);
                cb(null, data);
            });
        }
    },

    User: {
        current: () => {
            return JSON.parse(localStorage.getItem("user"));
        },
        logOut: (user_id, cb) => {
            SDK.request({
                data:{
                    user_id: SDK.User.current().user_id
                },
                method: "POST",
                url: "/start/logout",
                headers: {
                    authorization: "Bearer " + SDK.User.current().token
                }
            }, (err, data) => {
                if (err) return cb(err);
                cb(null, data);

            });

            localStorage.removeItem("user");
            SDK.Storage.remove("basket")
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
                //console.log('sdk test', data);
                localStorage.setItem("user", JSON.stringify(data));

                cb(null, data);

            });
        },
        create: (username, password, cb) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/user/createUser",
                method: "POST"
            }, (err, data) => {

                //On signup-error
                if (err) return cb(err);

                cb(null, data);

            });
        },

        loadNav: () => {
            $("#nav-container").load("nav.html", () => {
                const currentUser = SDK.User.current();
                if (currentUser) {
                    if(!SDK.User.current().isPersonel) {
                        $(".navbar-left").html(`
                        <li><a href="shop.html">Shop</a></li>
                        <li><a href="checkout.html">Kurv</a></li>
      `);
                        $(".navbar-right").html(`
                        <li><a href="my-page.html">Min side</a></li>
                        <li><a href="#" id="logout-link">Log ud</a></li>
      `);
                    } else {
                        $(".navbar-right").html(`
                        <li><a href="#" id="logout-link">Log ud</a></li>
      `);
                    }

                } else {
                    $(".navbar-right").html(`
                    <li><a href="login.html">Log ind<span class="sr-only">(current)</span></a></li>
      `);
                }
                $("#logout-link").click(() => SDK.User.logOut());
            });
        }

    },

    Storage: {
        prefix: "YoloSDK",
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
}