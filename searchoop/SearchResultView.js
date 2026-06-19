"use strict";
 
export default class SearchResultView {
 
    constructor(searchResultArea) {
        this.searchResultArea = searchResultArea;
    }
 
    render(items) {
        this.searchResultArea.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.volumeInfo.title;
            this.searchResultArea.appendChild(li);
        });
    }
}