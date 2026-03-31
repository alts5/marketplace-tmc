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
            url: '/token',
            method: $(this).attr('method'),
            data: $(this).serialize() + '&grant_type=password',
            dataType: "json",
            beforeSend: function (xhr) {
                btn.prop('disabled', true);
            },
            success: function(data) {
                notifySend("success")
                window.location.href = "/front/lk.html"
            },
            error: function(data){
                switch(data["status"]) {
                    case 401 || 400:
                        notifySend("error", "Неверный логин или пароль")
                        break
                    case 500:
                        notifySend("error", "Ошибка на стороне сервера")
                        break
                    default:
                        notifySend("error", "Ошибка при подключении к серверу")
                }
            },
            complete: function() {
                form.find("input").val("")
                setTimeout(() => btn.prop('disabled', false), 5000);
            }
    })
    return false
})

