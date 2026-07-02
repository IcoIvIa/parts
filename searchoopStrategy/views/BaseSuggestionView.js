"use strict";

/**
 * 検索入力に応じたサジェスト（候補）の表示を行うクラス。
 *
 * book/gameでクラスを分けず、このクラス内で分岐させている。
 * （サジェストは補助的な機能で、本体の検索・一覧・詳細表示と比べて
 *  ロジックが少ないため、Strategyパターンのような分離はせず、
 *  if文で済ませる）
 *
 * 【処理の流れ】
 *   入力イベント発火
 *     → view(query, selectedField, searchCategory)
 *         → デバウンス(指定時間入力が無ければ確定)
 *         → book/gameに応じてAPIを呼び分け
 *         → renderList(items, searchCategory) で <li> を描画
 *         → onRendered コールバックで呼び出し元(SearchController)に通知
 *   候補クリック時
 *     → onSuggestionSelected コールバックで呼び出し元に通知（検索実行へ繋がる）
 *
 * @class
 */
export default class BaseSuggestionView {

    /**
     * @param {BooksApi} booksApi - 本検索用のAPIクライアント
     * @param {GamesApi} gamesApi - ゲーム検索用のAPIクライアント
     * @param {HTMLElement} suggestionArea - サジェスト一覧を描画する要素
     * @param {Function} onRendered - サジェスト描画後に呼ばれるコールバック。描画結果の配列を受け取る
     * @param {Function} onSuggestionSelected - 候補クリック時に呼ばれるコールバック。選ばれたタイトル(文字列)を受け取る
     */
    constructor( suggestionArea, onRendered, onSuggestionSelected) {

        this.suggestionArea = suggestionArea;
        this.onRendered = onRendered;
        this.onSuggestionSelected = onSuggestionSelected;
        this.maxSuggestionResults = 20;
        this.debounceTime = 500;
        this.debounceTimer = null;
        this.currentQuery = null;
    }

    /**
     * 検索入力のたびに呼ばれ、一定時間入力が止まったらサジェストを取得・表示する。
     *
     * @param {string} query - 入力中の検索クエリ
     * @param {string} selectedField - 検索対象フィールド（title/author/isbn等。book検索でのみ使用）
     * @param {string} searchCategory - 現在の検索カテゴリ（"book" または "game"）
     * @returns {void}
     */
    view(query, selectedField,) {
        // 入力中に前回のタイマーが残っていればキャンセル（デバウンス）
        clearTimeout(this.debounceTimer);

        if (!query) {
            this.suggestionArea.innerHTML = "";
            return;
        }

        // debounceTime(ms) の間、入力が無ければ確定とみなして検索する
        this.debounceTimer = setTimeout(async () => {

            this.currentQuery = query;
            let items = "";

            // カテゴリに応じてAPIを呼び分ける
            // if (searchCategory === "book") {
            //     items = await this.booksApi.fetchBooks(selectedField, query);
            //     if (!items) return;
            // } else if (searchCategory === "game") {
            //     items = await this.gamesApi.fetchGames(query);
            // }

            // タイマー発火までの間に、さらに新しい入力があった場合は描画しない
            // （古い検索結果が後から表示されるバグを防ぐ）
            if (query !== this.currentQuery) return;

            const suggestionResults = items.slice(0, this.maxSuggestionResults);

            // this.renderList(suggestionResults, searchCategory);
            this.renderList(suggestionResults);
            this.onRendered(suggestionResults);

        }, this.debounceTime);
    }

    /**
     * サジェスト候補を <li> として描画し、クリック時の挙動を設定する。
     *
     * @param {Array<Object>} items - 表示する候補データの配列（本またはゲームのデータ）
     * @param {string} searchCategory - 現在の検索カテゴリ（"book" または "game"）
     * @returns {void}
     */

    renderList(items) {
                throw new Error("getFormValues はサブクラスで実装してください");
    }

}