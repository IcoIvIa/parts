"use strict";

export default class BooksApi {
    
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
        this.itemsPerPage = 10;
    }

    createUrl(query, startIndex = 0) {
        return `${this.baseUrl}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${this.itemsPerPage}&key=${this.apiKey}`;
    }

    async search(query, startIndex = 0) {
        const url = this.createUrl(query, startIndex);

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