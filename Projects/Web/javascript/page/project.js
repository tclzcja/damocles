var Current_ID;
var Current_Start;
var Current_End;
var Current_Span;

$(document).ready(
    function () {

        Auth.Test();
        Nav.Render.Begin().Render.Type().Render.Object("Project").Render.Profile();
        Initialization();

    }
)

function Initialization() {

    Pool.Core("user", "multiple", null, function (data) {

        //Adding User to the List
        for (var i = 0; i < data.length; i++) {
            var O = document.createElement("option");
            $(O).val(data[i].ID).text(data[i].Name).appendTo($("#canvas-tasks-users > select"));
        }

        Pool.Core("project", "multiple/templatable", null, function (data) {

            //Adding Templatable Project to the List
            for (var i = 0; i < data.length; i++) {
                var O = document.createElement("option");
                $(O).val(data[i].ID).text(data[i].Name).appendTo($("#input-template > select"));
            }

            Current_ID = $.QueryString("id") ? $.QueryString("id") : "0";

            if (Current_ID == '0') {
                Initialization_New();
            } else {
                Initialization_Existing();
            }

            Roll.Active();
            Nav.Fade.In();

        })
    })

}

function Initialization_New() {

    $("#submit-update > input, #submit-delete > input").prop("disabled", true);

    $("#submit-create > input").on("click", function () {
        Create();
    })

    Bind_Project_Start_End();
    Bind_Template();
    Bind_TD_Create();

}

function Initialization_Existing() {

    $("#canvas-tasks > table").addClass("loading");

    $("#submit-result").html("<p>Updating a Project will reset all the Tasks as incomplete and all the Attachments as un-uploaded.</p><p>You may want to backup the Attachments you've uploaded first.</p>")

    var info = {
        ID: Current_ID,
    }

    Pool.Core("project", "single", info, function (data) {
        $("#submit-create > input").prop("disabled", true);
        $("#submit-delete > input").on("click", Delete);
        $("#submit-update > input").on("click", Update);
        Bind_Project_Start_End();
        Bind_Template();
        DataToForm(data);
        $("#canvas-tasks > table").removeClass("loading");
    })

}

function Bind_Project_Start_End() {
    $("#input-start > input, #input-end > input").on("change", function () {

        var DS = $("#input-start > input").val().split("-");
        Current_Start = Date.UTC(parseInt(DS[0]), parseInt(DS[1]) - 1, parseInt(DS[2]), 0, 0, 0);

        var DE = $("#input-end > input").val().split("-");
        Current_End = Date.UTC(parseInt(DE[0]), parseInt(DE[1]) - 1, parseInt(DE[2]), 0, 0, 0);

        Current_Span = (Current_End - Current_Start) / 24 / 60 / 60 / 1000 + 1;

    }).trigger("change");
}
function Bind_Template() {
    $("#input-template > select").off().on("change", function () {
        Pool.Core("project", "single", { ID: $(this).val() }, function (data) {
            DataToForm(data);
        })
    })
}

