"use strict";
import { apikey } from "../config.js"
import BooksApi from "./BooksApi.js";
import SuggestionView from "./SuggestionView.js";
import SearchResultView from "./SearchResultView.js";

class SearchController {
    constructor(apikey) {
        this.booksApi = new BooksApi(apikey);
        this.searchButton = document.getElementById("searchButton");
        this.searchInput = document.getElementById("searchInput");
        this.suggestionArea = document.getElementById("suggestions");
        this.searchResultArea = document.getElementById("searchResultView");

        this.suggestionView = new SuggestionView(this.booksApi, this.suggestionArea);
        this.searchResultView = new SearchResultView(this.searchResultArea);

        this.state = {
            query: "",
            results: [],
            page: 0,
            isLoading: false,
            requestId: 0
        };
    }

    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.searchResultView.render(this.state.results);
    }

    init() {
        this.searchButton.addEventListener("click", () => {
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

        const requestId = ++this.state.requestId;
        console.log(query);
        const books = await this.booksApi.search(query);
        console.log(books);

        if (requestId !== this.state.requestId) return;

        this.setState({ query, results: books, page: 0 });
    }
}

// 実行
const controller = new SearchController(apikey);
controller.init();