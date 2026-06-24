"use strict";
import { apikey } from "../config.js"
import BooksApi from "./BooksApi.js";
import SuggestionView from "./SuggestionView.js";
import BookResultView from "./BookResultView.js";
import BookDetailsView from "./BookDetailsView.js";
import ButtonTrigger from "./ButtonTrigger.js";

class SearchController {
    constructor(apikey) {
        this.booksApi = new BooksApi(apikey);
        this.searchButton = document.getElementById("searchButton");
        this.searchInput = document.getElementById("searchInput");
        this.suggestionArea = document.getElementById("suggestions");
        this.searchResultArea = document.getElementById("searchResultView");
        this.loadMoreButton = document.getElementById("loadMoreButton");
        this.searchResultDetails = document.getElementById("searchResultDetails");
        this.dataSelectedfield = document.querySelectorAll('[data-selectedfield]');

        this.suggestionView = new SuggestionView(
            this.booksApi,
            this.suggestionArea,
            (suggestionItems) => this.setState({ suggestions: suggestionItems }),
            // function (suggestionItems) {
            // return this.setState({ suggestions: suggestionItems });
            // }　の短縮系
            // onSuggestionSelected: クリックされた候補のタイトル(文字列)を受け取る
            (selectedTitle) => {
                this.searchInput.value = selectedTitle;
                this.handleSearch();
            }
        );

        this.detailsView = new BookDetailsView(this.searchResultDetails);

        const loadMoreTrigger = new ButtonTrigger(this.loadMoreButton, () => this.loadMore());
        this.searchResultView = new BookResultView(
            this.searchResultArea,
            loadMoreTrigger,
            // onResultSelected: クリックされた検索結果の項目(本のデータ全体)を受け取る
            (selectedItem) => this.detailsView.render(selectedItem)
        );

        this.state = {
            query: "",
            results: [],
            suggestions: [],
            page: 0,
            isLoading: false,
            requestId: 0,
            selectedField: "",
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
            this.handleSearch();
        });

        this.searchInput.addEventListener("input", () => {
            const query = this.searchInput.value.trim();
            const selectedField = this.state.selectedField;
            this.suggestionView.view(query , selectedField);
        });

        this.dataSelectedfield.forEach(radio => {
            radio.addEventListener('change', (e)=> {
                const selected = e.target.dataset.selectedfield;
                this.state.selectedField = selected;

                // fordebug
                // console.log(selected);
                // console.log(`これはクラス内のステートです上記と一致${this.state.selectedField}`)
            })
        });

    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        const requestId = ++this.state.requestId;
        const books = await this.booksApi.fetchBooks(this.state.selectedField, query);

        if (requestId !== this.state.requestId) return;

        this.setState({ query, results: books, page: 0 });
    }

    async loadMore() {
        if (this.state.isLoading) return;
        if (!this.state.query) return;

        this.setState({ isLoading: true });

        const nextPage = this.state.page + 1;
        const startIndex = nextPage * this.booksApi.itemsPerPage;
        const newBooks = await this.booksApi.fetchBooks(this.state.selectedField, this.state.query, startIndex);

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