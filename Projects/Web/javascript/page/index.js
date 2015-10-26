var Page = 0;
var Tasks;
var Attachments;

$(document).ready(
    function () {
        Auth.Test();
        Nav.Render.Begin().Render.Type().Render.Profile();
        Initialization();
    }
)

function Initialization() {

    var _Kick = 0;
    function Kick() {
        _Kick++;
        if (_Kick >= 2) {
            Nav.Fade.In();
            Roll.Active();
        }
    }

    Pool.Core("attachment", "multiple", { Task: { Users: [{ ID: (Auth.Current.User()).ID }] }, Status: 2 }, function (data) {
        Attachments = data;
        Draw_Select();
        Reorder_Select();
        Bind_Uploaded_Attachments_Select();
        Kick();
    })

    Pool.Core("task", "multiple", { Users: [{ ID: (Auth.Current.User()).ID }], Status: 1 }, function (data) {
        Tasks = data;
        Reorder_Incomplete_Tasks();
        Draw_List_Incomplete_Tasks();
        Bind_Task_Panel();
        Kick();
    })

}

function Reorder_Incomplete_Tasks() {

    var DNow = new Date();
    var UTCNow = Date.UTC(DNow.getFullYear(), DNow.getMonth(), DNow.getDate(), 0, 0, 0);

    for (var i = 0; i < Tasks.length; i++) {

        var DProjectStart = Tasks[i].Project.Start.substring(0, Tasks[i].Project.Start.indexOf("T")).split("-");
        var UTCStart = Date.UTC(parseInt(DProjectStart[0]), parseInt(DProjectStart[1]) - 1, parseInt(DProjectStart[2]), 0, 0, 0) + Tasks[i].Start * 24 * 60 * 60 * 1000;
        var UTCEnd = Date.UTC(parseInt(DProjectStart[0]), parseInt(DProjectStart[1]) - 1, parseInt(DProjectStart[2]), 0, 0, 0) + Tasks[i].End * 24 * 60 * 60 * 1000;

        Tasks[i].Gap = Math.ceil(UTCEnd / 24 / 60 / 60 / 1000 - UTCNow / 24 / 60 / 60 / 1000);

        Tasks[i].StartDate = new Date(UTCStart);
        Tasks[i].EndDate = new Date(UTCEnd);

    }

    Tasks.sort(function (a, b) {
        return a.Gap - b.Gap;
    })

}

function Draw_Select() {

    // Fill in the Selects
    for (var i = 0; i < Attachments.length; i++) {

        // Current Attachment's Task is not in the list
        if ($("#input-task > select > option[value='" + Attachments[i].TaskID + "']").length <= 0) {
            var TO = document.createElement("option");
            $(TO).val(Attachments[i].TaskID).text(Attachments[i].Task.Name).attr("data-project-id", Attachments[i].Task.ProjectID).appendTo("#input-task > select");
        }

        if ($("#input-project > select > option[value='" + Attachments[i].Task.ProjectID + "']").length <= 0) {
            var PO = document.createElement("option");
            $(PO).val(Attachments[i].Task.ProjectID).text(Attachments[i].Task.Project.Name).appendTo("#input-project > select");
        }
    }
}

function Reorder_Select() {

    var TL = $("#input-task > select > option").length + 1;
    for (i = 2; i < TL; i++) {
        for (j = i + 1; j < TL; j++) {
            console.log($("#input-task > select > option:nth-child(" + i + ")").text() + " - " + $("#input-task > select > option:nth-child(" + j + ")").text() + " - " + ($("#input-task > select > option:nth-child(" + i + ")").text()).localeCompare($("#input-task > select > option:nth-child(" + j + ")").text()));
            if (($("#input-task > select > option:nth-child(" + i + ")").text()).localeCompare($("#input-task > select > option:nth-child(" + j + ")").text()) > 0) {
                $("#input-task > select > option:nth-child(" + i + ")").after($("#input-task > select > option:nth-child(" + j + ")"));
                $("#input-task > select > option:nth-child(" + j + ")").after($("#input-task > select > option:nth-child(" + i + ")"));
            }
        }
    }

    var PL = $("#input-project > select > option").length + 1;
    for (i = 1; i < PL; i++) {
        for (j = i + 1; j < PL; j++) {
            console.log($("#input-project > select > option:nth-child(" + i + ")").text() + " - " + $("#input-project > select > option:nth-child(" + j + ")").text() + " - " + ($("#input-project > select > option:nth-child(" + i + ")").text()).localeCompare($("#input-project > select > option:nth-child(" + j + ")").text()));
            if (($("#input-project > select > option:nth-child(" + i + ")").text()).localeCompare($("#input-project > select > option:nth-child(" + j + ")").text()) > 0) {
                $("#input-project > select > option:nth-child(" + i + ")").after($("#input-project > select > option:nth-child(" + j + ")"));
                $("#input-project > select > option:nth-child(" + j + ")").after($("#input-project > select > option:nth-child(" + i + ")"));
            }
        }
    }
}

