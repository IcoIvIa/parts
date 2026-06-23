"use strict";
import BaseDetailsView from "./BaseDetailsView.js";

export default class BookDetailsView extends BaseDetailsView {

    createDetailLines(detailItem) {
        const identifiers = detailItem.volumeInfo.industryIdentifiers ?? [];
        const isbn13 = identifiers.find(id => id.type === "ISBN_13");

        return [
            `タイトル: ${detailItem.volumeInfo.title ?? "なし"}`,
            `著者: ${detailItem.volumeInfo.authors?.join(", ") ?? "なし"}`,
            `出版社: ${detailItem.volumeInfo.publisher ?? "なし"}`,
            `ISBN: ${isbn13?.identifier ?? "なし"}`
        ];
    }
}