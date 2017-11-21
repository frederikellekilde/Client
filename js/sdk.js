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
                        include: ["authors"]
                    }
                }
            }, cb);
        },
    },
    Order: {
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/user/createOrder",
                data: data,
                headers: {authorization: SDK.Storage.load("token")}
            }, cb);
        },
        findMine: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getOrdersById/" + SDK.User.current().user_id,
                headers: {
                    authorization:  "Bearer " + SDK.User.current().token,
                }
            }, cb);
        }
    },
    User: {
        current: () => {
            return JSON.parse(localStorage.getItem("user"));
        },
        logOut: () => {
           localStorage.removeItem("user");
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

                //console.log('tester', err, data)

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
                    $(".navbar-right").html(`
                    <li><a href="my-page.html">Min side</a></li>
                    <li><a href="#" id="logout-link">Log ud</a></li>
      `);
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