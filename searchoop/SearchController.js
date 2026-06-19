"use strict";
import { apikey } from "../config.js"
import BooksApi from "./BooksApi.js";
import SuggestionView from "./SuggestionView.js";

class SearchController {
    constructor(apikey) {
        this.booksApi = new BooksApi(apikey);
        this.searchButton = document.getElementById("searchButton");
        this.searchInput = document.getElementById("searchInput");
        this.suggestionArea = document.getElementById("suggestions");
        this.suggestionView = new SuggestionView(this.booksApi, this.suggestionArea);
    }

    init() {
        this.searchButton.addEventListener("click", () => {
            if (!this.searchInput.value) return;
            this.search();
        });

        this.searchInput.addEventListener("input", () => {
            const query = this.searchInput.value.trim();
            this.suggestionView.view(query);
        });
    }

    async search() {
        const query = this.searchInput.value.trim();
        if (!query) return;
        console.log(query)
        const books = await this.booksApi.search(query)
        console.log(books);
    }
}

// 実行
const controller = new SearchController(apikey);
controller.init();