function Bind_TD_Name() {

    var From;

    // Value Change
    $("#canvas-tasks > #canvas-tasks-name > input").off().on("keyup", function () {
        $(From).html($(this).val());
    })

    // Fade In
    $("#canvas-tasks > table > tbody > tr > td:nth-child(1)").off().on("click", function (e) {

        // $("#canvas-tasks > #canvas-tasks-name").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-start-end").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-users").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-users > div").remove();
        $("#canvas-tasks > #canvas-tasks-attachments").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-attachments > div").remove();

        e.stopPropagation();
        e.preventDefault();

        From = this;

        $("#canvas-tasks > #canvas-tasks-name").css("opacity", 1).css("top", $(this).position().top - 10).css("left", $(this).position().left).css("width", $(this).outerWidth() + 20).css("z-index", 5);
        $("#canvas-tasks > #canvas-tasks-name > input").val($(this).html()).focus();

        // Fadeoff
        $("#canvas-tasks").off().on("click", function (e) {

            e.stopPropagation();
            e.preventDefault();

            if (!$(e.target).is("#canvas-tasks-name > input")) {
                $("#canvas-tasks > #canvas-tasks-name").css("opacity", 0).css("z-index", 0).css("top", "-50px");
            }

        });

    })

}
function Bind_TD_Start_End() {

    var From;

    // Value Change
    $("#canvas-tasks > #canvas-tasks-start-end > input").off().on("change", function () {

        var DS = $(this).parent().children("input:first-child").val().split("-");
        var S = Math.ceil((Date.UTC(parseInt(DS[0]), parseInt(DS[1]) - 1, parseInt(DS[2]), 0, 0, 0) - Current_Start) / 24 / 60 / 60 / 1000);

        var DE = $(this).parent().children("input:last-child").val().split("-");
        var E = Math.ceil((Date.UTC(parseInt(DE[0]), parseInt(DE[1]) - 1, parseInt(DE[2]), 0, 0, 0) - Current_Start) / 24 / 60 / 60 / 1000);

        $(From).attr("data-start", S);
        $(From).attr("data-end", E);

        $(From).children("span").css("width", Math.floor((E + 1 - S) / Current_Span * 100) + "%");
        $(From).children("span").css("margin-left", S / Current_Span * 100 + "%");

    })

    // Fade In
    $("#canvas-tasks > table > tbody > tr > td:nth-child(2)").off().on("click", function (e) {

        $("#canvas-tasks > #canvas-tasks-name").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        // $("#canvas-tasks > #canvas-tasks-start-end").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-users").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-users > div").remove();
        $("#canvas-tasks > #canvas-tasks-attachments").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-attachments > div").remove();

        e.stopPropagation();
        e.preventDefault();

        From = this;

        $("#canvas-tasks > #canvas-tasks-start-end").css("opacity", 1).css("top", $(this).position().top - 10).css("left", $(this).position().left).css("width", $(this).outerWidth() + 20).css("z-index", 5);

        var S = Current_Start + parseInt($(this).attr("data-start")) * 24 * 60 * 60 * 1000;
        var E = Current_Start + parseInt($(this).attr("data-end")) * 24 * 60 * 60 * 1000;

        $("#canvas-tasks > #canvas-tasks-start-end > input:first-child").val((new Date(S)).toUTCyyyyMMdd()).focus();
        $("#canvas-tasks > #canvas-tasks-start-end > input:last-child").val((new Date(E)).toUTCyyyyMMdd());

        // Fade Off
        $("#canvas-tasks").off().on("click", function (e) {

            e.stopPropagation();
            e.preventDefault();

            if (!$(e.target).is("#canvas-tasks-start-end > input")) {
                $("#canvas-tasks > #canvas-tasks-start-end").css("opacity", 0).css("z-index", 0).css("top", "-50px");
            }

        });

    })

}
function Bind_TD_Users() {

    var From;

    function _TDToPanel() {

        $("#canvas-tasks-users > div").remove();
        var UL = JSON.parse($(From).attr("data-users"));
        for (var i = 0; i < UL.length; i++) {
            var D = document.createElement("div");
            $(D).attr("data-id", UL[i].ID).html($("#canvas-tasks-users > select > option[value='" + UL[i].ID + "']").text());
            $("#canvas-tasks-users").append(D);
            $(D).on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).remove();
                _PanelToTD();
            });
        }

    }

    function _PanelToTD() {

        var UL = [];

        $(From).html("");

        $("#canvas-tasks-users > div").each(function () {
            var O = {
                ID: $(this).attr("data-id")
            }
            UL.push(O);
            $(From).append("<span></span>");
        })

        $(From).attr("data-users", JSON.stringify(UL));

    }

    // Value Change
    $("#canvas-tasks-users > select").off().on("change", function () {
        if ($(this).val() != '0' && $("#canvas-tasks-users > div[data-id='" + $(this).val() + "']").length <= 0) {
            var D = document.createElement("div");
            $(D).attr("data-id", $(this).val()).html($(this).children("option:selected").text());
            $("#canvas-tasks-users").append(D);
            $(D).on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).remove();
                _PanelToTD();
            });
            _PanelToTD();
        }
    })

    // Fade In
    $("#canvas-tasks > table > tbody > tr > td:nth-child(3)").off().on("click", function (e) {

        $("#canvas-tasks > #canvas-tasks-name").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-start-end").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        // $("#canvas-tasks > #canvas-tasks-users").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        // $("#canvas-tasks > #canvas-tasks-users > div").remove();
        $("#canvas-tasks > #canvas-tasks-attachments").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-attachments > div").remove();

        e.stopPropagation();
        e.preventDefault();

        From = this;

        _TDToPanel();

        $("#canvas-tasks > #canvas-tasks-users").css("opacity", 1).css("top", $(this).position().top - 10).css("left", $(this).position().left).css("width", $(this).outerWidth() + 20).css("z-index", 5).children("select").val("0").focus();

        // Fade Off
        $("#canvas-tasks").off().on("click", function (e) {

            e.stopPropagation();
            e.preventDefault();

            if (!$(e.target).is("#canvas-tasks-users") && !$(e.target).is("#canvas-tasks-users *")) {
                $("#canvas-tasks > #canvas-tasks-users").css("opacity", 0).css("z-index", 0).css("top", "-50px");
                $("#canvas-tasks > #canvas-tasks-users > div").remove();
            }

        });

    })

}
function Bind_TD_Attachments() {

    var From;

    function _TDToPanel() {

        $("#canvas-tasks-attachments > div").remove();
        var AL = JSON.parse($(From).attr("data-attachments"));
        for (var i = 0; i < AL.length; i++) {
            var D = document.createElement("div");
            $(D).attr("data-id", AL[i].ID).html(AL[i].Name);
            $("#canvas-tasks-attachments").append(D);
            $(D).on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).remove();
                _PanelToTD();
            });
        }

    }

    function _PanelToTD() {

        var AL = [];

        $(From).html("");

        $("#canvas-tasks-attachments > div").each(function () {
            var O = {
                Name: $(this).html()
            }
            AL.push(O);
            $(From).append("<span></span>");
        })

        $(From).attr("data-attachments", JSON.stringify(AL));

    }

    // Value Change
    $("#canvas-tasks-attachments > input").off().on("keypress", function (e) {
        if (e.which == 13) {
            var D = document.createElement("div");
            $(D).html($(this).val());
            $("#canvas-tasks-attachments").append(D);
            $(D).on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).remove();
                _PanelToTD();
            });
            _PanelToTD();
        }
    })

    // Fade In
    $("#canvas-tasks > table > tbody > tr > td:nth-child(4)").off().on("click", function (e) {

        $("#canvas-tasks > #canvas-tasks-name").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-start-end").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-users").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        $("#canvas-tasks > #canvas-tasks-users > div").remove();
        // $("#canvas-tasks > #canvas-tasks-attachments").css("opacity", 0).css("z-index", 0).css("top", "-50px");
        // $("#canvas-tasks > #canvas-tasks-attachments > div").remove();

        e.stopPropagation();
        e.preventDefault();

        From = this;

        _TDToPanel();

        $("#canvas-tasks > #canvas-tasks-attachments").css("opacity", 1).css("top", $(this).position().top - 10).css("left", $(this).position().left).css("width", $(this).outerWidth() + 20).css("z-index", 5).children("input").val("").focus();

        // Fade Off
        $("#canvas-tasks").off().on("click", function (e) {

            e.stopPropagation();
            e.preventDefault();

            if (!$(e.target).is("#canvas-tasks-attachments") && !$(e.target).is("#canvas-tasks-attachments *")) {
                $("#canvas-tasks > #canvas-tasks-attachments").css("opacity", 0).css("z-index", 0).css("top", "-50px");
                $("#canvas-tasks > #canvas-tasks-attachments > div").remove();
            }

        });

    })
}
function Bind_TD_Create() {
    $("#canvas-tasks > table > tfoot > tr > td").off().on("click", function () {
        var TR = document.createElement("tr");
        var TDName = document.createElement("td");
        var TDStartEnd = document.createElement("td");
        var TDUsers = document.createElement("td");
        var TDAttachments = document.createElement("td");
        var TDDelete = document.createElement("td");

        $(TDName).html("Click to change the task's name");
        $(TDStartEnd).html("<span></span>").attr("data-start", 0).attr("data-end", Current_Span - 1).children("span").css("width", "100%");
        $(TDUsers).attr("data-users", "[]");
        $(TDAttachments).attr("data-attachments", "[]");

        $(TDDelete).on("click", function () {
            $(this).parent().remove();
        })

        $(TR).append(TDName).append(TDStartEnd).append(TDUsers).append(TDAttachments).append(TDDelete).appendTo("#canvas-tasks > table > tbody");

        Bind_TD_Name();
        Bind_TD_Start_End();
        Bind_TD_Users();
        Bind_TD_Attachments();
    })
}

