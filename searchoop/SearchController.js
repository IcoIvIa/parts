"use strict";
import { apikey } from "../config.js"
import BooksApi from "./BooksApi.js";
import SuggestionView from "./SuggestionView.js";
import BookResultView from "./BookResultView.js";
import ButtonTrigger from "./ButtonTrigger.js";

class SearchController {
    constructor(apikey) {
        this.booksApi = new BooksApi(apikey);
        this.searchButton = document.getElementById("searchButton");
        this.searchInput = document.getElementById("searchInput");
        this.suggestionArea = document.getElementById("suggestions");
        this.searchResultArea = document.getElementById("searchResultView");
        this.loadMoreButton = document.getElementById("loadMoreButton");

        this.suggestionView = new SuggestionView(
            this.booksApi,
            this.suggestionArea,
            (results) => this.setState({ suggestions: results })
            // function (results) {
            // return this.setState({ suggestions: results });
            // }　の短縮系
        );

        const trigger = new ButtonTrigger(this.loadMoreButton, () => this.loadMore());
        this.searchResultView = new BookResultView(this.searchResultArea, trigger);

        this.state = {
            query: "",
            results: [],
            suggestions: [],
            page: 0,
            isLoading: false,
            requestId: 0
        };
    }

    setState(stateChanges) {
        this.state = { ...this.state, ...stateChanges };

        if ("results" in stateChanges) {
            this.searchResultView.render(this.state.results);
        }
        if ("newResults" in stateChanges) {
            this.searchResultView.appendItems(stateChanges.newResults);
        }
        if ("suggestions" in stateChanges) {
        }
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
        const books = await this.booksApi.search(query);

        if (requestId !== this.state.requestId) return;

        this.setState({ query, results: books, page: 0 });
    }

    async loadMore() {
        if (this.state.isLoading) return;
        if (!this.state.query) return;

        this.setState({ isLoading: true });

        const nextPage = this.state.page + 1;
        const startIndex = nextPage * this.booksApi.itemsPerPage;
        const newBooks = await this.booksApi.search(this.state.query, startIndex);

        this.setState({
            results: [...this.state.results, ...newBooks],
            newResults: newBooks,
            page: nextPage,
            isLoading: false
        });
    }
}

// 実行
const controller = new SearchController(apikey);
controller.init();