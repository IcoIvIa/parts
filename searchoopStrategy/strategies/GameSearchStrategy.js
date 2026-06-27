"use strict";

/**
 * ゲームの検索処理（API呼び出し）だけを担当するStrategy。
 * 表示（View）には関与しない。
 * @class
 */
export default class GameSearchStrategy {
    /**
     * @param {GamesApi} api - ゲーム検索用のAPIクライアント
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * クエリで検索を実行する。
     * @param {string} keyword - 検索キーワード
     * @returns {Promise<Array<Object>>} 検索結果の配列
     */
    async search(keyword) {
        return this.api.fetchGames(keyword);
    }

    // ゲームAPIが複数結果を表示するようになったら作成する
    // async loadMore() { ... }
}