"use strict"
import {} from "./jquery-4.0.0.min.js"
import { NotifyMessage, InputField } from "./components.js"
import { notifySend } from "./controllers.js"


window.customElements.define('input-field', InputField)
window.customElements.define('notify-message', NotifyMessage)


$("form").submit(function (e) {
    const btn = $(this).find('button[type=submit]')
    const form = $(this)

    $.ajax({
            url: '/auth/token',
            method: $(this).attr('method'),
            data: $(this).serialize() + '&grant_type=password',
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa("myapp" + ":" + "mysecret"))
                btn.prop('disabled', true);
            },
            success: function(data) {
                localStorage.setItem("at", data['access_token'])
                notifySend("success")
            },
            error: function(data){
                switch(data["status"]) {
                    case 401:
                        notifySend("error", "Неверный логин или пароль")
                        break
                    default:
                        notifySend("error", "Ошибка при подключении к серверу")
                }
            },
            complete: function() {
                form.find("input").val("")
                setTimeout(() => btn.prop('disabled', false), 5000);
            }
    });
    return false;
});


$("#test").on("click", () => {
    $.ajax({
            url: 'http://localhost:8080/rest/entities/User',
            method: "get",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("at")
            },
            success: function(data){
                console.log(data["_entityName"])
                console.log(data)
            },
            error: function(data){
                console.log(1)
                console.log(data)
            }
        });
});