"use strict";

import BaseResultView from "./BaseResultView.js";

export default class GameResultView extends BaseResultView {

    createListItem(item) {
        const li = document.createElement("li");
        li.textContent = item.title;
        li.addEventListener("click", () => {
            this.onResultSelected(item);
        })
        return li;
    }

}