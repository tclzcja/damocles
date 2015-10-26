$(document).ready(
    function () {
        Pool.Reset();
        Auth.Reset();
        Initialization();
    }
)

function Initialization() {
    $("body > main").css("opacity", 1);
    $("#input-login > input").on("click", function () {
        Login();
    })
}

function Login() {

    $("#input-login > input").addClass("loading");

    var INFO = {
        grant_type: "password",
        Username: $("#input-email > input").val(),
        Password: $("#input-password > input").val()
    }

    Pool.Core("token", "", INFO, function (data) {
        Auth.Auth(data.access_token, $("#input-email > input").val(), function () { window.location = Pool.Web() + "/index.html"; })
    })

}