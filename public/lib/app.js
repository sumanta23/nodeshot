var socketprotocol = window.location.protocol === "https:" ? "wss" : "ws";
var socketPath = socketprotocol + '://' + window.location.host;

function showUpdate(data, event) {
    event = !!event? event: "info";
    toastr[event](data);

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    /*$.notify(data, {
        className: event || 'info',
        style: 'bootstrap',
        showAnimation: 'slideDown',
        showDuration: 400,
        hideAnimation: 'slideUp',
        hideDuration: 200,
        gap: 2
    }); */
};

var ws;
if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
}

var connect = function () {
    var ws = new WebSocket(socketPath);
    //debugger;
    ws.onclose = function (e) {
        console.log('Server is closed');
        setTimeout(connect, 1000);
    };
    // If there is an error while sending or receving data
    ws.onerror = function (e) {
        //console.log("Error : ", e);
        setTimeout(function () {
            ws = new WebSocket(socketPath);
        }, 2000);
    };

    ws.onmessage = function (event) {
        var msg = JSON.parse(event.data);
        console.log(msg);
        handleEvent(msg);
        //showUpdate(msg.data, msg.event);
    };
};
connect();

//{event:"start", data:{}}
function sendEvent(msg) {
    var state = ws.readyState;
    if (state === 1) {
        item = JSON.stringify(msg);
        console.log(item);
        ws.send(item);
    } else {
        console.error('No web socket connection: failed to send: ', msg);
    }
}

//sendEvent({event: "start",data:"tring to connect"});

function handleEvent(eventData) {
    var eventType = eventData.event;
    switch (eventType) {
        case "userId": clientId = eventData.msg.data;
            break;
        case "update": showUpdate(eventData.msg.data, eventData.msg.type);
            break;
        default:
            console.error("eventType", eventType);
    }

};
