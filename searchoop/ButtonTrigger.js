"use strict";

export default class ButtonTrigger {

    constructor(button, onTrigger) {
        this.button = button;
        this.onTrigger = onTrigger;

        this.button.addEventListener("click", () => {
            this.onTrigger();
        });
    }

    reset() {
        // 自動スクロールを実装した場合等に処理を書く。
    }
}