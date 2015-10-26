var Current_Object;
var Current_Version;

var Sitemap = [
    {
        id: "index",
        title: "Index",
        url: "index.html",
        role: "Administrator|User"
    },
    {
        id: "project",
        title: "Project",
        url: "project.html",
        role: "Administrator"
    },
    {
        id: "user",
        title: "User",
        url: "user.html",
        role: "Administrator"
    }
]

var Nav = (function () {
    var _body = {};
    _body.Render = {};
    _body.Fade = {};

    _body.Render.Begin = function () {
        $("body > nav").append("<article><section id='nav-logo'></section></article>");
        return _body;
    }

    _body.Render.Type = function () {

        $("body > nav > article").append("<section id='nav-type'><select></select></section>");

        for (var i = 0; i < Sitemap.length; i++) {
            if (Sitemap[i].role.indexOf(Auth.Current.User().Role) >= 0) {
                var O = document.createElement("option");
                $(O).html(Sitemap[i].title).val(Sitemap[i].id).attr("data-url", Sitemap[i].url);
                $("#nav-type select").append(O);

                if (window.location.toString().indexOf(Sitemap[i].url) != -1) {
                    $("#nav-type select").val(Sitemap[i].id);
                }
            }
        }

        $("#nav-type select").on("change", function () {

            window.location = $("#nav-type select option:selected").attr("data-url");

            /*
            _body.Fade.Off();

            setTimeout(function () {
                window.location = $("#nav-type select option:selected").attr("data-url");
            }, 400);
            */
        })

        return _body;
    }

    _body.Render.Object = function (EntityName) {

        $("body > nav > article").append("<section id='nav-object'><select><optgroup label='New " + EntityName + "'><option value='0'>Create a new " + EntityName + "</option></optgroup><optgroup label='Existing " + EntityName + "(s)'></optgroup></select></section>");

        Pool.Core(EntityName, "multiple", null, function (data) {

            for (var i = 0; i < data.length; i++) {
                var O = document.createElement("option");
                $(O).html(data[i].Name).val(data[i].ID);
                $("#nav-object optgroup:last-child").append(O);
            }

            $("#nav-object > select").on("change", function () {

                window.location = EntityName.toLowerCase() + ".html?id=" + $("#nav-object > select").val();

                /*
                _body.Fade.Off();

                setTimeout(function () {
                    window.location = EntityName.toLowerCase() + ".html?id=" + $("#nav-object > select").val();
                }, 400);
                */
            });

            $("#nav-object > select").val($.QueryString("id") ? $.QueryString("id") : 0);

        })

        return _body;
    }

    _body.Render.Profile = function () {

        $("body > nav > article").append("<section id='nav-profile'><header></header><input id='nav-profile-change-password' type='button' /><input id='nav-profile-logout' type='button' /></section>");
        $("body > nav > article > #nav-profile > header").html(Auth.Current.User().Name);

        $("#nav-profile-logout").on("click", function () {
            window.location = "login.html";
        })

        $("#nav-profile-change-password").on("click", function () {
            window.location = "user.html?id=change";
        })

        return _body;
    }

    _body.Fade.In = function () {
        $("body > main").css("opacity", 1);
        setTimeout(function () { $("body > nav").css("opacity", 1); }, 100);
    }

    _body.Fade.Off = function () {
        $("body > header > img").css("opacity", 0);
        setTimeout(function () { $("body > main").css("opacity", 0); }, 100);
        setTimeout(function () { $("body > nav").css("opacity", 0); }, 100);
    }

    return _body;
}());