function Create() {
    $("#submit-result").attr("class", "loading");
    Pool.Core("project", "create", FormToData(), function () {
        $("#submit-result").attr("class", "good");
    });
}

function Delete() {
    $("#submit-result").attr("class", "loading");
    Pool.Core("project", "delete", FormToData(), function () {
        $("#submit-result").attr("class", "good");
        window.location = "index.html";
    });
}

function Update() {
    $("#submit-result").attr("class", "loading").html("");
    Pool.Core("project", "update", FormToData(), function () {
        $("#submit-result").attr("class", "good");
        location.reload();
    });
}

function FormToData() {

    var Project = {
        ID: Current_ID,
        Name: $("#input-name > input").val(),
        Start: $("#input-start > input").val(),
        End: $("#input-end > input").val(),
        Templatable: $("#input-templatable > select").val(),
        Tasks: []
    }

    $("#canvas-tasks > table > tbody > tr").each(function () {

        var Task = {
            Name: $(this).children("td:nth-child(1)").html(),
            Start: parseInt($(this).children("td:nth-child(2)").attr("data-start")),
            End: parseInt($(this).children("td:nth-child(2)").attr("data-end")),
            Index: $(this).index(),
            Users: JSON.parse($(this).children("td:nth-child(3)").attr("data-users")),
            Attachments: JSON.parse($(this).children("td:nth-child(4)").attr("data-attachments")),
        }

        Project.Tasks.push(Task);

    })

    return Project;

}

