"use strict";
import { apikey } from "../config.js";
import BookSearchStrategy from "./strategies/BookSearchStrategy.js";
import GameSearchStrategy from "./strategies/GameSearchStrategy.js";
import BooksApi from "./api/BooksApi.js";
import GamesApi from "./api/GamesApi.js";
import SuggestionView from "./ui/SuggestionView.js";
import BookResultView from "./views/BookResultView.js";
import GameResultView from "./views/GameResultView.js";
import BookDetailsView from "./views/BookDetailsView.js";
import GameDetailsView from "./views/GameDetailsView.js";
import ButtonTrigger from "./ui/ButtonTrigger.js";
import CategorySelector from "./ui/CategorySelector.js";

/**
 * 検索画面全体の制御を行うコントローラー。
 *
 * 検索カテゴリ（book/game）に応じて currentCategory を切り替え、
 * 検索・もっと見る・結果表示の処理を、カテゴリの違いを意識せず
 * 同じ呼び方（strategy.search / resultView.render 等）で扱えるようにしている。
 *
 * 【処理の流れ（概略）】
 *   ユーザー操作
 *     ├─ カテゴリ切替    → setState({searchCategory}) → updateCurrentCategory → currentCategory 更新
 *     ├─ 検索ボタン押下  → handleSearch → currentCategory.strategy.search → setState({results})
 *     │                                                                        → updateResults → resultView.render
 *     ├─ もっと見る押下  → loadMore     → currentCategory.strategy.loadMore → setState({results, newResults})
 *     │                                                                        → updateResults → resultView.appendItems
 *     └─ 結果クリック    → resultView の onResultSelected → detailsView.render（フォーム反映も内部で実施）
 *
 * @class
 */
class SearchController {
    // ーーーーーーーーーーーーーーーコンストラクターーーーーーーーーーーーーーーーーーーーーーーーー
    constructor(apikey) {
        this.booksApi = new BooksApi(apikey);
        this.gamesApi = new GamesApi();

        this.searchButton = document.getElementById("searchButton");
        this.searchInput = document.getElementById("searchInput");
        this.suggestionArea = document.getElementById("suggestions");
        this.searchResultArea = document.getElementById("searchResultView");
        this.loadMoreButton = document.getElementById("loadMoreButton");
        this.searchResultDetails = document.getElementById("searchResultDetails");

        this.dataSelectedfield = document.querySelectorAll("[data-selectedfield]");
        this.categoryRadios = document.querySelectorAll('input[name="searchCategoryRadios"]');
        this.searchFieldAreas = document.querySelectorAll("[data-searchfield]");
        this.dataSuggestions = document.querySelectorAll("input[data-suggestion]");

        this.suggestionView = new SuggestionView(
            this.booksApi,
            this.gamesApi,
            this.suggestionArea,
            // onRendered: サジェスト一覧が描画された後に呼ばれる
            (suggestionItems) => this.setState({ suggestions: suggestionItems }),
            // onSuggestionSelected: クリックされた候補のタイトル(文字列)を受け取る
            (selectedTitle) => {
                this.searchInput.value = selectedTitle;
                this.handleSearch();
            }
        );

        const loadMoreTrigger = new ButtonTrigger(
            this.loadMoreButton,
            () => this.loadMore()
        );

        this.bookDetailsView = new BookDetailsView(this.searchResultDetails, this.dataSuggestions);
        this.gameDetailsView = new GameDetailsView(this.searchResultDetails, this.dataSuggestions);

        this.bookResultView = new BookResultView(
            this.searchResultArea,
            loadMoreTrigger,
            // onResultSelected: クリックされた検索結果の項目(本のデータ全体)を受け取る
            (selectedItem) => this.bookDetailsView.render(selectedItem)
        );

        this.gameResultView = new GameResultView(
            this.searchResultArea,
            loadMoreTrigger,
            // onResultSelected: クリックされた検索結果の項目(ゲームのデータ)を受け取る
            (selectedItem) => this.gameDetailsView.render(selectedItem)
        );

        this.bookStrategy = new BookSearchStrategy(this.booksApi);
        this.gameStrategy = new GameSearchStrategy(this.gamesApi);

        /**
         * カテゴリごとに「検索ロジック(strategy)」と「表示View」をひとまとめにした辞書。
         * setStateやhandleSearchは、この辞書から該当カテゴリの一式を取り出すだけで済む。
         * @type {Object<string, {strategy: Object, resultView: Object, detailsView: Object}>}
         */
        this.categories = {
            book: {
                strategy: this.bookStrategy,
                resultView: this.bookResultView,
                detailsView: this.bookDetailsView,
            },
            game: {
                strategy: this.gameStrategy,
                resultView: this.gameResultView,
                detailsView: this.gameDetailsView,
            },
        };

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

        // state の初期値(searchCategory: "book")に合わせて、currentCategory も初期化する
        this.currentCategory = this.categories[this.state.searchCategory];
    }
    // ーーーーーーーーーーーーーーーコンストラクターーーーーーーーーーーーーーーーーーーーーーーーー

