"use strict";
import BaseDetailsView from "./BaseDetailsView.js";

export default class GameDetailsView extends BaseDetailsView {

    createDetailLines(detailItem) {
        return [
            { imageUrl: detailItem.imageUrl },
            { text: `タイトル: ${detailItem.title ?? "なし"}` }
        ];
    }

    getFormValues(detailItem) {
        return {
            title: detailItem.title ?? "",
            imageUrl: detailItem.imageUrl ?? "",
        };
    }
}