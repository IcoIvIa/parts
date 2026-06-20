"use strict";
 
export default class BaseResultView {
 
    constructor(resultArea, trigger) {
        this.resultArea = resultArea;
        this.trigger = trigger;
    }
 
    render(items) {
        this.resultArea.innerHTML = "";
        this.appendItems(items);
        this.trigger.reset();
    }
 
    appendItems(items) {
        items.forEach(item => {
            const li = this.createListItem(item);
            this.resultArea.appendChild(li);
        });
    }

    createListItem(item) {
        throw new Error("createListItem はサブクラスで実装してください");
    }
}