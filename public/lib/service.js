var clientId = "";
function dataSubmit() {
    var url = $("#url").val();
    if (!url) {
        alert("please provide url");
        return;
    }
    $.ajax({
        url: "/img",
        type: 'post',
        data: JSON.stringify({
            url: url,
            userId: clientId,
            resolution: {
                width: screen.width,
                height: screen.height
            }
        }),
        contentType: 'application/json; charset=UTF-8'
    }).done(function (res) {
        $("#imgpos").attr("src", "/img/" + res.hash + "?userId=" + clientId);
        $("#imgpos").css("display", "");
        $("#navpos").css("display", "");
        //$("#inputpos").css("display", "none");
    });
}