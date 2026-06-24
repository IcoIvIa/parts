"use strict";

export default class BooksApi {

    constructor(apiKey,) {
        this.apiKey = apiKey;
        this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
        this.itemsPerPage = 10;
    }

    // createUrl(query, startIndex = 0) {
    //     return `${this.baseUrl}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${this.itemsPerPage}&key=${this.apiKey}`;
    // }
    createUrl(selectedField, query, startIndex = 0) {
        switch (selectedField) {
            case "title":
                return `${this.baseUrl}?q=intitle:${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${this.itemsPerPage}&key=${this.apiKey}`;
            case "author":
                return `${this.baseUrl}?q=inauthor:${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${this.itemsPerPage}&key=${this.apiKey}`;
            case "isbn":
                return `${this.baseUrl}?q=isbn:${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${this.itemsPerPage}&key=${this.apiKey}`;
            default:
                return `${this.baseUrl}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${this.itemsPerPage}&key=${this.apiKey}`;
        }
    }

    async fetchBooks(selectedField, query, startIndex = 0,) {
        // for debug
        console.log(selectedField);
        
        const url = this.createUrl(selectedField, query, startIndex,);

        try {
            const response = await fetch(url);
            const fetchData = await response.json();
            return fetchData.items ?? [];

        } catch (error) {
            console.error(error);
            return [];
        }
    }

}