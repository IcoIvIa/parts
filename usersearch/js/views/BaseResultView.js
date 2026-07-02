"use strict";

export default class BaseResultView {

    constructor(resultArea){
        this.resultArea = resultArea;
    }

        render(items) {
        this.resultArea.innerHTML = "";
        this.appendItems(items);
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