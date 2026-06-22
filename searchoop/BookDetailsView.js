"use strict";
import BaseDetailsView from "./BaseDetailsView.js";

export default class BookDetailsView extends BaseDetailsView {

    createDetailLines(item) {
        return [
            `タイトル: ${item.volumeInfo.title ?? "なし"}`,
            `著者: ${item.volumeInfo.authors?.join(", ") ?? "なし"}`,
            `出版社: ${item.volumeInfo.publisher ?? "なし"}`
        ];
    }
}