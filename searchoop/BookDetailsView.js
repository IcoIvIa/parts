"use strict";
import BaseDetailsView from "./BaseDetailsView.js";

export default class BookDetailsView extends BaseDetailsView {

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

getFormValues(detailItem) {
    // for debug
    console.log(detailItem.volumeInfo.industryIdentifiers);
    
    const identifiers = detailItem.volumeInfo.industryIdentifiers ?? [];
    const isbn13 = identifiers.find(id => id.type === "ISBN_13");

    return {
        title: detailItem.volumeInfo.title ?? "",
        isbn: isbn13?.identifier ?? "",
        author: detailItem.volumeInfo.authors?.join(", ") ?? "",
        publisher: detailItem.volumeInfo.publisher ?? "",
        imageUrl: detailItem.volumeInfo.imageLinks?.thumbnail ?? "" 
    };
}
}