function Bind_Uploaded_Attachments_Select() {

    $("#input-task > select").on("change", function () {
        Draw_Attachments();
    });

    $("#input-project > select").on("change", function () {
        $("#input-task > select").val("");
        var P = $("#input-project > select").val();
        var T = $("#input-task > select").val();
        $("#input-task > select > option:not([data-project-id*='" + P + "'])").prop("disabled", true);
        $("#input-task > select > option[data-project-id*='" + P + "'], #input-task > select > option[value='']").prop("disabled", false);
        Draw_Attachments();
    }).trigger("change");

    function Draw_Attachments() {

        $("#list-uploaded-attachments").html("");
        var P = $("#input-project > select").val();
        var T = $("#input-task > select").val();

        for (var i = 0; i < Attachments.length; i++) {
            if ((Attachments[i].TaskID == T || T == "") && (Attachments[i].Task.ProjectID == P)) {
                var D = document.createElement("div");
                $(D).html("<div></div><a></a>").addClass("attachment");
                $(D).children("a").attr("href", Pool.Storage(Attachments[i].ID, Attachments[i].Extension)).html(Attachments[i].Name);
                $(D).attr("data-id", Attachments[i].ID).attr("data-extension", Attachments[i].Extension).attr("data-status", Attachments[i].Status);
                $(D).attr("data-task-id", Attachments[i].TaskID).attr("data-project-id", Attachments[i].Task.ProjectID);
                $("#list-uploaded-attachments").append(D);
            }
        }

        $("#list-uploaded-attachments > div > div").on("click", function () {
            $(this).parent().children("a")[0].click();
        })
    }

}

function Draw_List_Incomplete_Tasks() {

    $("#list-incomplete-tasks > div").html("").attr("class", "");

    var DNow = new Date();
    var UTCNow = Date.UTC(DNow.getFullYear(), DNow.getMonth(), DNow.getDate(), 0, 0, 0);

    var p = Page * 18;

    while (p < Tasks.length && p < (Page + 1) * 18) {

        var D = $("#list-incomplete-tasks > div:nth-child(" + (p % 18 + 1) + ")");
        $(D).html("<h3></h3><h1></h1><h2></h2>");
        $(D).children("h1").html(Tasks[p].Name);
        $(D).children("h2").html(Tasks[p].Project.Name);

        //$(D).children("footer").append(Tasks[p].Gap);

        if (Tasks[p].Gap <= 0) {
            $(D).addClass("expired");
            $(D).children("h3").html("Expired");
        }
        else if (Tasks[p].Gap > 0 && Tasks[p].Gap <= 3) {
            $(D).addClass("close");
            $(D).children("h3").html(Tasks[p].Gap + " Days left");
        }
        else {
            $(D).addClass("normal");
            $(D).children("h3").html(Tasks[p].Gap + " Days left");
        }

        $(D).attr("data-id", Tasks[p].ID);

        $(D).attr("data-start-date", Tasks[p].StartDate.toUTCyyyyMMdd());
        $(D).attr("data-end-date", Tasks[p].EndDate.toUTCyyyyMMdd());
        $(D).attr("data-attachments", JSON.stringify(Tasks[p].Attachments));

        p++;

    }

    if (Page > 0) {
        $("#prev").css("opacity", 1).off().on("click", function () {
            Page--;
            Draw();
        })
    } else {
        $("#prev").css("opacity", 0).off();
    }

    if (Page < Tasks.length / 18 - 1) {
        $("#next").css("opacity", 1).off().on("click", function () {
            Page++;
            Draw();
        })
    } else {
        $("#next").css("opacity", 0).off();
    }

}

function Bind_Task_Panel() {

    $("#list-incomplete-tasks > div[data-id]").off().on("click", function () {

        var Current_Task_Div = this;

        $("#panel-task").addClass("open");

        $("#panel-task > #panel-task-name").html($(this).children("h1").html());
        $("#panel-task > #panel-task-project").html($(this).children("h2").html());
        $("#panel-task > #panel-task-status").html($(this).children("h3").html()).attr("class", $(this).attr("class")).append("<span>" + $(this).attr("data-end-date") + "</span>");

        // Attachment start
        $("#panel-task > #panel-task-attachments-list").html("");
        var AL = JSON.parse($(this).attr("data-attachments"));
        var UploadedCount = 0;

        for (var i = 0; i < AL.length; i++) {
            var D = document.createElement("div");

            $(D).html("<div></div><a></a>").addClass("attachment");

            if (AL[i].Status == 2) {
                $(D).children("a").attr("href", Pool.Storage(AL[i].ID, AL[i].Extension)).html(AL[i].Name);
                UploadedCount++;
            } else {
                $(D).children("a").html(AL[i].Name);
            }

            $(D).attr("data-id", AL[i].ID).attr("data-extension", AL[i].Extension).attr("data-status", AL[i].Status);
            $("#panel-task > #panel-task-attachments-list").append(D);
        }

        $("#panel-task > #panel-task-attachments").html(AL.length + " Attachments <span>" + UploadedCount + " uploaded</span>");

        $("#panel-task > #panel-task-attachments-list > div > div").on("click", function () {

            var D = this;

            // After file selected
            $("#panel-task > #panel-task-attachments-file > input").off().on("change", function () {

                $(D).addClass("loading");

                var FD = new FormData($("#panel-task-attachments-file")[0]);

                FD.append("ID", $(D).parent().attr("data-id"));

                Pool.File("attachment", "upload", FD, function (data) {
                    location.reload();
                    $(D).removeClass("loading");
                })

            })

            $("#panel-task > #panel-task-attachments-file > input").click();

        })
        // Attachment end

        // Completed button click
        if (UploadedCount >= AL.length) {
            $("#panel-task-complete").prop("disabled", false).val("Set this Task as completed");
            $("#panel-task-complete").off().on("click", function () {
                Pool.Core("task", "complete", { ID: $(Current_Task_Div).attr("data-id") }, function (data) {
                    location.reload();
                })
            })
        } else {
            $("#panel-task-complete").prop("disabled", true).val("*Upload all the Attachments to complete the Task").off();
        }

        $("body").on("click", function (e) {
            e.stopPropagation();
            if (!$(e.target).is("#list-incomplete-tasks, #list-incomplete-tasks *, #panel-task, #panel-task *")) {
                $("#panel-task").removeClass("open");
                $("body").off();
            }
        })

    })

}