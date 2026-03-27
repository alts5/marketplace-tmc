export function notifySend(type, text="") {
    $("notify-message").remove()
    $("body").append("<notify-message text='" + text + "' type='" + type + "'><notify-message>");

    $("notify-message").show("fast")
    setTimeout(() => $(".notify-message").hide("fast"), 5000);
}