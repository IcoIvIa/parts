"use strict";

/**
 * 本の検索処理（API呼び出し）だけを担当するStrategy。
 * 表示（View）には関与しない。
 * @class
 */
export default class BookSearchStrategy {
    /**
     * @param {BooksApi} api - 本検索用のAPIクライアント
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * クエリで検索を実行する。
     * @param {string} query - 検索クエリ
     * @param {string} selectedField - 検索対象フィールド（title/author/isbn）
     * @returns {Promise<Array<Object>>} 検索結果の配列
     */
    async search(query, selectedField) {
        return this.api.fetchBooks(selectedField, query);
    }

    /**
     * 追加ページを取得する（もっと見る）。
     * @param {string} query - 検索クエリ
     * @param {string} selectedField - 検索対象フィールド
     * @param {number} startIndex - 取得開始位置
     * @returns {Promise<Array<Object>>} 追加分の検索結果
     */
    async loadMore(query, selectedField, startIndex) {
        return this.api.fetchBooks(selectedField, query, startIndex);
    }
}