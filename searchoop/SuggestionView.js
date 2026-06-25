"use strict";

// ファイルを増やさないために、サジェスト表示は検索カテゴリー別にクラスを分けないようにしました。本とゲームのサジェスト表示のロジックがあります。

export default class SuggestionView {

    constructor(booksApi, gamesApi, suggestionArea, onRendered, onSuggestionSelected) {
        this.booksApi = booksApi;
        this.gamesApi = gamesApi;
        this.suggestionArea = suggestionArea;
        this.onRendered = onRendered;
        this.onSuggestionSelected = onSuggestionSelected;
        this.maxSuggestionResults = 2;
        this.debounceTime = 1000;
        this.debounceTimer = null;
        this.currentQuery = null;

    }

    view(query, selectedField, searchCategory) {
        clearTimeout(this.debounceTimer);

        if (!query) {
            this.suggestionArea.innerHTML = "";
            return;
        }

        this.debounceTimer = setTimeout(async () => {

            this.currentQuery = query;
            let items = ""

            if (searchCategory === "book") {
                items = await this.booksApi.fetchBooks(selectedField, query);
                if (!items) return;
            } else if (searchCategory === "game") {
                items = await this.gamesApi.fetchGames(query);
            }
            // console.log(items);

            if (query !== this.currentQuery) return;

            const suggestionResults = items.slice(0, this.maxSuggestionResults);

            this.renderList(suggestionResults, searchCategory);
            this.onRendered(suggestionResults);

        }, this.debounceTime);
    }

    renderList(items, searchCategory) {
        this.suggestionArea.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");

            if (searchCategory === "book") {
                li.textContent = item.volumeInfo.title;
                li.addEventListener("click", () => {
                    this.onSuggestionSelected(item.volumeInfo.title);
                })
                this.suggestionArea.appendChild(li);

            } else if (searchCategory === "game") {
                li.textContent = item.title;
                li.addEventListener("click", () => {
                    this.onSuggestionSelected(item.title);
                })
                this.suggestionArea.appendChild(li);
            }

        });
    }
}