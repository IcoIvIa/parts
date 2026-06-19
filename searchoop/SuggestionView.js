"use strict";

export default class SuggestionView {

    constructor(booksApi, suggestionArea) {
        this.booksApi = booksApi;
        this.suggestionArea = suggestionArea;
        this.maxSuggestionResults = 2;
        this.debounceTime = 1000;
        this.debounceTimer = null;
    }

    view(query) {
        clearTimeout(this.debounceTimer);

        if (!query) {
            this.suggestionArea.innerHTML = "";
            return;
        }

        this.debounceTimer = setTimeout(async () => {

            const items = await this.booksApi.search(query);
            if (!items) return;
            // console.log(items);

            const suggestionResults = items.slice(0, this.maxSuggestionResults);

            this.renderList(suggestionResults);
            
        }, this.debounceTime);
    }

    renderList(items){
    this.suggestionArea.innerHTML = "";
            items.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item.volumeInfo.title;
                this.suggestionArea.appendChild(li);
            });
        }
}