var Window_Width;
var Current_Article_Index = 0;
var Article_Sum;

var Roll = (function () {

    var _body = {};

    function go() {
        $("body > main").css("margin-left", 0 - Current_Article_Index * Window_Width);
        $("body > footer div").removeClass("active");
        $("body > footer td:nth-child(" + (Current_Article_Index + 1) + ") div").addClass("active");
    }

    _body.Active = function () {

        $("body > footer").html("").append("<table><tbody><tr></tr></tbody></table>");
        Window_Width = $(window).width();
        Article_Sum = $("body > main > article:visible").length;

        for (var i = 0; i < Article_Sum; i++) {
            $("body > footer tbody tr").append("<td><div></div></td>");
        }

        $("body > main > article:visible").each(function (index) {
            $(this).width(Window_Width);
            $(this).css("left", index * Window_Width);
        })

        $("body > footer td:first-child div").addClass("active");

        $("body > main, body").off();

        $("body > main").bind("mousewheel", function (e) {

            if (e.originalEvent.wheelDelta > 0) {
                if (Current_Article_Index > 0) {
                    Current_Article_Index--;
                }
            } else {
                if (Current_Article_Index < Article_Sum - 1) {
                    Current_Article_Index++;
                }
            }
            go();
        })

        $("body").keydown(function (e) {
            if (e.keyCode == 37 && Current_Article_Index > 0) { // left
                Current_Article_Index--;
            }
            else if (e.keyCode == 39 && Current_Article_Index < Article_Sum - 1) { // right
                Current_Article_Index++;
            }
            go();
        });

        $("body > footer td").on("click", function () {
            Current_Article_Index = $(this).index();
            go();
        })
    };

    _body.Jump = function (index) {
        if (index >= 0 && index < Article_Sum) {
            Current_Article_Index = index;
            go();
        }
    }

    return _body;
}());