    // ーーーーーーーーーーーーーーー状態管理ーーーーーーーーーーーーーーーーーーーーーーーーー
    /**
     * 状態を更新し、変更内容に応じて各種更新処理を呼び出す。
     * @param {Object} stateChanges - 更新したい状態の差分
     */
    setState(stateChanges) {
        this.state = { ...this.state, ...stateChanges };

        this.updateCurrentCategory(stateChanges);
        this.updateResults(stateChanges);
        this.updateSuggestions(stateChanges);
    }

    /**
     * stateChanges に searchCategory の変更が含まれていれば、
     * currentCategory（strategy・resultView・detailsView の組）を切り替える。
     *
     * カテゴリが増えてもこのメソッド自体は変更不要にするため、
     * switch文ではなく辞書ルックアップ(this.categories)で実装している。
     *
     * @param {Object} stateChanges - setStateに渡された変更差分
     */
    updateCurrentCategory(stateChanges) {
        if (!("searchCategory" in stateChanges)) return;

        // 以下のswitch文と同じ動き（book/gameどちらが来てもcurrentCategoryに該当する組を入れる）
        // switch (stateChanges.searchCategory) {
        //     case "book":
        //         this.currentCategory = this.categories.book;
        //         break;
        //     case "game":
        //         this.currentCategory = this.categories.game;
        //         break;
        // }
        this.currentCategory = this.categories[stateChanges.searchCategory];
    }
    // ーーーーーーーーーーーーーーー状態管理ーーーーーーーーーーーーーーーーーーーーーーーーー

    // ーーーーーーーーーーーーーーー描画処理ーーーーーーーーーーーーーーーーーーーーーーーーー
    /**
     * 検索結果一覧の再描画・追加描画を行う。
     * @param {Object} stateChanges - setStateに渡された変更差分
     */
    updateResults(stateChanges) {
        if ("results" in stateChanges) {
            this.currentCategory.resultView.render(this.state.results);
        }
        if ("newResults" in stateChanges) {
            this.currentCategory.resultView.appendItems(stateChanges.newResults);
        }
    }

    /**
     * サジェスト更新時の処理（現状は特になし）。
     * @param {Object} stateChanges - setStateに渡された変更差分
     */
    updateSuggestions(stateChanges) {
        if (!("suggestions" in stateChanges)) return;
        // サジェスト更新時の処理
    }
    // ーーーーーーーーーーーーーーー描画処理ーーーーーーーーーーーーーーーーーーーーーーーーー

    // ーーーーーーーーーーーーーーー初期化ーーーーーーーーーーーーーーーーーーーーーーーーー
    init() {
        // this.searchButton.addEventListener("click", () => {
        //     this.handleSearch();
        // });

        this.searchInput.addEventListener("input", () => {
            const query = this.searchInput.value.trim();
            const selectedField = this.state.selectedField;
            const searchCategory = this.state.searchCategory;

            this.suggestionView.view(query, selectedField, searchCategory);
        });

        this.dataSelectedfield.forEach((radio) => {
            radio.addEventListener("change", (e) => {
                const selected = e.target.dataset.selectedfield;
                this.state.selectedField = selected;
            });
        });
    }
    // ーーーーーーーーーーーーーーー初期化ーーーーーーーーーーーーーーーーーーーーーーーーー

    // ーーーーーーーーーーーーーーー検索処理ーーーーーーーーーーーーーーーーーーーーーーーーー
    /**
     * 検索を実行する。currentCategory.strategy に処理を委譲するため、
     * book/gameの区別をこのメソッド自身は意識しない。
     */
    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        const requestId = ++this.state.requestId;
        const results = await this.currentCategory.strategy.search(query, this.state.selectedField);

        if (requestId !== this.state.requestId) return;

        this.setState({ query, results, page: 0 });
    }

    /**
     * 「もっと見る」を実行し、追加の検索結果を取得する。
     */
    async loadMore() {
        if (this.state.isLoading) return;
        if (!this.state.query) return;

        this.setState({ isLoading: true });

        const nextPage = this.state.page + 1;
        const startIndex = nextPage * this.booksApi.itemsPerPage;
        const newResults = await this.currentCategory.strategy.loadMore(
            this.state.query,
            this.state.selectedField,
            startIndex
        );

        this.setState({
            results: [...this.state.results, ...newResults],
            newResults,
            page: nextPage,
            isLoading: false,
        });
    }
    // ーーーーーーーーーーーーーーー検索処理ーーーーーーーーーーーーーーーーーーーーーーーーー
}

// 実行
const controller = new SearchController(apikey);
controller.init();