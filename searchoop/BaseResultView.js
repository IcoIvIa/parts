"use strict";

export default class BaseResultView {

    constructor(resultArea, loadMoreTrigger, onResultSelected) {
        this.resultArea = resultArea;
        this.loadMoreTrigger = loadMoreTrigger;
        this.onResultSelected = onResultSelected;
    }

    render(items) {
        this.resultArea.innerHTML = "";
        this.appendItems(items);
        this.loadMoreTrigger.reset();
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