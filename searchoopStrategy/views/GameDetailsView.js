"use strict";

import BaseDetailsView from "./BaseDetailsView.js";

/**
 * ゲームの詳細表示を担当するクラス。
 * ゲームAPIのレスポンス構造から、表示用データとフォーム用データを取り出す。
 * @class
 * @extends BaseDetailsView
 */
export default class GameDetailsView extends BaseDetailsView {

    /**
     * 詳細エリアに表示する行（画像＋タイトル）を作る。
     * @param {Object} detailItem - ゲームAPIのレスポンス1件分
     * @returns {Array<{text?: string, imageUrl?: string}>} 表示行の配列
     */
    createDetailLines(detailItem) {
        return [
            { imageUrl: detailItem.imageUrl },
            { text: `タイトル: ${detailItem.title ?? "なし"}` }
        ];
    }

    /**
     * 登録フォームに入れる値（title/imageUrl）を作る。
     * ゲームにはISBN・著者に相当する情報が無いため、それらのキーは含めない
     * （フォーム側は事前にクリアされるので、対応するinputは空欄のままになる）。
     *
     * @param {Object} detailItem - ゲームAPIのレスポンス1件分
     * @returns {{title: string, imageUrl: string}}
     */
    getFormValues(detailItem) {
        return {
            title: detailItem.title ?? "",
            imageUrl: detailItem.imageUrl ?? "",
        };
    }
}