"use strict";

import BaseDetailsView from "./BaseDetailsView.js";

/**
 * 本の詳細表示を担当するクラス。
 * Google Books APIのレスポンス構造から、表示用データとフォーム用データを取り出す。
 * @class
 * @extends BaseDetailsView
 */
export default class BookDetailsView extends BaseDetailsView {

    /**
     * 詳細エリアに表示する行（画像＋タイトル・著者・出版社・ISBN）を作る。
     * @param {Object} detailItem - Google Books APIのレスポンス1件分
     * @returns {Array<{text?: string, imageUrl?: string}>} 表示行の配列
     */
    createDetailLines(detailItem) {
        const identifiers = detailItem.volumeInfo.industryIdentifiers ?? [];
        const isbn13 = identifiers.find(id => id.type === "ISBN_13");

        return [
            { imageUrl: detailItem.volumeInfo.imageLinks?.thumbnail },
            { text: `タイトル: ${detailItem.volumeInfo.title ?? "なし"}` },
            { text: `著者: ${detailItem.volumeInfo.authors?.join(", ") ?? "なし"}` },
            { text: `出版社: ${detailItem.volumeInfo.publisher ?? "なし"}` },
            { text: `ISBN: ${isbn13?.identifier ?? "なし"}` }
        ];
    }

    /**
     * 登録フォームに入れる値（title/imageUrl/releaseDate）を作る。
     *data-suggestion=""の値と対応する形になります。
     * 注意: ISBN_13が登録されていない本の場合、isbnは空文字になる
     * （Google Books APIのデータ自体にISBN_13が無いケースがあるため）。
     *
     * @param {Object} detailItem - Google Books APIのレスポンス1件分
     * @returns {{title: string, isbn: string, author: string, publisher: string, imageUrl: string}}
     */
    getFormValues(detailItem) {
        // const identifiers = detailItem.volumeInfo.industryIdentifiers ?? [];
        // const isbn13 = identifiers.find(id => id.type === "ISBN_13");ISBNの保存が必要な場合に使用する。

        return {
            title: detailItem.volumeInfo.title ?? "",
            // isbn: isbn13?.identifier ?? "",
            // author: detailItem.volumeInfo.authors?.join(", ") ?? "",
            // publisher: detailItem.volumeInfo.publisher ?? "",
            imageUrl: detailItem.volumeInfo.imageLinks?.thumbnail ?? "",
            releaseDate: detailItem.releaseDate ??""
        };
    }
}