export class NotifyMessage extends HTMLElement {
    #elem_error = `
            <div class="notify-message flex-row font-base">
                <div><img class = "notify-message-icon" src="icons/exclamation-circle.svg"/></div>
                <div>${ (this.getAttribute("text") || "Произошла ошибка").substring(0, 35) }</div>
                <div><img class="clickable" src="icons/close.svg"></div>
            </div>
    `
    #elem_info = `
        <div class="notify-message flex-row font-base">
            <div><img class = "notify-message-icon" src="icons/info-circle.svg"/></div>
            <div>${ (this.getAttribute("text") || "Для информации").substring(0, 35) }</div>
            <div><img class="clickable" src="icons/close.svg"></div>
        </div>
    `

    #elem_success = `
            <div class="notify-message flex-row font-base">
                <div><img class = "notify-message-icon" src="icons/ok-circle.svg"/></div>
                <div>${ (this.getAttribute("text") || "Успешно выполнено").substring(0, 35) }</div>
                <div><img class="clickable" src="icons/close.svg"></div>
            </div>
        `

    constructor() {
        super()

        switch(this.getAttribute("type")) {
          case "success":
            $(this).html(this.#elem_success)
            break
          case "info":
            $(this).html(this.#elem_info)
            break
          default:
            $(this).html(this.#elem_error)
        }
    }

    static get observedAttributes() {
        return ["type", "text"]
    }

    connectedCallback() {
        var close_btn = $(this).find("img.clickable")
        var elem = $(this)

        close_btn.on("click", function() {
            elem.hide("fast")
        });
    }
}

export class InputField extends HTMLElement {
    #elem_classic = `
            <fieldset class = "field-container">
                <legend>${this.getAttribute("header")}</legend>
                <input ${ this.getAttribute("required") != null ? "required" : false } placeholder="${ this.getAttribute('example') || 'user1' }" name="${ this.getAttribute('name') }" autocomplete="on"/>
            </fieldset>
        `

    #elem_secret = `
            <fieldset class = "field-container">
                <legend>${this.getAttribute("header")}</legend>
                <input ${ this.getAttribute("required") != null ? "required" : false } placeholder="${ this.getAttribute('example') || '***' }" type = "password" name="${ this.getAttribute('name') }" autocomplete="on"/>
                <img class = "clickable" src="icons/eyeInvisible.svg" alt="Отобразить ввод" title="Отобразить ввод">
            </fieldset>
        `

    constructor() {
        super()

        if (this.getAttribute("secret") !== null) {
            $(this).html(this.#elem_secret)
        }
        else {
            $(this).html(this.#elem_classic)
        }
    }

    static get observedAttributes() {
        return ["required", "header", "example", "name","secret"]
    }

    connectedCallback() {

        const input_field = $(this).find("input")
        const eye_btn = $(this).find("img")

        eye_btn.on("click", function() {
            if (input_field.attr("type") == "password") {
                eye_btn.attr("src", "icons/eyeVisible.svg")
                input_field.attr("type", "text")
            }
            else {
                eye_btn.attr("src", "icons/eyeInvisible.svg")
                input_field.attr("type", "password")
            }
        });
    }

}