"use strict";

export default class BooksApi {
    

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
    }

    createUrl(query) {
        return `${this.baseUrl}?q=${encodeURIComponent(query)}&key=${this.apiKey}`;
    }

    async search(query) {

        const url = this.createUrl(query);

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