function DataToForm(data) {

    $("#input-name > input").val(data.Name);
    $("#input-start > input").val(data.Start.substring(0, data.Start.indexOf("T")));
    $("#input-end > input").val(data.End.substring(0, data.End.indexOf("T"))).trigger("change");
    $("#input-templatable > select").val(data.Templatable.toString());

    data.Tasks.sort(function (a, b) { return a.Index - b.Index; });

    for (var i = 0; i < data.Tasks.length; i++) {

        var T = data.Tasks[i];

        var TR = document.createElement("tr");

        var TDName = document.createElement("td");
        var TDUsers = document.createElement("td");
        var TDAttachments = document.createElement("td");
        var TDTimespan = document.createElement("td");
        var TDDelete = document.createElement("td");

        $(TDName).html(T.Name);

        for (var j = 0; j < T.Users.length; j++) {
            T.Users[j].AspNetUser = [];
            T.Users[j].Tasks = [];
            T.Users[j].Role = [];
            $(TDUsers).append("<span></span>");
        }
        $(TDUsers).attr("data-users", JSON.stringify(T.Users));

        for (var j = 0; j < T.Attachments.length; j++) {
            $(TDAttachments).append("<span></span>");
        }
        $(TDAttachments).attr("data-attachments", JSON.stringify(T.Attachments));

        $(TDTimespan).attr("data-start", T.Start).attr("data-end", T.End);
        $(TDTimespan).html("<span></span>");
        $(TDTimespan).children("span").css("width", Math.floor((T.End + 1 - T.Start) / Current_Span * 100) + "%");
        $(TDTimespan).children("span").css("margin-left", T.Start / Current_Span * 100 + "%");

        $(TDDelete).on("click", function () {
            $(this).parent().remove();
        })

        $(TR).append(TDName).append(TDTimespan).append(TDUsers).append(TDAttachments).append(TDDelete);

        $("#canvas-tasks > table > tbody").append(TR);

    }

    Bind_TD_Name();
    Bind_TD_Start_End();
    Bind_TD_Users();
    Bind_TD_Attachments();
    Bind_TD_Create();

}