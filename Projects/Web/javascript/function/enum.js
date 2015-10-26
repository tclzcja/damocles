var Enum = (function () {

    var _enum_object;
    var _enum_status;
    var _enum_usage;
    var _enum_influence;
    var _enum_influence_constrain;

    var _body = {};
    _body.Object = {};
    _body.Status = {};
    _body.Usage = {};
    _body.Influence = {};
    _body.Influence.Constrain = {};

    _body.Object.GetName = function (key) {
        return _enum_object[key.toString()];
    }

    _body.Object.ToHashtable = function () {
        return _enum_object;
    }

    _body.Status.GetName = function (key) {
        return _enum_status[key.toString()];
    }

    _body.Usage.GetName = function (key) {
        return _enum_usage[key.toString()].replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    _body.Usage.ToHashtable = function () {
        return _enum_usage;
    }

    _body.Influence.GetName = function (key) {
        return _enum_influence[key.toString()].replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    _body.Influence.ToHashtable = function () {
        return _enum_influence;
    }

    _body.Influence.Constrain.GetConstrain = function (key) {
        return _enum_influence_constrain[key.toString()].replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    _body.Influence.Constrain.ToHashtable = function () {
        return _enum_influence_constrain;
    }

    //////////////////////////////////////////////// Loading ////////////////////////////////////////////////
    //////////////////////////////////////////////// Loading ////////////////////////////////////////////////
    //////////////////////////////////////////////// Loading ////////////////////////////////////////////////

    _body.Load = function (callback) {

        var _hit = 0;
        function _hitter() {
            _hit++;
            if (_hit >= 5) {
                sessionStorage.setItem("Enum_Loaded", "1");
                callback();
            }
        }

        Pool.Core("enum", "object", null, function (data) {
            _enum_object = {};
            for (var i = 0; i < data.length; i++) {
                _enum_object[data[i].ID] = data[i].Name;
            }
            sessionStorage.setItem("Enum_Object", JSON.stringify(_enum_object));
            _hitter();
        })

        Pool.Core("enum", "status", null, function (data) {
            _enum_status = {};
            for (var i = 0; i < data.length; i++) {
                _enum_status[data[i].ID] = data[i].Name;
            }
            sessionStorage.setItem("Enum_Status", JSON.stringify(_enum_status));
            _hitter();
        })

        Pool.Core("enum", "usage", null, function (data) {
            _enum_usage = {};
            for (var i = 0; i < data.length; i++) {
                _enum_usage[data[i].ID] = data[i].Name;
            }
            sessionStorage.setItem("Enum_Usage", JSON.stringify(_enum_usage));
            _hitter();
        })

        Pool.Core("enum", "influence", null, function (data) {
            _enum_influence = {};
            for (var i = 0; i < data.length; i++) {
                _enum_influence[data[i].ID] = data[i].Name;
            }
            sessionStorage.setItem("Enum_Influence", JSON.stringify(_enum_influence));
            _hitter();
        })

        Pool.Core("enum", "influence/constrain", null, function (data) {
            _enum_influence_constrain = {};
            for (var i = 0; i < data.length; i++) {
                _enum_influence_constrain[data[i].Influence] = data[i];
            }
            sessionStorage.setItem("Enum_Influence_Constrain", JSON.stringify(_enum_influence_constrain));
            _hitter();
        })

    }

    ///////////////////////////////////////////// Auto Loading //////////////////////////////////////////////
    ///////////////////////////////////////////// Auto Loading //////////////////////////////////////////////
    ///////////////////////////////////////////// Auto Loading //////////////////////////////////////////////

    if (sessionStorage.getItem("Enum_Loaded") == "1") {

        _enum_object = JSON.parse(sessionStorage.getItem("Enum_Object"));
        _enum_status = JSON.parse(sessionStorage.getItem("Enum_Status"));
        _enum_usage = JSON.parse(sessionStorage.getItem("Enum_Usage"));
        _enum_influence = JSON.parse(sessionStorage.getItem("Enum_Influence"));
        _enum_influence_constrain = JSON.parse(sessionStorage.getItem("Enum_Influence_Constrain"));

    }

    return _body;

}());