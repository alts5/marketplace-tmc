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