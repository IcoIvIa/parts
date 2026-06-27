"use strict";

/**
 * 検索結果一覧の表示を担当する基底クラス。
 *
 * 「一覧をクリアして描画する」という共通の手順だけをここで定義し、
 * 1項目をどう見せるか（createListItem）はサブクラス（Book/GameResultView）に委ねる。
 *
 * 【処理の流れ】
 *   render(items)
 *     → resultArea をクリア
 *     → appendItems(items) で各項目を追加
 *     → loadMoreTrigger.reset() で「もっと見る」周りをリセット
 *   appendItems(items)
 *     → createListItem(item) で <li> を1つずつ作成（中身はサブクラスが実装）
 *
 * @class
 */
export default class BaseResultView {

    /**
     * @param {HTMLElement} resultArea - 結果一覧を表示するコンテナ要素
     * @param {ButtonTrigger} loadMoreTrigger - 「もっと見る」ボタンの制御オブジェクト
     * @param {Function} onResultSelected - 一覧の項目がクリックされた時に呼ばれるコールバック。クリックされた項目データを受け取る
     */
    constructor(resultArea, loadMoreTrigger, onResultSelected) {
        this.resultArea = resultArea;
        this.loadMoreTrigger = loadMoreTrigger;
        this.onResultSelected = onResultSelected;
    }

    /**
     * 一覧を最初から描画し直す（新しい検索を行った時に使う）。
     * @param {Array<Object>} items - 表示する項目データの配列
     * @returns {void}
     */
    render(items) {
        this.resultArea.innerHTML = "";
        this.appendItems(items);
        this.loadMoreTrigger.reset();
    }

    /**
     * 既存の一覧の末尾に項目を追加する（「もっと見る」で使う）。
     * @param {Array<Object>} items - 追加する項目データの配列
     * @returns {void}
     */
    appendItems(items) {
        items.forEach(item => {
            const li = this.createListItem(item);
            this.resultArea.appendChild(li);
        });
    }

    /**
     * 1項目分の <li> 要素を作る。サブクラスで必ず実装すること。
     * @param {Object} item - 1件分のデータ
     * @returns {HTMLElement} 作成された <li> 要素
     */
    createListItem(item) {
        throw new Error("createListItem はサブクラスで実装してください");
    }
}