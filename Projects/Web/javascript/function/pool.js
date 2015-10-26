var Pool = (function () {

    var _body = {};

    _body.Reset = function () {
        sessionStorage.clear();
        sessionStorage.setItem("Path_Web", "http://damocles.tale.land/page");
        sessionStorage.setItem("Path_Api", "http://api.damocles.tale.land");
        //sessionStorage.setItem("Path_Api", "http://localhost:8080");
        sessionStorage.setItem("Path_Storage", "http://storage.damocles.tale.land");
        //sessionStorage.setItem("Path_Storage", "file:///C:/Users/Jingan Chen/SkyDrive/Projects/Riot Games/Damocles/Projects/Storage");
    };

    _body.Core = function (type, action, info, callback) {
        $.ajax({
            url: sessionStorage.getItem("Path_Api") + (type == "token" ? "/token" : "/api/" + type.toLowerCase() + "/" + action.toLowerCase() + ""),
            type: "POST",
            dataType: "json",
            data: info,
            headers: Auth.Current.Header(),
            statusCode: {
                200: function (data) {
                    callback(data);
                },
            }
        })
    };

    _body.File = function (type, action, info, callback) {
        $.ajax({
            url: sessionStorage.getItem("Path_Api") + "/api/" + type.toLowerCase() + "/" + action.toLowerCase(),
            type: "POST",
            data: info,
            headers: Auth.Current.Header(),
            cache: false,
            contentType: false,
            processData: false,
            statusCode: {
                200: function (data) {
                    callback(data);
                },
            }
        })
    };

    _body.Storage = function (id, extension) {
        return sessionStorage.getItem("Path_Storage") + "/" + id + "." + extension;
    }

    _body.Web = function (id, extension) {
        return sessionStorage.getItem("Path_Web");
    }

    return _body;
}());