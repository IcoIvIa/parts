"use strict";

export default class TitleSearchStrategy {
    constructor(api) {
        this.api = api;
    }

    async search(query){
        return this.api.fetchPHP('title',query);
    }
}