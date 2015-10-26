var Current_ID;

$(document).ready(
    function () {

        Auth.Test();
        Nav.Render.Begin().Render.Type().Render.Profile();
        Initialization();

    }
)

function Initialization() {

    Current_ID = $.QueryString("id") ? $.QueryString("id") : "0";

    if (Current_ID == '0') {
        Prepare_New();
    } else if (Current_ID == 'change') {
        Prepare_Change_Password();
    } else {
        Prepare_Existing();
    }

    Roll.Active();
    Nav.Fade.In();

}

function Prepare_New() {

    Nav.Render.Object("User");

    $("#submit-delete > input, #submit-update > input, #input-password-new > input, #input-password-new-confirm > input").prop("disabled", true);
    $("#submit-create").click(Create);

}

function Prepare_Change_Password() {

    $("#submit-create > input, #submit-delete > input, #input-name > input, #input-email > input, #input-role > select").prop("disabled", true);
    $("#nav-type").css("right", 80).css("width", "auto");

    Current_ID = Auth.Current.User().ID;

    $("#submit-update").click(ChangePassword);

}

function Prepare_Existing() {

    Nav.Render.Object("User");

    $("#submit-create > input, #input-password > input, #input-password-new > input, #input-password-new-confirm > input").prop("disabled", true);

    var info = {
        ID: Current_ID,
    }

    Pool.Core("user", "single", info, function (data) {
        DataToForm(data);
    })

    $("#submit-update").click(Update);
}

function Create() {
    $("#submit-result").attr("class", "loading");
    Pool.Core("user", "create", FormToData(), function () {
        $("#submit-result").attr("class", "good");
    });
}

function Update() {
    $("#submit-result").attr("class", "loading");
    Pool.Core("user", "update", FormToData(), function () {
        $("#submit-result").attr("class", "good");
    });
}

function ChangePassword() {
    $("#submit-result").attr("class", "loading");
    Pool.Core("user", "changepassword", FormToData(), function () {
        $("#submit-result").attr("class", "good");
    });
}

function FormToData() {

    var data = {
        ID: Current_ID,
        Name: $("#input-name > input").val(),
        Email: $("#input-email > input").val(),
        Role: $("#input-role > select option:selected").val(),
        Password: $("#input-password > input").val(),
        Password2: $("#input-password-new > input").val(),
    };

    return data;

}

function DataToForm(data) {

    $("#input-name > input").val(data.Name);
    $("#input-email > input").val(data.Email);
    $("#input-role > select").val(data.Role);

}