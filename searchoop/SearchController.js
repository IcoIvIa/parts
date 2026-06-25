"use strict";
import { apikey } from "../config.js"
import BooksApi from "./BooksApi.js";
import GamesApi from "./GamesApi.js";
import SuggestionView from "./SuggestionView.js";
import BookResultView from "./BookResultView.js";
import GameResultView from "./GameResultView.js";
import BookDetailsView from "./BookDetailsView.js";
import GameDetailsView from "./GameDetailsView.js";
import ButtonTrigger from "./ButtonTrigger.js";
import CategorySelector from "./CategorySelector.js";

class SearchController {
    constructor(apikey) {
        this.booksApi = new BooksApi(apikey);
        this.gamesApi = new GamesApi();
        this.searchButton = document.getElementById("searchButton");
        this.searchInput = document.getElementById("searchInput");
        this.suggestionArea = document.getElementById("suggestions");
        this.searchResultArea = document.getElementById("searchResultView");
        this.loadMoreButton = document.getElementById("loadMoreButton");
        this.searchResultDetails = document.getElementById("searchResultDetails");
        this.dataSelectedfield = document.querySelectorAll('[data-selectedfield]');
        this.categoryRadios = document.querySelectorAll('input[name="searchCategoryRadios"]');
        this.searchFieldAreas = document.querySelectorAll('[data-searchfield]');

        this.suggestionView = new SuggestionView(
            this.booksApi,
            this.gamesApi,
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

        this.detailsViewBook = new BookDetailsView(this.searchResultDetails);
        this.detailsViewGame = new GameDetailsView(this.searchResultDetails);

        const loadMoreTrigger = new ButtonTrigger(this.loadMoreButton, () => this.loadMore());

        this.searchResultViewBooks = new BookResultView(
            this.searchResultArea,
            loadMoreTrigger,
            // onResultSelected: クリックされた検索結果の項目(本のデータ全体)を受け取る
            (selectedItem) => this.detailsViewBook.render(selectedItem)
        );
        this.searchResultViewGames = new GameResultView(
            this.searchResultArea,
            loadMoreTrigger,
            // onResultSelected: クリックされた検索結果の項目(ゲームデータ全体)を受け取る
            (selectedItem) => this.detailsViewGame.render(selectedItem)
        );


        this.categorySelector = new CategorySelector(
            this.categoryRadios,
            this.searchFieldAreas,
            (category) => this.setState({ searchCategory: category })
        );

        this.state = {
            query: "",
            results: [],
            suggestions: [],
            page: 0,
            isLoading: false,
            requestId: 0,
            searchCategory: "book",
            selectedField: "",
        };
    }





    setState(stateChanges) {
        this.state = { ...this.state, ...stateChanges };

        if (this.state.searchCategory === "book") {
            if ("results" in stateChanges) {
                this.searchResultViewBooks.render(this.state.results);
            }
            if ("newResults" in stateChanges) {
                this.searchResultViewBooks.appendItems(stateChanges.newResults);
            }
            if ("suggestions" in stateChanges) {
            }
        } else if (this.state.searchCategory === "game") {
            if ("results" in stateChanges) {
                this.searchResultViewGames.render(this.state.results);
            }
            if ("newResults" in stateChanges) {
                this.searchResultViewGames.appendItems(stateChanges.newResults);
            }
            if ("suggestions" in stateChanges) {
            }
        }


    }

    init() {
        this.searchButton.addEventListener("click", () => {
            this.handleSearch();
        });

        this.searchInput.addEventListener("input", () => {
            const query = this.searchInput.value.trim();
            const selectedField = this.state.selectedField;
            const searchCategory = this.state.searchCategory;
            this.suggestionView.view(query, selectedField, searchCategory);
        });

        this.dataSelectedfield.forEach(radio => {
            radio.addEventListener('change', (e) => {
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

        if (this.state.searchCategory === "book") {
            const books = await this.booksApi.fetchBooks(this.state.selectedField, query);
            if (requestId !== this.state.requestId) return;
            this.setState({ query, results: books, page: 0 });
        }

        else if (this.state.searchCategory === "game") {
            const games = await this.gamesApi.fetchGames(query);
            this.setState({ query, results: games });

            // fordebug
            // console.log(games);
        }

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