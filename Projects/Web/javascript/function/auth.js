var Auth = (function () {

    var _body = {};
    _body.Current = {};

    _body.Test = function () {
        if (sessionStorage.getItem("Auth_Pass") != "1") {
            window.location = "login.html";
        }
    }

    _body.Reset = function () {
        sessionStorage.removeItem("Auth_Pass");
        sessionStorage.removeItem("Auth_Header");
        sessionStorage.removeItem("Auth_User");
        sessionStorage.removeItem("Auth_Universe");
    }

    _body.Auth = function (token, email, callback) {
        sessionStorage.setItem("Auth_Pass", "1");
        sessionStorage.setItem("Auth_Header", JSON.stringify({ "Authorization": "Bearer " + token }));

        Pool.Core("user", "single/email", { Email: email }, function (data) {
            data.Tasks = [];
            sessionStorage.setItem("Auth_User", JSON.stringify(data));
            callback();
        })
    }

    _body.Current.Header = function () {
        if (sessionStorage.getItem("Auth_Pass") != "1") {
            return {};
        }
        else {
            return JSON.parse(sessionStorage.getItem("Auth_Header"));
        }
    }

    _body.Current.User = function () {
        return JSON.parse(sessionStorage.getItem("Auth_User"));
    }

    return _body;
}());