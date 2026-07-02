"use strict";

import BaseSuggestionView from "./BaseSuggestionView.js";
import BookSearchStrategy from "../strategies/BookSearchStrategy.js";

export default class BookSuggestionView extends BaseSuggestionView{

    /**
     * 検索入力のたびに呼ばれ、一定時間入力が止まったらサジェストを取得・表示する。
     *
     * @param {string} query - 入力中の検索クエリ
     * @param {string} selectedField - 検索対象フィールド（title/author/isbn等。book検索でのみ使用）
     * @param {string} searchCategory - 現在の検索カテゴリ（"book" または "game"）
     * @returns {void}
     */
    // view(query, selectedField, searchCategory) {
    //     // 入力中に前回のタイマーが残っていればキャンセル（デバウンス）
    //     clearTimeout(this.debounceTimer);

    //     if (!query) {
    //         this.suggestionArea.innerHTML = "";
    //         return;
    //     }

    //     // debounceTime(ms) の間、入力が無ければ確定とみなして検索する
    //     this.debounceTimer = setTimeout(async () => {

    //         this.currentQuery = query;
    //         let items = "";

    //         // カテゴリに応じてAPIを呼び分ける
    //         if (searchCategory === "book") {
    //             items = await this.booksApi.fetchBooks(selectedField, query);
    //             if (!items) return;
    //         } else if (searchCategory === "game") {
    //             items = await this.gamesApi.fetchGames(query);
    //         }

    //         // タイマー発火までの間に、さらに新しい入力があった場合は描画しない
    //         // （古い検索結果が後から表示されるバグを防ぐ）
    //         if (query !== this.currentQuery) return;

    //         const suggestionResults = items.slice(0, this.maxSuggestionResults);

    //         this.renderList(suggestionResults, searchCategory);
    //         this.onRendered(suggestionResults);

    //     }, this.debounceTime);
    // }


    /**
     * サジェスト候補を <li> として描画し、クリック時の挙動を設定する。
     *
     * @param {Array<Object>} items - 表示する候補データの配列（本またはゲームのデータ）
     * @param {string} searchCategory - 現在の検索カテゴリ（"book" または "game"）
     * @returns {void}
     */
    renderList(items) {
        this.suggestionArea.innerHTML = "";

        items.forEach(item => {
            const li = document.createElement("li");

            // book/gameでデータ構造が違うため、表示文字列とクリック時の値をそれぞれ分けて設定する
            // if (searchCategory === "book") {
                li.textContent = item.volumeInfo.title;
                li.addEventListener("click", () => {
                    this.onSuggestionSelected(item.volumeInfo.title);
                });
                this.suggestionArea.appendChild(li);

            // } 
            // else if (searchCategory === "game") {
            //     li.textContent = item.title;
            //     li.addEventListener("click", () => {
            //         this.onSuggestionSelected(item.title);
            //     });
            //     this.suggestionArea.appendChild(li);
            // }
        });
    }
}

