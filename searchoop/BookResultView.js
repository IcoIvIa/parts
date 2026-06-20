"use strict";
import BaseResultView from "./BaseResultView.js";
 
export default class BookResultView extends BaseResultView {
 
    createListItem(item) {
        const li = document.createElement("li");
        li.textContent = item.volumeInfo.title;
        return li;
    }
}
 